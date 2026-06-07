import { Platform, ScrollView, View } from 'react-native'
import React, { useState } from 'react'
import RegistrationWrapper from '../components/RegistrationWrapper'
import ProfileImage from '@/components/features/ProfileImage'
import { Text } from '@/components/ui/text'
import { Input } from "@/components/ui/input"
import { Button } from '@/components/ui/button'
import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';
import { ToggleGroup, ToggleGroupIcon, ToggleGroupItem } from '@/components/ui/toggle-group'
import { Ionicons, } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { Bold, Italic, Underline } from 'lucide-react-native'
import { PRIMARY } from '@/constants/colors'
import { KeyboardAwareScrollView, KeyboardToolbar } from 'react-native-keyboard-controller';
import { router } from 'expo-router'
import { useAppDispatch } from '@/store';
import { setProfileInfo } from '@/store/authSlice';
import { saveLocalOnboardingState } from '@/lib/onboardingStore';


const JoinScreen1 = () => {
  const dispatch = useAppDispatch();

  const [fullName, setFullName] = useState<string>('');
  const [date, setDate] = useState<Date>(new Date());
  const [show, setShow] = useState<boolean>(false);
  const [opened, setOpened] = useState<boolean>(false);
  const [value, setValue] = React.useState<string>("male");

  const [errors, setErrors] = useState<{ fullName?: string; birthday?: string }>({});

  const onChange = (event: DateTimePickerEvent, selectedDate?: Date) => {
    // Android requires manual closing after selection
    setShow(Platform.OS === 'ios');

    if (selectedDate) {
      setDate(selectedDate);
      setOpened(true);
      setErrors(prev => ({ ...prev, birthday: undefined }));
      console.log('Selected Date:', selectedDate);
    }
  };

  function onValueChange(value: string | undefined) {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    if (value) {
      console.log("vvv ", value)
      setValue(value);
    }
  }

  const continueProcess = () => {
    const newErrors: typeof errors = {};

    if (!fullName || fullName.trim().length < 2) {
      newErrors.fullName = "Full name must be at least 2 characters.";
    }

    if (!opened) {
      newErrors.birthday = "Please select your birthday.";
    } else {
      const today = new Date();
      let age = today.getFullYear() - date.getFullYear();
      const m = today.getMonth() - date.getMonth();
      if (m < 0 || (m === 0 && today.getDate() < date.getDate())) {
        age--;
      }
      if (age < 13) {
        newErrors.birthday = "You must be at least 13 years old to join.";
      }
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      return;
    }

    const profileData = {
      fullName: fullName.trim(),
      birthday: date.toISOString().split('T')[0],
      gender: value,
    };

    // Dispatch profile information to global store
    dispatch(setProfileInfo(profileData));
    saveLocalOnboardingState(profileData);

    router.push('/(auth)/join2');
  };

  return (
    <RegistrationWrapper
      mainTitle={"Let's get to know you"}
      onPress={continueProcess}
      subTitle={"Complete your profile to personalize your fitness experience"}
      step={0}
    >
      <View className='items-center mt-5'>
        <ProfileImage width={96} height={96} />
        <Text className='mt-3'>{"Welcome!"} </Text>
        <Text variant={'small'} className='text-center text-gray-300 px-10'>{"You're in. Let's set up your profile."}</Text>
        <View className='w-full items-start mt-6'>
          <Text className='text-center text-gray-300 text-sm'>{"Full name"}</Text>
          <Input
            className='mt-2 w-full'
            textContentType="name"
            autoComplete="name"
            placeholder="Enter your full name"
            value={fullName}
            onChangeText={(text) => {
              setFullName(text);
              if (errors.fullName) {
                setErrors(prev => ({ ...prev, fullName: undefined }));
              }
            }}
          />
          {errors.fullName && (
            <Text className='text-red-500 text-xs mt-1'>{errors.fullName}</Text>
          )}

          <Text className='text-center text-gray-300 mt-4 text-sm'>{"Birthday"}</Text>
          <Button onPress={() => {
            setShow(true)
          }} variant={'outline'} className='mt-2 w-full items-center justify-start'>
            <Text className='text-gray-500'>{(opened) ? date.toDateString() : "Select your birthday"}</Text>
          </Button>
          {errors.birthday && (
            <Text className='text-red-500 text-xs mt-1'>{errors.birthday}</Text>
          )}
          {show && (
            <DateTimePicker
              testID="dateTimePicker"
              value={date}
              mode="date"
              is24Hour={true}
              onChange={onChange}
            />
          )}

          <Text className='text-center text-gray-300 mt-4 text-sm'>{"Gender"}</Text>
          <ToggleGroup className='mt-2' value={value} onValueChange={onValueChange} variant="outline" type="single">
            <ToggleGroupItem isFirst value="male" aria-label="Toggle bold" className='flex-1'>
              <Ionicons name="male" size={20} color={PRIMARY} />
              <Text>Male</Text>
            </ToggleGroupItem>
            <ToggleGroupItem value="female" aria-label="Toggle italic" className='flex-1'>
              <Ionicons name="female" size={20} color={PRIMARY} />
              <Text>Female</Text>
            </ToggleGroupItem>
            <ToggleGroupItem isLast value="other" aria-label="Toggle strikethrough" className='flex-1'>
              <Ionicons name="male-female" size={20} color={PRIMARY} />
              <Text>Other</Text>
            </ToggleGroupItem>
          </ToggleGroup>
        </View>
      </View>
    </RegistrationWrapper>
  )
}

export default JoinScreen1