// app/recommendations.js
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { AntDesign } from '@expo/vector-icons';
import { useState } from 'react';

export default function Recommendations() {
  const router = useRouter();
  const [selectedBooks, setSelectedBooks] = useState<Record<string, boolean>>({});

  // Lista de recomendações baseada nos livros selecionados anteriormente
  const books = [
    "A Revolução dos Bichos - George Orwell",
    "O Retrato de Dorian Gray - Oscar Wilde",
    "O Morro dos Ventos Uivantes - Emily Brontë",
    "Grande Sertão: Veredas - João Guimarães Rosa",
    "O Nome do Vento - Patrick Rothfuss",
    "Duna - Frank Herbert",
    "Neuromancer - William Gibson",
    "A Mão Esquerda da Escuridão - Ursula K. Le Guin",
    "O Silmarillion - J.R.R. Tolkien",
    "As Crônicas de Gelo e Fogo - George R.R. Martin"
  ];

  const toggleBook = (book: string) => {
    setSelectedBooks(prev => ({
      ...prev,
      [book]: !prev[book]
    }));
  };

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
        Com base nos seus gostos, selecionamos estas recomendações especiais para você!
      </Text>
      <Text style={styles.description}>
        Selecione os livros que você gostaria de ler da nossa lista de recomendações.
      </Text>

      <ScrollView style={styles.bookList}>
        {books.map((book, index) => (
          <TouchableOpacity
            key={index}
            style={styles.bookItem}
            onPress={() => toggleBook(book)}
          >
            <View style={[
              styles.checkbox,
              selectedBooks[book] && styles.checkboxSelected
            ]}>
              {selectedBooks[book] && (
                <AntDesign name="check" size={16} color="white" />
              )}
            </View>
            <Text style={styles.bookTitle}>{book}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <TouchableOpacity
        style={styles.button}
        onPress={() => router.push('/final')}
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
    bookTitle: {
      fontSize: 16,
      color: '#333',
      flex: 1,
    },
    button: {
      backgroundColor: '#FF8C00',
      padding: 15,
      borderRadius: 25,
      alignItems: 'center',
      marginTop: 20,
    },
    buttonText: {
      color: '#fff',
      fontSize: 16,
      fontWeight: 'bold',
    },
  });