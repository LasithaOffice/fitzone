import { View } from 'react-native'
import React from 'react'
import { Text } from '@/components/ui/text'
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from '@/components/ui/select'

type SelectOption = {
  value: string
  label: string
}

const fitnessLevels: SelectOption[] = [
  { label: 'Sedentary', value: 'Sedentary' },
  { label: 'Beginner', value: 'Beginner' },
  { label: 'Intermediate', value: 'Intermediate' },
  { label: 'Active', value: 'Active' },
  { label: 'Advanced', value: 'Advanced' },
  { label: 'Athlete', value: 'Athlete' },
]

interface FitnessLevelSelectProps {
  fitnessLevel: string
  setFitnessLevel: (val: string) => void
}

const FitnessLevelSelect: React.FC<FitnessLevelSelectProps> = ({
  fitnessLevel,
  setFitnessLevel,
}) => {
  return (
    <View className="mt-4">
      <Text className="text-gray-300 text-sm font-medium">Fitness Level</Text>
      <Select 
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
  )
}

export default FitnessLevelSelect
