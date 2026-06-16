import React from 'react'
import { View, Text, ScrollView, TouchableOpacity, Linking } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { router } from 'expo-router'
import { Feather, Ionicons } from '@expo/vector-icons'
import { COMP_BACKGROUND_COLOR, COMP_BORDER_COLOR, PRIMARY } from '@/constants/colors'
import * as Haptics from 'expo-haptics'

const HelpCenter = () => {
  const cardBg = COMP_BACKGROUND_COLOR || '#121214'
  const borderBg = COMP_BORDER_COLOR || '#1F1F23'
  const accentColor = PRIMARY || '#A3E635'

  const faqs = [
    {
      q: "How do I request enrollment in a gym?",
      a: "Go to the Gym Network map, tap on a branch marker, and open the profile details. If you have no active enrollment, tap 'Send Join Request'."
    },
    {
      q: "How can I cancel my active gym subscription?",
      a: "Navigate to your Gym Details profile from the home screen, scroll to the bottom and select 'Leave Enrolled Gym'."
    },
    {
      q: "Why isn't my training log sync working?",
      a: "Make sure you are actively enrolled in a branch and your phone is connected to the internet. Sync runs automatically."
    }
  ]

  return (
    <SafeAreaView className="flex-1 bg-black">
      {/* Header */}
      <View className="flex-row items-center justify-between px-4 py-3 border-b" style={{ borderColor: borderBg }}>
        <TouchableOpacity onPress={() => router.back()} className="p-1">
          <Feather name="arrow-left" size={24} color="#FFF" />
        </TouchableOpacity>
        <Text className="text-white text-[18px] font-extrabold tracking-wider">
          Help Center
        </Text>
        <View style={{ width: 32 }} />
      </View>

      <ScrollView className="flex-1 px-4 mt-4" showsVerticalScrollIndicator={false}>
        <Text className="text-zinc-500 text-xs font-semibold uppercase tracking-wider mb-2">Contact Support Desk</Text>
        <View className="flex-row gap-3 mb-6">
          <TouchableOpacity 
            className="flex-1 p-4 rounded-2xl border items-center justify-center" 
            style={{ backgroundColor: cardBg, borderColor: borderBg }}
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)
              Linking.openURL('mailto:support@fitzone.com')
            }}
          >
            <Feather name="mail" size={24} color={accentColor} />
            <Text className="text-white font-bold text-xs mt-2">Email Support</Text>
            <Text className="text-zinc-500 text-[10px] mt-0.5">support@fitzone.com</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            className="flex-1 p-4 rounded-2xl border items-center justify-center" 
            style={{ backgroundColor: cardBg, borderColor: borderBg }}
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)
              alert('Live chat is currently offline. Please send us an email.')
            }}
          >
            <Feather name="message-square" size={24} color={accentColor} />
            <Text className="text-white font-bold text-xs mt-2">Live Chat</Text>
            <Text className="text-zinc-500 text-[10px] mt-0.5">Offline (Mon-Fri)</Text>
          </TouchableOpacity>
        </View>

        <Text className="text-zinc-500 text-xs font-semibold uppercase tracking-wider mb-2">Frequently Asked Questions</Text>
        <View className="gap-3 mb-8">
          {faqs.map((faq, idx) => (
            <View 
              key={idx} 
              className="p-4 rounded-xl border" 
              style={{ backgroundColor: cardBg, borderColor: borderBg }}
            >
              <Text className="text-white font-extrabold text-sm mb-1">{faq.q}</Text>
              <Text className="text-zinc-400 text-xs leading-5">{faq.a}</Text>
            </View>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

export default HelpCenter
