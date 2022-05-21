import { TabRouter } from "@react-navigation/native";
import { View, Text } from "../components/Themed";
import { Platform, Pressable, StatusBar, StyleSheet, TextInput } from 'react-native';
import Navigation from "../navigation";
import { RootStackParamList, RootTabScreenProps } from "../types";
import React, { useEffect, useState } from "react";
import * as SQLite from "expo-sqlite";
import Toast from "react-native-toast-message";
import { render, Value } from "sass";


const showToast = (type: string, text: string) => {
    Toast.show({
        type: type,
        text1: text,
        position: "bottom"
    });
}

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

export default function ModalScreen({ route, navigation }: any) {
    const { id } = route.params;
    const [item, setItem] = useState({ id: null, title: "", episode: null });
    const [tempItem, setTempItem]:any = useState({ id: null, title: "", episode: null });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        getData()
    }, [])

    function getData() {
        db.transaction((tx) => {
            tx.executeSql("select * from watch_list where id = ?", [id], (trans, result) => {
                result.rows._array.forEach(element => {
                    setItem(element)
                    setTempItem(element)
                    setLoading(false)
                });
            })
        }, () => {
            showToast("error", "Something went wrong")
        })
    }



    function update() {
        db.transaction((tx) => {
            if (tempItem.title !== item.title ||tempItem.episode !== item.episode ) {
                if (tempItem.title === "" ||tempItem.title === null || tempItem.episode === "" || tempItem.episode === null) {
                    showToast("error", "Please fill in the blanks")
                    return null
                }
                tx.executeSql("update watch_list set title = ?, episode = ? where id = ?", [tempItem.title, tempItem.episode, id], () => {
                    showToast("success", "Success")
                    navigation.navigate("TabOne", {update_success:true})
                })
            } else {
                showToast("error", "There're no change in data")
            }
        }, (error) => {
            showToast("error", "Something went wrong")
        })
    }


    if (loading) {
        return <Text>Something went wrong</Text>
    }
    return (
        <View style={styles.container}>
            <Text style={styles.header}>Update</Text>
            <Text style={styles.title}>Title</Text>
            <TextInput style={styles.textInput} autoFocus defaultValue={item.title} onChangeText={(text: any) => { setTempItem({title:text,episode:tempItem.episode}) }} ></TextInput>
            <Text style={styles.title}>Episode</Text>
            <TextInput style={styles.textInput} defaultValue={item.episode.toString()} onChangeText={(text: any) => { setTempItem({title:tempItem.title ,episode:text}) }} keyboardType="numeric"></TextInput>
            <Pressable
                onPress={update}
                style={({ pressed }) => ({
                    opacity: pressed ? 0.5 : 1,
                })}>
                <Text style={styles.addText}>Update</Text>
            </Pressable>

            <Pressable
                onPress={() => { navigation.navigate("TabOne") }}
                style={({ pressed }) => ({
                    opacity: pressed ? 0.5 : 1,
                })}>
                <Text style={styles.cancelText}>Cancel</Text>
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
        backgroundColor: "#424949",
        borderRadius: 5
    },
    addText: {
        padding: 15,
        backgroundColor: "#2471A3",
        color: "#fff",
        borderRadius: 5,
        textAlign: 'center',
        marginTop: 20
    },
    cancelText: {
        padding: 15,
        backgroundColor: "#CB4335",
        color: "#fff",
        borderRadius: 5,
        textAlign: 'center',
        marginTop: 20
    },
});