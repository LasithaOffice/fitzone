import { View } from 'react-native'
import React from 'react'
import { Image } from 'expo-image';
import { PRIMARY } from '@/constants/colors';
import { useAppSelector } from '@/store';

type Props = {
  width: number,
  height: number,
  url?: string
}

const ProfileImage = ({
  height,
  width,
  url
}: Props) => {
  const auth = useAppSelector(state => state.auth);
  
  const blurhash =
    '|rF?hV%2WCj[ayj[a|j[az_NaeWBj@ayfRayfQfQM{M|azj[azf6fQfQfQIpWXofj[ayj[j[fQayWCoeoeaya}j[ayfQa{oLj?j[WVj[ayayj[fQoff7azayj[ayj[j[ayofayayayj[fQj[ayayj[ayfjj[j[ayjuayj[';

  const imageSrc = url || auth.logoUrl || "https://img.magnific.com/free-photo/portrait-white-man-isolated_53876-40306.jpg?semt=ais_hybrid&w=740&q=80";

  return (
    <View style={{
      borderRadius: 1000,
      borderWidth: 4,
      width: width + 4, height: height + 4,
      borderColor: PRIMARY,
      justifyContent: 'center',
      alignItems: 'center'
    }}>
      <Image
        style={{ width, height, borderRadius: 1000 }}
        source={imageSrc}
        contentFit={'cover'}
        placeholder={{ blurhash }}
      />
    </View>
  )
}

export default ProfileImage