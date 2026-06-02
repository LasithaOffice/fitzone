import { View } from 'react-native'
import React, { useState } from 'react'
import RegistrationWrapper from '../components/RegistrationWrapper'
import { Text } from '@/components/ui/text'
import * as Haptics from 'expo-haptics';
import { router } from 'expo-router'
import useFormInputWithDropdown, { SelectItem } from '@/components/ui/custom/FormInputWithDropdown'
import { useAppDispatch } from '@/store';
import { setPhysicalInfo } from '@/store/authSlice';

const weightUnits: SelectItem[] = [
  { label: 'Kg', value: 'kg' },
  { label: 'Lb', value: 'lb' },
];

const heightUnits: SelectItem[] = [
  { label: 'cm', value: 'cm' },
  { label: 'm', value: 'm' },
  { label: 'inch', value: 'inch' },
  { label: 'feet', value: 'feet' },
];

const JoinScreen2 = () => {
  const dispatch = useAppDispatch();

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

  const [errors, setErrors] = useState<{ weight?: string; height?: string }>({});

  const continueProcess = () => {
    const newErrors: typeof errors = {};
    const weightNum = parseFloat(weight.value || '');
    const heightNum = parseFloat(height.value || '');

    if (!weight.value || isNaN(weightNum) || weightNum <= 0) {
      newErrors.weight = "Please enter a valid weight (greater than 0).";
    }

    if (!height.value || isNaN(heightNum) || heightNum <= 0) {
      newErrors.height = "Please enter a valid height (greater than 0).";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      return;
    }

    // Dispatch physical metrics to Redux store
    dispatch(
      setPhysicalInfo({
        weightValue: weight.value || '',
        weightUnit: weight.selected,
        heightValue: height.value || '',
        heightUnit: height.selected,
      })
    );

    router.push('/(auth)/join3');
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
          {weight.element}
          {errors.weight && (
            <Text className='text-red-500 text-xs mt-1'>{errors.weight}</Text>
          )}

          {height.element}
          {errors.height && (
            <Text className='text-red-500 text-xs mt-1'>{errors.height}</Text>
          )}
        </View>
      </View>
    </RegistrationWrapper>
  )
}

export default JoinScreen2