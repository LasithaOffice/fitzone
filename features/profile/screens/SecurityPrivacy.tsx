import React, { useState } from 'react'
import { View, Text, ScrollView, TouchableOpacity, Switch } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { router } from 'expo-router'
import { Feather, Ionicons } from '@expo/vector-icons'
import { COMP_BACKGROUND_COLOR, COMP_BORDER_COLOR, PRIMARY } from '@/constants/colors'
import * as Haptics from 'expo-haptics'

const SecurityPrivacy = () => {
  const [twoFactor, setTwoFactor] = useState(false)
  const [biometrics, setBiometrics] = useState(true)
  const [marketing, setMarketing] = useState(false)

  const cardBg = COMP_BACKGROUND_COLOR || '#121214'
  const borderBg = COMP_BORDER_COLOR || '#1F1F23'
  const accentColor = PRIMARY || '#A3E635'

  return (
    <SafeAreaView className="flex-1 bg-black">
      {/* Header */}
      <View className="flex-row items-center justify-between px-4 py-3 border-b" style={{ borderColor: borderBg }}>
        <TouchableOpacity onPress={() => router.back()} className="p-1">
          <Feather name="arrow-left" size={24} color="#FFF" />
        </TouchableOpacity>
        <Text className="text-white text-[18px] font-extrabold tracking-wider">
          Security & Privacy
        </Text>
        <View style={{ width: 32 }} />
      </View>

      <ScrollView className="flex-1 px-4 mt-4" showsVerticalScrollIndicator={false}>
        <Text className="text-zinc-500 text-xs font-semibold uppercase tracking-wider mb-2">Login Security</Text>
        <View className="rounded-2xl border overflow-hidden mb-6" style={{ backgroundColor: cardBg, borderColor: borderBg }}>
          {/* Biometrics */}
          <View className="flex-row items-center justify-between p-4 border-b" style={{ borderColor: borderBg }}>
            <View className="flex-1 pr-4">
              <Text className="text-white font-bold text-sm">Biometric Authentication</Text>
              <Text className="text-zinc-500 text-[11px] mt-0.5">Use FaceID or Fingerprint to unlock your workouts and dashboard logs.</Text>
            </View>
            <Switch 
              value={biometrics} 
              onValueChange={(val) => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)
                setBiometrics(val)
              }}
              trackColor={{ false: '#3a3a3c', true: accentColor }}
              thumbColor="#FFF"
            />
          </View>

          {/* Two Factor */}
          <View className="flex-row items-center justify-between p-4 border-b" style={{ borderColor: borderBg }}>
            <View className="flex-1 pr-4">
              <Text className="text-white font-bold text-sm">Two-Factor Auth (2FA)</Text>
              <Text className="text-zinc-500 text-[11px] mt-0.5">Receive verification codes via email or phone on login attempts.</Text>
            </View>
            <Switch 
              value={twoFactor} 
              onValueChange={(val) => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)
                setTwoFactor(val)
              }}
              trackColor={{ false: '#3a3a3c', true: accentColor }}
              thumbColor="#FFF"
            />
          </View>

          {/* Change Password */}
          <TouchableOpacity 
            className="flex-row items-center justify-between p-4"
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)
              alert('Password change request sent to your email.')
            }}
          >
            <Text className="text-white font-bold text-sm">Change Login Password</Text>
            <Feather name="chevron-right" size={16} color="#FFF" />
          </TouchableOpacity>
        </View>

        <Text className="text-zinc-500 text-xs font-semibold uppercase tracking-wider mb-2">Privacy & Consents</Text>
        <View className="rounded-2xl border overflow-hidden mb-6" style={{ backgroundColor: cardBg, borderColor: borderBg }}>
          {/* Trainer Sync */}
          <View className="flex-row items-center justify-between p-4 border-b" style={{ borderColor: borderBg }}>
            <View className="flex-1 pr-4">
              <Text className="text-white font-bold text-sm">Trainer Database Sync</Text>
              <Text className="text-zinc-500 text-[11px] mt-0.5">Share weight log and workouts with enrolled gym managers and coaches.</Text>
            </View>
            <Switch 
              value={true} 
              disabled
              trackColor={{ false: '#3a3a3c', true: accentColor }}
              thumbColor="#FFF"
            />
          </View>

          {/* Marketing preferences */}
          <View className="flex-row items-center justify-between p-4" style={{ borderColor: borderBg }}>
            <View className="flex-1 pr-4">
              <Text className="text-white font-bold text-sm">Fitzone Special Offers</Text>
              <Text className="text-zinc-500 text-[11px] mt-0.5">Receive notifications regarding membership discount coupons and local network branch deals.</Text>
            </View>
            <Switch 
              value={marketing} 
              onValueChange={(val) => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)
                setMarketing(val)
              }}
              trackColor={{ false: '#3a3a3c', true: accentColor }}
              thumbColor="#FFF"
            />
          </View>
        </View>

        <TouchableOpacity 
          className="w-full py-4 bg-red-950/10 border border-red-900/40 rounded-2xl items-center mb-8"
          onPress={() => {
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning)
            alert('To delete your Fitzone account, please contact our support desk.')
          }}
        >
          <Text className="text-red-500 font-extrabold text-sm uppercase tracking-wider">Delete My Account</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  )
}

export default SecurityPrivacy
