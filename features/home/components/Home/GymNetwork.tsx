import { View, TouchableOpacity, Image } from 'react-native'
import React from 'react'
import { COMP_BACKGROUND_COLOR, COMP_BORDER_COLOR, GRAY, PRIMARY } from '@/constants/colors'
import { Octicons, Feather, MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons';
import { Button } from '@/components/ui/button';
import { Text } from '@/components/ui/text';

const GymNetwork = () => {
  return (
    <View>
      <View className='flex-row mx-4 items-center'>
        <Text className='flex-1'>Gym Network</Text>
        <TouchableOpacity className='flex-row' onPress={() => {

        }}>
          <Text className='text-primary mr-2'>View all branches</Text>
          <Feather name="chevron-right" size={20} color={GRAY} />
        </TouchableOpacity>
      </View>
      <View className='p-2 m-4 rounded-lg flex-row' style={{ backgroundColor: COMP_BACKGROUND_COLOR, borderColor: COMP_BORDER_COLOR, borderWidth: 1 }}>
        <View className='flex-row gap-3 w-full'>
          <Image source={require('@/assets/images/gym1.jpg')} className='w-[60px] h-[40px]' />
          <View className='flex-1'>
            <Text className='text-[12px]'>Gym Golden</Text>
            <View className='flex-row gap-1'>
              <View className='flex-row items-center gap-1'>
                <Text className='text-gray-400 text-[11px]'>12 km away</Text>
              </View>
              <View className='flex-row items-center'>
                <Octicons name="dot-fill" size={20} color={PRIMARY} />
                <Text className={`text-[11px] text-primary`}>Open now</Text>
              </View>
            </View>
          </View>
          <Button variant={'outline'} className='w-36 h-10 px-5'>
            <Octicons name='location' size={20} color={'white'} />
            <Text className='text-[14px]'>Switch Branch</Text>
          </Button>
        </View>
      </View>
    </View>
  )
}

export default GymNetwork