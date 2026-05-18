import { TouchableOpacity, View } from 'react-native'
import React from 'react'
import { Text } from '@/components/ui/text'
import { COMP_BACKGROUND_COLOR, COMP_BACKGROUND_COLOR_SELECTED, COMP_BORDER_COLOR, COMP_BORDER_COLOR_SELECTED, ICON_COLOR } from '@/constants/colors'
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import { Levels } from '../screens/JoinScreen3';

type Props = { data: Levels, current: Levels, setSelectedFitnessLevel: (s: Levels) => void }

const ItemBox = ({ data, current, setSelectedFitnessLevel }: Props) => {
  return (
    <TouchableOpacity onPress={(() => {
      setSelectedFitnessLevel(data);
    })} style={
      {
        backgroundColor: (current.title == data.title) ? COMP_BACKGROUND_COLOR_SELECTED : COMP_BACKGROUND_COLOR,
        borderColor: (current.title == data.title) ? COMP_BORDER_COLOR_SELECTED : COMP_BORDER_COLOR
      }
    } className='flex-1 border-2
     py-5 px-2 items-center
      justify-between rounded-xl bg-gray-900 gap-2 h-full'>
      {
        (current.title == data.title) ? data.iconSelected : data.icon
      }
      <Text className='text-[11px] text-center'>{data.title}</Text>
      <Text className='text-[#77787a] text-center text-[10px]'>{data.description}</Text>
    </TouchableOpacity>
  )
}

export default ItemBox