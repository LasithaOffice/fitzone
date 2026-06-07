import { View, TouchableOpacity, ScrollView, Modal, ActivityIndicator } from 'react-native'
import React, { useState, useEffect } from 'react'
import RegistrationWrapper from '../components/RegistrationWrapper'
import { Text } from '@/components/ui/text'
import * as Haptics from 'expo-haptics'
import { router } from 'expo-router'
import { useAppDispatch, useAppSelector } from '@/store'
import { registerUser, setLifestyleInfo, resetRegistration } from '@/store/authSlice'
import { fetchPlan } from '@/store/planSlice'
import { saveOnboardingCompleted, clearLocalOnboardingState } from '@/lib/onboardingStore'
import {
  COMP_BACKGROUND_COLOR,
  COMP_BACKGROUND_COLOR_SELECTED,
  COMP_BORDER_COLOR,
  COMP_BORDER_COLOR_SELECTED,
  GRAY,
  TEXT_PRIMARY
} from '@/constants/colors'

const frequencyOptions = ['Rarely', '1-2 days/week', '3-4 days/week', '5+ days/week'];
const durationOptions = ['15-30 mins', '30-45 mins', '45-60 mins', '60+ mins'];
const sleepOptions = ['4-5 hours', '5-6 hours', '6-7 hours', '7-8 hours', '8+ hours'];
const occupationOptions = ['Sedentary (Desk Job)', 'Moderately Active (Walking/Standing)', 'Highly Active (Heavy Labor)'];

