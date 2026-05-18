import { View, Text, ActivityIndicator } from 'react-native'
import React from 'react'
import { Button } from '../button'
import { FontAwesome } from '@expo/vector-icons'
import { TEXT_PRIMARY } from '@/constants/colors'

type Props = {
  variant?: "outline" | "link" | "default" | "destructive" | "secondary" | "ghost" | null | undefined,
  disabled?: boolean
}

const CButton = ({
  variant,
  disabled
}: Props) => {
  return (
    <Button variant={variant}>
      {
        (disabled) && <ActivityIndicator size="small" color="black" />
      }
      <FontAwesome name="apple" size={20} color="black" />
      <Text>Continue with Apple</Text>
    </Button>
  )
}

export default CButton