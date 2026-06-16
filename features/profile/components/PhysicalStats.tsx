import { View } from 'react-native'
import React from 'react'
import { Text } from '@/components/ui/text'
import { COMP_BACKGROUND_COLOR, COMP_BORDER_COLOR, PRIMARY } from '@/constants/colors'
import { FontAwesome5, FontAwesome6 } from '@expo/vector-icons'
import { useAppSelector } from '@/store'

const PhysicalStats = () => {
  const { weightValue, weightUnit, heightValue, heightUnit, birthday } = useAppSelector(state => state.auth)

  const calculateAge = (birthdayStr?: string) => {
    if (!birthdayStr) return 'N/A';
    const birth = new Date(birthdayStr);
    if (isNaN(birth.getTime())) return 'N/A';
    const today = new Date();
    let age = today.getFullYear() - birth.getFullYear();
    const m = today.getMonth() - birth.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    return `${age} yrs`;
  }

  return (
    <View className="flex-row mx-4 mt-6 p-4 rounded-xl border justify-between" style={{ backgroundColor: COMP_BACKGROUND_COLOR, borderColor: COMP_BORDER_COLOR }}>
      <View className="items-center flex-1">
        <FontAwesome5 name="weight" size={18} color={PRIMARY} />
        <Text className="text-white font-bold mt-2 text-sm">{weightValue ? `${weightValue} ${weightUnit || 'kg'}` : 'N/A'}</Text>
        <Text className="text-[10px] text-gray-500 mt-0.5">Weight</Text>
      </View>
      <View className="w-[1px] h-10 self-center" style={{ backgroundColor: COMP_BORDER_COLOR }} />
      <View className="items-center flex-1">
        <FontAwesome6 name="ruler-vertical" size={18} color={PRIMARY} />
        <Text className="text-white font-bold mt-2 text-sm">{heightValue ? `${heightValue} ${heightUnit || 'cm'}` : 'N/A'}</Text>
        <Text className="text-[10px] text-gray-500 mt-0.5">Height</Text>
      </View>
      <View className="w-[1px] h-10 self-center" style={{ backgroundColor: COMP_BORDER_COLOR }} />
      <View className="items-center flex-1">
        <FontAwesome5 name="birthday-cake" size={17} color={PRIMARY} />
        <Text className="text-white font-bold mt-2 text-sm">{calculateAge(birthday)}</Text>
        <Text className="text-[10px] text-gray-500 mt-0.5">Age</Text>
      </View>
    </View>
  )
}

export default PhysicalStats
