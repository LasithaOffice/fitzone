import { ScrollView, View, ActivityIndicator } from 'react-native'
import React, { useEffect } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import Header from '../components/Home/Header'
import WeeklyUpdate from '../components/Home/WeeklyUpdate'
import MainMenu from '../components/Home/MainMenu'
import ProgressOverview from '../components/Home/ProgressOverview'
import TodayPlan from '../components/Home/TodayPlan'
import GymNetwork from '../components/Home/GymNetwork'
import { useAppDispatch, useAppSelector } from '@/store'
import { fetchPlan } from '@/store/planSlice'
import { PRIMARY } from '@/constants/colors'

const Home = () => {
  const dispatch = useAppDispatch()
  const auth = useAppSelector((state) => state.auth)
  const { loading, workoutPlan } = useAppSelector((state) => state.plan)


  useEffect(() => {
    // Construct the UserProfile for plan generation
    const profilePayload = {
      fullName: auth.fullName || 'Alex',
      birthday: auth.birthday || '1995-01-01',
      gender: auth.gender || 'male',
      weight: {
        value: parseFloat(auth.weightValue) || 75,
        unit: auth.weightUnit || 'kg',
      },
      height: {
        value: parseFloat(auth.heightValue) || 180,
        unit: auth.heightUnit || 'cm',
      },
      fitnessLevel: auth.fitnessLevel || 'Intermediate',
      goal: auth.goal || 'Build Muscle',
      allergies: auth.allergies || [],
      chronicConditions: auth.chronicConditions || [],
      injuryHistory: auth.injuryHistory || '',
      targetWeight: {
        value: parseFloat(auth.targetWeightValue) || 70,
        unit: auth.targetWeightUnit || 'kg',
      },
      workoutFrequency: auth.workoutFrequency || '3-4 days/week',
      workoutDuration: auth.workoutDuration || '45-60 mins',
      sleepDuration: parseFloat(auth.sleepDuration) || 8,
      occupationType: auth.occupationType || 'Moderately Active (Walking/Standing)',
    };

    dispatch(fetchPlan(profilePayload));
  }, [dispatch, auth]);

  return (
    <SafeAreaView edges={['top']} className="bg-black flex-1">
      <Header />
      {loading && workoutPlan.length === 0 ? (
        <View className="flex-1 justify-center items-center">
          <ActivityIndicator size="large" color={PRIMARY} />
        </View>
      ) : (
        <ScrollView
          className="flex-1"
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 32 }}
        >
          <WeeklyUpdate />
          <MainMenu />
          <ProgressOverview />
          <TodayPlan />
          <GymNetwork />
        </ScrollView>
      )}

    </SafeAreaView>
  )
}

export default Home