// app/final.js
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { AntDesign } from '@expo/vector-icons';

export default function Final() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => router.back()}
      >
        <AntDesign name="left" size={24} color="black" />
      </TouchableOpacity>

      <Text style={styles.title}>Sua recomendação personalizada</Text>
      <Text style={styles.subtitle}>
        Aqui estão os livros relacionados ao seu perfil!
      </Text>

      <View style={styles.bookList}>
        {[1, 2, 3, 4, 5, 6].map((item, index) => (
          <Text key={index} style={styles.bookItem}>
            Livros ----------------------
          </Text>
        ))}
      </View>

      <Text style={styles.footer}>
        Esperamos que goste da nossa recomendação!
      </Text>
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
    marginBottom: 20,
  },
  bookList: {
    flex: 1,
    marginVertical: 20,
  },
  bookItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  footer: {
    textAlign: 'center',
    color: '#666',
    marginTop: 20,
  },
});