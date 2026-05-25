import { View, TouchableOpacity, Text } from 'react-native'
import React from 'react'
import { 
  COMP_BACKGROUND_COLOR, 
  COMP_BACKGROUND_COLOR_SELECTED, 
  COMP_BORDER_COLOR, 
  COMP_BORDER_COLOR_SELECTED, 
  ICON_COLOR 
} from '@/constants/colors'
import { FontAwesome5, FontAwesome6, MaterialCommunityIcons } from '@expo/vector-icons'
import * as Haptics from 'expo-haptics'

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

interface GoalSelectionProps {
  selectedGoal: string
  setSelectedGoal: (val: string) => void
}

const GoalSelection: React.FC<GoalSelectionProps> = ({
  selectedGoal,
  setSelectedGoal,
}) => {
  return (
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
  )
}

export default GoalSelection
