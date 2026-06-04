import { View, Text, TouchableOpacity } from 'react-native'
import React from 'react'
import { COMP_BACKGROUND_COLOR, COMP_BORDER_COLOR, GRAY, PRIMARY } from '@/constants/colors'
import { FontAwesome5, Feather, MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons';

const iconSize = 25;

const menuItems = [
  {
    icon: <MaterialCommunityIcons name="fire" size={iconSize} color={PRIMARY} />,
    title: '0.0',
    desc: "Cal Burned"
  },
  {
    icon: <Feather name="bar-chart" size={iconSize} color={PRIMARY} />,
    title: '0',
    desc: "Workouts"
  },
  {
    icon: <MaterialCommunityIcons name="clock-outline" size={iconSize} color={PRIMARY} />,
    title: '0h 0m',
    desc: "Duration"
  },
  {
    icon: <MaterialCommunityIcons name="chart-bell-curve-cumulative" size={iconSize} color={PRIMARY} />,
    title: '0 / 7',
    desc: "Overall Progress"
  }
]

const ProgressOverview = () => {
  return (
    <View>
      <View className='flex-row mx-4 items-center'>
        <Text className='flex-1 text-white'>Progress Overview</Text>
        <TouchableOpacity className='flex-row' onPress={() => {

        }}>
          <Text className='text-primary mr-2'>View all</Text>
          <Feather name="chevron-right" size={20} color={GRAY} />
        </TouchableOpacity>
      </View>
      <View className='px-2 py-2 m-4 rounded-lg flex-row' style={{ backgroundColor: COMP_BACKGROUND_COLOR, borderColor: COMP_BORDER_COLOR, borderWidth: 1 }}>
        {
          menuItems.map((s, index) =>
            <TouchableOpacity key={s.title} className={`items-center gap-2 flex-1 ${(index < menuItems.length - 1) ? 'border-r-[1px]' : ''}`} style={{ borderColor: COMP_BORDER_COLOR }}>
              {s.icon}
              <Text className='text-[14px] text-center text-white'>{s.title}</Text>
              <Text className='text-white text-center text-[11px]'>{s.desc}</Text>
            </TouchableOpacity>
          )
        }
      </View>
    </View>
  )
}

export default ProgressOverview