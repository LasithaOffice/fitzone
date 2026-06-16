import { ScrollView, ActivityIndicator } from 'react-native'
import React, { useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { router } from 'expo-router'
import * as Haptics from 'expo-haptics'
import { useAppDispatch, useAppSelector } from '@/store'
import { updateUserProfileThunk } from '@/store/authSlice'

// Components
import EditProfileHeader from '../components/EditProfileHeader'
import ProfileImageSection from '../components/ProfileImageSection'
import PersonalInfoForm from '../components/PersonalInfoForm'
import BodyStatsForm from '../components/BodyStatsForm'
import FitnessLevelSelect from '../components/FitnessLevelSelect'
import GoalSelection from '../components/GoalSelection'

const EditProfile = () => {
  const auth = useAppSelector(state => state.auth)
  const dispatch = useAppDispatch()

  // Form States initialized with existing profile values
  const [fullName, setFullName] = useState(auth.fullName || '')
  const [birthday, setBirthday] = useState<Date>(auth.birthday ? new Date(auth.birthday) : new Date('1997-12-15'))
  const [showDatePicker, setShowDatePicker] = useState(false)
  const [birthdayOpened, setBirthdayOpened] = useState(true)
  const [gender, setGender] = useState(auth.gender || 'male')
  
  const [weight, setWeight] = useState(auth.weightValue || '')
  const [weightUnit, setWeightUnit] = useState(auth.weightUnit || 'kg')
  
  const [height, setHeight] = useState(auth.heightValue || '')
  const [heightUnit, setHeightUnit] = useState(auth.heightUnit || 'cm')
  
  const [fitnessLevel, setFitnessLevel] = useState(auth.fitnessLevel || 'Beginner')
  const [selectedGoal, setSelectedGoal] = useState(auth.goal || 'Weight Loss')

  const [saving, setSaving] = useState(false)

  const handleSave = async () => {
    if (!fullName.trim()) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error)
      alert('Please enter your full name')
      return
    }

    try {
      setSaving(true)
      const profilePayload = {
        fullName,
        birthday: birthday.toISOString().split('T')[0],
        gender,
        weight: {
          value: parseFloat(weight) || 0,
          unit: weightUnit,
        },
        height: {
          value: parseFloat(height) || 0,
          unit: heightUnit,
        },
        fitnessLevel,
        goal: selectedGoal,
      }
      await dispatch(updateUserProfileThunk(profilePayload)).unwrap()
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success)
      router.back()
    } catch (err: any) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error)
      alert(err || 'Failed to save profile changes.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <SafeAreaView className="flex-1 bg-black">
      <EditProfileHeader onSave={handleSave} />
      <ScrollView 
        className="flex-1 px-4"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 40 }}
      >
        <ProfileImageSection />
        
        <PersonalInfoForm 
          fullName={fullName}
          setFullName={setFullName}
          birthday={birthday}
          setBirthday={setBirthday}
          gender={gender}
          setGender={setGender}
          showDatePicker={showDatePicker}
          setShowDatePicker={setShowDatePicker}
          birthdayOpened={birthdayOpened}
          setBirthdayOpened={setBirthdayOpened}
        />

        <BodyStatsForm 
          weight={weight}
          setWeight={setWeight}
          weightUnit={weightUnit}
          setWeightUnit={setWeightUnit}
          height={height}
          setHeight={setHeight}
          heightUnit={heightUnit}
          setHeightUnit={setHeightUnit}
        />

        <FitnessLevelSelect 
          fitnessLevel={fitnessLevel}
          setFitnessLevel={setFitnessLevel}
        />

        <GoalSelection 
          selectedGoal={selectedGoal}
          setSelectedGoal={setSelectedGoal}
        />
      </ScrollView>
    </SafeAreaView>
  )
}

export default EditProfile
