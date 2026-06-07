import React, { useState } from 'react';
import { View, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Text } from '@/components/ui/text';
import { useAppSelector, useAppDispatch } from '@/store';
import { toggleSetCompletionLocal, logWorkoutSet, getTodayKey, getTodayName } from '@/store/planSlice';
import { BACKGROUND_COLOR, COMP_BACKGROUND_COLOR, COMP_BORDER_COLOR, PRIMARY, SECONDARY, GRAY } from '@/constants/colors';
import { Ionicons, FontAwesome5, MaterialCommunityIcons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { SafeAreaView } from 'react-native-safe-area-context';

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

const Workouts = () => {
  const dispatch = useAppDispatch();
  const { workoutPlan, workoutTracking, loading } = useAppSelector((state) => state.plan);

  const todayName = getTodayName();
  const initialDayIndex = DAYS.includes(todayName) ? todayName : 'Monday';
  const [selectedDay, setSelectedDay] = useState<string>(initialDayIndex);

  const dateKey = getTodayKey();
  const dayTracking = workoutTracking[dateKey] ?? {};

  const currentDayWorkout = workoutPlan.find((w) => w.day === selectedDay);

  console.log("currentDayWorkout", currentDayWorkout)
  console.log("dayTracking", dayTracking)


  const isRestDay = !currentDayWorkout || currentDayWorkout.exercises.length === 0;

  // Find the first uncompleted set in the entire workout to mark as "upcoming"
  let upcomingSetFound = false;
  let upcomingExerciseName = '';
  let upcomingSetIndex = -1;

  if (currentDayWorkout && !isRestDay) {
    for (const exercise of currentDayWorkout.exercises) {
      const exerciseProgress = dayTracking[exercise.name] ?? {};
      for (let s = 1; s <= exercise.sets; s++) {
        if (!exerciseProgress[s]) {
          upcomingSetFound = true;
          upcomingExerciseName = exercise.name;
          upcomingSetIndex = s;
          break;
        }
      }
      if (upcomingSetFound) break;
    }
  }

  const handleToggleSet = (exerciseName: string, setNumber: number, totalSets: number) => {
    const exerciseProgress = dayTracking[exerciseName] ?? {};
    const currentStatus = exerciseProgress[setNumber] ?? false;

    if (!currentStatus) {
      // User wants to mark as completed. Must verify previous set is done.
      if (setNumber > 1) {
        const previousSetCompleted = exerciseProgress[setNumber - 1] ?? false;
        if (!previousSetCompleted) {
          Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
          return;
        }
      }
    } else {
      // User wants to uncheck. Must verify next set is not done.
      if (setNumber < totalSets) {
        const nextSetCompleted = exerciseProgress[setNumber + 1] ?? false;
        if (nextSetCompleted) {
          Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
          return;
        }
      }
    }

    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

    // Toggle local state (using 1-indexed set number)
    dispatch(toggleSetCompletionLocal({ dateKey, exerciseName, setIndex: setNumber }));

    // Send tracking update to the backend (passed as 1-indexed to logs API)
    dispatch(logWorkoutSet({
      date: dateKey,
      day: selectedDay,
      exerciseName,
      setIndex: setNumber,
      completed: !currentStatus
    }));
  };

  if (loading && workoutPlan.length === 0) {
    return (
      <SafeAreaView className="flex-1 bg-black justify-center items-center">
        <ActivityIndicator size="large" color={PRIMARY} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-black" style={{ backgroundColor: BACKGROUND_COLOR }}>
      {/* Top Header */}
      <View className="px-4 py-3 flex-row justify-between items-center border-b" style={{ borderColor: COMP_BORDER_COLOR }}>
        <Text className="text-xl font-bold text-white">Workout Plan</Text>
        {!isRestDay && currentDayWorkout && (
          <View className="bg-zinc-900 px-3 py-1 rounded-full border flex-row items-center gap-1.5" style={{ borderColor: COMP_BORDER_COLOR }}>
            <Ionicons name="time" size={14} color={PRIMARY} />
            <Text className="text-[12px] font-semibold text-white">{currentDayWorkout.durationMinutes} min</Text>
          </View>
        )}
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
        {isRestDay ? (
          /* Rest Day Component */
          <View className="py-12 items-center justify-center bg-zinc-950 rounded-2xl border" style={{ borderColor: COMP_BORDER_COLOR }}>
            <View className="w-20 h-20 rounded-full bg-zinc-900/80 justify-center items-center mb-6 border" style={{ borderColor: COMP_BORDER_COLOR }}>
              <MaterialCommunityIcons name="sleep" size={40} color={PRIMARY} />
            </View>
            <Text className="text-xl font-bold text-white mb-2">Rest & Recovery Day</Text>
            <Text className="text-zinc-400 text-center text-sm px-8 max-w-sm mb-6">
              Your muscles build and repair during rest. Hydrate well, do light stretching, and get sufficient sleep today!
            </Text>
            <View className="w-5/6 p-4 rounded-xl border border-zinc-900 bg-zinc-900/30">
              <Text className="text-xs font-bold uppercase tracking-wider text-zinc-500 mb-2">Active Recovery Tips</Text>
              <View className="gap-2">
                <Text className="text-zinc-300 text-xs">• 15-20 min light walk or mobility work</Text>
                <Text className="text-zinc-300 text-xs">• Focus on eating clean, protein-rich foods</Text>
                <Text className="text-zinc-300 text-xs">• Aim for at least 7-8 hours of sound sleep</Text>
              </View>
            </View>
          </View>
        ) : (
          /* Workouts Exercises List */
          <View>
            {/* Workout Overview Header Card */}
            <View className="mb-6 p-4 rounded-2xl border flex-row justify-between items-center" style={{ backgroundColor: COMP_BACKGROUND_COLOR, borderColor: COMP_BORDER_COLOR }}>
              <View className="flex-1">
                <Text className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-1">Workout Focus</Text>
                <Text className="text-xl font-extrabold text-white mb-1">{currentDayWorkout.workoutName}</Text>
                <Text className="text-xs text-zinc-400">{currentDayWorkout.focus} targeting</Text>
              </View>
              <View className="p-3 bg-zinc-900 rounded-xl border border-zinc-800">
                <FontAwesome5 name="dumbbell" size={24} color={PRIMARY} />
              </View>
            </View>

            {/* Exercises Title */}
            <Text className="text-white text-md font-bold mb-3">Exercises ({currentDayWorkout.exercises.length})</Text>

            {currentDayWorkout.exercises.map((exercise) => {
              const exerciseProgress = dayTracking[exercise.name] ?? {};
              const completedSetsCount = Object.keys(exerciseProgress).filter((k) => exerciseProgress[parseInt(k)]).length;
              const progressPct = (completedSetsCount / exercise.sets) * 100;

              return (
                <View
                  key={exercise.name}
                  className="mb-4 p-4 rounded-2xl border"
                  style={{ backgroundColor: COMP_BACKGROUND_COLOR, borderColor: COMP_BORDER_COLOR }}
                >
                  {/* Exercise Title Area */}
                  <View className="flex-row justify-between items-start mb-2">
                    <View className="flex-1">
                      <Text className="text-white font-extrabold text-sm">{exercise.name}</Text>
                      <Text className="text-zinc-400 text-xs mt-0.5">{exercise.equipment} • {exercise.reps} reps • Rest: {exercise.rest}</Text>
                    </View>
                    <View className="bg-zinc-900/60 border border-zinc-800 px-2 py-1 rounded-md">
                      <Text className="text-[10px] text-zinc-400 font-bold">{completedSetsCount}/{exercise.sets} sets</Text>
                    </View>
                  </View>

                  {/* Set Progress Bar */}
                  <View className="w-full bg-zinc-900 h-1.5 rounded-full overflow-hidden mb-4 border border-zinc-850">
                    <View
                      className="h-full rounded-full transition-all duration-300"
                      style={{ width: `${progressPct}%`, backgroundColor: PRIMARY }}
                    />
                  </View>

                  {/* Horizontal set tracking checkboxes */}
                  <View className="flex-row justify-between items-center gap-2">
                    {Array.from({ length: exercise.sets }).map((_, index) => {
                      const isSetCompleted = exerciseProgress[index + 1] ?? false;
                      const isUpcoming = upcomingSetFound && upcomingExerciseName === exercise.name && upcomingSetIndex === index + 1;

                      return (
                        <TouchableOpacity
                          key={index}
                          onPress={() => handleToggleSet(exercise.name, index + 1, exercise.sets)}
                          className="flex-1 py-2 rounded-lg border items-center justify-center relative transition-all duration-300"
                          style={{
                            backgroundColor: isSetCompleted ? PRIMARY : (isUpcoming ? 'rgba(159, 209, 1, 0.1)' : 'rgba(255,255,255,0.02)'),
                            borderColor: isSetCompleted ? PRIMARY : (isUpcoming ? PRIMARY : COMP_BORDER_COLOR),
                            borderWidth: isUpcoming ? 1.5 : 1
                          }}
                        >
                          {isUpcoming && (
                            <View
                              className="absolute -top-1.5 px-1 rounded-full bg-primary flex-row items-center border border-black"
                              style={{ transform: [{ scale: 0.85 }] }}
                            >
                              <Text className="text-[7px] font-black text-black uppercase tracking-wider">NEXT</Text>
                            </View>
                          )}
                          <Text
                            className="text-[10px] font-extrabold"
                            style={{ color: isSetCompleted ? 'black' : (isUpcoming ? PRIMARY : 'white') }}
                          >
                            Set {index + 1}
                          </Text>
                          <View className="mt-1">
                            {isSetCompleted ? (
                              <Ionicons name="checkmark-circle" size={12} color="black" />
                            ) : (
                              <Ionicons name="ellipse-outline" size={12} color={isUpcoming ? PRIMARY : 'rgba(255,255,255,0.3)'} />
                            )}
                          </View>
                        </TouchableOpacity>
                      );
                    })}
                  </View>
                </View>
              );
            })}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

export default Workouts;
