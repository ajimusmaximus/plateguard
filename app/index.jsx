import { useEffect } from 'react'
import { useRouter } from 'expo-router'
import { View, ActivityIndicator } from 'react-native'
import { useAuth } from '../hooks/useAuth'
import { supabase } from '../lib/supabase'
import { Colors } from '../constants/colors'

export default function Index() {
  const { session, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (loading) return

    if (!session) {
      router.replace('/(auth)/login')
      return
    }

    // Check if disclaimer accepted
    async function checkOnboarding() {
      const { data: account } = await supabase
        .from('accounts')
        .select('disclaimer_accepted')
        .eq('id', session.user.id)
        .single()

      if (!account?.disclaimer_accepted) {
        router.replace('/(onboarding)/disclaimer')
        return
      }

      // Check if they have at least one profile
      const { data: profiles } = await supabase
        .from('profiles')
        .select('id')
        .eq('account_id', session.user.id)
        .limit(1)

      if (!profiles || profiles.length === 0) {
        router.replace('/(onboarding)/profile-setup')
        return
      }

      router.replace('/(tabs)')
    }

    checkOnboarding()
  }, [session, loading])

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: Colors.background }}>
      <ActivityIndicator size="large" color={Colors.primary} />
    </View>
  )
}