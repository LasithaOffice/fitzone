import { View, Text, TouchableOpacity } from 'react-native'
import React, { useState, useCallback } from 'react'
import Ionicons from '@expo/vector-icons/Ionicons';
import { PRIMARY } from '@/constants/colors';
import { router, useFocusEffect } from 'expo-router';
import apiClient from '@/lib/apiClient';

const NotificationButton = () => {
  const [unreadCount, setUnreadCount] = useState(0)

  const fetchUnreadCount = async () => {
    try {
      const response = await apiClient.get('/gym/notifications/unread')
      setUnreadCount(response.data.count || 0)
    } catch (err) {
      console.error('Failed to fetch unread notification count:', err)
    }
  }

  useFocusEffect(
    useCallback(() => {
      fetchUnreadCount()
    }, [])
  )

  return (
    <TouchableOpacity 
      className='w-10 h-10 items-center justify-center'
      onPress={() => router.push('/main/notifications')}
    >
      <Ionicons name="notifications-outline" size={25} color="white" />
      {unreadCount > 0 && (
        <View 
          className='absolute border border-black items-center justify-center rounded-full right-0 top-0' 
          style={{ 
            backgroundColor: PRIMARY,
            minWidth: 16,
            height: 16,
            paddingHorizontal: 2,
          }}
        >
          <Text className="text-[9px] font-black text-black text-center leading-[16px]">
            {unreadCount}
          </Text>
        </View>
      )}
    </TouchableOpacity>
  )
}

export default NotificationButton