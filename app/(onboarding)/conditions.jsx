import { useState } from 'react'
import {
  View, Text, TouchableOpacity, StyleSheet,
  ScrollView, ActivityIndicator, Alert, TextInput
} from 'react-native'
import { useRouter, useLocalSearchParams } from 'expo-router'
import { supabase } from '../../lib/supabase'
import { Colors } from '../../constants/colors'

const COMMON_CONDITIONS = [
  'Type 1 Diabetes',
  'Type 2 Diabetes',
  'Prediabetes',
  'High Blood Pressure',
  'Heart Disease',
  'High Cholesterol',
  'Celiac Disease',
  'Gluten Intolerance',
  'Kidney Disease',
  'Thyroid Disease',
  'PCOS',
  'Crohn\'s Disease',
  'IBS',
  'Lactose Intolerance',
  'Nut Allergy',
  'Shellfish Allergy',
]

export default function Conditions() {
  const router = useRouter()
  const { profileId } = useLocalSearchParams()
  const [selected, setSelected] = useState([])
  const [custom, setCustom] = useState('')
  const [loading, setLoading] = useState(false)

  function toggleCondition(condition) {
    setSelected(prev =>
      prev.includes(condition)
        ? prev.filter(c => c !== condition)
        : [...prev, condition]
    )
  }

  function addCustom() {
    const trimmed = custom.trim()
    if (!trimmed) return
    if (!selected.includes(trimmed)) {
      setSelected(prev => [...prev, trimmed])
    }
    setCustom('')
  }

  async function handleContinue() {
    setLoading(true)

    if (selected.length > 0) {
      const rows = selected.map(condition => ({
        profile_id: profileId,
        condition_name: condition,
      }))
      const { error } = await supabase.from('profile_conditions').insert(rows)
      if (error) {
        setLoading(false)
        Alert.alert('Error', 'Could not save conditions. Please try again.')
        return
      }
    }

    setLoading(false)
    router.replace({ pathname: '/(onboarding)/goals', params: { profileId } })
  }

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <Text style={styles.title}>Health Conditions</Text>
        <Text style={styles.subtitle}>
          Select any conditions that apply. This helps us personalize your meal suggestions.
          You can always update this later.
        </Text>

        <View style={styles.disclaimer}>
          <Text style={styles.disclaimerText}>
            All conditions are self-reported by you. PlateGuard does not verify or assess medical information.
          </Text>
        </View>

        <View style={styles.chipGrid}>
          {COMMON_CONDITIONS.map(condition => (
            <TouchableOpacity
              key={condition}
              style={[styles.chip, selected.includes(condition) && styles.chipSelected]}
              onPress={() => toggleCondition(condition)}
            >
              <Text style={[styles.chipText, selected.includes(condition) && styles.chipTextSelected]}>
                {condition}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <Text style={styles.label}>Add a condition not listed</Text>
        <View style={styles.customRow}>
          <TextInput
            style={styles.customInput}
            value={custom}
            onChangeText={setCustom}
            placeholder="Type condition name..."
            placeholderTextColor={Colors.textMuted}
            onSubmitEditing={addCustom}
            returnKeyType="done"
          />
          <TouchableOpacity style={styles.addButton} onPress={addCustom}>
            <Text style={styles.addButtonText}>Add</Text>
          </TouchableOpacity>
        </View>

        {selected.filter(c => !COMMON_CONDITIONS.includes(c)).map(condition => (
          <View key={condition} style={styles.customChip}>
            <Text style={styles.customChipText}>{condition}</Text>
            <TouchableOpacity onPress={() => toggleCondition(condition)}>
              <Text style={styles.removeText}>✕</Text>
            </TouchableOpacity>
          </View>
        ))}

        <TouchableOpacity style={styles.button} onPress={handleContinue} disabled={loading}>
          {loading
            ? <ActivityIndicator color={Colors.white} />
            : <Text style={styles.buttonText}>
                {selected.length > 0 ? `Continue with ${selected.length} condition${selected.length > 1 ? 's' : ''}` : 'Skip for now'}
              </Text>
          }
        </TouchableOpacity>
      </ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  scroll: { padding: 24, paddingBottom: 48 },
  title: { fontSize: 28, fontWeight: '700', color: Colors.textPrimary, marginTop: 48 },
  subtitle: { fontSize: 15, color: Colors.textSecondary, marginTop: 8, marginBottom: 16, lineHeight: 22 },
  disclaimer: {
    backgroundColor: Colors.primaryLight,
    borderRadius: 12, padding: 12, marginBottom: 24,
  },
  disclaimerText: { fontSize: 13, color: Colors.primaryDark, lineHeight: 20 },
  chipGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginBottom: 24 },
  chip: {
    paddingHorizontal: 14, paddingVertical: 10,
    borderRadius: 99, borderWidth: 1, borderColor: Colors.border,
    backgroundColor: Colors.card,
  },
  chipSelected: { backgroundColor: Colors.primary, borderColor: Colors.primary },
  chipText: { fontSize: 14, color: Colors.textSecondary },
  chipTextSelected: { color: Colors.white, fontWeight: '600' },
  label: { fontSize: 14, fontWeight: '600', color: Colors.textPrimary, marginBottom: 8 },
  customRow: { flexDirection: 'row', gap: 10, marginBottom: 12 },
  customInput: {
    flex: 1, backgroundColor: Colors.card,
    borderWidth: 1, borderColor: Colors.border,
    borderRadius: 12, padding: 14,
    fontSize: 16, color: Colors.textPrimary,
  },
  addButton: {
    backgroundColor: Colors.primary,
    borderRadius: 12, paddingHorizontal: 20,
    justifyContent: 'center',
  },
  addButtonText: { color: Colors.white, fontWeight: '600', fontSize: 14 },
  customChip: {
    flexDirection: 'row', alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: Colors.secondaryLight,
    borderRadius: 12, padding: 12, marginBottom: 8,
  },
  customChipText: { fontSize: 14, color: Colors.textPrimary, fontWeight: '500' },
  removeText: { color: Colors.textSecondary, fontSize: 16, paddingHorizontal: 4 },
  button: {
    backgroundColor: Colors.primary,
    borderRadius: 12, padding: 16,
    alignItems: 'center', marginTop: 24,
  },
  buttonText: { color: Colors.white, fontSize: 16, fontWeight: '600' },
})