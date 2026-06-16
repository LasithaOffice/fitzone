import React, { useState, useEffect } from 'react'
import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator, Linking, Image } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { router, useLocalSearchParams } from 'expo-router'
import { Ionicons, Feather, FontAwesome5 } from '@expo/vector-icons'
import GymImageCarousel from '../components/GymImageCarousel'
import { COMP_BACKGROUND_COLOR, COMP_BORDER_COLOR, GRAY, PRIMARY } from '@/constants/colors'
import { useAppSelector } from '@/store'
import apiClient from '@/lib/apiClient'

interface GymInfo {
  enrolled: boolean;
  gymId?: string;
  gymName?: string;
  gymEmail?: string;
  logoUrl?: string;
  images?: string[];
  branchId?: string;
  branchName?: string;
  branchLocation?: string;
  branchPhone?: string;
  plan?: 'Basic' | 'Premium' | 'VIP';
  status?: 'active' | 'inactive';
  joinedDate?: string;
  memberCount?: number;
}

const GymDetails = () => {
  const auth = useAppSelector((state) => state.auth)
  const { branchId } = useLocalSearchParams()
  const [loading, setLoading] = useState(true)
  const [gymDetails, setGymDetails] = useState<GymInfo | null>(null)
  const [branches, setBranches] = useState<any[]>([])
  const [error, setError] = useState<string | null>(null)

  const fetchGymDetails = async () => {
    setLoading(true)
    setError(null)
    try {
      if (branchId) {
        const response = await apiClient.get(`/gym/public-branches/${branchId}`)
        const data = response.data
        setGymDetails({
          enrolled: false,
          gymId: data.gymId?._id,
          gymName: data.gymId?.gymName || 'Fitzone Partner',
          gymEmail: data.gymId?.email || '',
          logoUrl: data.gymId?.logoUrl || '',
          images: data.gymId?.images || [],
          branchId: data._id,
          branchName: data.name,
          branchLocation: data.location,
          branchPhone: data.phone || 'Not Specified',
          memberCount: data.memberCount,
        })
      } else {
        const response = await apiClient.get('/gym/my-gym')
        setGymDetails(response.data)
      }
    } catch (err: any) {
      console.error(err)
      setError('Could not establish database connection to fetch gym details.')
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    const fetchGymBranches = async () => {
      if (!gymDetails?.gymId) return
      try {
        const response = await apiClient.get(`/gym/public-branches?gymId=${gymDetails.gymId}`)
        // Filter out the branch currently showing (if we are looking at a public branch detail)
        const filtered = response.data.filter((b: any) => b._id !== gymDetails.branchId)
        setBranches(filtered)
      } catch (err) {
        console.error('Failed to fetch gym branches:', err)
      }
    }
    fetchGymBranches()
  }, [gymDetails?.gymId, gymDetails?.branchId])

  useEffect(() => {
    fetchGymDetails()
  }, [branchId])

  const handleCall = (phone?: string) => {
    if (phone && phone !== 'Not Specified') {
      Linking.openURL(`tel:${phone}`)
    }
  }

  const handleEmail = (email?: string) => {
    if (email) {
      Linking.openURL(`mailto:${email}`)
    }
  }

  // Format joined date
  const formatDate = (dateString?: string) => {
    if (!dateString) return ''
    const d = new Date(dateString)
    return d.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
  }

  // Neon-lime theme configuration
  const themeAccent = PRIMARY // '#A3E635' (lime) or fallback
  const cardBg = COMP_BACKGROUND_COLOR || '#121214'
  const borderBg = COMP_BORDER_COLOR || '#1F1F23'

  console.log("auth", auth)

  return (
    <SafeAreaView className="bg-black flex-1">
      {/* HEADER NAVBAR */}
      <View className="flex-row items-center justify-between px-4 py-3 border-b" style={{ borderColor: borderBg }}>
        <TouchableOpacity onPress={() => router.back()} className="p-1">
          <Feather name="arrow-left" size={24} color="#FFF" />
        </TouchableOpacity>
        <Text className="text-white text-[18px] font-extrabold tracking-wider">
          {gymDetails?.enrolled ? 'My Gym Terminal' : 'Gym Association'}
        </Text>
        <TouchableOpacity onPress={fetchGymDetails} className="p-1">
          <Feather name="refresh-cw" size={20} color="#FFF" />
        </TouchableOpacity>
      </View>

      {loading ? (
        <View className="flex-1 justify-center items-center">
          <ActivityIndicator size="large" color={themeAccent} />
          <Text className="text-gray-400 text-sm mt-3 font-semibold">Updating connection stream...</Text>
        </View>
      ) : error ? (
        <View className="flex-1 justify-center items-center px-6">
          <Ionicons name="cloud-offline-outline" size={60} color="#EF4444" />
          <Text className="text-white text-lg font-bold mt-4">Offline Sync Failed</Text>
          <Text className="text-gray-400 text-sm text-center mt-2">{error}</Text>
          <TouchableOpacity
            className="mt-6 py-2.5 px-6 rounded-lg bg-zinc-900 border"
            style={{ borderColor: borderBg }}
            onPress={fetchGymDetails}
          >
            <Text className="text-white font-bold">Try Reconnecting</Text>
          </TouchableOpacity>
        </View>
      ) : gymDetails && gymDetails.enrolled ? (
        /* ================= ENROLLED VIEW ================= */
        <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
          <GymImageCarousel images={gymDetails.images} />

          <View className="px-4 mt-4">
            {/* GYM MAIN PROFILE BRAND */}
            <View
              className="p-6 rounded-2xl border mb-6 relative overflow-hidden"
              style={{ backgroundColor: cardBg, borderColor: borderBg }}
            >
              <View className="flex-row items-center mb-4">
                {gymDetails.logoUrl ? (
                  <Image
                    source={{ uri: gymDetails.logoUrl }}
                    style={{ width: 50, height: 50, borderRadius: 10, marginRight: 12 }}
                    resizeMode="cover"
                  />
                ) : null}
                <View className="flex-1">
                  <Text className="text-[12px] font-extrabold uppercase tracking-widest text-primary mb-1">
                    Active Membership
                  </Text>
                  <Text className="text-white text-[22px] font-extrabold mb-1">
                    {gymDetails.gymName}
                  </Text>
                  <View className="flex-row items-center mt-1">
                    <Ionicons name="people" size={14} color={themeAccent} />
                    <Text className="text-gray-400 text-[12px] font-semibold ml-1">
                      {gymDetails.memberCount || 0} active members
                    </Text>
                  </View>
                </View>
              </View>

              <Text className="text-gray-400 text-[14px] font-medium">
                Joined: {formatDate(gymDetails.joinedDate)}
              </Text>

              {/* Status Indicator */}
              <View
                className="py-1 px-2.5 rounded-full"
                style={{ backgroundColor: gymDetails.status === 'active' ? '#10B98122' : '#EF444422' }}
              >
                <Text
                  className="font-bold text-[11px] uppercase tracking-widest"
                  style={{ color: gymDetails.status === 'active' ? '#10B981' : '#EF4444' }}
                >
                  {gymDetails.status || 'active'}
                </Text>
              </View>

              {/* Plan Tier Banner */}
              <View className="mt-6 pt-5 border-t border-zinc-800/60 flex-row items-center justify-between">
                <View>
                  <Text className="text-gray-400 text-[12px] uppercase tracking-wider">Subscription Tier</Text>
                  <Text className="text-white text-[16px] font-black">{gymDetails.plan} Plan</Text>
                </View>
                <View
                  className="w-10 h-10 rounded-full items-center justify-center bg-zinc-900 border"
                  style={{ borderColor: borderBg }}
                >
                  <FontAwesome5
                    name="medal"
                    size={16}
                    color={
                      gymDetails.plan === 'VIP'
                        ? '#EAB308' // Gold
                        : gymDetails.plan === 'Premium'
                          ? '#A855F7' // Purple
                          : '#64748B' // Silver
                    }
                  />
                </View>
              </View>
            </View>

            {/* BRANCH INFO CARD */}
            <Text className="text-gray-400 font-extrabold uppercase tracking-widest text-[11px] mb-2 px-1">
              Home Branch Details
            </Text>
            <View
              className="p-5 rounded-xl border mb-6"
              style={{ backgroundColor: cardBg, borderColor: borderBg }}
            >
              <View className="flex-row items-center mb-4">
                <Ionicons name="location-sharp" size={20} color={themeAccent} className="mr-3" />
                <View className="flex-1 ml-2">
                  <Text className="text-white text-[16px] font-extrabold">{gymDetails.branchName}</Text>
                  <Text className="text-gray-400 text-[13px] mt-1 leading-5">{gymDetails.branchLocation}</Text>
                </View>
              </View>

              {/* Phone Info */}
              {gymDetails.branchPhone && gymDetails.branchPhone !== 'Not Specified' && (
                <View className="flex-row items-center pt-3 border-t border-zinc-800/40">
                  <Ionicons name="call" size={16} color={GRAY || '#888'} className="mr-3" />
                  <Text className="text-gray-300 text-[13px] ml-2 font-semibold">{gymDetails.branchPhone}</Text>
                </View>
              )}
            </View>

            {/* CONTACT & INTERACTION BUTTONS */}
            <View className="flex-row gap-3 mb-8">
              <TouchableOpacity
                className="flex-1 flex-row items-center justify-center py-3.5 rounded-xl bg-zinc-900 border"
                style={{ borderColor: borderBg }}
                onPress={() => handleCall(gymDetails.branchPhone)}
                disabled={!gymDetails.branchPhone || gymDetails.branchPhone === 'Not Specified'}
              >
                <Feather name="phone" size={16} color="#FFF" style={{ marginRight: 8 }} />
                <Text className="text-white font-bold text-[14px]">Call Branch</Text>
              </TouchableOpacity>

              <TouchableOpacity
                className="flex-1 flex-row items-center justify-center py-3.5 rounded-xl bg-zinc-900 border"
                style={{ borderColor: borderBg }}
                onPress={() => handleEmail(gymDetails.gymEmail)}
                disabled={!gymDetails.gymEmail}
              >
                <Feather name="mail" size={16} color="#FFF" style={{ marginRight: 8 }} />
                <Text className="text-white font-bold text-[14px]">Email Support</Text>
              </TouchableOpacity>
            </View>

            {/* BRANCHES LIST SECTION */}
            <Text className="text-gray-400 font-extrabold uppercase tracking-widest text-[11px] mb-3 px-1">
              Gym Branches
            </Text>
            {branches.length > 0 ? (
              <ScrollView horizontal showsHorizontalScrollIndicator={false} className="mb-6">
                {branches.map((b) => (
                  <TouchableOpacity
                    key={b._id}
                    onPress={() => router.push(`/main/branch-details?branchId=${b._id}`)}
                    className="mr-4 p-4 rounded-xl border"
                    style={{ backgroundColor: cardBg, borderColor: borderBg, width: 220 }}
                  >
                    {b.image ? (
                      <Image
                        source={{ uri: b.image }}
                        style={{ width: '100%', height: 100, borderRadius: 8, marginBottom: 10 }}
                        resizeMode="cover"
                      />
                    ) : (
                      <View className="bg-zinc-900 rounded-lg justify-center items-center mb-2" style={{ width: '100%', height: 100 }}>
                        <Ionicons name="image-outline" size={24} color="#555" />
                      </View>
                    )}
                    <Text className="text-white font-bold text-[14px] mb-1" numberOfLines={1}>
                      {b.name}
                    </Text>
                    <View className="flex-row items-center">
                      <Ionicons name="location-sharp" size={12} color={themeAccent} />
                      <Text className="text-gray-400 text-[11px] ml-1 flex-1" numberOfLines={1}>
                        {b.location}
                      </Text>
                    </View>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            ) : (
              <Text className="text-zinc-500 text-[12px] italic mb-6 px-1">No other branches registered.</Text>
            )}

            {/* SYNC INFORMATION FOOTNOTE */}
            <View
              className="p-4 rounded-xl border flex-row items-start mb-6"
              style={{ backgroundColor: '#10B9810A', borderColor: '#10B98133' }}
            >
              <Ionicons name="checkmark-circle" size={20} color="#10B981" />
              <View className="flex-1 ml-3">
                <Text className="text-white text-[13px] font-bold">Training Database Synchronized</Text>
                <Text className="text-gray-400 text-[12px] mt-1 leading-5">
                  Your workout plans and meal log entries are successfully sharing with your gym trainers. They can monitor your progress in real-time.
                </Text>
              </View>
            </View>
          </View>
        </ScrollView>
      ) : (
        /* ================= UNENROLLED VIEW ================= */
        <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
          <GymImageCarousel images={gymDetails?.images} />

          <View className="px-4 mt-4">
            {gymDetails && gymDetails.branchName && (
              <View
                className="p-5 rounded-2xl border mb-6"
                style={{ backgroundColor: cardBg, borderColor: borderBg }}
              >
                <View className="flex-row items-center mb-4">
                  {gymDetails.logoUrl ? (
                    <Image
                      source={{ uri: gymDetails.logoUrl }}
                      style={{ width: 50, height: 50, borderRadius: 10, marginRight: 12 }}
                      resizeMode="cover"
                    />
                  ) : null}
                  <View className="flex-1">
                    <Text className="text-[12px] font-extrabold uppercase tracking-widest text-primary mb-1">
                      Selected Partner Branch
                    </Text>
                    <Text className="text-white text-[22px] font-extrabold mb-1">
                      {gymDetails.gymName}
                    </Text>
                    <View className="flex-row items-center mt-1">
                      <Ionicons name="people" size={14} color={themeAccent} />
                      <Text className="text-gray-400 text-[12px] font-semibold ml-1">
                        {gymDetails.memberCount || 0} active members
                      </Text>
                    </View>
                  </View>
                </View>

                <Text style={{ color: themeAccent }} className="text-[14px] font-bold mb-4">
                  {gymDetails.branchName}
                </Text>

                <View className="flex-row items-center mb-3">
                  <Ionicons name="location-sharp" size={18} color={themeAccent} style={{ marginRight: 8 }} />
                  <Text className="text-gray-300 text-[13px] flex-1 leading-5">{gymDetails.branchLocation}</Text>
                </View>

                {gymDetails.branchPhone && gymDetails.branchPhone !== 'Not Specified' && (
                  <View className="flex-row items-center mb-3">
                    <Ionicons name="call" size={16} color={GRAY} style={{ marginRight: 8 }} />
                    <Text className="text-gray-300 text-[13px]">{gymDetails.branchPhone}</Text>
                  </View>
                )}

                {gymDetails.gymEmail ? (
                  <View className="flex-row items-center">
                    <Ionicons name="mail" size={16} color={GRAY} className="mr-2" style={{ marginRight: 8 }} />
                    <Text className="text-gray-300 text-[13px]">{gymDetails.gymEmail}</Text>
                  </View>
                ) : null}

                {/* CONTACT BUTTONS FOR SELECTED BRANCH */}
                <View className="flex-row gap-3 mt-5">
                  <TouchableOpacity
                    className="flex-1 flex-row items-center justify-center py-2.5 rounded-xl bg-zinc-900 border"
                    style={{ borderColor: borderBg }}
                    onPress={() => handleCall(gymDetails.branchPhone)}
                    disabled={!gymDetails.branchPhone || gymDetails.branchPhone === 'Not Specified'}
                  >
                    <Feather name="phone" size={14} color="#FFF" style={{ marginRight: 6 }} />
                    <Text className="text-white font-bold text-[12px]">Call</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    className="flex-1 flex-row items-center justify-center py-2.5 rounded-xl bg-zinc-900 border"
                    style={{ borderColor: borderBg }}
                    onPress={() => handleEmail(gymDetails.gymEmail)}
                    disabled={!gymDetails.gymEmail}
                  >
                    <Feather name="mail" size={14} color="#FFF" style={{ marginRight: 6 }} />
                    <Text className="text-white font-bold text-[12px]">Email</Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}

            {/* BRANCHES LIST SECTION */}
            <Text className="text-gray-400 font-extrabold uppercase tracking-widest text-[11px] mb-3 px-1">
              Gym Branches
            </Text>
            {branches.length > 0 ? (
              <ScrollView horizontal showsHorizontalScrollIndicator={false} className="mb-6">
                {branches.map((b) => (
                  <TouchableOpacity
                    key={b._id}
                    onPress={() => router.push(`/main/branch-details?branchId=${b._id}`)}
                    className="mr-4 p-4 rounded-xl border"
                    style={{ backgroundColor: cardBg, borderColor: borderBg, width: 220 }}
                  >
                    {b.image ? (
                      <Image
                        source={{ uri: b.image }}
                        style={{ width: '100%', height: 100, borderRadius: 8, marginBottom: 10 }}
                        resizeMode="cover"
                      />
                    ) : (
                      <View className="bg-zinc-900 rounded-lg justify-center items-center mb-2" style={{ width: '100%', height: 100 }}>
                        <Ionicons name="image-outline" size={24} color="#555" />
                      </View>
                    )}
                    <Text className="text-white font-bold text-[14px] mb-1" numberOfLines={1}>
                      {b.name}
                    </Text>
                    <View className="flex-row items-center">
                      <Ionicons name="location-sharp" size={12} color={themeAccent} />
                      <Text className="text-gray-400 text-[11px] ml-1 flex-1" numberOfLines={1}>
                        {b.location}
                      </Text>
                    </View>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            ) : (
              <Text className="text-zinc-500 text-[12px] italic mb-6 px-1">No other branches registered.</Text>
            )}

            {/* WELCOME GRAPHIC PANEL */}
            <View
              className="p-6 rounded-2xl border mb-6"
              style={{ backgroundColor: cardBg, borderColor: borderBg }}
            >
              <View className="flex-row items-center gap-4 mb-4">
                <View className="w-12 h-12 rounded-xl bg-zinc-900 border items-center justify-center" style={{ borderColor: borderBg }}>
                  <FontAwesome5 name="store" size={20} color={themeAccent} />
                </View>
                <View className="flex-1">
                  <Text className="text-white text-[20px] font-black">Join a Partner Gym</Text>
                  <Text className="text-gray-400 text-[13px] mt-0.5">Take your training to the next level</Text>
                </View>
              </View>

              <Text className="text-gray-300 text-[13px] leading-5 mt-2">
                Sync your mobile app with one of our certified partner gyms. By joining, your physical stats, workout completions, and dietary routines will sync directly with your gym trainer console.
              </Text>
            </View>

            {/* BENEFIT ITEMS LIST */}
            <Text className="text-gray-400 font-extrabold uppercase tracking-widest text-[11px] mb-3 px-1">
              Membership Benefits
            </Text>

            <View className="gap-3 mb-6">
              <View className="flex-row items-start p-4 rounded-xl bg-zinc-950 border" style={{ borderColor: borderBg }}>
                <Ionicons name="pulse" size={20} color={themeAccent} className="mr-3" />
                <View className="flex-1 ml-2">
                  <Text className="text-white font-bold text-[14px]">Real-Time Progress Sharing</Text>
                  <Text className="text-gray-400 text-[12px] mt-1 leading-5">Trainers can inspect your workout streaks and log metrics directly to adjust your schedule.</Text>
                </View>
              </View>

              <View className="flex-row items-start p-4 rounded-xl bg-zinc-950 border" style={{ borderColor: borderBg }}>
                <Ionicons name="shield-checkmark" size={20} color={themeAccent} className="mr-3" />
                <View className="flex-1 ml-2">
                  <Text className="text-white font-bold text-[14px]">Access Specialized Equipment</Text>
                  <Text className="text-gray-400 text-[12px] mt-1 leading-5">Unlock equipment tutorials and log metrics optimized for your gym's specific catalog.</Text>
                </View>
              </View>

              <View className="flex-row items-start p-4 rounded-xl bg-zinc-950 border" style={{ borderColor: borderBg }}>
                <Ionicons name="sparkles" size={20} color={themeAccent} className="mr-3" />
                <View className="flex-1 ml-2">
                  <Text className="text-white font-bold text-[14px]">Premium Tier Assignments</Text>
                  <Text className="text-gray-400 text-[12px] mt-1 leading-5">Get assigned to custom Basic, Premium, or VIP tiers with associated perks.</Text>
                </View>
              </View>
            </View>

            {/* HOW TO JOIN STEP BY STEP */}
            <Text className="text-gray-400 font-extrabold uppercase tracking-widest text-[11px] mb-3 px-1">
              Enrollment Steps
            </Text>

            <View
              className="p-5 rounded-xl border mb-8"
              style={{ backgroundColor: cardBg, borderColor: borderBg }}
            >
              {/* Step 1 */}
              <View className="flex-row items-start mb-5">
                <View className="w-6 h-6 rounded-full bg-zinc-900 border items-center justify-center mr-3 mt-0.5" style={{ borderColor: borderBg }}>
                  <Text className="text-white text-[11px] font-bold">1</Text>
                </View>
                <View className="flex-1 ml-1">
                  <Text className="text-white font-bold text-[13px]">Visit a Fitzone Gym</Text>
                  <Text className="text-gray-400 text-[12px] mt-0.5 leading-5">Drop by any of our certified local gym facilities or branches.</Text>
                </View>
              </View>

              {/* Step 2 */}
              <View className="flex-row items-start mb-5">
                <View className="w-6 h-6 rounded-full bg-zinc-900 border items-center justify-center mr-3 mt-0.5" style={{ borderColor: borderBg }}>
                  <Text className="text-white text-[11px] font-bold">2</Text>
                </View>
                <View className="flex-1 ml-1">
                  <Text className="text-white font-bold text-[13px]">Provide Your Account Email</Text>
                  <Text className="text-gray-400 text-[12px] mt-0.5 leading-5">Share your registered Fitzone login email with the gym owner.</Text>
                </View>
              </View>

              {/* Step 3 */}
              <View className="flex-row items-start">
                <View className="w-6 h-6 rounded-full bg-zinc-900 border items-center justify-center mr-3 mt-0.5" style={{ borderColor: borderBg }}>
                  <Text className="text-white text-[11px] font-bold">3</Text>
                </View>
                <View className="flex-1 ml-1">
                  <Text className="text-white font-bold text-[13px]">Instantly Connect</Text>
                  <Text className="text-gray-400 text-[12px] mt-0.5 leading-5">Once added by the manager, this console will automatically update with your credentials.</Text>
                </View>
              </View>

              {/* REGISTERED EMAIL CALLOUT */}
              <View
                className="mt-6 p-4 rounded-lg flex-row items-center border bg-zinc-950"
                style={{ borderColor: borderBg }}
              >
                <Feather name="info" size={16} color={themeAccent} className="mr-3" />
                <View className="flex-1 ml-2">
                  <Text className="text-gray-400 text-[11px] uppercase tracking-wider">Your Registered Email</Text>
                  <Text className="text-white text-[14px] font-black mt-0.5">{auth.email || "not-found"}</Text>
                </View>
              </View>
            </View>
          </View>
        </ScrollView>
      )}
    </SafeAreaView>
  )
}

export default GymDetails
