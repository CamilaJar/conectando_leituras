import { AntDesign } from '@expo/vector-icons';
import { Picker } from '@react-native-picker/picker';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { ActivityIndicator, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function BookSelection() {
  const router = useRouter();
  const [selectedBooks, setSelectedBooks] = useState<string[]>([]);
  const [selectedBookId, setSelectedBookId] = useState('');
  const [books, setBooks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Carregar livros da API
  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const response = await fetch('http://167.99.12.162:3000/api/livros');
        if (!response.ok) {
          throw new Error('Falha ao carregar livros');
        }
        const data = await response.json();
        setBooks(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchBooks();
  }, []);

  const addBook = () => {
    if (selectedBooks.length >= 2) {
      setError('Você pode selecionar no máximo 2 livros');
      return;
    }
    if (selectedBookId && !selectedBooks.includes(selectedBookId)) {
      const bookToAdd = books.find(book => book.titulo === selectedBookId);
      if (bookToAdd) {
        setSelectedBooks([...selectedBooks, bookToAdd.titulo]);
        setSelectedBookId('');
        setError(''); // Clear any previous error
      }
    }
  };

  const removeBook = (bookToRemove: string) => {
    setSelectedBooks(selectedBooks.filter(book => book !== bookToRemove));
  };

  const handleConfirm = async () => {
    if (selectedBooks.length === 0) return;

    try {
      // Aqui você pode registrar as relações de leitura se necessário
      // Exemplo: registrar que o usuário "leu" estes livros
      // await Promise.all(selectedBooks.map(book => 
      //   registerBookReading(book)
      // ));

      // Navegar para a tela de recomendações com os livros selecionados
      router.push({
        pathname: '/recommendations',
        params: { selectedBooks: JSON.stringify(selectedBooks) }
      });
    } catch (err) {
      setError('Erro ao processar seleção');
    }
  };

  if (loading) {
    return (
      <View style={[styles.container, styles.loadingContainer]}>
        <ActivityIndicator size="large" color="#FF8C00" />
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
      
      <Text style={styles.title}>Seleção de Livros</Text>
      <Text style={styles.subtitle}>
        Vamos personalizar sua experiência!
      </Text>
      <Text style={styles.description}>
        Selecione até 2 livros que você já leu para que possamos oferecer as melhores recomendações!
      </Text>

      <View style={styles.pickerContainer}>
        <Picker
          selectedValue={selectedBookId}
          onValueChange={(itemValue) => setSelectedBookId(itemValue)}
          style={styles.picker}
          enabled={selectedBooks.length < 2}
        >
          <Picker.Item label="Selecione um livro" value="" />
          {books.map((book: any) => (
            <Picker.Item 
              key={book.titulo} 
              label={`${book.titulo} - ${book.autor}`} 
              value={book.titulo} 
            />
          ))}
        </Picker>
        <TouchableOpacity
          style={styles.addButton}
          onPress={addBook}
          disabled={!selectedBookId}
        >
          <Text style={styles.addButtonText}>Adicionar</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.selectedTitle}>Livros Selecionados:</Text>
      <ScrollView style={styles.selectedBooks}>
        {selectedBooks.map((bookTitle, index) => {
          const book = books.find(b => b.titulo === bookTitle);
          return (
            <View key={index} style={styles.selectedBookItem}>
              <Text style={styles.selectedBookText}>
                {book?.titulo} - {book?.autor}
              </Text>
              <TouchableOpacity
                onPress={() => removeBook(bookTitle)}
                style={styles.removeButton}
              >
                <AntDesign name="close" size={20} color="#FF8C00" />
              </TouchableOpacity>
            </View>
          );
        })}
      </ScrollView>

      <TouchableOpacity
        style={[
          styles.button,
          selectedBooks.length === 0 && styles.buttonDisabled
        ]}
        onPress={handleConfirm}
        disabled={selectedBooks.length === 0}
      >
        <Text style={styles.buttonText}>Obter Recomendações</Text>
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
  description: {
    fontSize: 14,
    color: '#999',
    marginBottom: 20,
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 10,
    marginBottom: 20,
    backgroundColor: '#f9f9f9',
    overflow: 'hidden',
  },
  picker: {
    height: 50,
  },
  addButton: {
    backgroundColor: '#FF8C00',
    padding: 10,
    alignItems: 'center',
  },
  addButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  selectedTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#666',
  },
  selectedBooks: {
    flex: 1,
    marginBottom: 10,
  },
  selectedBookItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
    marginBottom: 10,
  },
  selectedBookText: {
    flex: 1,
    fontSize: 14,
    color: '#333',
  },
  removeButton: {
    padding: 5,
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
});