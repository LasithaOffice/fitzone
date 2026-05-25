import { View } from 'react-native'
import React from 'react'
import { Text } from '@/components/ui/text'
import { COMP_BACKGROUND_COLOR, COMP_BORDER_COLOR, PRIMARY } from '@/constants/colors'
import { FontAwesome6, MaterialCommunityIcons } from '@expo/vector-icons'

const FitnessFocus = () => {
  return (
    <View className="flex-row mx-4 mt-3 gap-3">
      <View className="flex-1 p-4 rounded-xl border flex-row items-center gap-3" style={{ backgroundColor: COMP_BACKGROUND_COLOR, borderColor: COMP_BORDER_COLOR }}>
        <View className="p-2.5 rounded-lg" style={{ backgroundColor: PRIMARY + '15' }}>
          <MaterialCommunityIcons name="arm-flex" size={20} color={PRIMARY} />
        </View>
        <View className="flex-1">
          <Text className="text-[10px] text-gray-500 uppercase font-semibold">Goal</Text>
          <Text className="text-white font-bold text-sm mt-0.5">Build Muscle</Text>
        </View>
      </View>

      <View className="flex-1 p-4 rounded-xl border flex-row items-center gap-3" style={{ backgroundColor: COMP_BACKGROUND_COLOR, borderColor: COMP_BORDER_COLOR }}>
        <View className="p-2.5 rounded-lg" style={{ backgroundColor: PRIMARY + '15' }}>
          <FontAwesome6 name="person-running" size={20} color={PRIMARY} />
        </View>
        <View className="flex-1">
          <Text className="text-[10px] text-gray-500 uppercase font-semibold">Level</Text>
          <Text className="text-white font-bold text-sm mt-0.5">Intermediate</Text>
        </View>
      </View>
    </View>
  )
}

export default FitnessFocus
