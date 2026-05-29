import { View, Text, Image } from 'react-native'
import React from 'react'

const Logo = () => {
  return (
    <Image style={
      {
        width: 250,
        height: 100,
      }
    } resizeMode='contain' source={require('@/assets/images/fitzone_logo_cut.png')} />
  )
}

export default Logo