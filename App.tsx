import React, {useState, useEffect} from 'react';
import {
  SafeAreaView,
  StyleSheet,
  ScrollView,
  View,
  Text,
  StatusBar,
  Button,
} from 'react-native';

import {TouchableOpacity} from 'react-native';

import {Colors} from 'react-native/Libraries/NewAppScreen';
import AppleHealthKit, {
  HealthValue,
  HealthKitPermissions,
} from 'react-native-health';

import {NativeEventEmitter, NativeModules} from 'react-native';

/* Permission options */
const permissions = {
  permissions: {
    read: [AppleHealthKit.Constants.Permissions.HeartRate],
    write: [AppleHealthKit.Constants.Permissions.Steps],
  },
} as HealthKitPermissions;

AppleHealthKit.initHealthKit(permissions, (error: string) => {
  /* Called after we receive a response from the system */

  if (error) {
    console.log('[ERROR] Cannot grant permissions!');
  }

  /* Can now read or write to HealthKit */

  const options = {
    startDate: new Date(2020, 1, 1).toISOString(),
  };

  AppleHealthKit.getHeartRateSamples(
    options,
    (callbackError: string, results: HealthValue[]) => {
      /* Samples are now collected from HealthKit */
    },
  );
});

export default function App() {
  const [heartRateSamples, setHeartRateSamples] = useState<HealthValue[]>([]);
  const [heartRateValues, setHeartRateValues] = useState<number[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    const permissions = {
      permissions: {
        read: [
          AppleHealthKit.Constants.Permissions.HeartRate,
          AppleHealthKit.Constants.Permissions.ActiveEnergyBurned,
        ],
        write: [AppleHealthKit.Constants.Permissions.Steps],
      },
    } as HealthKitPermissions;

    AppleHealthKit.initHealthKit(permissions, (error: string) => {
      if (error) {
        console.log('[ERROR] Cannot grant permissions!');
      }
    });
  }, []);

  const handlePressGetHeartRate = () => {
    setRefreshing(true);

    const options = {
      startDate: new Date(2020, 1, 1).toISOString(),
    };

    AppleHealthKit.getHeartRateSamples(
      options,
      (callbackError: string, results: HealthValue[]) => {
        if (callbackError) {
          console.error(callbackError);
          return;
        }
        if (results.length > 0) {
          const newHeartRateValues = results.map(sample => sample.value);
          setHeartRateValues(newHeartRateValues);
        } else {
          setHeartRateValues([]);
        }

        setRefreshing(false);
      },
    );
  };

  return (
    <>
      <StatusBar barStyle="dark-content" />
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Heart rate values</Text>
        </View>
        <ScrollView
          contentContainerStyle={styles.contentContainer}
          style={styles.scrollView}>
          {refreshing && <Text style={styles.loadingText}></Text>}
          <View style={styles.listContainer}>
            {heartRateValues.map((value, index) => (
              <Text style={styles.heartRateValue} key={index}>
                {value} bpm
              </Text>
            ))}
          </View>
        </ScrollView>
        <TouchableOpacity
          style={styles.refreshButton}
          onPress={handlePressGetHeartRate}
          disabled={refreshing}>
          <Text style={styles.buttonText}>Refresh</Text>
        </TouchableOpacity>
      </SafeAreaView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  header: {
    paddingHorizontal: 24,
    paddingTop: 32,
  },
  title: {
    fontSize: 24,
    fontWeight: '600',
    color: 'black',
  },
  scrollView: {
    backgroundColor: 'white',
  },
  contentContainer: {
    paddingVertical: 16,
  },
  listContainer: {
    paddingHorizontal: 24,
  },
  heartRateValue: {
    fontSize: 20,
    fontWeight: '600',
    color: 'black',
    marginBottom: 16,
  },
  refreshButton: {
    backgroundColor: '#2196F3',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    marginHorizontal: 24,
    marginBottom: 16,
    alignSelf: 'center',
  },
  buttonText: {
    fontSize: 18,
    fontWeight: '600',
    color: 'white',
  },
  loadingText: {
    fontSize: 18,
    fontWeight: '600',
    color: 'black',
    alignSelf: 'center',
    marginBottom: 16,
  },
});
