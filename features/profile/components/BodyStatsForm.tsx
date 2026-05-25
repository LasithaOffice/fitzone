import { View } from 'react-native'
import React from 'react'
import { Text } from '@/components/ui/text'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from '@/components/ui/select'

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

interface BodyStatsFormProps {
  weight: string
  setWeight: (val: string) => void
  weightUnit: string
  setWeightUnit: (val: string) => void
  height: string
  setHeight: (val: string) => void
  heightUnit: string
  setHeightUnit: (val: string) => void
}

const BodyStatsForm: React.FC<BodyStatsFormProps> = ({
  weight,
  setWeight,
  weightUnit,
  setWeightUnit,
  height,
  setHeight,
  heightUnit,
  setHeightUnit,
}) => {
  return (
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
  )
}

export default BodyStatsForm
