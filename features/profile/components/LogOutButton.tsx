import { TouchableOpacity, Text, Alert } from 'react-native'
import React, { useState } from 'react'
import { router } from 'expo-router'
import { Feather } from '@expo/vector-icons'
import * as Haptics from 'expo-haptics'
import * as tokenStore from '@/lib/tokenStore'
import { clearLocalOnboardingState, clearOnboardingCompleted } from '@/lib/onboardingStore'
import { GoogleSignin } from '@react-native-google-signin/google-signin'

const LogOutButton = () => {
  const [loading, setLoading] = useState(false)

  const handleLogout = () => {
    Alert.alert(
      'Log Out',
      'Are you sure you want to log out?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Log Out',
          style: 'destructive',
          onPress: performLogout,
        },
      ]
    )
  }

  const performLogout = async () => {
    setLoading(true)
    try {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success)

      // Clear auth tokens from SecureStore
      await tokenStore.clearTokens()

      // Clear onboarding state so it resets for the next user
      await clearLocalOnboardingState()
      await clearOnboardingCompleted()

      // Sign out from Google to force a fresh sign-in next time
      try {
        await GoogleSignin.signOut()
      } catch (e) {
        // Not fatal — continue with logout even if Google sign-out fails
        console.warn('Google sign-out failed (non-fatal):', e)
      }

      router.replace('/(auth)/login')
    } catch (err) {
      console.error('Logout error:', err)
      // Still navigate to login even if cleanup partially fails
      router.replace('/(auth)/login')
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <TouchableOpacity 
        className="mx-4 mt-8 py-3.5 rounded-xl border items-center justify-center flex-row gap-2 border-red-500/30"
        style={{ backgroundColor: '#ff453a15', opacity: loading ? 0.6 : 1 }}
        onPress={handleLogout}
        disabled={loading}
      >
        <Feather name="log-out" size={16} color="#ff453a" />
        <Text className="font-bold text-sm text-[#ff453a]">
          {loading ? 'Logging out...' : 'Log Out'}
        </Text>
      </TouchableOpacity>
      
      <Text className="text-[10px] text-gray-600 text-center mt-6">Version 1.0.0 (Build 102)</Text>
    </>
  )
}

export default LogOutButton
