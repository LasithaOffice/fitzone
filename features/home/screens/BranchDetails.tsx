import React, { useState, useEffect } from 'react'
import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator, Image, Linking, Alert } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { router, useLocalSearchParams } from 'expo-router'
import { Ionicons, Feather, FontAwesome5 } from '@expo/vector-icons'
import { COMP_BACKGROUND_COLOR, COMP_BORDER_COLOR, GRAY, PRIMARY } from '@/constants/colors'
import apiClient from '@/lib/apiClient'

interface EquipmentItem {
  _id: string;
  name: string;
  quantity: number;
  status: 'active' | 'maintenance' | 'broken';
}

interface TimetableItem {
  day: string;
  slots: string[];
}

interface BranchDetailInfo {
  _id: string;
  name: string;
  location: string;
  phone?: string;
  image?: string;
  gymId?: {
    gymName: string;
    email: string;
    logoUrl?: string;
  };
  equipments?: EquipmentItem[];
  timetable?: TimetableItem[];
}

const BranchDetails = () => {
  const { branchId } = useLocalSearchParams()
  const [loading, setLoading] = useState(true)
  const [detail, setDetail] = useState<BranchDetailInfo | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [enrollment, setEnrollment] = useState<{
    enrolled: boolean;
    pendingRequest?: boolean;
    branchId?: string;
    branchName?: string;
    gymName?: string;
  } | null>(null)

  const fetchBranchDetails = async () => {
    if (!branchId) return
    setLoading(true)
    setError(null)
    try {
      const response = await apiClient.get(`/gym/public-branches/${branchId}`)
      setDetail(response.data)
    } catch (err) {
      console.error(err)
      setError('Could not load branch details.')
    } finally {
      setLoading(false)
    }
  }

  const fetchEnrollmentStatus = async () => {
    try {
      const response = await apiClient.get('/gym/my-gym')
      setEnrollment(response.data)
    } catch (err) {
      console.error('Failed to fetch enrollment status:', err)
    }
  }

  useEffect(() => {
    fetchBranchDetails()
    fetchEnrollmentStatus()
  }, [branchId])

  const handleJoinRequest = async () => {
    if (!branchId) return
    try {
      setLoading(true)
      const res = await apiClient.post('/gym/join-request', { branchId })
      Alert.alert('Success', res.data.message || 'Join request submitted!')
      await fetchEnrollmentStatus()
    } catch (err: any) {
      Alert.alert('Error', err.response?.data?.message || 'Failed to submit join request')
    } finally {
      setLoading(false)
    }
  }

  const handleCall = (phone?: string) => {
    if (phone && phone !== 'Not Specified') {
      Linking.openURL(`tel:${phone}`)
    }
  }

  const themeAccent = PRIMARY || '#A3E635'
  const cardBg = COMP_BACKGROUND_COLOR || '#121214'
  const borderBg = COMP_BORDER_COLOR || '#1F1F23'

  return (
    <SafeAreaView className="bg-black flex-1">
      {/* Navbar header */}
      <View className="flex-row items-center justify-between px-4 py-3 border-b" style={{ borderColor: borderBg }}>
        <TouchableOpacity onPress={() => router.back()} className="p-1">
          <Feather name="arrow-left" size={24} color="#FFF" />
        </TouchableOpacity>
        <Text className="text-white text-[18px] font-extrabold tracking-wider">
          Branch Profile
        </Text>
        <TouchableOpacity onPress={fetchBranchDetails} className="p-1">
          <Feather name="refresh-cw" size={20} color="#FFF" />
        </TouchableOpacity>
      </View>

      {loading ? (
        <View className="flex-1 justify-center items-center">
          <ActivityIndicator size="large" color={themeAccent} />
          <Text className="text-gray-400 text-sm mt-3 font-semibold">Loading facility profiles...</Text>
        </View>
      ) : error ? (
        <View className="flex-1 justify-center items-center px-6">
          <Ionicons name="alert-circle-outline" size={60} color="#EF4444" />
          <Text className="text-white text-lg font-bold mt-4">Failed to load data</Text>
          <Text className="text-gray-400 text-sm text-center mt-2">{error}</Text>
          <TouchableOpacity
            className="mt-6 py-2.5 px-6 rounded-lg bg-zinc-900 border"
            style={{ borderColor: borderBg }}
            onPress={fetchBranchDetails}
          >
            <Text className="text-white font-bold">Try Again</Text>
          </TouchableOpacity>
        </View>
      ) : detail ? (
        <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
          {/* Branch Image Cover Banner */}
          <View className="w-full relative" style={{ height: 200, backgroundColor: '#18181b' }}>
            {detail.image ? (
              <Image
                source={{ uri: detail.image }}
                style={{ width: '100%', height: '100%' }}
                resizeMode="cover"
              />
            ) : (
              <View className="w-full h-full items-center justify-center">
                <Ionicons name="images-outline" size={48} color="#444" />
                <Text className="text-zinc-600 mt-2 font-semibold">No Preview Image</Text>
              </View>
            )}

            {/* Gym Owner Logo Badge overlay */}
            {detail.gymId?.logoUrl ? (
              <View 
                className="absolute left-4 -bottom-6 rounded-xl border-2 overflow-hidden shadow-lg"
                style={{ width: 60, height: 60, borderColor: borderBg, backgroundColor: '#000' }}
              >
                <Image
                  source={{ uri: detail.gymId.logoUrl }}
                  style={{ width: '100%', height: '100%' }}
                  resizeMode="cover"
                />
              </View>
            ) : null}
          </View>

          {/* Body Information */}
          <View className="px-4 mt-10">
            <Text className="text-gray-400 text-[11px] font-extrabold uppercase tracking-widest text-primary mb-1">
              {detail.gymId?.gymName || 'Fitzone Partner'}
            </Text>
            <Text className="text-white text-[24px] font-black leading-8 mb-4">
              {detail.name}
            </Text>

            {/* Contact Card */}
            <View className="p-5 rounded-2xl border mb-6" style={{ backgroundColor: cardBg, borderColor: borderBg }}>
              <View className="flex-row items-start mb-4">
                <Ionicons name="location" size={20} color={themeAccent} style={{ marginTop: 2 }} />
                <View className="flex-1 ml-3">
                  <Text className="text-zinc-400 text-[11px] uppercase tracking-wider">Address Location</Text>
                  <Text className="text-white text-[14px] font-semibold mt-0.5 leading-5">{detail.location}</Text>
                </View>
              </View>

              {detail.phone ? (
                <View className="flex-row items-start pt-3 border-t border-zinc-800/40">
                  <Ionicons name="call" size={18} color={themeAccent} style={{ marginTop: 1 }} />
                  <View className="flex-1 ml-3">
                    <Text className="text-zinc-400 text-[11px] uppercase tracking-wider">Telephone Contacts</Text>
                    <Text className="text-white text-[14px] font-semibold mt-0.5">{detail.phone}</Text>
                  </View>
                </View>
              ) : null}
            </View>

            {/* Enrollment Section */}
            <View className="p-5 rounded-2xl border mb-6" style={{ backgroundColor: cardBg, borderColor: borderBg }}>
              <View className="flex-row items-center mb-3">
                <Ionicons name="card-outline" size={20} color={themeAccent} />
                <Text className="text-white text-[16px] font-extrabold ml-2">Membership Status</Text>
              </View>
              {enrollment ? (
                (() => {
                  if (enrollment.enrolled) {
                    const isThisBranch = enrollment.branchId === branchId;
                    return (
                      <View>
                        <Text className="text-zinc-400 text-[13px] mb-3 leading-5">
                          {isThisBranch 
                            ? "You are currently an active member of this branch." 
                            : `You are currently enrolled at ${enrollment.gymName} (${enrollment.branchName}).`}
                        </Text>
                        <View 
                          className="py-3 px-4 rounded-xl flex-row items-center justify-center border"
                          style={{ borderColor: '#10B98130', backgroundColor: '#10B98110' }}
                        >
                          <Ionicons name="checkmark-circle" size={18} color="#10B981" style={{ marginRight: 6 }} />
                          <Text className="font-bold text-[14px] text-[#10B981]">
                            {isThisBranch ? "Active Member" : "Enrolled Elsewhere"}
                          </Text>
                        </View>
                      </View>
                    );
                  } else if (enrollment.pendingRequest) {
                    const isThisBranch = enrollment.branchName === detail.name && enrollment.gymName === detail.gymId?.gymName;
                    return (
                      <View>
                        <Text className="text-zinc-400 text-[13px] mb-3 leading-5">
                          {isThisBranch
                            ? "Your enrollment request is pending review by the branch manager."
                            : `You have a pending request at ${enrollment.gymName} (${enrollment.branchName}).`}
                        </Text>
                        <View 
                          className="py-3 px-4 rounded-xl flex-row items-center justify-center border"
                          style={{ borderColor: '#F59E0B30', backgroundColor: '#F59E0B10' }}
                        >
                          <Ionicons name="time" size={18} color="#F59E0B" style={{ marginRight: 6 }} />
                          <Text className="font-bold text-[14px] text-[#F59E0B]">
                            {isThisBranch ? "Request Pending" : "Pending Request Elsewhere"}
                          </Text>
                        </View>
                      </View>
                    );
                  } else {
                    return (
                      <View>
                        <Text className="text-zinc-400 text-[13px] mb-3 leading-5">
                          You are not currently enrolled in any gym branch. Send a join request to request membership at this branch.
                        </Text>
                        <TouchableOpacity
                          className="w-full flex-row items-center justify-center py-3.5 rounded-xl"
                          style={{ backgroundColor: themeAccent }}
                          onPress={handleJoinRequest}
                        >
                          <Ionicons name="send" size={16} color="#000" style={{ marginRight: 8 }} />
                          <Text className="text-black font-extrabold text-[14px] uppercase tracking-wider">
                            Send Join Request
                          </Text>
                        </TouchableOpacity>
                      </View>
                    );
                  }
                })()
              ) : (
                <ActivityIndicator size="small" color={themeAccent} />
              )}
            </View>

            {/* Timetable Section */}
            <View className="mb-6">
              <View className="flex-row items-center mb-3">
                <Ionicons name="calendar-outline" size={20} color={themeAccent} />
                <Text className="text-white text-[16px] font-extrabold ml-2">Weekly Timetable</Text>
              </View>
              <View className="p-4 rounded-2xl border" style={{ backgroundColor: cardBg, borderColor: borderBg }}>
                {detail.timetable && detail.timetable.length > 0 ? (
                  detail.timetable.map((item, idx) => (
                    <View 
                      key={idx} 
                      className={`flex-row justify-between py-2.5 ${idx !== 0 ? 'border-t border-zinc-900' : ''}`}
                    >
                      <Text className="text-white font-bold text-[13px]">{item.day}</Text>
                      <View className="items-end gap-1">
                        {item.slots.map((slot, sIdx) => (
                          <Text key={sIdx} className="text-gray-400 text-[12px] font-medium">
                            {slot}
                          </Text>
                        ))}
                      </View>
                    </View>
                  ))
                ) : (
                  <Text className="text-zinc-500 text-[12px] italic text-center py-2">
                    No operating schedule specified.
                  </Text>
                )}
              </View>
            </View>

            {/* Equipments Section */}
            <View className="mb-8">
              <View className="flex-row items-center mb-3">
                <Ionicons name="construct-outline" size={20} color={themeAccent} />
                <Text className="text-white text-[16px] font-extrabold ml-2">Branch Equipments</Text>
              </View>

              {detail.equipments && detail.equipments.length > 0 ? (
                <View className="gap-3">
                  {detail.equipments.map((eq) => (
                    <View 
                      key={eq._id}
                      className="p-4 rounded-xl border flex-row items-center justify-between"
                      style={{ backgroundColor: cardBg, borderColor: borderBg }}
                    >
                      <View className="flex-1 mr-3">
                        <Text className="text-white font-bold text-[14px]">{eq.name}</Text>
                        <Text className="text-gray-400 text-[12px] mt-0.5">
                          Quantity: <Text className="text-white font-bold">{eq.quantity}</Text>
                        </Text>
                      </View>

                      {/* Status indicator */}
                      <View 
                        className="py-1 px-3 rounded-full"
                        style={{ 
                          backgroundColor: eq.status === 'active' 
                            ? '#10B98115' 
                            : eq.status === 'maintenance' 
                              ? '#F59E0B15' 
                              : '#EF444415' 
                        }}
                      >
                        <Text 
                          className="font-bold text-[10px] uppercase tracking-wider"
                          style={{ 
                            color: eq.status === 'active' 
                              ? '#10B981' 
                              : eq.status === 'maintenance' 
                                ? '#F59E0B' 
                                : '#EF4444' 
                          }}
                        >
                          {eq.status}
                        </Text>
                      </View>
                    </View>
                  ))}
                </View>
              ) : (
                <View className="p-5 rounded-2xl border items-center" style={{ backgroundColor: cardBg, borderColor: borderBg }}>
                  <FontAwesome5 name="box-open" size={24} color="#444" />
                  <Text className="text-zinc-500 text-[12px] italic mt-2">
                    No registered equipments at this branch.
                  </Text>
                </View>
              )}
            </View>

            {/* Action Call Button */}
            {detail.phone && (
              <TouchableOpacity
                className="w-full flex-row items-center justify-center py-4 rounded-2xl mb-8"
                style={{ backgroundColor: themeAccent }}
                onPress={() => handleCall(detail.phone)}
              >
                <Feather name="phone-call" size={18} color="#000" style={{ marginRight: 8 }} />
                <Text className="text-black font-extrabold text-[15px] uppercase tracking-wider">Contact Branch Office</Text>
              </TouchableOpacity>
            )}
          </View>
        </ScrollView>
      ) : null}
    </SafeAreaView>
  )
}

export default BranchDetails
