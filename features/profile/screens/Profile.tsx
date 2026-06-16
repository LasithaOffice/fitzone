import { ScrollView } from 'react-native'
import React, { useEffect } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import ProfileHeader from '../components/ProfileHeader'
import UserInfo from '../components/UserInfo'
import PhysicalStats from '../components/PhysicalStats'
import FitnessFocus from '../components/FitnessFocus'
import AccountSettings from '../components/AccountSettings'
import FitnessPreferences from '../components/FitnessPreferences'
import SupportLegal from '../components/SupportLegal'
import LogOutButton from '../components/LogOutButton'
import { useAppDispatch } from '@/store'
import { fetchUserProfileThunk } from '@/store/authSlice'

const Profile = () => {
  const dispatch = useAppDispatch()

  useEffect(() => {
    dispatch(fetchUserProfileThunk())
  }, [dispatch])
  return (
    <SafeAreaView className="flex-1 bg-black">
      <ProfileHeader />
      <ScrollView 
        className="flex-1"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 40 }}
      >
        <UserInfo />
        <PhysicalStats />
        <FitnessFocus />
        <AccountSettings />
        <FitnessPreferences />
        <SupportLegal />
        <LogOutButton />
      </ScrollView>
    </SafeAreaView>
  )
}

export default Profile
