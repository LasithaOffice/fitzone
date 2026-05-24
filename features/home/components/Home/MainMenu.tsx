import { View, Text, TouchableOpacity } from 'react-native'
import React from 'react'
import { COMP_BACKGROUND_COLOR, COMP_BORDER_COLOR, PRIMARY } from '@/constants/colors'
import Feather from '@expo/vector-icons/Feather';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';

const iconSize = 20;

const menuItems = [
  {
    icon: <Feather name="file-text" size={iconSize} color={PRIMARY} />,
    title: 'Meal Plan',
    desc: "Personalized\nfor you"
  },
  {
    icon: <FontAwesome6 name="dumbbell" size={iconSize} color={PRIMARY} />,
    title: 'Workout Plan',
    desc: "Tailored to your\ngoals"
  },
  {
    icon: <MaterialCommunityIcons name="robot" size={iconSize} color={PRIMARY} />,
    title: 'Ai Coach',
    desc: "Smart plan\nadjustments"
  },
  {
    icon: <FontAwesome6 name="house" size={iconSize} color={PRIMARY} />,
    title: 'My Gym',
    desc: "Plans, schedules,\nand gym support"
  }
]

const MainMenu = () => {
  return (
    <View className='p-4 mx-4 my-2 rounded-lg flex-row' style={{ backgroundColor: COMP_BACKGROUND_COLOR, borderColor: COMP_BORDER_COLOR, borderWidth: 1 }}>
      {
        menuItems.map((s, index) =>
          <TouchableOpacity key={s.title} className={`items-center gap-2 flex-1 ${(index < menuItems.length - 1) ? 'border-r-[1px]' : ''}`} style={{ borderColor: COMP_BORDER_COLOR }}>
            {s.icon}
            <Text className='text-[11px] text-center text-white'>{s.title}</Text>
            <Text className='text-[#77787a] text-center text-[10px]'>{s.desc}</Text>
          </TouchableOpacity>
        )
      }
    </View>
  )
}

export default MainMenu