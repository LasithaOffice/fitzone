import { View } from 'react-native'
import React from 'react'
import RegistrationWrapper from '../components/RegistrationWrapper'
import ProfileImage from '@/components/features/ProfileImage'
import { Text } from '@/components/ui/text'
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group'
import { Ionicons, } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { PRIMARY } from '@/constants/colors'
import { router } from 'expo-router'
import useFormInputWithDropdown, { SelectItem } from '@/components/ui/custom/FormInputWithDropdown'
import useFormSelector from '@/components/ui/custom/FormDropdown'

const weightUnits: SelectItem[] = [
  { label: 'Kg', value: 'kg' },
  { label: 'Lb', value: 'lb' },
];

const heightUnits: SelectItem[] = [
  { label: 'cm', value: 'cm' },
  { label: 'm', value: 'lb' },
  { label: 'inch', value: 'inch' },
  { label: 'feet', value: 'feet' },
];

const fitnessLevels: SelectItem[] = [
  { label: 'Sedentary', value: 'Sedentary' },
  { label: 'Beginner', value: 'Beginner' },
  { label: 'Intermediate', value: 'Intermediate' },
  { label: 'Active', value: 'Active' },
  { label: 'Advanced', value: 'Advanced' },
  { label: 'Athlete', value: 'Athlete' },
];

const JoinScreen2 = () => {

  const weight = useFormInputWithDropdown({
    items: weightUnits,
    listTitle: "Unit",
    placeHolder: "Enter your weight",
    title: "Weight"
  })

  const height = useFormInputWithDropdown({
    items: heightUnits,
    listTitle: "Unit",
    placeHolder: "Enter your height",
    title: "Height",
    topGap: 20
  })

  const fitnessLevel = useFormSelector({
    items: fitnessLevels,
    placeHolder: "Select your fitness level",
    title: "Fitness Level",
    topGap: 20
  })

  const continueProcess = () => {
    router.push('/(auth)/join3')
  }

  return (
    <RegistrationWrapper
      mainTitle={"Tell us a bit more"}
      onPress={continueProcess}
      onBack={() => {
        router.back();
      }}
      subTitle={"This helps us personalize your fitness journey"}
      step={1}
    >
      <View className='items-center mt-5'>
        <View className='w-full items-start mt-10'>
          <weight.Component />
          <height.Component />
        </View>
      </View>
    </RegistrationWrapper>
  )
}

export default JoinScreen2