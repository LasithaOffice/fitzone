import { ScrollView, View } from 'react-native'
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import ProfileImage from '@/components/features/ProfileImage'
import { Text } from '@/components/ui/text'
import Header from '../components/Home/Header'
import WeeklyUpdate from '../components/Home/WeeklyUpdate'
import MainMenu from '../components/Home/MainMenu'
import ProgressOverview from '../components/Home/ProgressOverview'
import TodayPlan from '../components/Home/TodayPlan'
import GymNetwork from '../components/Home/GymNetwork'

const Home = () => {
  return (
    <SafeAreaView className='bg-black flex-1'>
      <Header />
      <ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 40 }}
      >
        <WeeklyUpdate />
        <MainMenu />
        <ProgressOverview />
        <TodayPlan />
        <GymNetwork />
      </ScrollView>
    </SafeAreaView>
  )
}

export default Home