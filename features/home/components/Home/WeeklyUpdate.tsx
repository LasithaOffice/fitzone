import { View } from 'react-native'
import React from 'react'
import { ImageBackground } from 'expo-image'
import { Text } from '@/components/ui/text'
import { Progress } from '@/components/ui/progress'
import { useAppSelector } from '@/store'
import { getTodayKey } from '@/store/planSlice'

const WeeklyUpdate = () => {
  const { workoutPlan, workoutTracking } = useAppSelector((state) => state.plan)
  
  // Count how many days have workouts
  const activeWorkoutDays = workoutPlan.filter(day => day.exercises.length > 0).length
  
  // Count how many days in tracking have at least one set completed
  // For simplicity, we check if today or any other day this week has completion
  let completedDaysCount = 0
  
  // Check tracked entries. Count keys in workoutTracking where at least one set is checked
  Object.values(workoutTracking).forEach((exerciseTrack) => {
    let dayHasCompletedSet = false
    Object.values(exerciseTrack).forEach((setTrack) => {
      if (Object.values(setTrack).some(completed => completed === true)) {
        dayHasCompletedSet = true
      }
    })
    if (dayHasCompletedSet) {
      completedDaysCount++
    }
  })

  // Ensure minimum 0 and cap at activeWorkoutDays
  const totalDays = activeWorkoutDays || 5
  const progressVal = Math.round((completedDaysCount / totalDays) * 100)

  return (
    <View className='h-52 w-full p-4'>
      <ImageBackground contentFit='contain'
        source={require('../../assets/images/weekly_progress.png')}
        style={
          {
            width: '100%',
            height: '100%',
          }
        }
      >
        <View className='absolute bottom-0 p-5'>
          <Text className='text-[#9fd101] text-[10px]'>{completedDaysCount} of {totalDays} <Text className='text-[10px]'>workout days completed</Text></Text>
          <Progress value={progressVal} className="w-40 mt-3" indicatorClassName='bg-[#9fd101]' />
        </View>
      </ImageBackground>
    </View >
  )
}

export default WeeklyUpdate