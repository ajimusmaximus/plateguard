import { useState } from 'react'
import {
  View, Text, TouchableOpacity, StyleSheet,
  ScrollView, ActivityIndicator, Alert, TextInput,
  KeyboardAvoidingView, Platform
} from 'react-native'
import { useRouter, useLocalSearchParams } from 'expo-router'
import { supabase } from '../../lib/supabase'
import { Colors } from '../../constants/colors'

const GOALS = [
  { key: 'manage_condition', label: 'Manage a health condition', icon: '💊' },
  { key: 'lose_weight', label: 'Lose weight', icon: '⚖️' },
  { key: 'eat_healthier', label: 'Eat healthier overall', icon: '🥗' },
  { key: 'build_habits', label: 'Build better habits', icon: '🏃' },
  { key: 'family_health', label: 'Improve family health', icon: '👨‍👩‍👧' },
]

export default function Goals() {
  const router = useRouter()
  const { profileId } = useLocalSearchParams()
  const [goal, setGoal] = useState('')
  const [stepGoal, setStepGoal] = useState('5000')
  const [sugarLimit, setSugarLimit] = useState('')
  const [carbLimit, setCarbLimit] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleFinish() {
    setLoading(true)

    const { error } = await supabase
      .from('profiles')
      .update({
        goal: goal || null,
        daily_step_goal: stepGoal ? parseInt(stepGoal) : 5000,
        daily_sugar_limit_grams: sugarLimit ? parseFloat(sugarLimit) : null,
        daily_carb_limit_grams: carbLimit ? parseFloat(carbLimit) : null,
      })
      .eq('id', profileId)

    setLoading(false)

    if (error) {
      Alert.alert('Error', 'Could not save goals. Please try again.')
      return
    }

    router.replace('/(tabs)')
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
        <Text style={styles.title}>Set Your Goals</Text>
        <Text style={styles.subtitle}>
          What brings you to PlateGuard? We'll tailor your experience around what matters most to you.
        </Text>

        <Text style={styles.label}>Primary Goal</Text>
        <View style={styles.goalList}>
          {GOALS.map(g => (
            <TouchableOpacity
              key={g.key}
              style={[styles.goalCard, goal === g.key && styles.goalCardSelected]}
              onPress={() => setGoal(g.key)}
            >
              <Text style={styles.goalIcon}>{g.icon}</Text>
              <Text style={[styles.goalLabel, goal === g.key && styles.goalLabelSelected]}>
                {g.label}
              </Text>
              <View style={[styles.radio, goal === g.key && styles.radioSelected]}>
                {goal === g.key && <View style={styles.radioDot} />}
              </View>
            </TouchableOpacity>
          ))}
        </View>

        <Text style={styles.sectionTitle}>Daily Targets</Text>
        <Text style={styles.sectionSubtitle}>These can be adjusted anytime in settings.</Text>

        <Text style={styles.label}>Daily Step Goal</Text>
        <TextInput
          style={styles.input}
          value={stepGoal}
          onChangeText={setStepGoal}
          placeholder="5000"
          placeholderTextColor={Colors.textMuted}
          keyboardType="numeric"
        />

        <Text style={styles.label}>Daily Sugar Limit (grams) — optional</Text>
        <TextInput
          style={styles.input}
          value={sugarLimit}
          onChangeText={setSugarLimit}
          placeholder="e.g. 25 for diabetic, 50 general"
          placeholderTextColor={Colors.textMuted}
          keyboardType="numeric"
        />

        <Text style={styles.label}>Daily Carb Limit (grams) — optional</Text>
        <TextInput
          style={styles.input}
          value={carbLimit}
          onChangeText={setCarbLimit}
          placeholder="e.g. 130 for diabetic"
          placeholderTextColor={Colors.textMuted}
          keyboardType="numeric"
        />

        <TouchableOpacity style={styles.button} onPress={handleFinish} disabled={loading}>
          {loading
            ? <ActivityIndicator color={Colors.white} />
            : <Text style={styles.buttonText}>Let's Go!</Text>
          }
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  scroll: { padding: 24, paddingBottom: 48 },
  title: { fontSize: 28, fontWeight: '700', color: Colors.textPrimary, marginTop: 48 },
  subtitle: { fontSize: 15, color: Colors.textSecondary, marginTop: 8, marginBottom: 24, lineHeight: 22 },
  label: { fontSize: 14, fontWeight: '600', color: Colors.textPrimary, marginTop: 16, marginBottom: 6 },
  goalList: { gap: 10 },
  goalCard: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: Colors.card, borderRadius: 14,
    padding: 16, borderWidth: 1, borderColor: Colors.border, gap: 12,
  },
  goalCardSelected: { borderColor: Colors.primary, backgroundColor: '#F1F8F1' },
  goalIcon: { fontSize: 22 },
  goalLabel: { flex: 1, fontSize: 15, color: Colors.textPrimary },
  goalLabelSelected: { fontWeight: '600', color: Colors.primaryDark },
  radio: {
    width: 22, height: 22, borderRadius: 11,
    borderWidth: 2, borderColor: Colors.border,
    alignItems: 'center', justifyContent: 'center',
  },
  radioSelected: { borderColor: Colors.primary },
  radioDot: {
    width: 10, height: 10, borderRadius: 5,
    backgroundColor: Colors.primary,
  },
  sectionTitle: { fontSize: 18, fontWeight: '700', color: Colors.textPrimary, marginTop: 32 },
  sectionSubtitle: { fontSize: 13, color: Colors.textSecondary, marginTop: 4, marginBottom: 8 },
  input: {
    backgroundColor: Colors.card,
    borderWidth: 1, borderColor: Colors.border,
    borderRadius: 12, padding: 14,
    fontSize: 16, color: Colors.textPrimary,
  },
  button: {
    backgroundColor: Colors.primary,
    borderRadius: 12, padding: 16,
    alignItems: 'center', marginTop: 32,
  },
  buttonText: { color: Colors.white, fontSize: 16, fontWeight: '600' },
})