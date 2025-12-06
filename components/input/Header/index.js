import React from "react"
import{ View, StyleSheet, Text, StatusBar, TouchableOpacity} from "react-native"
import {Feather} from '@expo/vector-icons'

export default function Header({name}){
    return(
        <View style = {styles.container}>
            <View style={styles.content}>
                <Text style={styles.username}>Olá, Pedro Cruz{name}</Text>
                <TouchableOpacity activeOpacity={0.6} style={styles.buttonUser}>
                    <Feather name="user" size={27} color="#000000ff"/>
                </TouchableOpacity>
            </View>
        </View>
    )
}

const statusBarHeight = StatusBar.currentHeight ? StatusBar.currentHeight +44: 64;

const styles= StyleSheet.create({
    container:{
        backgroundColor:"#FCC100",
        paddingTop: statusBarHeight,
        flexDirection:"row",
        paddingStart:16,
        paddingEnd: 16,
        paddingBottom:44,
    },
    content:{
        flex:1,
        alignItems:"center",
        flexDirection:'row',
        justifyContent:'space-between'
    },
    username:{
        flex:1,
        fontSize:18,
        color:'#000000ff',
        fontWeight:'bold',
    },
    buttonUser:{
        width:44,
        height:44,
        backgroundColor:"#ffffffaf",
        justifyContent:'center',
        alignItems:'center',
        borderRadius:44/2
    }
})