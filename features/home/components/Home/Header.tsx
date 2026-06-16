import { View, TouchableOpacity } from 'react-native'
import React from 'react'
import ProfileImage from '@/components/features/ProfileImage'
import { Text } from '@/components/ui/text'
import NotificationButton from './NotificationButton'
import { router } from 'expo-router'
import * as Haptics from 'expo-haptics'

import { useAppSelector } from '@/store'

const Header = () => {
  const { fullName } = useAppSelector(state => state.auth)

  const navigateToProfile = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)
    router.push('/(tabs)/profile')
  }

  const firstName = fullName ? fullName.split(' ')[0] : 'User'

  return (
    <View className='flex-row p-3 gap-3 items-center'>
      <TouchableOpacity 
        className='flex-row flex-1 gap-3 items-center' 
        onPress={navigateToProfile}
        activeOpacity={0.7}
      >
        <ProfileImage width={40} height={40} />
        <View className='flex-1'>
          <Text className='font-bold text-white'>Hello, {firstName}! 👋</Text>
          <Text className='text-gray-300 text-[10px]'>Let's crush your goals today.</Text>
        </View>
      </TouchableOpacity>
      <NotificationButton />
    </View>
  )
}

export default Header