import { AntDesign } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { ActivityIndicator, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function Final() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const [selectedBooks, setSelectedBooks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Carrega os livros selecionados da tela anterior
  useEffect(() => {
    if (params.selectedRecommendations) {
      try {
        const books = JSON.parse(params.selectedRecommendations as string);
        
        // Busca detalhes completos dos livros selecionados
        const fetchBookDetails = async () => {
          try {
            const promises = books.map(async (title: string) => {
              const encodedTitle = encodeURIComponent(title);
              const response = await fetch(
                `http://167.99.12.162:3000/api/livros/busca/${encodedTitle}`
              );
              if (!response.ok) throw new Error('Falha ao buscar detalhes do livro');
              const data = await response.json();
              return data[0]; // Retorna o primeiro resultado da busca
            });

            const bookDetails = await Promise.all(promises);
            setSelectedBooks(bookDetails.filter(book => book)); // Remove valores undefined
          } catch (err: any) {
            setError(err.message);
          } finally {
            setLoading(false);
          }
        };

        fetchBookDetails();
      } catch (err) {
        setError('Erro ao carregar recomendações selecionadas');
        setLoading(false);
      }
    } else {
      setLoading(false);
    }
  }, []);

  const handleFinish = () => {
    // Aqui você pode implementar lógica adicional como:
    // - Registrar as seleções no banco de dados
    // - Enviar para uma lista de desejos
    // - Navegar para a tela inicial
    router.push('/');
  };

  if (loading) {
    return (
      <View style={[styles.container, styles.loadingContainer]}>
        <ActivityIndicator size="large" color="#FF8C00" />
        <Text style={styles.loadingText}>Preparando suas recomendações...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity 
          style={styles.button} 
          onPress={() => router.back()}
        >
          <Text style={styles.buttonText}>Voltar</Text>
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

      <Text style={styles.title}>Sua lista de leitura personalizada</Text>
      <Text style={styles.subtitle}>
        Aqui estão os livros que você selecionou:
      </Text>

      <ScrollView style={styles.bookList}>
        {selectedBooks.length > 0 ? (
          selectedBooks.map((book, index) => (
            <View key={index} style={styles.bookItem}>
              <Text style={styles.bookTitle}>{book.titulo}</Text>
              <Text style={styles.bookAuthor}>{book.autor}</Text>
              {book.genero && (
                <Text style={styles.bookGenre}>Gênero: {book.genero}</Text>
              )}
            </View>
          ))
        ) : (
          <Text style={styles.emptyMessage}>
            Nenhum livro selecionado. Volte e escolha algumas recomendações.
          </Text>
        )}
      </ScrollView>

      <View style={styles.footer}>
        <Text style={styles.footerText}>
          Esperamos que goste das suas seleções!
        </Text>
        <Text style={styles.footerSubtext}>
          Você pode acessar esta lista a qualquer momento no seu perfil.
        </Text>
      </View>

      <TouchableOpacity
        style={styles.button}
        onPress={handleFinish}
      >
        <Text style={styles.buttonText}>Finalizar</Text>
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
    fontSize: 16,
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
    marginBottom: 20,
  },
  bookList: {
    flex: 1,
    marginVertical: 10,
  },
  bookItem: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    marginBottom: 10,
  },
  bookTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  bookAuthor: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  bookGenre: {
    fontSize: 12,
    color: '#FF8C00',
    fontStyle: 'italic',
  },
  emptyMessage: {
    textAlign: 'center',
    color: '#888',
    marginTop: 40,
    fontSize: 16,
  },
  footer: {
    marginVertical: 20,
    padding: 10,
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
  },
  footerText: {
    textAlign: 'center',
    color: '#666',
    fontSize: 14,
    marginBottom: 4,
  },
  footerSubtext: {
    textAlign: 'center',
    color: '#999',
    fontSize: 12,
  },
  button: {
    backgroundColor: '#FF8C00',
    padding: 15,
    borderRadius: 25,
    alignItems: 'center',
    marginTop: 10,
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
    marginBottom: 20,
  },
});