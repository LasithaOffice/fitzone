import { View } from 'react-native'
import React from 'react'
import ViewBox from '@/components/wrappers/ViewBox'
import Logo from '@/components/features/Logo'
import { Text } from '@/components/ui/text'
import { Button } from '@/components/ui/button'
import { Text as RNText } from 'react-native';
import { FontAwesome6 } from '@expo/vector-icons'
import { KeyboardAwareScrollView } from 'react-native-keyboard-controller'
type Props = {
  mainTitle: string,
  subTitle: string,
  onPress: () => void,
  onBack?: () => void,
  step: number
  children: React.ReactNode
}

const RegistrationWrapper = ({
  mainTitle,
  children,
  onPress,
  onBack,
  step,
  subTitle
}: Props) => {

  return (
    <ViewBox base padding={30}>
      <KeyboardAwareScrollView bottomOffset={62} showsVerticalScrollIndicator={false}>
        <ViewBox center marginTop={20}>
          <Logo />
          <Text className='mt-5 text-2xl font-semibold'>{mainTitle} </Text>
          <Text variant={'small'} className='text-center text-gray-300 px-10 mt-1'>{subTitle}</Text>
        </ViewBox>
        <ViewBox flex1>
          {children}
        </ViewBox>
      </KeyboardAwareScrollView>
      <View className='flex-row gap-2'>
        {
          (onBack) &&
          <Button className='flex-1' variant={'secondary'} onPress={onBack} >
            <Text>{"Back"}</Text>
          </Button>
        }
        <Button className='justify-between flex-1' onPress={onPress} >
          <View></View>
          <Text>{"Continue"}</Text>
          <FontAwesome6 name="arrow-right" size={16} color="black" />
        </Button>
      </View>
      <View className='flex-row p-2 gap-2 mt-5 justify-center mb-5'>
        <View className={`h-1 w-8 ${step == 0 ? 'bg-primary' : 'opacity-15 bg-white'} rounded-lg`}></View>
        <View className={`h-1 w-8 ${step == 1 ? 'bg-primary' : 'opacity-15 bg-white'} rounded-lg`}></View>
        <View className={`h-1 w-8 ${step == 2 ? 'bg-primary' : 'opacity-15 bg-white'} rounded-lg`}></View>
      </View>
    </ViewBox>
  )
}

export default RegistrationWrapper