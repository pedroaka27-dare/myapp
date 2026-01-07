
import React, { useState } from "react";
import {View, Text, Image, TextInput, TouchableOpacity, Alert} from "react-native";
import { router } from 'expo-router';
import { styles } from "../../styles";
import CadastroModal from '../../components/CadastroModal';
import { initDatabase, addUsuario, getUsuarioByEmailSenha } from '../../services/database';

function Login() {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [modalVisible, setModalVisible] = useState(false);

  React.useEffect(() => { initDatabase(); }, []);

  const handleLogin = async () => {
    if (!email || !senha) {
      Alert.alert('Erro', 'Preencha e-mail e senha!');
      return;
    }
    const usuario = await getUsuarioByEmailSenha(email, senha);
    if (usuario) {
      router.replace('/(tabs)/HomePage');
    } else {
      Alert.alert('Erro', 'E-mail ou senha inválidos!');
    }
  };

  const handleCadastrar = async (dados) => {
    const success = await addUsuario(dados);
    if (success) {
      Alert.alert('Sucesso', 'Usuário cadastrado!');
    } else {
      Alert.alert('Erro', 'Não foi possível cadastrar. E-mail já existe?');
    }
  };

  return (
    <View style={styles.container}>
      <CadastroModal visible={modalVisible} onClose={() => setModalVisible(false)} onCadastrar={handleCadastrar} />
      <View style={styles.TopBox}>
        <Image source={require("../../assets/logo/cofrinho.png")}
        style={{width:256, height:256,}} />
        <Text style={styles.Title}> Bem vindo ! </Text>
      </View>
      <View style={styles.MiddleBox}>
        <Text style={styles.Text}>Email:</Text>
        <View style={styles.InputBox}>
           <TextInput style={styles.Input} value={email} onChangeText={setEmail} autoCapitalize="none" keyboardType="email-address" />
           <Image source={require('../../assets/email.png')} style={{width:29, height:29}} />
         </View>
         <Text style={styles.Text}>Senha:</Text>
         <View style={styles.InputBox}>
           <TextInput secureTextEntry={true} style={styles.Input} value={senha} onChangeText={setSenha} />
           <Image source={require('../../assets/eye.png')} style={{width:29, height:29}} />
         </View>
      </View>
      <View style={styles.BottomBox}>
        <TouchableOpacity onPress={handleLogin} style={styles.Button}>
          <Text style={styles.ButtonText}>Entrar</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setModalVisible(true)}>
          <Text> Não tem cadastro !? <Text style={styles.Link}> Clique aqui! </Text></Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
export default Login;