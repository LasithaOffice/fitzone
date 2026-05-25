import { View, ScrollView, TouchableOpacity } from 'react-native'
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Text } from '@/components/ui/text'
import { COMP_BACKGROUND_COLOR, COMP_BORDER_COLOR, PRIMARY } from '@/constants/colors'
import { FontAwesome5, Ionicons } from '@expo/vector-icons'
import * as Haptics from 'expo-haptics'

const Progress = () => {
  return (
    <SafeAreaView className="flex-1 bg-black">
      <View className="px-4 py-3 flex-row justify-between items-center border-b" style={{ borderColor: COMP_BORDER_COLOR }}>
        <Text className="text-xl font-bold text-white">Progress</Text>
        <TouchableOpacity onPress={() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)}>
          <Ionicons name="calendar-outline" size={20} color="white" />
        </TouchableOpacity>
      </View>

      <ScrollView className="flex-1" showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 40 }}>
        {/* Weekly Stats Grid */}
        <View className="flex-row mx-4 mt-6 p-4 rounded-xl border justify-between" style={{ backgroundColor: COMP_BACKGROUND_COLOR, borderColor: COMP_BORDER_COLOR }}>
          <View className="items-center flex-1">
            <FontAwesome5 name="fire" size={18} color={PRIMARY} />
            <Text className="text-white font-bold mt-2 text-sm">2,450</Text>
            <Text className="text-[10px] text-gray-500 mt-0.5">Kcal Burned</Text>
          </View>
          <View className="w-[1px] h-10 self-center" style={{ backgroundColor: COMP_BORDER_COLOR }} />
          <View className="items-center flex-1">
            <FontAwesome5 name="running" size={18} color={PRIMARY} />
            <Text className="text-white font-bold mt-2 text-sm">12.5 km</Text>
            <Text className="text-[10px] text-gray-500 mt-0.5">Distance</Text>
          </View>
          <View className="w-[1px] h-10 self-center" style={{ backgroundColor: COMP_BORDER_COLOR }} />
          <View className="items-center flex-1">
            <FontAwesome5 name="clock" size={17} color={PRIMARY} />
            <Text className="text-white font-bold mt-2 text-sm">3h 45m</Text>
            <Text className="text-[10px] text-gray-500 mt-0.5">Active Time</Text>
          </View>
        </View>

        {/* Goals Progress */}
        <Text className="mx-4 mt-6 text-sm font-bold text-white mb-3">Weekly Target</Text>
        <View className="mx-4 p-4 rounded-xl border" style={{ backgroundColor: COMP_BACKGROUND_COLOR, borderColor: COMP_BORDER_COLOR }}>
          <View className="flex-row justify-between items-center mb-2">
            <Text className="text-white font-semibold text-sm">Workout Consistency</Text>
            <Text className="text-sm" style={{ color: PRIMARY }}>4 of 5 workouts</Text>
          </View>
          <View className="h-2 w-full rounded-full bg-gray-800 overflow-hidden">
            <View className="h-full rounded-full" style={{ width: '80%', backgroundColor: PRIMARY }} />
          </View>
        </View>

        {/* History Log */}
        <Text className="mx-4 mt-6 text-sm font-bold text-white mb-3">Recent Activity</Text>
        <View className="mx-4 rounded-xl border overflow-hidden" style={{ backgroundColor: COMP_BACKGROUND_COLOR, borderColor: COMP_BORDER_COLOR }}>
          <View className="flex-row items-center p-4 border-b" style={{ borderColor: COMP_BORDER_COLOR }}>
            <Ionicons name="checkmark-circle" size={20} color={PRIMARY} />
            <View className="ml-3 flex-1">
              <Text className="text-white text-sm font-semibold">Upper Body Strength</Text>
              <Text className="text-[10px] text-gray-500 mt-0.5">Today, 8:30 AM • 45 min • 350 kcal</Text>
            </View>
          </View>
          <View className="flex-row items-center p-4 border-b" style={{ borderColor: COMP_BORDER_COLOR }}>
            <Ionicons name="checkmark-circle" size={20} color={PRIMARY} />
            <View className="ml-3 flex-1">
              <Text className="text-white text-sm font-semibold">HIIT Cardio Session</Text>
              <Text className="text-[10px] text-gray-500 mt-0.5">Yesterday, 6:00 PM • 30 min • 280 kcal</Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

export default Progress
