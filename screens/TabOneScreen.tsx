import { Component, useEffect, useState } from 'react';
import { StyleSheet, SectionList, StatusBar, SafeAreaView, FlatList, TouchableOpacity, TextInput, Button, Pressable, Platform, RefreshControl } from 'react-native';
import { render, renderSync, Value } from 'sass';

import { FontAwesome } from '@expo/vector-icons';
import useColorScheme from '../hooks/useColorScheme';
import Colors from '../constants/Colors';

import EditScreenInfo from '../components/EditScreenInfo';
import { Text, View } from '../components/Themed';
import Navigation from '../navigation';
import { RootTabScreenProps } from '../types';

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

const showToast = (type: string, text: string) => {
  Toast.show({
    type: type,
    text1: text,
    position: "bottom"
  });
}



export default function TabOneScreen({ route, navigation }: RootTabScreenProps<'TabOne'>) {
  const { update_success }:any = route?.params || {};
  useEffect(() => {
    db.transaction((tx) => {
      tx.executeSql("create table if not exists watch_list (id integer primary key autoincrement not null, title text, episode number)")
    }, (error) => {//Error callback
      showToast("error","Something went wrong")
    })
  }, [])

  function GetWatchList() {
    const [items, setItems]: any[] = useState([]);
    const [refreshing, setRefreshing] = useState(true);
    const colorScheme = useColorScheme();

    useEffect(() => {
      if (refreshing) {
        getData()
      }
      if (update_success === true) {
        setRefreshing(true)
      }
    }, [])

    function deleteRecord(id: number) {
      db.transaction((tx) => {
        tx.executeSql("delete from watch_list where id = ?", [id])
      }, (error) => {//Error callback
        showToast("error","Something went wrong")
      }, () => {
        getData()
      })
    }

    const Item = ({ title, episode, id }: any) => (

      <View style={styles.item}>
        <Text style={styles.header}>{title}</Text>
        <Text style={styles.title}>{episode}</Text>
        <View style={styles.buttonView}>
          <Pressable
            onPress={() => navigation.navigate("UpdateScreen",{id})}
            style={({ pressed }) => ({
              opacity: pressed ? 0.5 : 1,
            })}>
            <Text style={styles.updateText}>Update</Text>
          </Pressable>
          <Pressable
            onPress={() => deleteRecord(id)}
            style={({ pressed }) => ({
              opacity: pressed ? 0.5 : 1,
            })}>
            <Text style={styles.deleteText}>Delete</Text>
          </Pressable>
        </View>
      </View>
    );

    function getData() {
      db.transaction((tx) => {
        tx.executeSql("select * from watch_list", [],
          (_, { rows: { _array } }) => {
            // (_, { rows: { _array } }) => setItems(_array)
            setItems(_array)
            setRefreshing(false)
          }
        )
      }, (error) => {
        showToast("error","Something went wrong")
      })
    }

    if (items === null || items.length === 0) {
      return null
    }

    const renderItem = ({ item }: any) => <Item title={item.title} episode={item.episode} id={item.id} />;
    return (
      <FlatList data={items} renderItem={renderItem} keyExtractor={item => item.id.toString()} refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={getData} />
      } />
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <GetWatchList />
    </SafeAreaView>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: StatusBar.currentHeight,
    marginHorizontal: 16,
  },
  item: {
    backgroundColor: '#515A5A',
    padding: 20,
    marginVertical: 8,
    borderRadius: 5,

  },
  header: {
    fontSize: 32,
    color: "#fff"
  },
  title: {
    fontSize: 24,
  },
  updateText: {
    padding: 15,
    backgroundColor: "#2471A3",
    color: "#fff",
    borderRadius: 5,
    textAlign: 'center',
    width: 170,
    margin: 5
  },
  deleteText: {
    padding: 15,
    backgroundColor: "#CB4335",
    color: "#fff",
    borderRadius: 5,
    textAlign: 'center',
    width: 170,
    margin: 5,
  },
  buttonView: {
    flex: 1,
    flexDirection: 'row',
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: '#515A5A',
  }
});
