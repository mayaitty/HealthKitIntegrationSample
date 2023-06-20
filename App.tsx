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
  const [heartRate, setHeartRate] = useState<number | null>(null);
  const [activeCalories, setActiveCalories] = useState<number | null>(null);

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
          const latestHeartRate = results[0].value;
          setHeartRate(latestHeartRate);
        }
      },
    );
  };

  const handlePressGetActiveCalories = () => {
    const options = {
      startDate: new Date(2021, 0, 0).toISOString(),
    };

    AppleHealthKit.getActiveEnergyBurned(
      options,
      (err: string, results: HealthValue[]) => {
        if (err) {
          console.error(err);
          return;
        }
        if (results.length > 0) {
          setActiveCalories(results[0].value);
        } else {
          setActiveCalories(null);
        }
      },
    );
  };

  return (
    <>
      <StatusBar barStyle="dark-content" />
      <SafeAreaView style={styles.container}>
        <ScrollView
          contentInsetAdjustmentBehavior="automatic"
          style={styles.scrollView}>
          <View style={styles.body}>
            <View style={styles.sectionContainer}>
              <Text style={styles.sectionTitle}>
                Apple HealthKit Integration
              </Text>
              <TouchableOpacity
                style={styles.button}
                onPress={handlePressGetHeartRate}>
                <Text style={styles.buttonText}>Heart Rate</Text>
              </TouchableOpacity>
              {heartRate !== null && (
                <Text style={styles.dataText}>{heartRate} bpm</Text>
              )}
              <TouchableOpacity
                style={styles.button}
                onPress={handlePressGetActiveCalories}>
                <Text style={styles.buttonText}>Active Calories Burned</Text>
              </TouchableOpacity>
              {activeCalories !== null && (
                <Text style={styles.dataText}>{activeCalories} kcal</Text>
              )}
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  scrollView: {
    backgroundColor: 'lightgray',
  },
  body: {
    backgroundColor: 'white',
  },
  sectionContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
    color: 'black',
    marginBottom: 16,
  },
  button: {
    backgroundColor: '#2196F3',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    marginBottom: 16,
  },
  buttonText: {
    fontSize: 18,
    fontWeight: '600',
    color: 'white',
  },
  dataText: {
    fontSize: 20,
    fontWeight: '600',
    color: 'black',
  },
});
