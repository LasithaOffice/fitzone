import { TouchableOpacity, Text } from 'react-native'
import React from 'react'
import { router } from 'expo-router'
import { Feather } from '@expo/vector-icons'
import * as Haptics from 'expo-haptics'

const LogOutButton = () => {
  const handleLogout = () => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success)
    router.replace('/(auth)/login')
  }

  return (
    <>
      <TouchableOpacity 
        className="mx-4 mt-8 py-3.5 rounded-xl border items-center justify-center flex-row gap-2 border-red-500/30"
        style={{ backgroundColor: '#ff453a15' }}
        onPress={handleLogout}
      >
        <Feather name="log-out" size={16} color="#ff453a" />
        <Text className="font-bold text-sm text-[#ff453a]">Log Out</Text>
      </TouchableOpacity>
      
      <Text className="text-[10px] text-gray-600 text-center mt-6">Version 1.0.0 (Build 102)</Text>
    </>
  )
}

export default LogOutButton
