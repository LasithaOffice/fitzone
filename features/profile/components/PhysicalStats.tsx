import { View } from 'react-native'
import React from 'react'
import { Text } from '@/components/ui/text'
import { COMP_BACKGROUND_COLOR, COMP_BORDER_COLOR, PRIMARY } from '@/constants/colors'
import { FontAwesome5, FontAwesome6 } from '@expo/vector-icons'

const PhysicalStats = () => {
  return (
    <View className="flex-row mx-4 mt-6 p-4 rounded-xl border justify-between" style={{ backgroundColor: COMP_BACKGROUND_COLOR, borderColor: COMP_BORDER_COLOR }}>
      <View className="items-center flex-1">
        <FontAwesome5 name="weight" size={18} color={PRIMARY} />
        <Text className="text-white font-bold mt-2 text-sm">78 kg</Text>
        <Text className="text-[10px] text-gray-500 mt-0.5">Weight</Text>
      </View>
      <View className="w-[1px] h-10 self-center" style={{ backgroundColor: COMP_BORDER_COLOR }} />
      <View className="items-center flex-1">
        <FontAwesome6 name="ruler-vertical" size={18} color={PRIMARY} />
        <Text className="text-white font-bold mt-2 text-sm">182 cm</Text>
        <Text className="text-[10px] text-gray-500 mt-0.5">Height</Text>
      </View>
      <View className="w-[1px] h-10 self-center" style={{ backgroundColor: COMP_BORDER_COLOR }} />
      <View className="items-center flex-1">
        <FontAwesome5 name="birthday-cake" size={17} color={PRIMARY} />
        <Text className="text-white font-bold mt-2 text-sm">28 yrs</Text>
        <Text className="text-[10px] text-gray-500 mt-0.5">Age</Text>
      </View>
    </View>
  )
}

export default PhysicalStats
