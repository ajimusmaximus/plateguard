import { useState } from 'react'
import {
  View, Text, ScrollView, TouchableOpacity,
  StyleSheet, ActivityIndicator, Alert
} from 'react-native'
import { useRouter } from 'expo-router'
import { supabase } from '../../lib/supabase'
import { Colors } from '../../constants/colors'

const DISCLAIMER_VERSION = '1.0'

export default function Disclaimer() {
  const router = useRouter()
  const [checked1, setChecked1] = useState(false)
  const [checked2, setChecked2] = useState(false)
  const [checked3, setChecked3] = useState(false)
  const [loading, setLoading] = useState(false)

  const allChecked = checked1 && checked2 && checked3

  async function handleAccept() {
    if (!allChecked) {
      Alert.alert('Please acknowledge all statements', 'You must check all three boxes to continue.')
      return
    }
    setLoading(true)
    const { data: { user } } = await supabase.auth.getUser()
    const { error } = await supabase
      .from('accounts')
      .update({
        disclaimer_accepted: true,
        disclaimer_accepted_at: new Date().toISOString(),
        disclaimer_version: DISCLAIMER_VERSION,
      })
      .eq('id', user.id)

    setLoading(false)
    if (error) {
      Alert.alert('Error', 'Could not save your acceptance. Please try again.')
      return
    }
    router.replace('/(onboarding)/profile-setup')
  }

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <Text style={styles.title}>Before You Begin</Text>
        <Text style={styles.subtitle}>Please read and acknowledge the following.</Text>

        <View style={styles.disclaimerBox}>
          <Text style={styles.disclaimerTitle}>Important Health Disclaimer</Text>
          <Text style={styles.disclaimerText}>
            PlateGuard is a nutrition guidance and meal planning application. It is <Text style={styles.bold}>not a medical service, medical device, or healthcare provider</Text> of any kind.{'\n\n'}
            Nothing in PlateGuard — including meal suggestions, food ratings, restaurant menu analysis, health logging, or any other feature — constitutes medical advice, clinical diagnosis, or treatment of any kind.{'\n\n'}
            Always seek the advice of a qualified physician or licensed healthcare professional before making changes to your diet, exercise routine, or medication regimen, particularly if you have a diagnosed medical condition.{'\n\n'}
            If you are experiencing a medical emergency, call 911 immediately. Do not use PlateGuard to make emergency medical decisions.
          </Text>
        </View>

        <View style={styles.checkboxSection}>
          <CheckRow
            checked={checked1}
            onPress={() => setChecked1(!checked1)}
            label="I understand that PlateGuard is not a medical service and does not provide medical advice, diagnosis, or treatment."
          />
          <CheckRow
            checked={checked2}
            onPress={() => setChecked2(!checked2)}
            label="I confirm that all health information I enter is self-reported and PlateGuard bears no responsibility for outcomes based on my data."
          />
          <CheckRow
            checked={checked3}
            onPress={() => setChecked3(!checked3)}
            label="I agree to the Terms of Service and Privacy Policy and confirm I am 18 or older, or a parent/guardian consenting for a minor."
          />
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity
          style={[styles.button, !allChecked && styles.buttonDisabled]}
          onPress={handleAccept}
          disabled={!allChecked || loading}
        >
          {loading
            ? <ActivityIndicator color={Colors.white} />
            : <Text style={styles.buttonText}>I Agree — Continue</Text>
          }
        </TouchableOpacity>
      </View>
    </View>
  )
}

function CheckRow({ checked, onPress, label }) {
  return (
    <TouchableOpacity style={styles.checkRow} onPress={onPress} activeOpacity={0.7}>
      <View style={[styles.checkbox, checked && styles.checkboxChecked]}>
        {checked && <Text style={styles.checkmark}>✓</Text>}
      </View>
      <Text style={styles.checkLabel}>{label}</Text>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  scroll: { padding: 24, paddingBottom: 120 },
  title: { fontSize: 28, fontWeight: '700', color: Colors.textPrimary, marginTop: 48 },
  subtitle: { fontSize: 15, color: Colors.textSecondary, marginTop: 8, marginBottom: 24 },
  disclaimerBox: {
    backgroundColor: Colors.card,
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: Colors.border,
    marginBottom: 24,
  },
  disclaimerTitle: { fontSize: 16, fontWeight: '700', color: Colors.textPrimary, marginBottom: 12 },
  disclaimerText: { fontSize: 14, color: Colors.textSecondary, lineHeight: 22 },
  bold: { fontWeight: '700', color: Colors.textPrimary },
  checkboxSection: { gap: 16 },
  checkRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 12 },
  checkbox: {
    width: 24, height: 24, borderRadius: 6,
    borderWidth: 2, borderColor: Colors.border,
    alignItems: 'center', justifyContent: 'center',
    flexShrink: 0, marginTop: 2,
  },
  checkboxChecked: { backgroundColor: Colors.primary, borderColor: Colors.primary },
  checkmark: { color: Colors.white, fontSize: 14, fontWeight: '700' },
  checkLabel: { flex: 1, fontSize: 14, color: Colors.textPrimary, lineHeight: 22 },
  footer: {
    position: 'absolute', bottom: 0, left: 0, right: 0,
    padding: 24, backgroundColor: Colors.background,
    borderTopWidth: 1, borderTopColor: Colors.border,
  },
  button: {
    backgroundColor: Colors.primary,
    borderRadius: 12, padding: 16, alignItems: 'center',
  },
  buttonDisabled: { backgroundColor: Colors.textMuted },
  buttonText: { color: Colors.white, fontSize: 16, fontWeight: '600' },
})