import { View } from 'react-native'
import React, { useState, useEffect } from 'react'
import RegistrationWrapper from '../components/RegistrationWrapper'
import { Text } from '@/components/ui/text'
import { FontAwesome6, FontAwesome5, MaterialCommunityIcons } from '@expo/vector-icons';
import { COMP_BORDER_COLOR_SELECTED, ICON_COLOR } from '@/constants/colors'
import { router } from 'expo-router'
import ItemBox from '../components/ItemBox'
import { useAppDispatch, useAppSelector } from '@/store'
import { registerUser, resetRegistration } from '@/store/authSlice'

export type Levels = {
  icon: any,
  iconSelected: any,
  title: string,
  description: string
}

const fitnessLevels: Levels[] = [
  {
    icon: <FontAwesome6 name="chart-simple" size={24} color={ICON_COLOR} />,
    iconSelected: <FontAwesome6 name="chart-simple" size={24} color={COMP_BORDER_COLOR_SELECTED} />,
    title: 'Beginner',
    description: 'New to\nworking out'
  },
  {
    icon: <FontAwesome6 name="person-running" size={24} color={ICON_COLOR} />,
    iconSelected: <FontAwesome6 name="person-running" size={24} color={COMP_BORDER_COLOR_SELECTED} />,
    title: 'Intermediate',
    description: 'Work out\nregularly'
  },
  {
    icon: <FontAwesome6 name="dumbbell" size={24} color={ICON_COLOR} />,
    iconSelected: <FontAwesome6 name="dumbbell" size={24} color={COMP_BORDER_COLOR_SELECTED} />,
    title: 'Advanced',
    description: 'Train hard\n3-5 times a\nweek'
  },
  {
    icon: <FontAwesome6 name="trophy" size={24} color={ICON_COLOR} />,
    iconSelected: <FontAwesome6 name="trophy" size={24} color={COMP_BORDER_COLOR_SELECTED} />,
    title: 'Athlete',
    description: 'Train\nintensely'
  }
];

const goals: Levels[] = [
  {
    icon: <FontAwesome5 name="fire" size={24} color={ICON_COLOR} />,
    iconSelected: <FontAwesome5 name="fire" size={24} color={COMP_BORDER_COLOR_SELECTED} />,
    title: 'Lose\nWeight',
    description: ""
  },
  {
    icon: <MaterialCommunityIcons name="arm-flex" size={24} color={ICON_COLOR} />,
    iconSelected: <MaterialCommunityIcons name="arm-flex" size={24} color={COMP_BORDER_COLOR_SELECTED} />,
    title: 'Build\nMuscle',
    description: ''
  },
  {
    icon: <FontAwesome6 name="heart-pulse" size={24} color={ICON_COLOR} />,
    iconSelected: <FontAwesome6 name="heart-pulse" size={24} color={COMP_BORDER_COLOR_SELECTED} />,
    title: 'Improve\nFitness',
    description: ''
  },
  {
    icon: <MaterialCommunityIcons name="gymnastics" size={24} color={ICON_COLOR} />,
    iconSelected: <MaterialCommunityIcons name="gymnastics" size={24} color={COMP_BORDER_COLOR_SELECTED} />,
    title: 'Tone\nBody',
    description: ''
  },
];

const JoinScreen3 = () => {
  const dispatch = useAppDispatch();
  const { loading, error, registrationSuccess } = useAppSelector((state) => state.auth);

  const [selectedFitnessLevel, setSelectedFitnessLevel] = useState<Levels>(fitnessLevels[0]);
  const [selectedGoal, setSelectedGoal] = useState<Levels>(goals[0]);

  useEffect(() => {
    if (registrationSuccess) {
      // Clear redux flow state after completion, and redirect
      dispatch(resetRegistration());
      router.replace("/(tabs)");
    }
  }, [registrationSuccess, dispatch]);

  const continueProcess = () => {
    dispatch(
      registerUser({
        fitnessLevel: selectedFitnessLevel.title.replace(/\n/g, ' '),
        goal: selectedGoal.title.replace(/\n/g, ' '),
      })
    );
  }

  return (
    <RegistrationWrapper
      mainTitle={"Last step!"}
      onPress={continueProcess}
      onBack={() => {
        router.back();
      }}
      subTitle={"Help us personalize your fitness journey."}
      step={2}
      loading={loading}
    >
      <View className='mt-5'>
        {error && (
          <View className='bg-red-500/10 border border-red-500/30 p-3 rounded-lg mb-4'>
            <Text className='text-red-500 text-sm text-center'>{error}</Text>
          </View>
        )}

        <Text className='mt-10'>Fitness Level</Text>
        <View className='w-full items-start flex-row gap-2 mt-4 h-32'>
          {
            fitnessLevels.map(s =>
              <ItemBox data={s} current={selectedFitnessLevel} setSelectedFitnessLevel={setSelectedFitnessLevel} key={s.title} />
            )
          }
        </View>
        <Text className='mt-10'>Goal</Text>
        <View className='w-full items-start flex-row gap-2 mt-4 h-28'>
          {
            goals.map(s =>
              <ItemBox data={s} current={selectedGoal} setSelectedFitnessLevel={setSelectedGoal} key={s.title} />
            )
          }
        </View>
      </View>
    </RegistrationWrapper>
  )
}

export default JoinScreen3