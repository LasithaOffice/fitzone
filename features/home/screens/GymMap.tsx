import React, { useState, useEffect, useRef } from 'react';
import { View, Text, ActivityIndicator, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import MapView, { Marker, Callout } from 'react-native-maps';
import { Feather, Ionicons } from '@expo/vector-icons';
import { BACKGROUND_COLOR, COMP_BACKGROUND_COLOR, COMP_BORDER_COLOR, GRAY, PRIMARY } from '@/constants/colors';
import apiClient from '@/lib/apiClient';

interface BranchInfo {
  _id: string;
  name: string;
  location: string;
  phone?: string;
  latitude?: number;
  longitude?: number;
  image?: string;
  gymId?: {
    _id: string;
    gymName: string;
    email: string;
  };
}

const darkMapStyle = [
  { elementType: 'geometry', stylers: [{ color: '#111' }] },
  { elementType: 'labels.text.fill', stylers: [{ color: '#9d9d9f' }] },
  { elementType: 'labels.text.stroke', stylers: [{ color: '#070709' }] },
  {
    featureType: 'poi',
    elementType: 'geometry',
    stylers: [{ color: '#0d0d0f' }]
  },
  {
    featureType: 'poi',
    elementType: 'labels.text.fill',
    stylers: [{ color: '#9d9d9f' }]
  },
  {
    featureType: 'road',
    elementType: 'geometry',
    stylers: [{ color: '#444444' }]
  },
  {
    featureType: 'road',
    elementType: 'geometry.stroke',
    stylers: [{ color: '#0d0d0f' }]
  },
  {
    featureType: 'road',
    elementType: 'labels.text.fill',
    stylers: [{ color: '#9d9d9f' }]
  },
  {
    featureType: 'water',
    elementType: 'geometry',
    stylers: [{ color: '#001a24' }]
  }
];

const GymMap = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [branches, setBranches] = useState<BranchInfo[]>([]);
  const [selectedBranch, setSelectedBranch] = useState<BranchInfo | null>(null);
  const mapRef = useRef<MapView | null>(null);

  const fetchBranches = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await apiClient.get('/gym/public-branches');
      setBranches(response.data);
    } catch (err: any) {
      console.error('Failed to fetch public branches:', err);
      setError('Could not retrieve gym locations.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBranches();
  }, []);

  // Fit all markers on the map
  const fitAllMarkers = () => {
    if (branches.length === 0 || !mapRef.current) return;
    const coordinates = branches
      .filter((b) => b.latitude != null && b.longitude != null)
      .map((b) => ({
        latitude: b.latitude!,
        longitude: b.longitude!,
      }));

    if (coordinates.length === 1) {
      mapRef.current.animateToRegion({
        latitude: coordinates[0].latitude,
        longitude: coordinates[0].longitude,
        latitudeDelta: 0.02,
        longitudeDelta: 0.02,
      }, 1000);
    } else if (coordinates.length > 1) {
      mapRef.current.fitToCoordinates(coordinates, {
        edgePadding: { top: 100, right: 100, bottom: 100, left: 100 },
        animated: true,
      });
    }
  };

  useEffect(() => {
    if (!loading && branches.length > 0) {
      // Delay fitting markers to let layout complete
      const timer = setTimeout(() => {
        fitAllMarkers();
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [loading, branches]);

  const defaultRegion = {
    latitude: 6.9271,
    longitude: 79.8612,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* NAVBAR HEADER */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Feather name="arrow-left" size={24} color="#FFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Gym Locations Map</Text>
        <TouchableOpacity onPress={fetchBranches} style={styles.refreshButton}>
          <Feather name="refresh-cw" size={20} color="#FFF" />
        </TouchableOpacity>
      </View>

      {loading ? (
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color={PRIMARY} />
          <Text style={styles.loadingText}>Fetching partner network...</Text>
        </View>
      ) : error ? (
        <View style={styles.centerContainer}>
          <Ionicons name="alert-circle-outline" size={60} color="#EF4444" />
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity style={styles.retryButton} onPress={fetchBranches}>
            <Text style={styles.retryButtonText}>Try Again</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <View style={styles.container}>
          <MapView
            ref={mapRef}
            style={styles.map}
            initialRegion={
              branches.length > 0 && branches[0].latitude && branches[0].longitude
                ? {
                  latitude: branches[0].latitude,
                  longitude: branches[0].longitude,
                  latitudeDelta: 0.02,
                  longitudeDelta: 0.02,
                }
                : defaultRegion
            }
            customMapStyle={darkMapStyle}
            showsUserLocation={true}
          >
            {branches
              .filter((b) => b.latitude != null && b.longitude != null)
              .map((branch) => (
                <Marker
                  key={branch._id}
                  coordinate={{
                    latitude: branch.latitude!,
                    longitude: branch.longitude!,
                  }}
                  pinColor={PRIMARY}
                  onPress={(e) => {
                    e.stopPropagation();
                    setSelectedBranch(branch);
                    if (mapRef.current) {
                      mapRef.current.animateToRegion({
                        latitude: branch.latitude!,
                        longitude: branch.longitude!,
                        latitudeDelta: 0.015,
                        longitudeDelta: 0.015,
                      }, 500);
                    }
                  }}
                />
              ))}
          </MapView>

          {selectedBranch && (
            <View style={styles.popupContainer}>
              <View style={styles.popupCard}>
                {/* Branch cover image */}
                <Image
                  source={{ uri: selectedBranch.image || 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=600&auto=format&fit=crop' }}
                  style={styles.popupImage}
                  resizeMode="cover"
                />

                <View style={styles.popupInfo}>
                  <View style={styles.popupHeader}>
                    <Text style={styles.popupGymName} numberOfLines={1}>
                      {selectedBranch.gymId?.gymName || 'Fitzone Partner'}
                    </Text>
                    <TouchableOpacity 
                      style={styles.closeButton} 
                      onPress={() => setSelectedBranch(null)}
                    >
                      <Feather name="x" size={16} color="#FFF" />
                    </TouchableOpacity>
                  </View>

                  <Text style={styles.popupBranchName} numberOfLines={1}>
                    {selectedBranch.name}
                  </Text>
                  
                  <Text style={styles.popupAddress} numberOfLines={2}>
                    {selectedBranch.location}
                  </Text>

                  {selectedBranch.phone ? (
                    <Text style={styles.popupPhone} numberOfLines={1}>
                      {selectedBranch.phone}
                    </Text>
                  ) : null}

                  <TouchableOpacity
                    style={styles.popupDetailsButton}
                    onPress={() => {
                      const bId = selectedBranch._id;
                      setSelectedBranch(null);
                      router.push({
                        pathname: '/main/gym-details',
                        params: { branchId: bId },
                      });
                    }}
                  >
                    <Text style={styles.popupDetailsButtonText}>View Details</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          )}
        </View>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: BACKGROUND_COLOR,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: COMP_BORDER_COLOR,
  },
  backButton: {
    padding: 4,
  },
  headerTitle: {
    flex: 1,
    textAlign: 'center',
    color: '#FFF',
    fontSize: 16,
    fontWeight: '800',
    textTransform: 'uppercase',
    letterSpacing: 1.5,
  },
  refreshButton: {
    padding: 4,
  },
  container: {
    flex: 1,
  },
  map: {
    flex: 1,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  loadingText: {
    color: GRAY,
    fontSize: 14,
    fontWeight: '600',
    marginTop: 12,
  },
  errorText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 16,
    textAlign: 'center',
  },
  retryButton: {
    marginTop: 16,
    paddingVertical: 10,
    paddingHorizontal: 24,
    borderRadius: 8,
    backgroundColor: COMP_BACKGROUND_COLOR,
    borderWidth: 1,
    borderColor: COMP_BORDER_COLOR,
  },
  retryButtonText: {
    color: '#FFF',
    fontWeight: 'bold',
  },
  calloutContainer: {
    width: 220,
    padding: 12,
    borderRadius: 12,
    backgroundColor: '#0d0d0f',
    borderWidth: 1,
    borderColor: '#232325',
  },
  gymName: {
    color: '#9fd101',
    fontWeight: '800',
    fontSize: 14,
    marginBottom: 2,
  },
  branchName: {
    color: '#FFF',
    fontWeight: 'bold',
    fontSize: 12,
    marginBottom: 4,
  },
  branchAddress: {
    color: '#9d9d9f',
    fontSize: 11,
    marginBottom: 4,
    lineHeight: 14,
  },
  branchPhone: {
    color: '#9d9d9f',
    fontSize: 11,
    fontStyle: 'italic',
    marginBottom: 6,
  },
  detailsButton: {
    marginTop: 6,
    backgroundColor: '#9fd101',
    paddingVertical: 6,
    borderRadius: 6,
    alignItems: 'center',
  },
  detailsButtonText: {
    color: '#000',
    fontWeight: '800',
    fontSize: 11,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  popupContainer: {
    position: 'absolute',
    bottom: 20,
    left: 16,
    right: 16,
    zIndex: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  popupCard: {
    backgroundColor: '#0d0d0f',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#232325',
    overflow: 'hidden',
    flexDirection: 'row',
    height: 155,
  },
  popupImage: {
    width: 120,
    height: '100%',
  },
  popupInfo: {
    flex: 1,
    padding: 12,
    justifyContent: 'space-between',
  },
  popupHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  popupGymName: {
    color: '#9fd101',
    fontWeight: '800',
    fontSize: 14,
    flex: 1,
    marginRight: 8,
  },
  closeButton: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  popupBranchName: {
    color: '#FFF',
    fontWeight: 'bold',
    fontSize: 13,
    marginTop: 2,
  },
  popupAddress: {
    color: '#9d9d9f',
    fontSize: 11,
    lineHeight: 14,
    marginTop: 2,
  },
  popupPhone: {
    color: '#9d9d9f',
    fontSize: 10,
    fontStyle: 'italic',
    marginTop: 2,
  },
  popupDetailsButton: {
    backgroundColor: '#9fd101',
    paddingVertical: 6,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 6,
  },
  popupDetailsButtonText: {
    color: '#000',
    fontWeight: '800',
    fontSize: 11,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
});

export default GymMap;
