import { View, TouchableOpacity } from 'react-native'
import React from 'react'
import ProfileImage from '@/components/features/ProfileImage'
import { Text } from '@/components/ui/text'
import { PRIMARY } from '@/constants/colors'
import { Feather } from '@expo/vector-icons'
import * as Haptics from 'expo-haptics'

const UserInfo = () => {
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
      
      <Text className="text-xl font-bold mt-4 text-white">Alex Johnson</Text>
      <Text className="text-xs text-gray-400 mt-1">alex.johnson@fitzone.com</Text>
      
      <View className="mt-3 px-3 py-1 rounded-full border" style={{ borderColor: PRIMARY + '44', backgroundColor: PRIMARY + '15' }}>
        <Text className="text-[10px] font-bold tracking-widest uppercase" style={{ color: PRIMARY }}>Gold Member</Text>
      </View>
    </View>
  )
}

export default UserInfo
