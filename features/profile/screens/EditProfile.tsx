import { View, ScrollView, TouchableOpacity, Platform } from 'react-native'
import React, { useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { router } from 'expo-router'
import ProfileImage from '@/components/features/ProfileImage'
import { Text } from '@/components/ui/text'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from '@/components/ui/select'
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group'
import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker'
import { 
  BACKGROUND_COLOR, 
  COMP_BACKGROUND_COLOR, 
  COMP_BACKGROUND_COLOR_SELECTED, 
  COMP_BORDER_COLOR, 
  COMP_BORDER_COLOR_SELECTED, 
  GRAY, 
  PRIMARY, 
  ICON_COLOR 
} from '@/constants/colors'
import { 
  Feather, 
  FontAwesome5, 
  FontAwesome6, 
  MaterialCommunityIcons, 
  Ionicons 
} from '@expo/vector-icons'
import * as Haptics from 'expo-haptics'

type SelectOption = {
  value: string
  label: string
}

const weightUnits: SelectOption[] = [
  { label: 'Kg', value: 'kg' },
  { label: 'Lb', value: 'lb' },
]

const heightUnits: SelectOption[] = [
  { label: 'cm', value: 'cm' },
  { label: 'm', value: 'm' },
  { label: 'in', value: 'in' },
  { label: 'ft', value: 'ft' },
]

const fitnessLevels: SelectOption[] = [
  { label: 'Sedentary', value: 'Sedentary' },
  { label: 'Beginner', value: 'Beginner' },
  { label: 'Intermediate', value: 'Intermediate' },
  { label: 'Active', value: 'Active' },
  { label: 'Advanced', value: 'Advanced' },
  { label: 'Athlete', value: 'Athlete' },
]

type GoalOption = {
  icon: any
  iconSelected: any
  title: string
  value: string
}

const goalOptions: GoalOption[] = [
  {
    icon: <FontAwesome5 name="fire" size={20} color={ICON_COLOR} />,
    iconSelected: <FontAwesome5 name="fire" size={20} color={COMP_BORDER_COLOR_SELECTED} />,
    title: 'Lose Weight',
    value: 'Lose Weight'
  },
  {
    icon: <MaterialCommunityIcons name="arm-flex" size={20} color={ICON_COLOR} />,
    iconSelected: <MaterialCommunityIcons name="arm-flex" size={20} color={COMP_BORDER_COLOR_SELECTED} />,
    title: 'Build Muscle',
    value: 'Build Muscle'
  },
  {
    icon: <FontAwesome6 name="heart-pulse" size={20} color={ICON_COLOR} />,
    iconSelected: <FontAwesome6 name="heart-pulse" size={20} color={COMP_BORDER_COLOR_SELECTED} />,
    title: 'Improve Fitness',
    value: 'Improve Fitness'
  },
  {
    icon: <MaterialCommunityIcons name="gymnastics" size={20} color={ICON_COLOR} />,
    iconSelected: <MaterialCommunityIcons name="gymnastics" size={20} color={COMP_BORDER_COLOR_SELECTED} />,
    title: 'Tone Body',
    value: 'Tone Body'
  },
]

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

  const handleDateChange = (event: DateTimePickerEvent, selectedDate?: Date) => {
    setShowDatePicker(Platform.OS === 'ios')
    if (selectedDate) {
      setBirthday(selectedDate)
      setBirthdayOpened(true)
    }
  }

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
      {/* Header */}
      <View className="flex-row items-center justify-between px-4 py-3 border-b" style={{ borderColor: COMP_BORDER_COLOR }}>
        <TouchableOpacity 
          onPress={() => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)
            router.back()
          }}
          className="p-1 rounded-full"
          style={{ backgroundColor: COMP_BACKGROUND_COLOR, borderWidth: 1, borderColor: COMP_BORDER_COLOR }}
        >
          <Feather name="x" size={24} color="white" />
        </TouchableOpacity>
        
        <Text className="text-lg font-bold text-white">Edit Profile</Text>
        
        <TouchableOpacity 
          onPress={handleSave}
          className="px-3 py-1.5 rounded-full"
          style={{ backgroundColor: PRIMARY }}
        >
          <Text className="text-xs font-bold text-black">Save</Text>
        </TouchableOpacity>
      </View>

      <ScrollView 
        className="flex-1 px-4"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 40 }}
      >
        {/* Profile Image Section */}
        <View className="items-center mt-6">
          <View className="relative">
            <ProfileImage width={96} height={96} />
            <TouchableOpacity 
              className="absolute bottom-1 right-1 p-2 rounded-full items-center justify-center border-2 border-black" 
              style={{ backgroundColor: PRIMARY }}
              onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium)
              }}
            >
              <Feather name="camera" size={14} color="black" />
            </TouchableOpacity>
          </View>
          <TouchableOpacity 
            onPress={() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)}
            className="mt-2"
          >
            <Text className="text-xs text-primary font-semibold" style={{ color: PRIMARY }}>Change Photo</Text>
          </TouchableOpacity>
        </View>

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

        {/* Inputs: Weight & Height */}
        <View className="flex-row gap-4 mt-4">
          {/* Weight */}
          <View className="flex-1">
            <Text className="text-gray-300 text-sm font-medium">Weight</Text>
            <View className="flex-row gap-2 mt-2">
              <Input 
                className="flex-1" 
                placeholder="Weight" 
                inputMode="numeric" 
                value={weight} 
                onChangeText={setWeight} 
              />
              <Select 
                value={weightUnits.find(u => u.value === weightUnit)} 
                onValueChange={(val) => {
                  if (val) setWeightUnit(val.value)
                }}
              >
                <SelectTrigger className="w-20">
                  <SelectValue placeholder="" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Unit</SelectLabel>
                    {weightUnits.map((u) => (
                      <SelectItem key={u.value} label={u.label} value={u.value}>
                        {u.label}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </View>
          </View>

          {/* Height */}
          <View className="flex-1">
            <Text className="text-gray-300 text-sm font-medium">Height</Text>
            <View className="flex-row gap-2 mt-2">
              <Input 
                className="flex-1" 
                placeholder="Height" 
                inputMode="numeric" 
                value={height} 
                onChangeText={setHeight} 
              />
              <Select 
                value={heightUnits.find(u => u.value === heightUnit)} 
                onValueChange={(val) => {
                  if (val) setHeightUnit(val.value)
                }}
              >
                <SelectTrigger className="w-20">
                  <SelectValue placeholder="" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Unit</SelectLabel>
                    {heightUnits.map((u) => (
                      <SelectItem key={u.value} label={u.label} value={u.value}>
                        {u.label}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </View>
          </View>
        </View>

        {/* Input: Fitness Level */}
        <View className="mt-4">
          <Text className="text-gray-300 text-sm font-medium">Fitness Level</Text>
          <Select 
            className="w-full mt-2"
            value={fitnessLevels.find(l => l.value === fitnessLevel)} 
            onValueChange={(val) => {
              if (val) setFitnessLevel(val.value)
            }}
          >
            <SelectTrigger className="w-full mt-2">
              <SelectValue placeholder="Select fitness level" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Level</SelectLabel>
                {fitnessLevels.map((l) => (
                  <SelectItem key={l.value} label={l.label} value={l.value}>
                    {l.label}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </View>

        {/* Input: Goals Selection */}
        <View className="mt-4">
          <Text className="text-gray-300 text-sm font-medium">Goal</Text>
          <View className="flex-row flex-wrap gap-2 mt-2">
            {goalOptions.map((g) => {
              const isSelected = selectedGoal === g.value
              return (
                <TouchableOpacity 
                  key={g.value} 
                  onPress={() => {
                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)
                    setSelectedGoal(g.value)
                  }}
                  style={{
                    backgroundColor: isSelected ? COMP_BACKGROUND_COLOR_SELECTED : COMP_BACKGROUND_COLOR,
                    borderColor: isSelected ? COMP_BORDER_COLOR_SELECTED : COMP_BORDER_COLOR,
                    borderWidth: 2,
                  }}
                  className="flex-1 min-w-[45%] py-4 px-2 items-center justify-center rounded-xl gap-2 h-24"
                >
                  {isSelected ? g.iconSelected : g.icon}
                  <Text className="text-[11px] text-center font-semibold text-white">{g.title}</Text>
                </TouchableOpacity>
              )
            })}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

export default EditProfile
