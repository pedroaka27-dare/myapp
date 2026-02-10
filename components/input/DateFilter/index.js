import React, { useState, useMemo } from 'react';
import { View, Text, StyleSheet, TextInput, Pressable } from 'react-native';
import { parseDate, handleDateInput } from '../../../utils/dateHelper';

export default function DateFilter({ movimentos = [], onFilter }) {
    const [dataInicio, setDataInicio] = useState('');
    const [dataFim, setDataFim] = useState('');

    // Usar util compartilhado para formatar entrada de data

    // Converter data DD/MM/YYYY para objeto Date para comparação
    const customParseDate = parseDate;

    // Filtrar apenas por data
    const filteredMovimentos = useMemo(() => {
        if (!dataInicio || !dataFim || dataInicio.length !== 10 || dataFim.length !== 10) {
            return [];
        }

        const inicio = customParseDate(dataInicio);
        const fim = customParseDate(dataFim);

        if (!inicio || !fim) {
            return [];
        }

        return movimentos.filter(item => {
            const itemDate = customParseDate(item.date);
            return itemDate && itemDate >= inicio && itemDate <= fim;
        });
    }, [movimentos, dataInicio, dataFim]);

    // Calcular créditos e débitos do período filtrado
    const { creditos, debitos } = useMemo(() => {
        let totalCreditos = 0;
        let totalDebitos = 0;

        filteredMovimentos.forEach(item => {
            const valor = parseFloat(item.value) || 0;
            if (item.type === 1) {
                totalCreditos += valor;
            } else if (item.type === 0) {
                totalDebitos += valor;
            }
        });

        return {
            creditos: totalCreditos.toFixed(2),
            debitos: totalDebitos.toFixed(2),
        };
    }, [filteredMovimentos]);

    const handleAplicarFiltro = () => {

        if (!dataInicio || !dataFim) {
            alert('Preencha ambas as datas');
            return;
        }

        const inicio = customParseDate(dataInicio);
        const fim = customParseDate(dataFim);

        if (!(inicio instanceof Date) || isNaN(inicio.getTime()) || !(fim instanceof Date) || isNaN(fim.getTime())) {
            alert('Datas inválidas');
            return;
        }

        const resultado = movimentos.filter(item => {
            const itemDate = customParseDate(item.date);
            return itemDate && itemDate >= inicio && itemDate <= fim;
        });

        if (onFilter) onFilter(resultado);
    };

    const handleLimparFiltro = () => {
        setDataInicio('');
        setDataFim('');
        if (onFilter) {
            onFilter(null);
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Filtro por Data</Text>

            <View style={styles.inputsRow}>
                <View style={styles.inputGroup}>
                    <Text style={styles.label}>De:</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="DD/MM/YYYY"
                        value={dataInicio}
                        onChangeText={(text) => setDataInicio(handleDateInput(text))}
                        placeholderTextColor="#999"
                        keyboardType="number-pad"
                        maxLength={10}
                    />
                </View>

                <View style={styles.inputGroup}>
                    <Text style={styles.label}>Até:</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="DD/MM/YYYY"
                        value={dataFim}
                        onChangeText={(text) => setDataFim(handleDateInput(text))}
                        placeholderTextColor="#999"
                        keyboardType="number-pad"
                        maxLength={10}
                    />
                </View>
            </View>

            <View style={styles.buttonsRow}>
                <Pressable
                    style={[styles.button, styles.buttonAplicar]}
                    onPress={handleAplicarFiltro}
                >
                    <Text style={styles.buttonText}>Aplicar</Text>
                </Pressable>
                <Pressable
                    style={[styles.button, styles.buttonLimpar]}
                    onPress={handleLimparFiltro}
                >
                    <Text style={styles.buttonText}>Limpar</Text>
                </Pressable>
            </View>


        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#FFFFFF',
        borderRadius: 16,
        padding: 15,
        marginHorizontal: 14,
        marginVertical: 15,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 1,
        },
        shadowOpacity: 0.1,
        shadowRadius: 3,
        elevation: 2,
    },
    title: {
        fontSize: 16,
        fontWeight: '700',
        color: '#000000',
        marginBottom: 12,
    },
    inputsRow: {
        flexDirection: 'row',
        gap: 10,
        marginBottom: 12,
    },
    inputGroup: {
        flex: 1,
    },
    label: {
        fontSize: 12,
        fontWeight: '600',
        color: '#000000',
        marginBottom: 4,
    },
    input: {
        height: 44,
        backgroundColor: '#FFC100',
        borderRadius: 12,
        paddingHorizontal: 12,
        paddingVertical: 10,
        fontSize: 13,
        color: '#000000',
        borderWidth: 1,
        borderColor: '#FFB700',
    },
    buttonsRow: {
        flexDirection: 'row',
        gap: 10,
    },
    button: {
        flex: 1,
        borderRadius: 12,
        paddingVertical: 10,
        alignItems: 'center',
        borderWidth: 2,
    },
    buttonAplicar: {
        backgroundColor: '#FFC100',
        borderColor: '#000000',
    },
    buttonLimpar: {
        backgroundColor: '#FFFFFF',
        borderColor: '#000000',
    },
    buttonText: {
        color: '#000000',
        fontWeight: '700',
        fontSize: 13,
    },
    resultContainer: {
        backgroundColor: '#F5F5F5',
        borderRadius: 12,
        padding: 12,
        marginTop: 12,
        borderWidth: 1,
        borderColor: '#E0E0E0',
    },
    resultTitle: {
        fontSize: 13,
        fontWeight: '600',
        color: '#666666',
        marginBottom: 10,
    },
    resultRow: {
        flexDirection: 'row',
        gap: 10,
        marginBottom: 10,
    },
    resultItem: {
        flex: 1,
        backgroundColor: '#FFFFFF',
        borderRadius: 10,
        padding: 10,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#E0E0E0',
    },
    resultLabel: {
        fontSize: 12,
        fontWeight: '600',
        color: '#666666',
        marginBottom: 4,
    },
    resultCredito: {
        fontSize: 16,
        fontWeight: '700',
        color: '#2ecc71',
    },
    resultDebito: {
        fontSize: 16,
        fontWeight: '700',
        color: '#e74c3c',
    },
    resultCount: {
        fontSize: 12,
        color: '#999999',
        textAlign: 'center',
    },
});
