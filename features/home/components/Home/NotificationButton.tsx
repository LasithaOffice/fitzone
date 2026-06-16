import { View, Text, TouchableOpacity } from 'react-native'
import React from 'react'
import Ionicons from '@expo/vector-icons/Ionicons';
import { PRIMARY } from '@/constants/colors';
import { router } from 'expo-router';

const NotificationButton = () => {
  return (
    <TouchableOpacity 
      className='w-10 h-10 items-center justify-center'
      onPress={() => router.push('/main/notifications')}
    >
      <Ionicons name="notifications-outline" size={25} color="white" />
      <View className='absolute border-2 border-black w-4 h-4 rounded-full right-1 top-1' style={
        { backgroundColor: PRIMARY }
      }></View>
    </TouchableOpacity>
  )
}

export default NotificationButton