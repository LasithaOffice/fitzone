import React from 'react'
import { View, Text, ScrollView, TouchableOpacity } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { router } from 'expo-router'
import { Feather } from '@expo/vector-icons'
import { COMP_BORDER_COLOR } from '@/constants/colors'

const TermsService = () => {
  const borderBg = COMP_BORDER_COLOR || '#1F1F23'

  return (
    <SafeAreaView className="flex-1 bg-black">
      {/* Header */}
      <View className="flex-row items-center justify-between px-4 py-3 border-b" style={{ borderColor: borderBg }}>
        <TouchableOpacity onPress={() => router.back()} className="p-1">
          <Feather name="arrow-left" size={24} color="#FFF" />
        </TouchableOpacity>
        <Text className="text-white text-[18px] font-extrabold tracking-wider">
          Terms of Service
        </Text>
        <View style={{ width: 32 }} />
      </View>

      <ScrollView className="flex-1 px-4 mt-4" showsVerticalScrollIndicator={false}>
        <Text className="text-white font-extrabold text-base mb-2">User Agreement & Rules</Text>
        <Text className="text-zinc-500 text-xs mb-4">Last Updated: June 2026</Text>

        <Text className="text-zinc-300 text-sm leading-6 mb-4">
          Welcome to Fitzone. By creating an account or accessing our mobile and web applications, you agree to comply with our Terms of Service. Please read these guidelines carefully.
        </Text>

        <Text className="text-white font-bold text-sm mb-1">1. User Account Registration</Text>
        <Text className="text-zinc-400 text-xs leading-5 mb-4">
          Users must be at least 13 years old to use this platform. All registration details (e.g. weight, birthdate) must be accurate to ensure health recommendations match your current parameters.
        </Text>

        <Text className="text-white font-bold text-sm mb-1">2. Gym Network Membership</Text>
        <Text className="text-zinc-400 text-xs leading-5 mb-4">
          You may only enroll in one gym branch at a time. Gym owners reserve the right to approve, reject, or terminate member registry access for any reason.
        </Text>

        <Text className="text-white font-bold text-sm mb-1">3. Privacy Policies</Text>
        <Text className="text-zinc-400 text-xs leading-5 mb-6">
          Your workout plan details, logging summaries, and profile credentials are saved securely. We will never sell your health metrics.
        </Text>
      </ScrollView>
    </SafeAreaView>
  )
}

export default TermsService
