import { View, TouchableOpacity, Switch } from 'react-native'
import React, { useState } from 'react'
import { router } from 'expo-router'
import { Text } from '@/components/ui/text'
import { COMP_BACKGROUND_COLOR, COMP_BORDER_COLOR, GRAY, PRIMARY } from '@/constants/colors'
import { Feather } from '@expo/vector-icons'
import * as Haptics from 'expo-haptics'

const AccountSettings = () => {
  const [notificationsEnabled, setNotificationsEnabled] = useState(true)

  const toggleNotifications = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)
    setNotificationsEnabled(previousState => !previousState)
  }

  return (
    <View className="mt-2">
      <Text className="mx-4 mt-6 text-xs font-semibold text-gray-500 uppercase tracking-wider">Account Settings</Text>
      <View className="mx-4 mt-2 rounded-xl border overflow-hidden" style={{ backgroundColor: COMP_BACKGROUND_COLOR, borderColor: COMP_BORDER_COLOR }}>
        {/* Personal Information */}
        <TouchableOpacity 
          className="flex-row items-center p-4 border-b" 
          style={{ borderColor: COMP_BORDER_COLOR }}
          onPress={() => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)
            router.push('/main/edit-profile')
          }}
        >
          <Feather name="user" size={18} color={GRAY} />
          <Text className="text-white ml-3 flex-1 text-sm font-medium">Personal Information</Text>
          <Feather name="chevron-right" size={16} color={GRAY} />
        </TouchableOpacity>

        {/* Notifications Toggle */}
        <View className="flex-row items-center p-4 border-b justify-between" style={{ borderColor: COMP_BORDER_COLOR }}>
          <View className="flex-row items-center flex-1">
            <Feather name="bell" size={18} color={GRAY} />
            <Text className="text-white ml-3 text-sm font-medium">Notifications</Text>
          </View>
          <Switch 
            value={notificationsEnabled}
            onValueChange={toggleNotifications}
            trackColor={{ false: '#3a3a3c', true: PRIMARY }}
            thumbColor={'#ffffff'}
            ios_backgroundColor="#3a3a3c"
          />
        </View>

        {/* Security */}
        <TouchableOpacity 
          className="flex-row items-center p-4"
          onPress={() => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)
            router.push('/main/security-privacy')
          }}
        >
          <Feather name="shield" size={18} color={GRAY} />
          <Text className="text-white ml-3 flex-1 text-sm font-medium">Security & Privacy</Text>
          <Feather name="chevron-right" size={16} color={GRAY} />
        </TouchableOpacity>
      </View>
    </View>
  )
}

export default AccountSettings
