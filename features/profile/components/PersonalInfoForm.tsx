import { View, Platform } from 'react-native'
import React from 'react'
import { Text } from '@/components/ui/text'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group'
import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker'
import { GRAY, PRIMARY } from '@/constants/colors'
import { Feather, Ionicons } from '@expo/vector-icons'
import * as Haptics from 'expo-haptics'

interface PersonalInfoFormProps {
  fullName: string
  setFullName: (val: string) => void
  birthday: Date
  setBirthday: (val: Date) => void
  gender: string
  setGender: (val: string) => void
  showDatePicker: boolean
  setShowDatePicker: (val: boolean) => void
  birthdayOpened: boolean
  setBirthdayOpened: (val: boolean) => void
}

const PersonalInfoForm: React.FC<PersonalInfoFormProps> = ({
  fullName,
  setFullName,
  birthday,
  setBirthday,
  gender,
  setGender,
  showDatePicker,
  setShowDatePicker,
  birthdayOpened,
  setBirthdayOpened,
}) => {
  const handleDateChange = (event: DateTimePickerEvent, selectedDate?: Date) => {
    setShowDatePicker(Platform.OS === 'ios')
    if (selectedDate) {
      setBirthday(selectedDate)
      setBirthdayOpened(true)
    }
  }

  return (
    <>
      {/* Input: Full Name */}
      <View className="mt-6">
        <Text className="text-gray-300 text-sm font-medium">Full Name</Text>
        <Input 
          className="mt-2" 
          placeholder="Enter your full name" 
          value={fullName}
          onChangeText={setFullName}
          textContentType="name"
          autoComplete="name"
        />
      </View>

      {/* Input: Birthday */}
      <View className="mt-4">
        <Text className="text-gray-300 text-sm font-medium">Birthday</Text>
        <Button 
          onPress={() => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)
            setShowDatePicker(true)
          }} 
          variant="outline" 
          className="mt-2 w-full items-center justify-start h-12"
        >
          <Feather name="calendar" size={16} color={GRAY} className="mr-2" />
          <Text className="text-white text-sm">
            {birthdayOpened ? birthday.toDateString() : 'Select your birthday'}
          </Text>
        </Button>
        
        {showDatePicker && (
          <DateTimePicker
            testID="editDateTimePicker"
            value={birthday}
            mode="date"
            is24Hour={true}
            onChange={handleDateChange}
          />
        )}
      </View>

      {/* Input: Gender */}
      <View className="mt-4">
        <Text className="text-gray-300 text-sm font-medium">Gender</Text>
        <ToggleGroup 
          className="mt-2" 
          value={gender} 
          onValueChange={(val) => {
            if (val) {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)
              setGender(val)
            }
          }} 
          variant="outline" 
          type="single"
        >
          <ToggleGroupItem isFirst value="male" aria-label="Toggle male" className="flex-1">
            <Ionicons name="male" size={18} color={PRIMARY} />
            <Text className="text-sm">Male</Text>
          </ToggleGroupItem>
          <ToggleGroupItem value="female" aria-label="Toggle female" className="flex-1">
            <Ionicons name="female" size={18} color={PRIMARY} />
            <Text className="text-sm">Female</Text>
          </ToggleGroupItem>
          <ToggleGroupItem isLast value="other" aria-label="Toggle other" className="flex-1">
            <Ionicons name="male-female" size={18} color={PRIMARY} />
            <Text className="text-sm">Other</Text>
          </ToggleGroupItem>
        </ToggleGroup>
      </View>
    </>
  )
}

export default PersonalInfoForm
