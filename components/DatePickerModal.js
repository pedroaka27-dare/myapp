import React, { useState, useEffect } from 'react';
import { Modal, View, Text, TextInput, TouchableOpacity, StyleSheet, KeyboardAvoidingView } from 'react-native';
import { validateDay, validateMonth, validateYear, formatDateParts } from '../utils/dateHelper';

export default function DatePickerModal({ visible, onClose, onConfirm, title, initialDate = '01/01/25' }) {
  const [day, setDay] = useState('01');
  const [month, setMonth] = useState('01');
  const [year, setYear] = useState('25');

  // Atualizar valores iniciais quando modal abrir
  useEffect(() => {
    if (visible && initialDate) {
      const parts = initialDate.split('/');
      if (parts.length === 3) {
        setDay(parts[0] || '01');
        setMonth(parts[1] || '01');
        setYear(parts[2] || '25');
      }
    }
  }, [visible, initialDate]);

  const handleConfirm = () => {
    const d = day.length === 1 ? `0${day}` : day;
    const m = month.length === 1 ? `0${month}` : month;
    const y = year.length === 1 ? `0${year}` : year;
    const formattedDate = `${d}/${m}/${y}`;
    onConfirm(formattedDate);
    onClose();
  };

  const handleDayChange = (text) => {
    const validated = validateDay(text);
    setDay(validated);
  };

  const handleMonthChange = (text) => {
    const validated = validateMonth(text);
    setMonth(validated);
  };

  const handleYearChange = (text) => {
    const validated = validateYear(text);
    setYear(validated);
  };

  return (
    <Modal visible={visible} transparent animationType="fade">
      <KeyboardAvoidingView style={styles.overlay} behavior="padding">
        <View style={styles.modal}>
          <Text style={styles.title}>{title}</Text>
          
          <View style={styles.dateInputRow}>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Dia</Text>
              <TextInput
                style={styles.input}
                value={day}
                onChangeText={handleDayChange}
                keyboardType="number-pad"
                maxLength={2}
                placeholder="01"
              />
            </View>
            
            <Text style={styles.separator}>/</Text>
            
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Mês</Text>
              <TextInput
                style={styles.input}
                value={month}
                onChangeText={handleMonthChange}
                keyboardType="number-pad"
                maxLength={2}
                placeholder="01"
              />
            </View>
            
            <Text style={styles.separator}>/</Text>
            
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Ano</Text>
              <TextInput
                style={styles.input}
                value={year}
                onChangeText={handleYearChange}
                keyboardType="number-pad"
                maxLength={2}
                placeholder="25"
              />
            </View>
          </View>

          <View style={styles.buttonRow}>
            <TouchableOpacity style={[styles.btn, styles.cancelBtn]} onPress={onClose}>
              <Text style={styles.cancelText}>Cancelar</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.btn, styles.confirmBtn]} onPress={handleConfirm}>
              <Text style={styles.confirmText}>Confirmar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modal: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    width: '80%',
    elevation: 10,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  dateInputRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'flex-end',
    marginBottom: 20,
  },
  inputGroup: {
    alignItems: 'center',
    marginHorizontal: 6,
  },
  label: {
    fontSize: 12,
    fontWeight: '600',
    marginBottom: 4,
    color: '#666',
  },
  input: {
    width: 50,
    borderBottomWidth: 2,
    borderBottomColor: '#FFC100',
    paddingVertical: 6,
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  separator: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 2,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  btn: {
    flex: 1,
    borderRadius: 12,
    paddingVertical: 10,
    marginHorizontal: 6,
    alignItems: 'center',
  },
  cancelBtn: {
    backgroundColor: '#e0e0e0',
  },
  cancelText: {
    fontWeight: 'bold',
    fontSize: 16,
    color: '#666',
  },
  confirmBtn: {
    backgroundColor: '#FFC100',
  },
  confirmText: {
    fontWeight: 'bold',
    fontSize: 16,
    color: '#000',
  },
});
