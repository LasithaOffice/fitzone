import { View, TouchableOpacity } from 'react-native'
import React from 'react'
import { Text } from '@/components/ui/text'
import { COMP_BACKGROUND_COLOR, COMP_BORDER_COLOR, GRAY } from '@/constants/colors'
import { Feather, MaterialCommunityIcons, Ionicons } from '@expo/vector-icons'

const FitnessPreferences = () => {
  return (
    <View className="mt-2">
      <Text className="mx-4 mt-6 text-xs font-semibold text-gray-500 uppercase tracking-wider">Fitness Preferences</Text>
      <View className="mx-4 mt-2 rounded-xl border overflow-hidden" style={{ backgroundColor: COMP_BACKGROUND_COLOR, borderColor: COMP_BORDER_COLOR }}>
        {/* Units */}
        <TouchableOpacity className="flex-row items-center p-4 border-b" style={{ borderColor: COMP_BORDER_COLOR }}>
          <MaterialCommunityIcons name="scale-balance" size={18} color={GRAY} />
          <Text className="text-white ml-3 flex-1 text-sm font-medium">Units of Measure</Text>
          <Text className="text-xs text-gray-500 mr-2">Metric (kg, cm)</Text>
          <Feather name="chevron-right" size={16} color={GRAY} />
        </TouchableOpacity>

        {/* Linked Apps */}
        <TouchableOpacity className="flex-row items-center p-4">
          <Ionicons name="link-outline" size={18} color={GRAY} />
          <Text className="text-white ml-3 flex-1 text-sm font-medium">Connected Devices</Text>
          <Text className="text-xs text-gray-500 mr-2">Apple Health</Text>
          <Feather name="chevron-right" size={16} color={GRAY} />
        </TouchableOpacity>
      </View>
    </View>
  )
}

export default FitnessPreferences
