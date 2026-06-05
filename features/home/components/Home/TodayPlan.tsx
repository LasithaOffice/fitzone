import { View, Text, TouchableOpacity, Image } from 'react-native'
import React from 'react'
import { COMP_BACKGROUND_COLOR, COMP_BORDER_COLOR, GRAY, PRIMARY } from '@/constants/colors'
import { FontAwesome5, Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import { useAppSelector } from '@/store'
import { selectTodayWorkout, selectTodayMeals } from '@/store/planSlice'
import { router } from 'expo-router'
import * as Haptics from 'expo-haptics'

const TodayPlan = () => {
  const workout = useAppSelector(selectTodayWorkout)
  const meals = useAppSelector(selectTodayMeals)

  const isRestDay = !workout || workout.exercises.length === 0
  const firstMeal = meals.length > 0 ? meals[0] : null

  const handleStartWorkout = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium)
    router.replace('/(tabs)/workouts')
  }

  const handleViewMeal = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium)
    router.push('/main/meal-plan')
  }

  return (
    <View className="mt-4">
      <View className='flex-row mx-4 items-center'>
        <Text className='flex-1 text-white font-bold'>Today's Plan</Text>
      </View>
      <View className='p-3 m-4 rounded-xl flex-row gap-3 border' style={{ backgroundColor: COMP_BACKGROUND_COLOR, borderColor: COMP_BORDER_COLOR }}>
        {/* Workout section */}
        <View className='flex-1 border-r pr-3' style={{ borderColor: COMP_BORDER_COLOR }}>
          <View className="flex-row gap-2 items-center mb-2">
            <Image source={require('@/assets/images/workout.png')} className='rounded-full w-10 h-10' />
            <View className="flex-1">
              <Text className='text-zinc-500 text-[9px] uppercase font-bold'>Workout</Text>
              <Text className='text-white text-xs font-bold' numberOfLines={1} ellipsizeMode="tail">
                {isRestDay ? 'Rest / Recovery' : workout.workoutName}
              </Text>
            </View>
          </View>
          
          <View className="flex-row items-center gap-1.5 mb-3">
            <MaterialCommunityIcons name="clock-time-four-outline" size={12} color="#999" />
            <Text className='text-gray-400 text-[10px]'>{isRestDay ? '0' : workout.durationMinutes} min • {isRestDay ? '0' : workout.exercises.length} exercises</Text>
          </View>

          <TouchableOpacity 
            onPress={handleStartWorkout}
            className='bg-primary h-7 rounded-full items-center justify-center'
            activeOpacity={0.8}
          >
            <Text className='text-black font-extrabold text-[11px]'>{isRestDay ? 'View Plan' : 'Start Workout'}</Text>
          </TouchableOpacity>
        </View>

        {/* Meal section */}
        <View className='flex-1 pl-1'>
          <View className="flex-row gap-2 items-center mb-2">
            <Image source={require('@/assets/images/meal.png')} className='rounded-full w-10 h-10' />
            <View className="flex-1">
              <Text className='text-zinc-500 text-[9px] uppercase font-bold'>{firstMeal ? firstMeal.name : 'Nutrition'}</Text>
              <Text className='text-white text-xs font-bold' numberOfLines={1} ellipsizeMode="tail">
                {firstMeal ? firstMeal.mealName : 'Rest Fueling'}
              </Text>
            </View>
          </View>
          
          <View className="flex-row items-center gap-1.5 mb-3">
            <MaterialCommunityIcons name="fire" size={12} color="#999" />
            <Text className='text-gray-400 text-[10px]'>{firstMeal ? `${firstMeal.calories} kcal` : 'Clean diet'}</Text>
          </View>

          <TouchableOpacity 
            onPress={handleViewMeal}
            className='bg-primary h-7 rounded-full items-center justify-center'
            activeOpacity={0.8}
          >
            <Text className='text-black font-extrabold text-[11px]'>View Meal Plan</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  )
}

export default TodayPlan