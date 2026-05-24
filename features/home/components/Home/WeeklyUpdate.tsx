import { View } from 'react-native'
import React from 'react'
import { ImageBackground } from 'expo-image'
import { Text } from '@/components/ui/text'
import { Progress } from '@/components/ui/progress'

const WeeklyUpdate = () => {
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
          <Text className='text-[#9fd101] text-[10px]'>4 of 7 <Text className='text-[10px]'>workouts completed</Text></Text>
          <Progress value={40} className="w-40 mt-3" indicatorClassName='bg-[#9fd101]' />
        </View>
      </ImageBackground>
    </View >
  )
}

export default WeeklyUpdate