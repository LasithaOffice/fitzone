import { View, Text, TouchableOpacity, Image } from 'react-native'
import React from 'react'
import { COMP_BACKGROUND_COLOR, COMP_BORDER_COLOR, GRAY, PRIMARY } from '@/constants/colors'
import { FontAwesome5, Feather, MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons';
import { Button } from '@/components/ui/button';


const menuItems = [
  {
    icon: <MaterialCommunityIcons name="fire" size={30} color={PRIMARY} />,
    title: '1,250',
    desc: "Cal Burned"
  },
  {
    icon: <Feather name="bar-chart" size={30} color={PRIMARY} />,
    title: '4',
    desc: "Workouts"
  },
  {
    icon: <MaterialCommunityIcons name="clock-outline" size={30} color={PRIMARY} />,
    title: '3h 20m',
    desc: "Duration"
  },
  {
    icon: <MaterialCommunityIcons name="chart-bell-curve-cumulative" size={30} color={PRIMARY} />,
    title: '4 / 7',
    desc: "Overall Progress"
  }
]

const TodayPlan = () => {
  return (
    <View>
      <View className='flex-row mx-4 items-center'>
        <Text className='flex-1 text-white'>Today's Plan</Text>
        <TouchableOpacity className='flex-row' onPress={() => {

        }}>
          <Text className='text-primary mr-2'>View all</Text>
          <Feather name="chevron-right" size={20} color={GRAY} />
        </TouchableOpacity>
      </View>
      <View className='px-2 py-4 m-4 rounded-lg flex-row' style={{ backgroundColor: COMP_BACKGROUND_COLOR, borderColor: COMP_BORDER_COLOR, borderWidth: 1 }}>
        <View className='flex-row gap-1 border-r-[1px] pr-2' style={{ borderColor: COMP_BORDER_COLOR }}>
          <Image source={require('@/assets/images/workout.png')} className='rounded-full w-[70px] h-[70px]' />
          <View className='gap-2'>
            <Text className='text-white text-[12px]'>Upper Body Strength</Text>
            <View className='flex-row gap-1'>
              <View className='flex-row items-center gap-1'>
                <MaterialCommunityIcons name="clock-time-four-outline" size={12} color="#999999" />
                <Text className='text-gray-400 text-[9px]'>45 min</Text>
              </View>
              <View className='flex-row items-center gap-1'>
                <MaterialCommunityIcons name="clock-time-four-outline" size={12} color="#999999" />
                <Text className='text-gray-400 text-[9px]'>6 Exercises</Text>
              </View>
            </View>
            <TouchableOpacity className='bg-primary hover:bg-blue-600 text-white h-5 w-24 rounded-full items-center justify-center'>
              <Text className='text-black font-medium text-center text-[10px]'>Start Workout</Text>
            </TouchableOpacity>
          </View>
        </View>
        <View className='flex-row gap-1 pr-2 ml-2'>
          <Image source={require('@/assets/images/meal.png')} className='rounded-full w-[70px] h-[70px]' />
          <View className='gap-2'>
            <Text className='text-white text-[12px]'>Meal 2</Text>
            <Text className='text-gray-400 text-[9px] max-w-[80px]' ellipsizeMode='tail' numberOfLines={1} >Grilled Chicken with Quinoa</Text>
            <TouchableOpacity className='bg-primary hover:bg-blue-600 text-white h-5 w-16 rounded-full items-center justify-center'>
              <Text className='text-black font-medium text-center text-[10px]'>View Meal</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  )
}

export default TodayPlan