import { View, ScrollView, TouchableOpacity, Image } from 'react-native'
import React, { useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Text } from '@/components/ui/text'
import { COMP_BACKGROUND_COLOR, COMP_BORDER_COLOR, PRIMARY } from '@/constants/colors'
import { FontAwesome5, Ionicons } from '@expo/vector-icons'
import * as Haptics from 'expo-haptics'

const categories = ['All', 'Strength', 'Cardio', 'HIIT', 'Yoga']

const workoutList = [
  {
    id: 1,
    title: 'Upper Body Strength',
    duration: '45 min',
    exercises: 6,
    level: 'Intermediate',
    category: 'Strength'
  },
  {
    id: 2,
    title: 'HIIT Fat Burner',
    duration: '25 min',
    exercises: 8,
    level: 'Beginner',
    category: 'HIIT'
  },
  {
    id: 3,
    title: 'Core Stability',
    duration: '20 min',
    exercises: 5,
    level: 'Advanced',
    category: 'Strength'
  }
]

const Workouts = () => {
  const [selectedCat, setSelectedCat] = useState('All')

  return (
    <SafeAreaView className="flex-1 bg-black">
      <View className="px-4 py-3 flex-row justify-between items-center border-b" style={{ borderColor: COMP_BORDER_COLOR }}>
        <Text className="text-xl font-bold text-white">Workouts</Text>
        <TouchableOpacity onPress={() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)}>
          <Ionicons name="search" size={20} color="white" />
        </TouchableOpacity>
      </View>

      <ScrollView className="flex-1" showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 40 }}>
        {/* Categories */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} className="py-4 px-4">
          {categories.map(cat => {
            const isSelected = selectedCat === cat
            return (
              <TouchableOpacity
                key={cat}
                onPress={() => {
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)
                  setSelectedCat(cat)
                }}
                className="px-4 py-2 rounded-full mr-2 border"
                style={{
                  backgroundColor: isSelected ? PRIMARY : COMP_BACKGROUND_COLOR,
                  borderColor: isSelected ? PRIMARY : COMP_BORDER_COLOR
                }}
              >
                <Text style={{ color: isSelected ? 'black' : 'white', fontWeight: 'bold' }}>{cat}</Text>
              </TouchableOpacity>
            )
          })}
        </ScrollView>

        {/* Featured Card */}
        <View className="mx-4 mb-6 rounded-2xl overflow-hidden border" style={{ borderColor: COMP_BORDER_COLOR, backgroundColor: COMP_BACKGROUND_COLOR }}>
          <View className="p-4">
            <Text className="text-xs uppercase tracking-widest font-bold mb-1" style={{ color: PRIMARY }}>Featured Program</Text>
            <Text className="text-lg font-bold text-white mb-2">Summer Shred Challenge</Text>
            <Text className="text-xs text-gray-400 mb-4">A complete 4-week program designed to build lean muscle and burn fat efficiently.</Text>
            <TouchableOpacity
              onPress={() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium)}
              className="py-2.5 rounded-xl items-center justify-center"
              style={{ backgroundColor: PRIMARY }}
            >
              <Text className="font-bold text-black text-sm">Join Challenge</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Workout Cards */}
        <Text className="mx-4 text-sm font-bold text-white mb-3">Popular Workouts</Text>
        {workoutList
          .filter(w => selectedCat === 'All' || w.category === selectedCat)
          .map(workout => (
            <View key={workout.id} className="mx-4 mb-3 p-4 rounded-xl border flex-row items-center gap-4" style={{ backgroundColor: COMP_BACKGROUND_COLOR, borderColor: COMP_BORDER_COLOR }}>
              <View className="p-3 rounded-lg" style={{ backgroundColor: PRIMARY + '15' }}>
                <FontAwesome5 name="dumbbell" size={20} color={PRIMARY} />
              </View>
              <View className="flex-1">
                <Text className="text-white font-bold text-sm">{workout.title}</Text>
                <Text className="text-[10px] text-gray-500 mt-1">{workout.duration} • {workout.exercises} Exercises • {workout.level}</Text>
              </View>
              <TouchableOpacity
                onPress={() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium)}
                className="px-3 py-1.5 rounded-full"
                style={{ backgroundColor: PRIMARY }}
              >
                <Text className="text-xs font-bold text-black">Start</Text>
              </TouchableOpacity>
            </View>
          ))}
      </ScrollView>
    </SafeAreaView>
  )
}

export default Workouts
