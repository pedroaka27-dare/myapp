import React from "react";
import {View, Text, Image, TextInput, TouchableOpacity} from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";

import { styles } from "./styles";
import HomePage from "../HomePage/HomePage";

const Tab=createBottomTabNavigator();

function MyTabs(){
  return(
    <Tab.Navigator>
      <Tab.Screen name="Login" component={Login}/>
      <Tab.Screen name='HomePage' component={HomePage}/>
    </Tab.Navigator>
  )
}


function Login(){
  return (
    <NavigationContainer>

    <View style={styles.container}>

      <View style={styles.TopBox}>
        <Image source={require("../../../assets/logo/cofrinho.png")}
        style={{width:256, height:256,}} />

        <Text style={styles.Title}> Bem vindo ! </Text>
      
      </View>

      <View style={styles.MiddleBox}>
        <Text style={styles.Text}>Email:</Text>
        <View style={styles.InputBox}>

           
           <TextInput style={styles.Input}/>
           <Image
           source={require('../../../assets/email.png')}
           style={{width:29, height:29}}
         />
         </View>
         
         <Text style={styles.Text}>Senha:</Text>
         <View style={styles.InputBox}>
         <TextInput secureTextEntry style={styles.Input}/>
      
         <Image
      source={require('../../../assets/eye.png')}
      style={{width:29, height:29}}
         />
         </View>
    
      </View>

      <View style={styles.BottomBox}>

      <TouchableOpacity
      onPress={()=> HomePage}
      style={styles.Button}>
        <Text style={styles.ButtonText}>Entrar</Text>

      </TouchableOpacity>

        <TouchableOpacity>
          <Text > Não tem cadastro !? <Text style={styles.Link} > Clique aqui! </Text></Text>
        </TouchableOpacity>

      </View>
      
    </View>
    </NavigationContainer>
  )
}
export default Login;