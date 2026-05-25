import { View, ScrollView, TouchableOpacity, Switch } from 'react-native'
import React, { useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { router } from 'expo-router'
import ProfileImage from '@/components/features/ProfileImage'
import { Text } from '@/components/ui/text'
import { 
  BACKGROUND_COLOR, 
  COMP_BACKGROUND_COLOR, 
  COMP_BORDER_COLOR, 
  GRAY, 
  PRIMARY, 
  ICON_COLOR 
} from '@/constants/colors'
import { 
  Feather, 
  FontAwesome5, 
  FontAwesome6, 
  MaterialCommunityIcons, 
  Ionicons 
} from '@expo/vector-icons'
import * as Haptics from 'expo-haptics'

const Profile = () => {
  const [notificationsEnabled, setNotificationsEnabled] = useState(true)

  const toggleNotifications = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)
    setNotificationsEnabled(previousState => !previousState)
  }

  const handleLogout = () => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success)
    router.replace('/(auth)/login')
  }

  return (
    <SafeAreaView className="flex-1 bg-black">
      {/* Header */}
      <View className="flex-row items-center justify-between px-4 py-3 border-b" style={{ borderColor: COMP_BORDER_COLOR }}>
        <TouchableOpacity 
          onPress={() => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)
            router.back()
          }}
          className="p-1 rounded-full"
          style={{ backgroundColor: COMP_BACKGROUND_COLOR, borderWidth: 1, borderColor: COMP_BORDER_COLOR }}
        >
          <Feather name="chevron-left" size={24} color="white" />
        </TouchableOpacity>
        
        <Text className="text-lg font-bold text-white">Profile</Text>
        
        <TouchableOpacity 
          onPress={() => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)
            router.push('/main/edit-profile')
          }}
          className="p-1 rounded-full"
          style={{ backgroundColor: COMP_BACKGROUND_COLOR, borderWidth: 1, borderColor: COMP_BORDER_COLOR }}
        >
          <Feather name="edit-2" size={18} color="white" />
        </TouchableOpacity>
      </View>

      <ScrollView 
        className="flex-1"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 40 }}
      >
        {/* User Info Block */}
        <View className="items-center mt-6">
          <View className="relative">
            <ProfileImage width={96} height={96} />
            <TouchableOpacity 
              className="absolute bottom-1 right-1 p-2 rounded-full items-center justify-center border-2 border-black" 
              style={{ backgroundColor: PRIMARY }}
              onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium)
              }}
            >
              <Feather name="camera" size={14} color="black" />
            </TouchableOpacity>
          </View>
          
          <Text className="text-xl font-bold mt-4 text-white">Alex Johnson</Text>
          <Text className="text-xs text-gray-400 mt-1">alex.johnson@fitzone.com</Text>
          
          <View className="mt-3 px-3 py-1 rounded-full border" style={{ borderColor: PRIMARY + '44', backgroundColor: PRIMARY + '15' }}>
            <Text className="text-[10px] font-bold tracking-widest uppercase" style={{ color: PRIMARY }}>Gold Member</Text>
          </View>
        </View>

        {/* Physical Stats Grid */}
        <View className="flex-row mx-4 mt-6 p-4 rounded-xl border justify-between" style={{ backgroundColor: COMP_BACKGROUND_COLOR, borderColor: COMP_BORDER_COLOR }}>
          <View className="items-center flex-1">
            <FontAwesome5 name="weight" size={18} color={PRIMARY} />
            <Text className="text-white font-bold mt-2 text-sm">78 kg</Text>
            <Text className="text-[10px] text-gray-500 mt-0.5">Weight</Text>
          </View>
          <View className="w-[1px] h-10 self-center" style={{ backgroundColor: COMP_BORDER_COLOR }} />
          <View className="items-center flex-1">
            <FontAwesome6 name="ruler-vertical" size={18} color={PRIMARY} />
            <Text className="text-white font-bold mt-2 text-sm">182 cm</Text>
            <Text className="text-[10px] text-gray-500 mt-0.5">Height</Text>
          </View>
          <View className="w-[1px] h-10 self-center" style={{ backgroundColor: COMP_BORDER_COLOR }} />
          <View className="items-center flex-1">
            <FontAwesome5 name="birthday-cake" size={17} color={PRIMARY} />
            <Text className="text-white font-bold mt-2 text-sm">28 yrs</Text>
            <Text className="text-[10px] text-gray-500 mt-0.5">Age</Text>
          </View>
        </View>

        {/* Fitness Focus Card */}
        <View className="flex-row mx-4 mt-3 gap-3">
          <View className="flex-1 p-4 rounded-xl border flex-row items-center gap-3" style={{ backgroundColor: COMP_BACKGROUND_COLOR, borderColor: COMP_BORDER_COLOR }}>
            <View className="p-2.5 rounded-lg" style={{ backgroundColor: PRIMARY + '15' }}>
              <MaterialCommunityIcons name="arm-flex" size={20} color={PRIMARY} />
            </View>
            <View className="flex-1">
              <Text className="text-[10px] text-gray-500 uppercase font-semibold">Goal</Text>
              <Text className="text-white font-bold text-sm mt-0.5">Build Muscle</Text>
            </View>
          </View>
          
          <View className="flex-1 p-4 rounded-xl border flex-row items-center gap-3" style={{ backgroundColor: COMP_BACKGROUND_COLOR, borderColor: COMP_BORDER_COLOR }}>
            <View className="p-2.5 rounded-lg" style={{ backgroundColor: PRIMARY + '15' }}>
              <FontAwesome6 name="person-running" size={20} color={PRIMARY} />
            </View>
            <View className="flex-1">
              <Text className="text-[10px] text-gray-500 uppercase font-semibold">Level</Text>
              <Text className="text-white font-bold text-sm mt-0.5">Intermediate</Text>
            </View>
          </View>
        </View>

        {/* Settings Groups */}
        <Text className="mx-4 mt-6 text-xs font-semibold text-gray-500 uppercase tracking-wider">Account Settings</Text>
        <View className="mx-4 mt-2 rounded-xl border overflow-hidden" style={{ backgroundColor: COMP_BACKGROUND_COLOR, borderColor: COMP_BORDER_COLOR }}>
          {/* Personal Information */}
          <TouchableOpacity 
            className="flex-row items-center p-4 border-b" 
            style={{ borderColor: COMP_BORDER_COLOR }}
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)
              router.push('/main/edit-profile')
            }}
          >
            <Feather name="user" size={18} color={GRAY} />
            <Text className="text-white ml-3 flex-1 text-sm font-medium">Personal Information</Text>
            <Feather name="chevron-right" size={16} color={GRAY} />
          </TouchableOpacity>

          {/* Notifications Toggle */}
          <View className="flex-row items-center p-4 border-b justify-between" style={{ borderColor: COMP_BORDER_COLOR }}>
            <View className="flex-row items-center flex-1">
              <Feather name="bell" size={18} color={GRAY} />
              <Text className="text-white ml-3 text-sm font-medium">Notifications</Text>
            </View>
            <Switch 
              value={notificationsEnabled}
              onValueChange={toggleNotifications}
              trackColor={{ false: '#3a3a3c', true: PRIMARY }}
              thumbColor={'#ffffff'}
              ios_backgroundColor="#3a3a3c"
            />
          </View>

          {/* Security */}
          <TouchableOpacity className="flex-row items-center p-4">
            <Feather name="shield" size={18} color={GRAY} />
            <Text className="text-white ml-3 flex-1 text-sm font-medium">Security & Privacy</Text>
            <Feather name="chevron-right" size={16} color={GRAY} />
          </TouchableOpacity>
        </View>

        <Text className="mx-4 mt-6 text-xs font-semibold text-gray-500 uppercase tracking-wider">Fitness Preferences</Text>
        <View className="mx-4 mt-2 rounded-xl border overflow-hidden" style={{ backgroundColor: COMP_BACKGROUND_COLOR, borderColor: COMP_BORDER_COLOR }}>
          {/* Units */}
          <TouchableOpacity className="flex-row items-center p-4 border-b" style={{ borderColor: COMP_BORDER_COLOR }}>
            <MaterialCommunityIcons name="scale-balance" size={18} color={GRAY} />
            <Text className="text-white ml-3 flex-1 text-sm font-medium">Units of Measure</Text>
            <Text className="text-xs text-gray-500 mr-2">Metric (kg, cm)</Text>
            <Feather name="chevron-right" size={16} color={GRAY} />
          </TouchableOpacity>

          {/* Linked Apps */}
          <TouchableOpacity className="flex-row items-center p-4">
            <Ionicons name="link-outline" size={18} color={GRAY} />
            <Text className="text-white ml-3 flex-1 text-sm font-medium">Connected Devices</Text>
            <Text className="text-xs text-gray-500 mr-2">Apple Health</Text>
            <Feather name="chevron-right" size={16} color={GRAY} />
          </TouchableOpacity>
        </View>

        <Text className="mx-4 mt-6 text-xs font-semibold text-gray-500 uppercase tracking-wider">Support & Legal</Text>
        <View className="mx-4 mt-2 rounded-xl border overflow-hidden" style={{ backgroundColor: COMP_BACKGROUND_COLOR, borderColor: COMP_BORDER_COLOR }}>
          {/* Help Center */}
          <TouchableOpacity className="flex-row items-center p-4 border-b" style={{ borderColor: COMP_BORDER_COLOR }}>
            <Feather name="help-circle" size={18} color={GRAY} />
            <Text className="text-white ml-3 flex-1 text-sm font-medium">Help Center</Text>
            <Feather name="chevron-right" size={16} color={GRAY} />
          </TouchableOpacity>

          {/* Terms & Privacy */}
          <TouchableOpacity className="flex-row items-center p-4">
            <Feather name="file-text" size={18} color={GRAY} />
            <Text className="text-white ml-3 flex-1 text-sm font-medium">Terms of Service</Text>
            <Feather name="chevron-right" size={16} color={GRAY} />
          </TouchableOpacity>
        </View>

        {/* Log Out Button */}
        <TouchableOpacity 
          className="mx-4 mt-8 py-3.5 rounded-xl border items-center justify-center flex-row gap-2 border-red-500/30"
          style={{ backgroundColor: '#ff453a15' }}
          onPress={handleLogout}
        >
          <Feather name="log-out" size={16} color="#ff453a" />
          <Text className="font-bold text-sm text-[#ff453a]">Log Out</Text>
        </TouchableOpacity>
        
        {/* App Version Info */}
        <Text className="text-[10px] text-gray-600 text-center mt-6">Version 1.0.0 (Build 102)</Text>
      </ScrollView>
    </SafeAreaView>
  )
}

export default Profile
