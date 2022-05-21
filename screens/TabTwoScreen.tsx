import { useEffect, useState } from 'react';
import { StyleSheet, StatusBar, TextInput, Button, Platform, Pressable } from 'react-native';

import EditScreenInfo from '../components/EditScreenInfo';
import { Text, View } from '../components/Themed';

import Toast from 'react-native-toast-message';

import * as SQLite from "expo-sqlite";
import React from 'react';

function openDatabase() {
  if (Platform.OS === "web") {
    return {
      transaction: () => {
        return {
          executeSql: () => { }
        }
      }
    }
  }

  const db = SQLite.openDatabase("db.db")
  return db
}
const db = openDatabase()

export default function TabTwoScreen({ navigation }: any) {
  const [title, setTitle] = useState("")
  const [episode, setEpisode] = useState("")
  // const forceUpdate: () => void = React.useState()[1].bind(null, {})

  function AddOnClick() {
    if (title === null || title === "" || episode === null || episode === "") {
      showToast("error", "Please fill in the blanks")
      return false;
    }
    //Add to the database
    db.transaction((tx) => {
      tx.executeSql("insert into watch_list (title, episode) values(?,?)", [title, parseInt(episode)])
    }, () => { //Error callback
      showToast("error", "Something went wrong")
    }, () => { //Success callback
      showToast("success", "Adding successful")
      setTitle("")
      setEpisode("")
      navigation.navigate("TabOne", { refresh: true })
    })
  }

  const showToast = (type: string, text: string) => {
    Toast.show({
      type: type,
      text1: text,
      position: "bottom"
    });
  }


  return (
    <View style={styles.container}>
      <Text style={styles.header}>Add</Text>
      <Text style={styles.title}>Title</Text>
      <TextInput style={styles.textInput} autoFocus defaultValue={title} onChangeText={(text: any) => { setTitle(text) }} ></TextInput>
      <Text style={styles.title}>Episode</Text>
      <TextInput style={styles.textInput} defaultValue={episode} onChangeText={(text: any) => { setEpisode(text) }} keyboardType="numeric"></TextInput>
      <Pressable onPress={AddOnClick}
        style={({ pressed }) => ({
          opacity: pressed ? 0.5 : 1,
        })}>
        <Text style={styles.addText}>Add</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: StatusBar.currentHeight,
    marginHorizontal: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: '80%',
  },
  header: {
    alignSelf: "center",
    fontSize: 32,
    // backgroundColor: '#fff',
    color: "#fff"
  },
  textInput: {
    color: "#fff",
    padding: 10,
    margin: 5,
    fontSize: 25,
    borderColor: "#fff",
    borderBottomWidth: 2,
    backgroundColor:"#424949",
    borderRadius:5
  },
  addText: {
    padding: 15,
    backgroundColor: "#2471A3",
    color: "#fff",
    borderRadius: 5,
    textAlign: 'center',
    marginTop: 20
  },
});
