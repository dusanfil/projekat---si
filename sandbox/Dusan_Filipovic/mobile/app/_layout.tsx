// app/_layout.tsx
import { Link } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';

export default function Layout() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Task Manager</Text>
      {/* Link ka stranici sa zadacima */}
      <Link href="/tasks">Go to Tasks</Link>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    flex: 1,
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
});
