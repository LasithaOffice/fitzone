import { View } from 'react-native'
import React from 'react'
import ProfileImage from '@/components/features/ProfileImage'
import { Text } from '@/components/ui/text'
import NotificationButton from './NotificationButton'

const Header = () => {
  return (
    <View className='flex-row p-3 gap-3 items-center'>
      <ProfileImage width={40} height={40} />
      <View className='flex-1'>
        <Text className='font-bold'>Hello, Alex! 👋</Text>
        <Text className='text-gray-300 text-[10px]'>Let's crush your goals today.</Text>
      </View>
      <NotificationButton />
    </View>
  )
}

export default Header