import { View, Text, TouchableOpacity } from 'react-native'
import React from 'react'
import { COMP_BACKGROUND_COLOR, COMP_BORDER_COLOR, GRAY, PRIMARY } from '@/constants/colors'
import { FontAwesome5, Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import { useAppSelector } from '@/store'

const iconSize = 25;

const ProgressOverview = () => {
  const { mlOutputs } = useAppSelector((state) => state.plan)

  const items = [
    {
      icon: <MaterialCommunityIcons name="fire" size={iconSize} color={PRIMARY} />,
      title: mlOutputs ? `${mlOutputs.targetCalories}` : '3298',
      desc: "Daily kcal"
    },
    {
      icon: <MaterialCommunityIcons name="food-apple" size={iconSize} color={PRIMARY} />,
      title: mlOutputs ? `${mlOutputs.targetProteinG}g` : '188g',
      desc: "Daily Protein"
    },
    {
      icon: <FontAwesome5 name="dumbbell" size={20} color={PRIMARY} />,
      title: mlOutputs ? `${mlOutputs.weeklyVolumeSets}` : '17',
      desc: "Weekly Sets"
    },
    {
      icon: <MaterialCommunityIcons name="speedometer" size={iconSize} color={PRIMARY} />,
      title: mlOutputs ? `Lvl ${mlOutputs.intensityLevel}` : 'Lvl 2',
      desc: "Intensity"
    }
  ]

  return (
    <View>
      <View className='flex-row mx-4 items-center mt-4'>
        <Text className='flex-1 text-white font-bold'>Target Metrics</Text>
      </View>
      <View className='px-2 py-3 m-4 rounded-xl flex-row border' style={{ backgroundColor: COMP_BACKGROUND_COLOR, borderColor: COMP_BORDER_COLOR }}>
        {
          items.map((s, index) =>
            <View key={s.desc} className={`items-center gap-1.5 flex-1 ${(index < items.length - 1) ? 'border-r' : ''}`} style={{ borderColor: COMP_BORDER_COLOR }}>
              {s.icon}
              <Text className='text-[13px] font-extrabold text-center text-white mt-1'>{s.title}</Text>
              <Text className='text-zinc-500 text-center text-[10px] uppercase font-bold'>{s.desc}</Text>
            </View>
          )
        }
      </View>
    </View>
  )
}

export default ProgressOverview