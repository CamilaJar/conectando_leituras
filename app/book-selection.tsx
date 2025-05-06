// app/book-selection.js
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { AntDesign } from '@expo/vector-icons';
import { useState } from 'react';
import { Picker } from '@react-native-picker/picker';

export default function BookSelection() {
  const router = useRouter();
  const [selectedBooks, setSelectedBooks] = useState<string[]>([]);
  const [selectedBook, setSelectedBook] = useState('');

  const books = [
    "Selecione um livro",
    "Dom Casmurro - Machado de Assis",
    "O Pequeno Príncipe - Antoine de Saint-Exupéry",
    "1984 - George Orwell",
    "Cem Anos de Solidão - Gabriel García Márquez",
    "O Senhor dos Anéis - J.R.R. Tolkien",
    "Harry Potter e a Pedra Filosofal - J.K. Rowling",
    "O Alquimista - Paulo Coelho",
    "Crime e Castigo - Fiódor Dostoiévski",
    "Orgulho e Preconceito - Jane Austen",
    "A Metamorfose - Franz Kafka"
  ];

  const addBook = () => {
    if (selectedBook && selectedBook !== "Selecione um livro" && !selectedBooks.includes(selectedBook)) {
      setSelectedBooks([...selectedBooks, selectedBook]);
      setSelectedBook('');
    }
  };

  const removeBook = (bookToRemove: string) => {
    setSelectedBooks(selectedBooks.filter(book => book !== bookToRemove));
  };

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
        Selecione os livros que você já leu ou deseja ler para que possamos oferecer as melhores recomendações para você!
      </Text>

      <View style={styles.pickerContainer}>
        <Picker
          selectedValue={selectedBook}
          onValueChange={(itemValue) => setSelectedBook(itemValue)}
          style={styles.picker}
        >
          {books.map((book, index) => (
            <Picker.Item key={index} label={book} value={book} />
          ))}
        </Picker>
        <TouchableOpacity
          style={styles.addButton}
          onPress={addBook}
        >
          <Text style={styles.addButtonText}>Adicionar</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.selectedTitle}>Livros Selecionados:</Text>
      <ScrollView style={styles.selectedBooks}>
        {selectedBooks.map((book, index) => (
          <View key={index} style={styles.selectedBookItem}>
            <Text style={styles.selectedBookText}>{book}</Text>
            <TouchableOpacity
              onPress={() => removeBook(book)}
              style={styles.removeButton}
            >
              <AntDesign name="close" size={20} color="#FF8C00" />
            </TouchableOpacity>
          </View>
        ))}
      </ScrollView>

      <TouchableOpacity
        style={[
          styles.button,
          selectedBooks.length === 0 && styles.buttonDisabled
        ]}
        onPress={() => selectedBooks.length > 0 && router.push('/recommendations')}
      >
        <Text style={styles.buttonText}>Confirmar</Text>
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
  },
  picker: {
    height: 50,
  },
  addButton: {
    backgroundColor: '#FF8C00',
    padding: 10,
    alignItems: 'center',
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
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
});