import { View, TouchableOpacity } from 'react-native'
import React from 'react'
import { Text } from '@/components/ui/text'
import { COMP_BACKGROUND_COLOR, COMP_BORDER_COLOR, GRAY } from '@/constants/colors'
import { Feather } from '@expo/vector-icons'

const SupportLegal = () => {
  return (
    <View className="mt-2">
      <Text className="mx-4 mt-6 text-xs font-semibold text-gray-500 uppercase tracking-wider">Support & Legal</Text>
      <View className="mx-4 mt-2 rounded-xl border overflow-hidden" style={{ backgroundColor: COMP_BACKGROUND_COLOR, borderColor: COMP_BORDER_COLOR }}>
        {/* Help Center */}
        <TouchableOpacity className="flex-row items-center p-4 border-b" style={{ borderColor: COMP_BORDER_COLOR }}>
          <Feather name="help-circle" size={18} color={GRAY} />
          <Text className="text-white ml-3 flex-1 text-sm font-medium">Help Center</Text>
          <Feather name="chevron-right" size={16} color={GRAY} />
        </TouchableOpacity>

        {/* Terms & Privacy */}
        <TouchableOpacity className="flex-row items-center p-4">
          <Feather name="file-text" size={18} color={GRAY} />
          <Text className="text-white ml-3 flex-1 text-sm font-medium">Terms of Service</Text>
          <Feather name="chevron-right" size={16} color={GRAY} />
        </TouchableOpacity>
      </View>
    </View>
  )
}

export default SupportLegal
