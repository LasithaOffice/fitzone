import { View, Text, TouchableOpacity } from 'react-native'
import React from 'react'
import { COMP_BACKGROUND_COLOR, COMP_BORDER_COLOR, PRIMARY } from '@/constants/colors'
import Feather from '@expo/vector-icons/Feather';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { router } from 'expo-router';
import * as Haptics from 'expo-haptics';

const iconSize = 20;

const MainMenu = () => {
  const menuItems = [
    {
      icon: <Feather name="file-text" size={iconSize} color={PRIMARY} />,
      title: 'Meal Plan',
      desc: "Personalized\nfor you",
      onPress: () => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        router.push('/main/meal-plan');
      }
    },
    {
      icon: <FontAwesome6 name="dumbbell" size={iconSize} color={PRIMARY} />,
      title: 'Workout Plan',
      desc: "Tailored to your\ngoals",
      onPress: () => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        router.replace('/(tabs)/workouts');
      }
    },
    {
      icon: <MaterialCommunityIcons name="robot" size={iconSize} color={PRIMARY} />,
      title: 'Ai Coach',
      desc: "Smart plan\nadjustments",
      onPress: () => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      }
    },
    {
      icon: <FontAwesome6 name="house" size={iconSize} color={PRIMARY} />,
      title: 'My Gym',
      desc: "Plans, schedules,\nand gym support",
      onPress: () => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      }
    }
  ]

  return (
    <View className='p-4 mx-4 my-2 rounded-lg flex-row border' style={{ backgroundColor: COMP_BACKGROUND_COLOR, borderColor: COMP_BORDER_COLOR }}>
      {
        menuItems.map((s, index) =>
          <TouchableOpacity 
            key={s.title} 
            onPress={s.onPress}
            className={`items-center gap-2 flex-1 ${(index < menuItems.length - 1) ? 'border-r' : ''}`} 
            style={{ borderColor: COMP_BORDER_COLOR }}
          >
            {s.icon}
            <Text className='text-[11px] text-center text-white font-bold'>{s.title}</Text>
            <Text className='text-[#77787a] text-center text-[9px] mt-0.5'>{s.desc}</Text>
          </TouchableOpacity>
        )
      }
    </View>
  )
}

export default MainMenu