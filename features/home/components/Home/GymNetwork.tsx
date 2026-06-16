import { View, TouchableOpacity, Image, ActivityIndicator } from 'react-native'
import React, { useEffect, useState } from 'react'
import { COMP_BACKGROUND_COLOR, COMP_BORDER_COLOR, GRAY, PRIMARY } from '@/constants/colors'
import { Octicons, Feather, MaterialCommunityIcons, MaterialIcons, Ionicons } from '@expo/vector-icons';
import { Button } from '@/components/ui/button';
import { Text } from '@/components/ui/text';
import apiClient from '@/lib/apiClient';
import { router } from 'expo-router';

const GymNetwork = () => {

  const [gymEnrollment, setGymEnrollment] = useState<{ enrolled: boolean; gymName?: string; logoUrl?: string; branchName?: string } | null>(null)
  const [gymLoading, setGymLoading] = useState(false)

  useEffect(() => {
    const fetchGymStatus = async () => {
      setGymLoading(true);
      try {
        const response = await apiClient.get('/gym/my-gym');
        setGymEnrollment(response.data);
      } catch (error) {
        console.warn('Failed to fetch gym status:', error);
      } finally {
        setGymLoading(false);
      }
    };
    fetchGymStatus();
  }, []);

  return (
    <View>
      <View className='flex-row mx-4 items-center'>
        <Text className='flex-1'>Gym Network</Text>
        <TouchableOpacity className='flex-row' onPress={() => {
          router.push('/main/gym-map')
        }}>
          <Text className='text-primary mr-2'>View all branches</Text>
          <Feather name="chevron-right" size={20} color={GRAY} />
        </TouchableOpacity>
      </View>
      {
        !gymEnrollment?.enrolled ?
          <View className='p-2 m-2'>
            <TouchableOpacity
              className="flex-row items-center justify-center py-3.5 px-6 rounded-xl"
              style={{
                backgroundColor: gymEnrollment?.enrolled ? '#10B981' : '#A3E635', // Emerald or Lime
                shadowColor: gymEnrollment?.enrolled ? '#10B981' : '#A3E635',
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.3,
                shadowRadius: 10,
                elevation: 5,
              }}
              onPress={() => router.push('/main/gym-details')}
            >
              {gymLoading ? (
                <ActivityIndicator size="small" color="#000" />
              ) : (
                <>
                  <Ionicons
                    name={gymEnrollment?.enrolled ? "business" : "barbell"}
                    size={18}
                    color="#000"
                    style={{ marginRight: 8 }}
                  />
                  <Text className="text-black font-extrabold text-[14px] uppercase tracking-wider">
                    {gymEnrollment?.enrolled ? `My Gym: ${gymEnrollment.gymName}` : "Join a Gym"}
                  </Text>
                </>
              )}
            </TouchableOpacity>
          </View>
          :
          <View className='p-2.5 m-4 rounded-xl flex-row items-center' style={{ backgroundColor: COMP_BACKGROUND_COLOR, borderColor: COMP_BORDER_COLOR, borderWidth: 1 }}>
            <View className='flex-row gap-3 w-full items-center'>
              <Image
                source={gymEnrollment.logoUrl ? { uri: gymEnrollment.logoUrl } : require('@/assets/images/gym1.jpg')}
                className='w-[50px] h-[50px] rounded-lg'
                resizeMode="cover"
              />
              <View className='flex-1'>
                <Text className='text-white font-extrabold text-[14px]'>{gymEnrollment.gymName}</Text>
                <View className='flex-row gap-1 mt-1'>
                  <View className='flex-row items-center gap-1'>
                    <Text className='text-gray-400 text-[11px]'>{gymEnrollment.branchName || 'Main Branch'}</Text>
                  </View>
                  <View className='flex-row items-center'>
                    <Octicons name="dot-fill" size={14} color={PRIMARY} style={{ marginLeft: 6, marginRight: 2 }} />
                    <Text className={`text-[11px] text-primary font-bold`}>Enrolled</Text>
                  </View>
                </View>
              </View>
              <Button
                variant={'outline'}
                className='h-9 px-4 rounded-lg bg-primary border-0'
                onPress={() => router.push('/main/gym-details')}
                style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}
              >
                <Text className='text-[13px] text-white font-black uppercase tracking-wider'>Visit</Text>
              </Button>
            </View>
          </View>
      }

    </View>
  )
}

export default GymNetwork