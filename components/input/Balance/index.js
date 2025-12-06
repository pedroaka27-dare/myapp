import React from 'react';
import {View,Text,StyleSheet} from 'react-native';

export default function Balance({saldo, gastos}){
    return(
        <View style={styles.container}>

            <View style={styles.item}>
                <Text style={styles.itemTitle}>Crédito</Text>
                <View style={styles.content}>
                    <Text style={styles.currentSymbol}>R$</Text>
                    <Text style={styles.balance}>{saldo}</Text>
                </View>
            </View>

              <View style={styles.item}>
                <Text style={styles.itemTitle}>Débito</Text>
                <View style={styles.content}>
                    <Text style={styles.currentSymbol}>R$</Text>
                    <Text style={styles.expenses}>{gastos}</Text>
                </View>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container:{
        backgroundColor:"#FFF",
        flexDirection:'row',
        justifyContent:'space-between',
        paddingStart:20,
        paddingEnd:20,
        marginTop:-24,
        marginStart:14,
        marginEnd:14,
        borderRadius:24,
        paddingTop:20,
        paddingBottom:22,
        zIndex:99,
    },
    itemTitle:{
        fontSize: 20,
        color: '#000000ff',
    },
    content: {
        flexDirection:'row',
        alignItems:'center',


    },
    currentSymbol:{
        color: '#000000ff',
        marginRight: 6,
    },
    balance:{
        fontSize:22,
        color: '#2ecc71',
    },
    expenses:{
        fontSize:22,
        color: '#e74c3c',
    }

})