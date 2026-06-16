import React, { useState, useEffect, useRef } from 'react';
import { View, Text, ActivityIndicator, TouchableOpacity, StyleSheet } from 'react-native';
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
                >
                  <Callout
                    tooltip
                    onPress={() =>
                      router.push({
                        pathname: '/main/gym-details',
                        params: { branchId: branch._id },
                      })
                    }
                  >
                    <View style={styles.calloutContainer}>
                      <Text style={styles.gymName}>
                        {branch.gymId?.gymName || 'Fitzone Partner'}
                      </Text>
                      <Text style={styles.branchName}>{branch.name}</Text>
                      <Text style={styles.branchAddress} numberOfLines={2}>
                        {branch.location}
                      </Text>
                      {branch.phone ? (
                        <Text style={styles.branchPhone}>{branch.phone}</Text>
                      ) : null}
                      <View style={styles.detailsButton}>
                        <Text style={styles.detailsButtonText}>Details</Text>
                      </View>
                    </View>
                  </Callout>
                </Marker>
              ))}
          </MapView>
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
});

export default GymMap;
