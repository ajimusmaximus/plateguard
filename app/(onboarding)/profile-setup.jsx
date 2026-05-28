import { useState } from 'react'
import {
  View, Text, TextInput, TouchableOpacity,
  StyleSheet, ScrollView, ActivityIndicator,
  Alert, KeyboardAvoidingView, Platform
} from 'react-native'
import { useRouter } from 'expo-router'
import { supabase } from '../../lib/supabase'
import { Colors } from '../../constants/colors'

const SEX_OPTIONS = ['Male', 'Female', 'Prefer not to say']

export default function ProfileSetup() {
  const router = useRouter()
  const [name, setName] = useState('')
  const [dob, setDob] = useState('')
  const [heightFt, setHeightFt] = useState('')
  const [heightIn, setHeightIn] = useState('')
  const [weight, setWeight] = useState('')
  const [sex, setSex] = useState('')
  const [isMinor, setIsMinor] = useState(false)
  const [loading, setLoading] = useState(false)

  async function handleContinue() {
    if (!name.trim()) {
      Alert.alert('Name required', 'Please enter a name for this profile.')
      return
    }

    setLoading(true)
    const { data: { user } } = await supabase.auth.getUser()

    const totalInches = heightFt && heightIn
      ? (parseInt(heightFt) * 12) + parseInt(heightIn)
      : null

    const { data: profile, error } = await supabase
      .from('profiles')
      .insert({
        account_id: user.id,
        name: name.trim(),
        date_of_birth: dob || null,
        height_inches: totalInches,
        weight_lbs: weight ? parseFloat(weight) : null,
        sex: sex || null,
        is_minor: isMinor,
      })
      .select()
      .single()

    setLoading(false)

    if (error) {
      Alert.alert('Error', 'Could not create profile. Please try again.')
      return
    }

    router.replace({ pathname: '/(onboarding)/conditions', params: { profileId: profile.id } })
  }

  return (
    <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
        <Text style={styles.title}>Create Your Profile</Text>
        <Text style={styles.subtitle}>Tell us about yourself so we can personalize your experience.</Text>

        <Text style={styles.label}>Name *</Text>
        <TextInput
          style={styles.input}
          value={name}
          onChangeText={setName}
          placeholder="First name or nickname"
          placeholderTextColor={Colors.textMuted}
        />

        <Text style={styles.label}>Date of Birth</Text>
        <TextInput
          style={styles.input}
          value={dob}
          onChangeText={setDob}
          placeholder="YYYY-MM-DD"
          placeholderTextColor={Colors.textMuted}
          keyboardType="numeric"
        />

        <Text style={styles.label}>Height</Text>
        <View style={styles.row}>
          <TextInput
            style={[styles.input, styles.halfInput]}
            value={heightFt}
            onChangeText={setHeightFt}
            placeholder="ft"
            placeholderTextColor={Colors.textMuted}
            keyboardType="numeric"
          />
          <TextInput
            style={[styles.input, styles.halfInput]}
            value={heightIn}
            onChangeText={setHeightIn}
            placeholder="in"
            placeholderTextColor={Colors.textMuted}
            keyboardType="numeric"
          />
        </View>

        <Text style={styles.label}>Weight (lbs)</Text>
        <TextInput
          style={styles.input}
          value={weight}
          onChangeText={setWeight}
          placeholder="lbs"
          placeholderTextColor={Colors.textMuted}
          keyboardType="numeric"
        />

        <Text style={styles.label}>Sex</Text>
        <View style={styles.optionRow}>
          {SEX_OPTIONS.map(option => (
            <TouchableOpacity
              key={option}
              style={[styles.optionChip, sex === option && styles.optionChipSelected]}
              onPress={() => setSex(option)}
            >
              <Text style={[styles.optionChipText, sex === option && styles.optionChipTextSelected]}>
                {option}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <TouchableOpacity
          style={styles.minorRow}
          onPress={() => setIsMinor(!isMinor)}
          activeOpacity={0.7}
        >
          <View style={[styles.checkbox, isMinor && styles.checkboxChecked]}>
            {isMinor && <Text style={styles.checkmark}>✓</Text>}
          </View>
          <Text style={styles.minorLabel}>This profile is for a minor (under 18)</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.button} onPress={handleContinue} disabled={loading}>
          {loading
            ? <ActivityIndicator color={Colors.white} />
            : <Text style={styles.buttonText}>Continue</Text>
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
  subtitle: { fontSize: 15, color: Colors.textSecondary, marginTop: 8, marginBottom: 24 },
  label: { fontSize: 14, fontWeight: '600', color: Colors.textPrimary, marginTop: 16 },
  input: {
    backgroundColor: Colors.card,
    borderWidth: 1, borderColor: Colors.border,
    borderRadius: 12, padding: 14,
    fontSize: 16, color: Colors.textPrimary, marginTop: 6,
  },
  row: { flexDirection: 'row', gap: 12 },
  halfInput: { flex: 1 },
  optionRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginTop: 8 },
  optionChip: {
    paddingHorizontal: 16, paddingVertical: 10,
    borderRadius: 99, borderWidth: 1, borderColor: Colors.border,
    backgroundColor: Colors.card,
  },
  optionChipSelected: { backgroundColor: Colors.primary, borderColor: Colors.primary },
  optionChipText: { fontSize: 14, color: Colors.textSecondary },
  optionChipTextSelected: { color: Colors.white, fontWeight: '600' },
  minorRow: { flexDirection: 'row', alignItems: 'center', gap: 12, marginTop: 20 },
  checkbox: {
    width: 24, height: 24, borderRadius: 6,
    borderWidth: 2, borderColor: Colors.border,
    alignItems: 'center', justifyContent: 'center',
  },
  checkboxChecked: { backgroundColor: Colors.primary, borderColor: Colors.primary },
  checkmark: { color: Colors.white, fontSize: 14, fontWeight: '700' },
  minorLabel: { fontSize: 14, color: Colors.textPrimary, flex: 1 },
  button: {
    backgroundColor: Colors.primary,
    borderRadius: 12, padding: 16,
    alignItems: 'center', marginTop: 32,
  },
  buttonText: { color: Colors.white, fontSize: 16, fontWeight: '600' },
})