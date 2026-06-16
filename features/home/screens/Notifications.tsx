import React, { useState, useEffect } from 'react'
import { View, Text, FlatList, TouchableOpacity, ActivityIndicator, RefreshControl } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { router } from 'expo-router'
import { Ionicons, Feather } from '@expo/vector-icons'
import { COMP_BACKGROUND_COLOR, COMP_BORDER_COLOR, PRIMARY } from '@/constants/colors'
import apiClient from '@/lib/apiClient'

interface NotificationItem {
  _id: string;
  title: string;
  message: string;
  type: 'enrollment_accepted' | 'announcement';
  read: boolean;
  createdAt: string;
}

const Notifications = () => {
  const [loading, setLoading] = useState(true)
  const [notifications, setNotifications] = useState<NotificationItem[]>([])
  const [refreshing, setRefreshing] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchNotifications = async (isRefresh = false) => {
    if (!isRefresh) setLoading(true)
    setError(null)
    try {
      const response = await apiClient.get('/gym/notifications')
      setNotifications(response.data)
    } catch (err) {
      console.error(err)
      setError('Could not load notifications.')
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }

  useEffect(() => {
    fetchNotifications()
  }, [])

  const handleRefresh = () => {
    setRefreshing(true)
    fetchNotifications(true)
  }

  const themeAccent = PRIMARY || '#A3E635'
  const cardBg = COMP_BACKGROUND_COLOR || '#121214'
  const borderBg = COMP_BORDER_COLOR || '#1F1F23'

  const renderItem = ({ item }: { item: NotificationItem }) => {
    const isAnnouncement = item.type === 'announcement';
    return (
      <View 
        className="p-4 rounded-xl border mb-3 flex-row items-start"
        style={{ backgroundColor: cardBg, borderColor: borderBg }}
      >
        <View 
          className="p-2.5 rounded-lg mr-3.5"
          style={{ 
            backgroundColor: isAnnouncement ? `${themeAccent}15` : '#10B98115'
          }}
        >
          <Ionicons 
            name={isAnnouncement ? 'megaphone-outline' : 'checkmark-circle-outline'} 
            size={20} 
            color={isAnnouncement ? themeAccent : '#10B981'} 
          />
        </View>
        
        <View className="flex-1">
          <View className="flex-row items-center justify-between mb-1">
            <Text className="text-white font-extrabold text-[14px]">
              {item.title}
            </Text>
            <Text className="text-zinc-500 text-[10px] font-semibold">
              {new Date(item.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
            </Text>
          </View>
          <Text className="text-zinc-400 text-[13px] leading-5">
            {item.message}
          </Text>
        </View>
      </View>
    )
  }

  return (
    <SafeAreaView className="bg-black flex-1">
      {/* Header bar */}
      <View className="flex-row items-center justify-between px-4 py-3 border-b" style={{ borderColor: borderBg }}>
        <TouchableOpacity onPress={() => router.back()} className="p-1">
          <Feather name="arrow-left" size={24} color="#FFF" />
        </TouchableOpacity>
        <Text className="text-white text-[18px] font-extrabold tracking-wider">
          Notifications
        </Text>
        <TouchableOpacity onPress={() => fetchNotifications(false)} className="p-1">
          <Feather name="refresh-cw" size={20} color="#FFF" />
        </TouchableOpacity>
      </View>

      {loading ? (
        <View className="flex-1 justify-center items-center">
          <ActivityIndicator size="large" color={themeAccent} />
          <Text className="text-gray-400 text-sm mt-3 font-semibold">Loading updates...</Text>
        </View>
      ) : error ? (
        <View className="flex-1 justify-center items-center px-6">
          <Ionicons name="alert-circle-outline" size={60} color="#EF4444" />
          <Text className="text-white text-lg font-bold mt-4">Failed to load data</Text>
          <Text className="text-gray-400 text-sm text-center mt-2">{error}</Text>
          <TouchableOpacity
            className="mt-6 py-2.5 px-6 rounded-lg bg-zinc-900 border"
            style={{ borderColor: borderBg }}
            onPress={() => fetchNotifications(false)}
          >
            <Text className="text-white font-bold">Try Again</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={notifications}
          keyExtractor={(item) => item._id}
          renderItem={renderItem}
          contentContainerStyle={{ paddingHorizontal: 16, paddingTop: 16, paddingBottom: 32 }}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={handleRefresh}
              tintColor={themeAccent}
              colors={[themeAccent]}
            />
          }
          ListEmptyComponent={
            <View className="items-center justify-center py-20">
              <Ionicons name="notifications-off-outline" size={56} color="#3F3F46" />
              <Text className="text-zinc-500 font-bold text-base mt-4">All quiet for now</Text>
              <Text className="text-zinc-600 text-xs text-center mt-1 px-8">
                When you receive enrollment confirmations or club announcements, they will show up here.
              </Text>
            </View>
          }
        />
      )}
    </SafeAreaView>
  )
}

export default Notifications
