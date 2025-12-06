import React, { useEffect } from "react";
import {View, Text, Image, TextInput, TouchableOpacity} from "react-native";
import { Link,router} from 'expo-router';


import { styles } from "../../styles";


function handleLogin(){
   router.replace('/(tabs)/HomePage')
}


function Login({}){
  

  return (

    <View style={styles.container}>

      <View style={styles.TopBox}>
        <Image source={require("../../assets/logo/cofrinho.png")}
        style={{width:256, height:256,}} />

        <Text style={styles.Title}> Bem vindo ! </Text>
      
      </View>

      <View style={styles.MiddleBox}>
        <Text style={styles.Text}>Email:</Text>
        <View style={styles.InputBox}>

           
           <TextInput style={styles.Input}/>
           <Image
           source={require('../../assets/email.png')}
           style={{width:29, height:29}}
         />
         </View>
         
         <Text style={styles.Text}>Senha:</Text>
         <View style={styles.InputBox}>
         <TextInput secureTextEntry={true} style={styles.Input}/>
      
         <Image
      source={require('../../assets/eye.png')}
      style={{width:29, height:29}}
         />
         </View>
    
      </View>

      <View style={styles.BottomBox}>

      <TouchableOpacity onPress={handleLogin}
      style={styles.Button}>
        <Text style={styles.ButtonText}>Entrar</Text>

      </TouchableOpacity>

        <TouchableOpacity>
          <Text > Não tem cadastro !? <Text style={styles.Link} > Clique aqui! </Text></Text>
        </TouchableOpacity>

      </View>
      
    </View>
  )
}
export default Login;