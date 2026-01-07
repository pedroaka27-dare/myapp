import React, { useState } from 'react';
import { Modal, View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';

export default function CadastroModal({ visible, onClose, onCadastrar }) {
  const [nome, setNome] = useState('');
  const [sobrenome, setSobrenome] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');

  const handleCadastrar = () => {
    if (!nome || !sobrenome || !email || !senha) return;
    onCadastrar({ nome, sobrenome, email, senha });
    setNome(''); setSobrenome(''); setEmail(''); setSenha('');
    onClose();
  };

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={styles.overlay}>
        <View style={styles.modal}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
            <Text style={styles.title}>Cadastro</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
              <Text style={{ color: 'white', fontWeight: 'bold' }}>✕</Text>
            </TouchableOpacity>
          </View>
          <Text style={styles.label}>Nome</Text>
          <TextInput style={styles.input} value={nome} onChangeText={setNome} />
          <Text style={styles.label}>Sobrenome</Text>
          <TextInput style={styles.input} value={sobrenome} onChangeText={setSobrenome} />
          <Text style={styles.label}>E-mail</Text>
          <TextInput style={styles.input} value={email} onChangeText={setEmail} keyboardType="email-address" autoCapitalize="none" />
          <Text style={styles.label}>Senha:</Text>
          <TextInput style={styles.input} value={senha} onChangeText={setSenha} secureTextEntry />
          <TouchableOpacity style={styles.cadastrarBtn} onPress={handleCadastrar}>
            <Text style={styles.cadastrarText}>Cadastrar</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modal: {
    backgroundColor: '#F7F7F7',
    borderRadius: 20,
    padding: 24,
    width: 300,
    elevation: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    alignSelf: 'center',
    flex: 1,
    marginBottom: 8,
  },
  closeBtn: {
    backgroundColor: 'red',
    borderRadius: 10,
    width: 24,
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 8,
  },
  label: {
    fontSize: 16,
    marginTop: 8,
    marginBottom: 2,
    fontWeight: '500',
  },
  input: {
    backgroundColor: '#FFC100',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 6,
    fontSize: 16,
    marginBottom: 4,
    fontWeight: 'bold',
  },
  cadastrarBtn: {
    backgroundColor: '#FFC100',
    borderRadius: 20,
    marginTop: 18,
    alignItems: 'center',
    paddingVertical: 10,
  },
  cadastrarText: {
    fontWeight: 'bold',
    fontSize: 20,
  },
});
