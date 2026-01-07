import React, { useMemo } from 'react';
import {View,Text,StyleSheet} from 'react-native';

export default function Balance({saldo, gastos, movimentos = []}){
    // Calcular créditos e débitos baseado na lista de movimentos
    const { totalCreditos, totalDebitos } = useMemo(() => {
        let creditos = 0;
        let debitos = 0;

        movimentos.forEach(item => {
            const valor = parseFloat(item.value) || 0;
            if (item.type === 1) {
                // Crédito
                creditos += valor;
            } else if (item.type === 0) {
                // Débito
                debitos += valor;
            }
        });

        return {
            totalCreditos: creditos.toFixed(2),
            totalDebitos: debitos.toFixed(2),
        };
    }, [movimentos]);

    return(
        <View style={styles.container}>

            <View style={styles.item}>
                <Text style={styles.itemTitle}>Crédito</Text>
                <View style={styles.content}>
                    <Text style={styles.currentSymbol}>R$</Text>
                    <Text style={styles.balance}>{totalCreditos}</Text>
                </View>
            </View>

              <View style={styles.item}>
                <Text style={styles.itemTitle}>Débito</Text>
                <View style={styles.content}>
                    <Text style={styles.currentSymbol}>R$</Text>
                    <Text style={styles.expenses}>{totalDebitos}</Text>
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
        flexShrink: 1,
    },
    currentSymbol:{
        color: '#000000ff',
        marginRight: 6,
        flexShrink: 0,
    },
    balance:{
        fontSize:22,
        color: '#2ecc71',
        flexShrink: 0,
    },
    expenses:{
        fontSize:22,
        color: '#e74c3c',
        flexShrink: 0,
    }

})