const JoinScreen5 = () => {
  const dispatch = useAppDispatch();
  const { loading, error } = useAppSelector((state) => state.auth);

  const [selectedFreq, setSelectedFreq] = useState<string>('');
  const [selectedDur, setSelectedDur] = useState<string>('');
  const [selectedSleep, setSelectedSleep] = useState<string>('');
  const [selectedOcc, setSelectedOcc] = useState<string>('');

  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [statusText, setStatusText] = useState<string>('');
  const [localError, setLocalError] = useState<string | null>(null);

  const [validationErrors, setValidationErrors] = useState<{
    freq?: string;
    dur?: string;
    sleep?: string;
    occ?: string;
  }>({});

  const continueProcess = async () => {
    const newErrors: typeof validationErrors = {};

    if (!selectedFreq) newErrors.freq = "Please select your workout frequency.";
    if (!selectedDur) newErrors.dur = "Please select your average workout duration.";
    if (!selectedSleep) newErrors.sleep = "Please select your sleep duration.";
    if (!selectedOcc) newErrors.occ = "Please select your occupation activity level.";

    if (Object.keys(newErrors).length > 0) {
      setValidationErrors(newErrors);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      return;
    }

    const lifestyleData = {
      workoutFrequency: selectedFreq,
      workoutDuration: selectedDur,
      sleepDuration: selectedSleep.split(' ')[0], // Extract number, e.g. "7" from "7-8 hours"
      occupationType: selectedOcc,
    };

    // Dispatch details to store
    dispatch(setLifestyleInfo(lifestyleData));

    // Open generating popup
    setIsGenerating(true);
    setStatusText('Creating your user profile...');
    setLocalError(null);

    try {
      // 1. Register User
      const registerResult = await dispatch(registerUser()).unwrap();

      // Update status text with brief artificial delay for visual feedback
      setStatusText('Crafting your personalized workout split...');
      await new Promise(resolve => setTimeout(resolve, 800));

      setStatusText('Optimizing your meal macros...');

      // 2. Prepare profile payload for plan generation
      const profilePayload = {
        fullName: registerResult.user?.fullName || 'Alex',
        birthday: registerResult.user?.birthday || '1995-01-01',
        gender: registerResult.user?.gender || 'male',
        weight: registerResult.user?.weight || { value: 75, unit: 'kg' },
        height: registerResult.user?.height || { value: 180, unit: 'cm' },
        fitnessLevel: registerResult.user?.fitnessLevel || 'Intermediate',
        goal: registerResult.user?.goal || 'Build Muscle',
        allergies: registerResult.user?.allergies || [],
        chronicConditions: registerResult.user?.chronicConditions || [],
        injuryHistory: registerResult.user?.injuryHistory || '',
        targetWeight: registerResult.user?.targetWeight || { value: 70, unit: 'kg' },
        workoutFrequency: lifestyleData.workoutFrequency,
        workoutDuration: lifestyleData.workoutDuration,
        sleepDuration: parseFloat(lifestyleData.sleepDuration) || 8,
        occupationType: lifestyleData.occupationType,
        forceRegenerate: true, // Force new plan generation on onboarding submit
      };

      // 3. Request plans from Express backend
      const planResult = await dispatch(fetchPlan(profilePayload)).unwrap();

      console.log("prrrrrrr ", planResult)

      // Verify we received a valid plan
      if (!planResult || !planResult.workoutPlan || planResult.workoutPlan.length === 0) {
        throw new Error('Plan generation returned an empty workout plan.');
      }

      setStatusText('Plans created successfully! Welcome aboard!');
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      await new Promise(resolve => setTimeout(resolve, 500));

      // Save onboarding completion status & clear temporary state
      await saveOnboardingCompleted(true);
      await clearLocalOnboardingState();

      setIsGenerating(false);
      dispatch(resetRegistration());
      router.replace('/(tabs)');
    } catch (err: any) {
      console.error('Registration/Plan generation flow failed:', err);
      setIsGenerating(false);
      dispatch(resetRegistration());
      const errorMessage = typeof err === 'string'
        ? err
        : (err?.message || 'Failed to create your account and generate fitness plans. Please try again.');
      setLocalError(errorMessage);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
    }
  };

  return (
    <RegistrationWrapper
      mainTitle={"Habits & Lifestyle"}
      onPress={continueProcess}
      onBack={() => {
        router.back();
      }}
      subTitle={"Tell us about your daily patterns to shape your workouts"}
      step={4}
      loading={loading}
    >
      <ScrollView showsVerticalScrollIndicator={false} className="mt-5 mb-5">
        <View className="w-full items-start mt-4 pb-10">

          {(localError || error) && (
            <View className='bg-red-500/10 border border-red-500/30 p-3 rounded-lg mb-4 w-full'>
              <Text className='text-red-500 text-sm text-center'>{localError || error}</Text>
            </View>
          )}

          {/* Workout Frequency */}
          <Text className="text-gray-300 text-sm mb-2">How often do you plan to work out?</Text>
          <View className="flex-row flex-wrap mb-2">
            {frequencyOptions.map(option => {
              const isSelected = selectedFreq === option;
              return (
                <TouchableOpacity
                  key={option}
                  onPress={() => {
                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                    setSelectedFreq(option);
                    setValidationErrors(prev => ({ ...prev, freq: undefined }));
                  }}
                  style={{
                    backgroundColor: isSelected ? COMP_BACKGROUND_COLOR_SELECTED : COMP_BACKGROUND_COLOR,
                    borderColor: isSelected ? COMP_BORDER_COLOR_SELECTED : COMP_BORDER_COLOR,
                    borderWidth: 1,
                    borderRadius: 20,
                    paddingHorizontal: 16,
                    paddingVertical: 8,
                    marginRight: 8,
                    marginBottom: 8,
                  }}
                >
                  <Text style={{ color: isSelected ? TEXT_PRIMARY : GRAY, fontSize: 13, fontWeight: isSelected ? '600' : '400' }}>
                    {option}
                  </Text>
                </TouchableOpacity>
              )
            })}
          </View>
          {validationErrors.freq && (
            <Text className='text-red-500 text-xs mb-4'>{validationErrors.freq}</Text>
          )}

          {/* Workout Duration */}
          <Text className="text-gray-300 text-sm mb-2 mt-2">Average Workout Duration</Text>
          <View className="flex-row flex-wrap mb-2">
            {durationOptions.map(option => {
              const isSelected = selectedDur === option;
              return (
                <TouchableOpacity
                  key={option}
                  onPress={() => {
                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                    setSelectedDur(option);
                    setValidationErrors(prev => ({ ...prev, dur: undefined }));
                  }}
                  style={{
                    backgroundColor: isSelected ? COMP_BACKGROUND_COLOR_SELECTED : COMP_BACKGROUND_COLOR,
                    borderColor: isSelected ? COMP_BORDER_COLOR_SELECTED : COMP_BORDER_COLOR,
                    borderWidth: 1,
                    borderRadius: 20,
                    paddingHorizontal: 16,
                    paddingVertical: 8,
                    marginRight: 8,
                    marginBottom: 8,
                  }}
                >
                  <Text style={{ color: isSelected ? TEXT_PRIMARY : GRAY, fontSize: 13, fontWeight: isSelected ? '600' : '400' }}>
                    {option}
                  </Text>
                </TouchableOpacity>
              )
            })}
          </View>
          {validationErrors.dur && (
            <Text className='text-red-500 text-xs mb-4'>{validationErrors.dur}</Text>
          )}

          {/* Sleep Duration */}
          <Text className="text-gray-300 text-sm mb-2 mt-2">How much do you sleep daily?</Text>
          <View className="flex-row flex-wrap mb-2">
            {sleepOptions.map(option => {
              const isSelected = selectedSleep === option;
              return (
                <TouchableOpacity
                  key={option}
                  onPress={() => {
                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                    setSelectedSleep(option);
                    setValidationErrors(prev => ({ ...prev, sleep: undefined }));
                  }}
                  style={{
                    backgroundColor: isSelected ? COMP_BACKGROUND_COLOR_SELECTED : COMP_BACKGROUND_COLOR,
                    borderColor: isSelected ? COMP_BORDER_COLOR_SELECTED : COMP_BORDER_COLOR,
                    borderWidth: 1,
                    borderRadius: 20,
                    paddingHorizontal: 16,
                    paddingVertical: 8,
                    marginRight: 8,
                    marginBottom: 8,
                  }}
                >
                  <Text style={{ color: isSelected ? TEXT_PRIMARY : GRAY, fontSize: 13, fontWeight: isSelected ? '600' : '400' }}>
                    {option}
                  </Text>
                </TouchableOpacity>
              )
            })}
          </View>
          {validationErrors.sleep && (
            <Text className='text-red-500 text-xs mb-4'>{validationErrors.sleep}</Text>
          )}

          {/* Occupation Type */}
          <Text className="text-gray-300 text-sm mb-2 mt-2">Daily Occupation Activity Level</Text>
          <View className="flex-col w-full mb-2">
            {occupationOptions.map(option => {
              const isSelected = selectedOcc === option;
              return (
                <TouchableOpacity
                  key={option}
                  onPress={() => {
                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                    setSelectedOcc(option);
                    setValidationErrors(prev => ({ ...prev, occ: undefined }));
                  }}
                  style={{
                    backgroundColor: isSelected ? COMP_BACKGROUND_COLOR_SELECTED : COMP_BACKGROUND_COLOR,
                    borderColor: isSelected ? COMP_BORDER_COLOR_SELECTED : COMP_BORDER_COLOR,
                    borderWidth: 1,
                    borderRadius: 12,
                    paddingHorizontal: 16,
                    paddingVertical: 12,
                    marginBottom: 8,
                    width: '100%'
                  }}
                >
                  <Text style={{ color: isSelected ? TEXT_PRIMARY : GRAY, fontSize: 13, fontWeight: isSelected ? '600' : '400' }}>
                    {option}
                  </Text>
                </TouchableOpacity>
              )
            })}
          </View>
          {validationErrors.occ && (
            <Text className='text-red-500 text-xs'>{validationErrors.occ}</Text>
          )}

        </View>
      </ScrollView>

      <Modal
        transparent
        visible={isGenerating}
        animationType="fade"
      >
        <View className="flex-1 bg-black/85 justify-center items-center px-6">
          <View className="bg-zinc-900 border border-zinc-800 rounded-3xl p-8 w-full items-center shadow-2xl">
            <ActivityIndicator size="large" color="#9fd101" className="mb-6" />
            <Text className="text-white text-lg font-bold text-center mb-2">Creating your Fitness Plan</Text>
            <Text className="text-gray-400 text-sm text-center px-4 leading-relaxed">
              {statusText}
            </Text>
          </View>
        </View>
      </Modal>
    </RegistrationWrapper>
  )
}

export default JoinScreen5
