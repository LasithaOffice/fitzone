import React, { useState } from 'react';
import { View, ScrollView, TouchableOpacity, SafeAreaView, ActivityIndicator } from 'react-native';
import { Text } from '@/components/ui/text';
import { useAppSelector, useAppDispatch } from '@/store';
import { toggleMealTakenLocal, logMeal, getTodayKey, getTodayName } from '@/store/planSlice';
import { BACKGROUND_COLOR, COMP_BACKGROUND_COLOR, COMP_BORDER_COLOR, PRIMARY, SECONDARY, GRAY } from '@/constants/colors';
import { Ionicons, FontAwesome5, MaterialCommunityIcons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { router } from 'expo-router';

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

const Nutrition = () => {
  const dispatch = useAppDispatch();
  const { mealPlan, mealTracking, loading } = useAppSelector((state) => state.plan);
  
  // Set default selected day to today (if today is Rest day, still can select it)
  const todayName = getTodayName();
  const initialDayIndex = DAYS.includes(todayName) ? todayName : 'Monday';
  const [selectedDay, setSelectedDay] = useState<string>(initialDayIndex);

  const dateKey = getTodayKey();
  const dayTracking = mealTracking[dateKey] ?? {};

  const currentDayPlan = mealPlan.find((p) => p.day === selectedDay);
  const meals = currentDayPlan?.meals ?? [];

  // Calculate totals for the selected day
  const totalCalories = meals.reduce((sum, m) => sum + m.calories, 0);
  const totalProtein = meals.reduce((sum, m) => sum + m.macros.protein, 0);
  const totalCarbs = meals.reduce((sum, m) => sum + m.macros.carbs, 0);
  const totalFats = meals.reduce((sum, m) => sum + m.macros.fats, 0);

  // Completed totals (taken meals)
  const completedCalories = meals.reduce((sum, m) => {
    const isTaken = dayTracking[m.mealName] ?? false;
    return isTaken ? sum + m.calories : sum;
  }, 0);

  const handleToggleMeal = (mealName: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    const isCurrentlyTaken = dayTracking[mealName] ?? false;
    
    // Toggle local state
    dispatch(toggleMealTakenLocal({ dateKey, mealName }));

    // Sync to backend
    dispatch(logMeal({
      date: dateKey,
      day: selectedDay,
      mealName: mealName,
      consumed: !isCurrentlyTaken
    }));
  };

  if (loading && mealPlan.length === 0) {
    return (
      <SafeAreaView className="flex-1 bg-black justify-center items-center">
        <ActivityIndicator size="large" color={PRIMARY} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1" style={{ backgroundColor: BACKGROUND_COLOR }}>
      {/* Header */}
      <View className="px-4 py-3 flex-row items-center border-b" style={{ borderColor: COMP_BORDER_COLOR }}>
        <TouchableOpacity 
          onPress={() => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            router.back();
          }} 
          className="mr-3 p-1"
        >
          <Ionicons name="arrow-back" size={24} color="white" />
        </TouchableOpacity>
        <Text className="text-xl font-bold text-white flex-1">Meal Plan</Text>
        <View className="flex-row items-center bg-zinc-900 px-3 py-1 rounded-full border" style={{ borderColor: COMP_BORDER_COLOR }}>
          <MaterialCommunityIcons name="fire" size={16} color={PRIMARY} />
          <Text className="text-[12px] font-semibold text-white ml-1">{completedCalories} / {totalCalories} kcal</Text>
        </View>
      </View>

      {/* Day Selector */}
      <View className="py-3 border-b" style={{ borderColor: COMP_BORDER_COLOR }}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} className="px-4">
          {DAYS.map((day) => {
            const isSelected = selectedDay === day;
            const isToday = todayName === day;
            return (
              <TouchableOpacity
                key={day}
                onPress={() => {
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                  setSelectedDay(day);
                }}
                className="px-4 py-2 rounded-full mr-2 border flex-row items-center"
                style={{
                  backgroundColor: isSelected ? PRIMARY : COMP_BACKGROUND_COLOR,
                  borderColor: isSelected ? PRIMARY : (isToday ? PRIMARY + '66' : COMP_BORDER_COLOR),
                }}
              >
                <Text 
                  className="font-bold text-sm"
                  style={{ color: isSelected ? 'black' : 'white' }}
                >
                  {day.substring(0, 3)}
                </Text>
                {isToday && (
                  <View 
                    className="w-1.5 h-1.5 rounded-full ml-1.5"
                    style={{ backgroundColor: isSelected ? 'black' : PRIMARY }}
                  />
                )}
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      <ScrollView className="flex-1 px-4 py-4" showsVerticalScrollIndicator={false}>
        {/* Daily Summary Card */}
        <View className="mb-6 p-4 rounded-2xl border" style={{ backgroundColor: COMP_BACKGROUND_COLOR, borderColor: COMP_BORDER_COLOR }}>
          <Text className="text-gray-400 text-xs font-semibold uppercase tracking-wider mb-2">Daily Budget Total</Text>
          <View className="flex-row items-baseline mb-4">
            <Text className="text-3xl font-extrabold text-white">{totalCalories}</Text>
            <Text className="text-gray-400 text-sm ml-1">kcal</Text>
          </View>

          {/* Macro Progress Bar / Badges */}
          <View className="flex-row justify-between items-center bg-black/40 p-3 rounded-xl">
            <View className="items-center flex-1 border-r" style={{ borderColor: COMP_BORDER_COLOR }}>
              <Text className="text-[10px] text-zinc-500 uppercase font-bold">Protein</Text>
              <Text className="text-sm font-extrabold text-white mt-1">{totalProtein}g</Text>
            </View>
            <View className="items-center flex-1 border-r" style={{ borderColor: COMP_BORDER_COLOR }}>
              <Text className="text-[10px] text-zinc-500 uppercase font-bold">Carbs</Text>
              <Text className="text-sm font-extrabold text-white mt-1">{totalCarbs}g</Text>
            </View>
            <View className="items-center flex-1">
              <Text className="text-[10px] text-zinc-500 uppercase font-bold">Fats</Text>
              <Text className="text-sm font-extrabold text-white mt-1">{totalFats}g</Text>
            </View>
          </View>
        </View>

        {/* Meals list */}
        <Text className="text-white text-md font-bold mb-3">Today's Meals</Text>

        {meals.length === 0 ? (
          <View className="p-8 items-center bg-zinc-900 rounded-xl border border-zinc-800">
            <FontAwesome5 name="carrot" size={32} color={GRAY} />
            <Text className="text-zinc-400 text-sm mt-3 text-center">No meal plan structured for this day.</Text>
          </View>
        ) : (
          meals.map((meal) => {
            const isTaken = dayTracking[meal.mealName] ?? false;

            return (
              <View 
                key={meal.name} 
                className="mb-4 rounded-2xl border overflow-hidden transition-all duration-300"
                style={{ 
                  backgroundColor: COMP_BACKGROUND_COLOR, 
                  borderColor: isTaken ? PRIMARY : COMP_BORDER_COLOR,
                  borderWidth: isTaken ? 1.5 : 1
                }}
              >
                {/* Header of Meal Card */}
                <View className="p-4 flex-row justify-between items-center border-b border-zinc-900 bg-zinc-900/40">
                  <View className="flex-row items-center gap-2">
                    <View className="p-2 rounded-lg" style={{ backgroundColor: isTaken ? PRIMARY + '15' : 'rgba(255,255,255,0.05)' }}>
                      <FontAwesome5 
                        name={meal.name.toLowerCase() === 'breakfast' ? 'coffee' : meal.name.toLowerCase() === 'snack' ? 'apple-alt' : 'utensils'} 
                        size={16} 
                        color={isTaken ? PRIMARY : 'white'} 
                      />
                    </View>
                    <View>
                      <Text className="text-[10px] font-bold uppercase tracking-wider text-zinc-500">{meal.name}</Text>
                      <Text className="text-white font-extrabold text-sm">{meal.mealName}</Text>
                    </View>
                  </View>
                  <TouchableOpacity
                    onPress={() => handleToggleMeal(meal.mealName)}
                    className="flex-row items-center px-3 py-1.5 rounded-full border"
                    style={{
                      backgroundColor: isTaken ? PRIMARY : 'transparent',
                      borderColor: isTaken ? PRIMARY : COMP_BORDER_COLOR,
                    }}
                  >
                    {isTaken ? (
                      <>
                        <Ionicons name="checkmark-circle" size={14} color="black" />
                        <Text className="text-xs font-bold text-black ml-1">Taken</Text>
                      </>
                    ) : (
                      <>
                        <Ionicons name="ellipse-outline" size={14} color="white" />
                        <Text className="text-xs font-bold text-white ml-1">Mark Taken</Text>
                      </>
                    )}
                  </TouchableOpacity>
                </View>

                {/* Items & Macros Section */}
                <View className="p-4">
                  {/* Items List */}
                  <View className="mb-4 gap-2">
                    {meal.items.map((item, index) => {
                      const isExcluded = item.includes('[EXCLUDED');
                      return (
                        <View key={index} className="flex-row items-start gap-2">
                          <Ionicons 
                            name={isExcluded ? "warning" : "ellipse"} 
                            size={isExcluded ? 14 : 6} 
                            color={isExcluded ? "#EF4444" : PRIMARY} 
                            className="mt-1" 
                          />
                          <Text 
                            className={`text-xs flex-1 ${isExcluded ? 'text-red-400 line-through' : 'text-zinc-300'}`}
                          >
                            {item}
                          </Text>
                        </View>
                      );
                    })}
                  </View>

                  {/* Meal Macros Badges */}
                  <View className="flex-row justify-between items-center pt-3 border-t border-zinc-900/60">
                    <Text className="text-xs font-semibold text-zinc-400">{meal.calories} kcal</Text>
                    <View className="flex-row gap-2">
                      <View className="bg-zinc-900 px-2 py-1 rounded-md">
                        <Text className="text-[10px] font-medium text-zinc-400">P: {meal.macros.protein}g</Text>
                      </View>
                      <View className="bg-zinc-900 px-2 py-1 rounded-md">
                        <Text className="text-[10px] font-medium text-zinc-400">C: {meal.macros.carbs}g</Text>
                      </View>
                      <View className="bg-zinc-900 px-2 py-1 rounded-md">
                        <Text className="text-[10px] font-medium text-zinc-400">F: {meal.macros.fats}g</Text>
                      </View>
                    </View>
                  </View>
                </View>
              </View>
            );
          })
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

export default Nutrition;
