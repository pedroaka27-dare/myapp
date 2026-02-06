import React, { useState, useContext, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import Button from '../../../components/input/Button';
import CategoryChart from '../../../components/CategoryChart';
import CategoryList from '../../../components/CategoryList';
import DatePickerModal from '../../../components/DatePickerModal';
import { MovementContext } from '../../../context/MovementContext';
import { getAllMovimentos } from '../../../services/database';

export default function Dashbord() {
  const [dataInicio, setDataInicio] = useState('01/01/20');
  const [dataFim, setDataFim] = useState('31/12/99');
  const [showDatePickerInicio, setShowDatePickerInicio] = useState(false);
  const [showDatePickerFim, setShowDatePickerFim] = useState(false);
  const [movimentos, setMovimentos] = useState([]);

  const { movements, addMovement } = useContext(MovementContext);

  // Carregar movimentos ao montar e quando o context mudar
  useEffect(() => {
    const loadMovimentos = async () => {
      try {
        const data = await getAllMovimentos();
        setMovimentos(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error('Erro ao carregar movimentos:', error);
      }
    };
    loadMovimentos();
  }, []);

  // Sincronizar quando movimentos são adicionados ou removidos no context
  useEffect(() => {
    // Recarregar dados quando houver mudanças no context
    const loadMovimentos = async () => {
      try {
        const data = await getAllMovimentos();
        setMovimentos(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error('Erro ao carregar movimentos:', error);
      }
    };
    if (movements.length >= 0) {
      loadMovimentos();
    }
  }, [movements]);
  const handleConfirmDataInicio = (date) => {
    setDataInicio(date);
  };

  const handleConfirmDataFim = (date) => {
    setDataFim(date);
  };

  const handleAddMovimento = (novoMovimento) => {
    // Adicionar ao context para sincronizar com HomePage
    addMovement(novoMovimento);
    // Adicionar à lista local
    setMovimentos([novoMovimento, ...movimentos]);
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <Text style={styles.title}>Despesas</Text>
      
      <DatePickerModal
        visible={showDatePickerInicio}
        onClose={() => setShowDatePickerInicio(false)}
        onConfirm={handleConfirmDataInicio}
        title="Data Inicial"
        initialDate={dataInicio}
      />
      
      <DatePickerModal
        visible={showDatePickerFim}
        onClose={() => setShowDatePickerFim(false)}
        onConfirm={handleConfirmDataFim}
        title="Data Final"
        initialDate={dataFim}
      />

      <View style={styles.dateRow}>
        <View style={styles.dateBox}>
          <Text style={styles.dateLabel}>Data inicial:</Text>
          <TouchableOpacity style={styles.dateBtn} onPress={() => setShowDatePickerInicio(true)}>
            <Text style={styles.dateBtnText}>{dataInicio}</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.dateBox}>
          <Text style={styles.dateLabel}>Data Final:</Text>
          <TouchableOpacity style={styles.dateBtn} onPress={() => setShowDatePickerFim(true)}>
            <Text style={styles.dateBtnText}>{dataFim}</Text>
          </TouchableOpacity>
        </View>
      </View>

      <CategoryChart dataInicio={dataInicio} dataFim={dataFim} movimentos={movimentos} />
      <CategoryList dataInicio={dataInicio} dataFim={dataFim} movimentos={movimentos} />


    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingTop: 24,
    paddingHorizontal: 8,
    paddingBottom: 24,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 8,
    fontFamily: 'Inter',
  },
  dateRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 12,
    paddingHorizontal: 12,
  },
  dateBox: {
    alignItems: 'center',
  },
  dateLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 2,
  },
  dateBtn: {
    backgroundColor: '#FFC100',
    borderRadius: 16,
    paddingHorizontal: 18,
    paddingVertical: 6,
  },
  dateBtnText: {
    fontWeight: 'bold',
    fontSize: 16,
  },
  bottomBox: {
    alignItems: 'center',
    paddingVertical: 24,
  },
});
