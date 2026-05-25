import { View, TouchableOpacity } from 'react-native'
import React from 'react'
import { router } from 'expo-router'
import { Text } from '@/components/ui/text'
import { COMP_BACKGROUND_COLOR, COMP_BORDER_COLOR, PRIMARY } from '@/constants/colors'
import { Feather } from '@expo/vector-icons'
import * as Haptics from 'expo-haptics'

interface EditProfileHeaderProps {
  onSave: () => void
}

const EditProfileHeader: React.FC<EditProfileHeaderProps> = ({ onSave }) => {
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
        <Feather name="x" size={24} color="white" />
      </TouchableOpacity>
      
      <Text className="text-lg font-bold text-white">Edit Profile</Text>
      
      <TouchableOpacity 
        onPress={onSave}
        className="px-3 py-1.5 rounded-full"
        style={{ backgroundColor: PRIMARY }}
      >
        <Text className="text-xs font-bold text-black">Save</Text>
      </TouchableOpacity>
    </View>
  )
}

export default EditProfileHeader
