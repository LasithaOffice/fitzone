import { View, TouchableOpacity } from 'react-native'
import React from 'react'
import ProfileImage from '@/components/features/ProfileImage'
import { Text } from '@/components/ui/text'
import { PRIMARY } from '@/constants/colors'
import { Feather } from '@expo/vector-icons'
import * as Haptics from 'expo-haptics'

const ProfileImageSection = () => {
  return (
    <View className="items-center mt-6">
      <View className="relative">
        <ProfileImage width={96} height={96} />
        <TouchableOpacity 
          className="absolute bottom-1 right-1 p-2 rounded-full items-center justify-center border-2 border-black" 
          style={{ backgroundColor: PRIMARY }}
          onPress={() => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium)
          }}
        >
          <Feather name="camera" size={14} color="black" />
        </TouchableOpacity>
      </View>
      <TouchableOpacity 
        onPress={() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)}
        className="mt-2"
      >
        <Text className="text-xs font-semibold" style={{ color: PRIMARY }}>Change Photo</Text>
      </TouchableOpacity>
    </View>
  )
}

export default ProfileImageSection
