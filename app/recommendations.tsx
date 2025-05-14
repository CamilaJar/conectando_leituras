import { AntDesign } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { ActivityIndicator, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function Recommendations() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const [selectedBooks, setSelectedBooks] = useState<Record<string, boolean>>({});
  const [recommendations, setRecommendations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedBookTitles, setSelectedBookTitles] = useState<string[]>([]);

  // Carrega os livros selecionados da tela anterior
  useEffect(() => {
    if (params.selectedBooks) {
      try {
        const books = JSON.parse(params.selectedBooks as string);
        setSelectedBookTitles(books);
      } catch (err) {
        setError('Erro ao carregar seleção anterior');
      }
    }
  }, []);

  // Busca recomendações da API
  useEffect(() => {
    const fetchRecommendations = async () => {
      if (selectedBookTitles.length === 0) return;

      setLoading(true);
      setError('');

      try {
        // Para múltiplos livros, usamos a recomendação combinada
        if (selectedBookTitles.length >= 2) {
          const livro1 = encodeURIComponent(selectedBookTitles[0]);
          const livro2 = encodeURIComponent(selectedBookTitles[1]);
          const response = await fetch(
            `http://167.99.12.162:3000/api/livros/recomendacao-multipla?livro1=${livro1}&livro2=${livro2}`
          );
          
          if (!response.ok) throw new Error('Falha ao buscar recomendações combinadas');
          const data = await response.json();
          setRecommendations(data);
        } 
        // Para um único livro, usamos a recomendação simples
        else {
          const livro = encodeURIComponent(selectedBookTitles[0]);
          const response = await fetch(
            `http://167.99.12.162:3000/api/livros/tambem-lido/${livro}`
          );
          
          if (!response.ok) throw new Error('Falha ao buscar recomendações');
          const data = await response.json();
          setRecommendations(data);
        }
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchRecommendations();
  }, [selectedBookTitles]);

  const toggleBook = (bookTitle: string) => {
    setSelectedBooks(prev => ({
      ...prev,
      [bookTitle]: !prev[bookTitle]
    }));
  };

  const handleConfirm = () => {
    const selected = Object.keys(selectedBooks).filter(key => selectedBooks[key]);
    
    // Aqui você pode registrar as relações de leitura se necessário
    // Exemplo: registrar que o usuário deseja ler estes livros
    
    router.push({
      pathname: '/final',
      params: { selectedRecommendations: JSON.stringify(selected) }
    });
  };

  if (loading) {
    return (
      <View style={[styles.container, styles.loadingContainer]}>
        <ActivityIndicator size="large" color="#FF8C00" />
        <Text style={styles.loadingText}>Buscando recomendações personalizadas...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={styles.backText}>Voltar</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => router.back()}
      >
        <AntDesign name="left" size={24} color="black" />
      </TouchableOpacity>

      <Text style={styles.title}>Recomendações</Text>
      <Text style={styles.subtitle}>
        Com base nos seus livros selecionados, encontramos estas recomendações:
      </Text>
      
      {selectedBookTitles.length > 0 && (
        <Text style={styles.selectionInfo}>
          Baseado em: {selectedBookTitles.join(', ')}
        </Text>
      )}

      <ScrollView style={styles.bookList}>
        {recommendations.length > 0 ? (
          recommendations.map((book, index) => (
            <TouchableOpacity
              key={index}
              style={styles.bookItem}
              onPress={() => toggleBook(book.titulo)}
            >
              <View style={[
                styles.checkbox,
                selectedBooks[book.titulo] && styles.checkboxSelected
              ]}>
                {selectedBooks[book.titulo] && (
                  <AntDesign name="check" size={16} color="white" />
                )}
              </View>
              <View style={styles.bookInfo}>
                <Text style={styles.bookTitle}>{book.titulo}</Text>
                <Text style={styles.bookAuthor}>{book.autor}</Text>
                {book.genero && (
                  <Text style={styles.bookGenre}>{book.genero}</Text>
                )}
              </View>
            </TouchableOpacity>
          ))
        ) : (
          <Text style={styles.noRecommendations}>
            Nenhuma recomendação encontrada. Tente selecionar mais livros na tela anterior.
          </Text>
        )}
      </ScrollView>

      <TouchableOpacity
        style={[
          styles.button,
          Object.values(selectedBooks).filter(Boolean).length === 0 && styles.buttonDisabled
        ]}
        onPress={handleConfirm}
        disabled={Object.values(selectedBooks).filter(Boolean).length === 0}
      >
        <Text style={styles.buttonText}>Confirmar lista de leitura</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 20,
    paddingTop: 40,
  },
  loadingContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 20,
    color: '#FF8C00',
  },
  backButton: {
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FF8C00',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 10,
  },
  selectionInfo: {
    fontSize: 14,
    color: '#888',
    fontStyle: 'italic',
    marginBottom: 20,
  },
  bookList: {
    flex: 1,
    marginVertical: 10,
  },
  bookItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  checkbox: {
    width: 24,
    height: 24,
    borderWidth: 2,
    borderColor: '#FF8C00',
    borderRadius: 6,
    marginRight: 15,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxSelected: {
    backgroundColor: '#FF8C00',
  },
  bookInfo: {
    flex: 1,
  },
  bookTitle: {
    fontSize: 16,
    color: '#333',
    fontWeight: '500',
  },
  bookAuthor: {
    fontSize: 14,
    color: '#666',
  },
  bookGenre: {
    fontSize: 12,
    color: '#FF8C00',
    marginTop: 4,
    fontStyle: 'italic',
  },
  button: {
    backgroundColor: '#FF8C00',
    padding: 15,
    borderRadius: 25,
    alignItems: 'center',
    marginTop: 20,
  },
  buttonDisabled: {
    backgroundColor: '#FFB366',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  errorText: {
    color: 'red',
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
  },
  backText: {
    color: '#FF8C00',
    textAlign: 'center',
    fontSize: 16,
  },
  noRecommendations: {
    textAlign: 'center',
    color: '#888',
    marginTop: 40,
    fontSize: 16,
  },
});