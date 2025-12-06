import React from 'react';
import { View, Text, Image, TouchableOpacity,FlatList } from 'react-native';

import { styles } from "./styles";
import Balance from '../../../components/input/Balance';
import Header from '../../../components/input/Header';
import Movements from '../../../components/input/Movements';

const list= [{
  id:1,
  label:'Boleto conta luz',
  value: '300,50',
  date: '17/02/2022',
  type: 0//despesas
},
{
  id:2,
  label: 'Pix Cliente X',
  value: '2.500,00',
  date: '18/02/2022',
  type:1 //receita/entradas
},
{
  id:3,
  label: 'Salário',
  value: '7.200,00',
  date: '19/02/2022',
  type: 1 //receita//entrada
},


]


export default function HomePage() {
  return (
    <View style={styles.container}>

      <Header></Header>

      <View style={styles.MiddleBox}>

        <Balance saldo={'1000'} gastos={'500'} ></Balance>

                <Text style={styles.Title}> Ultimas movimentações</Text>
                       <FlatList 
                            style={styles.list} 
                            data={list} 
                            keyExtractor={(item)=> String(item.id)} 
                            showsVerticalScrollIndicator={false}
                            renderItem={({item}) => <Movements data={item}/>}
                            />
 
      </View>
    </View>
  );
}
