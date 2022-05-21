import { Link } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import { Platform, Pressable, StyleSheet } from 'react-native';

import EditScreenInfo from '../components/EditScreenInfo';
import { Text, View } from '../components/Themed';

import { Linking } from 'react-native'
import { useEffect } from 'react';
import { Header } from 'react-native/Libraries/NewAppScreen';

export default function ModalScreen(route, navigation) {
  
  return (
    <View style={styles.container}>
      <Text style={styles.header}>About Me</Text>
      <Text style={styles.separator}></Text>
      <Text style={styles.title}>Oğuzhan Aydınay</Text>
      <Text style={styles.title}>A developer who loves create </Text>
      <Text style={styles.title}>new things. Also see my website </Text>
      <Pressable onPress={() => { Linking.openURL('https://aydinayoguzhan.com') }}
        style={({ pressed }) => ({
          opacity: pressed ? 0.5 : 1,
        })}>
        <Text style={styles.websiteButton}>website</Text>
      </Pressable>
      <StatusBar style={Platform.OS === 'ios' ? 'light' : 'auto'} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    // justifyContent: 'center',
  },
  title: {
    fontSize: 20,
    backgroundColor:"#424949",
    borderRadius:5
    // fontWeight: 'bold',
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: '80%',
  },
  header: {
    alignSelf: "center",
    fontSize: 35,
    color: "#fff",
    fontWeight: "bold",
    margin: 10
  },
  websiteButton: {
    padding: 15,
    backgroundColor: "#2471A3",
    color: "#fff",
    borderRadius: 5,
    textAlign: 'center',
    width: 170,
    margin: 70,
  }
});
