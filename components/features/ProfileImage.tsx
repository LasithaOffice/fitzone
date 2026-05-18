import { View } from 'react-native'
import React from 'react'
import { Image } from 'expo-image';
import { PRIMARY } from '@/constants/colors';

const ProfileImage = () => {

  const blurhash =
    '|rF?hV%2WCj[ayj[a|j[az_NaeWBj@ayfRayfQfQM{M|azj[azf6fQfQfQIpWXofj[ayj[j[fQayWCoeoeaya}j[ayfQa{oLj?j[WVj[ayayj[fQoff7azayj[ayj[j[ayofayayayj[fQj[ayayj[ayfjj[j[ayjuayj[';

  return (
    <View style={{
      borderRadius: 1000,
      borderWidth: 4,
      width: 96, height: 96,
      borderColor: PRIMARY,
      justifyContent: 'center',
      alignItems: 'center'
    }}>
      <Image
        style={{ width: 90, height: 90, borderRadius: 1000 }}
        source={"https://img.magnific.com/free-photo/portrait-white-man-isolated_53876-40306.jpg?semt=ais_hybrid&w=740&q=80"}
        contentFit={'cover'}
        placeholder={{ blurhash }}
      />
    </View>
  )
}

export default ProfileImage