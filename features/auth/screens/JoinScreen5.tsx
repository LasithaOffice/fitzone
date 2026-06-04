import { View, TouchableOpacity, ScrollView } from 'react-native'
import React, { useState, useEffect } from 'react'
import RegistrationWrapper from '../components/RegistrationWrapper'
import { Text } from '@/components/ui/text'
import * as Haptics from 'expo-haptics'
import { router } from 'expo-router'
import { useAppDispatch, useAppSelector } from '@/store'
import { registerUser, setLifestyleInfo, resetRegistration } from '@/store/authSlice'
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
  const { loading, error, registrationSuccess } = useAppSelector((state) => state.auth);

  const [selectedFreq, setSelectedFreq] = useState<string>('');
  const [selectedDur, setSelectedDur] = useState<string>('');
  const [selectedSleep, setSelectedSleep] = useState<string>('');
  const [selectedOcc, setSelectedOcc] = useState<string>('');

  const [validationErrors, setValidationErrors] = useState<{
    freq?: string;
    dur?: string;
    sleep?: string;
    occ?: string;
  }>({});

  useEffect(() => {
    if (registrationSuccess) {
      dispatch(resetRegistration());
      router.replace('/(tabs)');
    }
  }, [registrationSuccess, dispatch]);

  const continueProcess = () => {
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

    // Dispatch details to store
    dispatch(
      setLifestyleInfo({
        workoutFrequency: selectedFreq,
        workoutDuration: selectedDur,
        sleepDuration: selectedSleep.split(' ')[0], // Extract number, e.g. "7" from "7-8 hours"
        occupationType: selectedOcc,
      })
    );

    // Trigger final backend submit
    dispatch(registerUser());
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
          
          {error && (
            <View className='bg-red-500/10 border border-red-500/30 p-3 rounded-lg mb-4 w-full'>
              <Text className='text-red-500 text-sm text-center'>{error}</Text>
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
    </RegistrationWrapper>
  )
}

export default JoinScreen5
