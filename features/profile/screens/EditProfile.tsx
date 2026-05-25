import { ScrollView } from 'react-native'
import React, { useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { router } from 'expo-router'
import * as Haptics from 'expo-haptics'

// Components
import EditProfileHeader from '../components/EditProfileHeader'
import ProfileImageSection from '../components/ProfileImageSection'
import PersonalInfoForm from '../components/PersonalInfoForm'
import BodyStatsForm from '../components/BodyStatsForm'
import FitnessLevelSelect from '../components/FitnessLevelSelect'
import GoalSelection from '../components/GoalSelection'

const EditProfile = () => {
  // Form States initialized with existing profile values
  const [fullName, setFullName] = useState('Alex Johnson')
  const [birthday, setBirthday] = useState<Date>(new Date('1997-12-15'))
  const [showDatePicker, setShowDatePicker] = useState(false)
  const [birthdayOpened, setBirthdayOpened] = useState(true)
  const [gender, setGender] = useState('male')
  
  const [weight, setWeight] = useState('78')
  const [weightUnit, setWeightUnit] = useState('kg')
  
  const [height, setHeight] = useState('182')
  const [heightUnit, setHeightUnit] = useState('cm')
  
  const [fitnessLevel, setFitnessLevel] = useState('Intermediate')
  const [selectedGoal, setSelectedGoal] = useState('Build Muscle')

  const handleSave = () => {
    if (!fullName.trim()) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error)
      alert('Please enter your full name')
      return
    }

    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success)
    console.log('Profile Saved:', {
      fullName,
      birthday,
      gender,
      weight: `${weight} ${weightUnit}`,
      height: `${height} ${heightUnit}`,
      fitnessLevel,
      goal: selectedGoal,
    })
    
    // Simulate updating and navigate back
    router.back()
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
