import { View, Text, StyleSheet, TouchableOpacity } from 'react-native'
import { supabase } from '../../lib/supabase'
import { Colors } from '../../constants/colors'

export default function Home() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome to PlateGuard</Text>
      <Text style={styles.subtitle}>Your dashboard is coming soon.</Text>
      <TouchableOpacity
        style={styles.signOut}
        onPress={() => supabase.auth.signOut()}
      >
        <Text style={styles.signOutText}>Sign Out</Text>
      </TouchableOpacity>
    </View>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background, justifyContent: 'center', alignItems: 'center', padding: 24 },
  title: { fontSize: 24, fontWeight: '700', color: Colors.textPrimary },
  subtitle: { fontSize: 15, color: Colors.textSecondary, marginTop: 8 },
  signOut: { marginTop: 32, padding: 14, backgroundColor: Colors.danger, borderRadius: 12 },
  signOutText: { color: Colors.white, fontWeight: '600' },
})