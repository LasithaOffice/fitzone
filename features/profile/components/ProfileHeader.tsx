import { View, TouchableOpacity } from 'react-native'
import React from 'react'
import { router } from 'expo-router'
import { Text } from '@/components/ui/text'
import { COMP_BACKGROUND_COLOR, COMP_BORDER_COLOR } from '@/constants/colors'
import { Feather } from '@expo/vector-icons'
import * as Haptics from 'expo-haptics'

const ProfileHeader = () => {
  return (
    <View className="flex-row items-center justify-between px-4 py-3 border-b" style={{ borderColor: COMP_BORDER_COLOR }}>
      <TouchableOpacity 
        onPress={() => {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)
          router.back()
        }}
        className="p-1 rounded-full"
        style={{ backgroundColor: COMP_BACKGROUND_COLOR, borderWidth: 1, borderColor: COMP_BORDER_COLOR }}
      >
        <Feather name="chevron-left" size={24} color="white" />
      </TouchableOpacity>
      
      <Text className="text-lg font-bold text-white">Profile</Text>
      
      <TouchableOpacity 
        onPress={() => {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)
          router.push('/main/edit-profile')
        }}
        className="p-1 rounded-full"
        style={{ backgroundColor: COMP_BACKGROUND_COLOR, borderWidth: 1, borderColor: COMP_BORDER_COLOR }}
      >
        <Feather name="edit-2" size={18} color="white" />
      </TouchableOpacity>
    </View>
  )
}

export default ProfileHeader
