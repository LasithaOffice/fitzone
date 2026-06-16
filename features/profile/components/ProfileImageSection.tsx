import { View, TouchableOpacity, ActivityIndicator, Alert } from 'react-native'
import React, { useState } from 'react'
import ProfileImage from '@/components/features/ProfileImage'
import { Text } from '@/components/ui/text'
import { PRIMARY } from '@/constants/colors'
import { Feather } from '@expo/vector-icons'
import * as Haptics from 'expo-haptics'
import * as ImagePicker from 'expo-image-picker'
import { useAppDispatch } from '@/store'
import { setLogoUrl } from '@/store/authSlice'
import apiClient from '@/lib/apiClient'

const ProfileImageSection = () => {
  const dispatch = useAppDispatch();
  const [uploading, setUploading] = useState<boolean>(false);

  const handlePickImage = async () => {
    console.log('handlePickImage clicked');
    try {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(e => console.warn('Haptics failed:', e));
      
      console.log('Requesting media library permissions...');
      const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
      console.log('Permission result:', permissionResult);
      
      if (!permissionResult.granted) {
        Alert.alert('Permission Required', 'You need to allow media access to change your profile picture.');
        return;
      }

      console.log('Launching image library...');
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.6,
        base64: true,
      });
      console.log('Image picker result:', result);

      if (result.canceled || !result.assets || result.assets.length === 0) {
        console.log('Image picker canceled or empty assets');
        return;
      }

      const base64Str = `data:image/jpeg;base64,${result.assets[0].base64}`;
      setUploading(true);

      const response = await apiClient.post('/gym/auth/upload', {
        image: base64Str,
        type: 'logo'
      });

      if (response.data?.url) {
        dispatch(setLogoUrl(response.data.url));
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      } else {
        throw new Error('No URL returned from server');
      }
    } catch (err) {
      console.error('Image upload failed:', err);
      Alert.alert('Upload Failed', 'Could not upload your image. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  return (
    <View className="items-center mt-6">
      <View style={{ width: 104, height: 104, position: 'relative' }}>
        <View style={{ position: 'absolute', top: 0, left: 0 }}>
          <ProfileImage width={96} height={96} />
        </View>
        {uploading ? (
          <View 
            className="absolute inset-0 bg-black/60 rounded-full items-center justify-center"
            style={{ width: 100, height: 100, borderRadius: 50 }}
          >
            <ActivityIndicator size="small" color={PRIMARY} />
          </View>
        ) : (
          <TouchableOpacity 
            className="absolute bottom-0 right-0 p-2 rounded-full items-center justify-center border-2 border-black" 
            style={{ 
              backgroundColor: PRIMARY,
              width: 36,
              height: 36,
              borderRadius: 18,
              zIndex: 99,
              elevation: 5,
            }}
            onPress={handlePickImage}
            activeOpacity={0.7}
          >
            <Feather name="camera" size={15} color="black" />
          </TouchableOpacity>
        )}
      </View>
      <TouchableOpacity 
        onPress={handlePickImage}
        className="mt-2"
        disabled={uploading}
      >
        <Text className="text-xs font-semibold" style={{ color: PRIMARY }}>
          {uploading ? 'Uploading...' : 'Change Photo'}
        </Text>
      </TouchableOpacity>
    </View>
  )
}

export default ProfileImageSection
