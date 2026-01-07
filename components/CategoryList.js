import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { getAllMovimentos } from '../services/database';

const COLORS = [
  '#4CAF50', // Verde
  '#2196F3', // Azul
  '#FFC100', // Amarelo
  '#E91E63', // Rosa
  '#FF9800', // Laranja
];

export default function CategoryList({ dataInicio, dataFim, movimentos = null }) {
  const [categorias, setCategorias] = useState([]);
  const [openIndex, setOpenIndex] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Usar movimentos prop se fornecido, senão buscar do banco
        let data = movimentos;
        if (!data) {
          data = await getAllMovimentos();
        }
        
        if (!Array.isArray(data) || data.length === 0) {
          setCategorias([]);
          return;
        }

        let filtered = data;
        
        // Filtrar por data se fornecido
        if (dataInicio && dataFim) {
          const parseDate = (str) => {
            const [d, m, y] = str.split('/');
            // Se ano tem 2 dígitos, assumir 20xx
            const fullYear = y.length === 2 ? `20${y}` : y;
            return new Date(fullYear, parseInt(m) - 1, parseInt(d));
          };
          
          try {
            const start = parseDate(dataInicio);
            const end = parseDate(dataFim);
            filtered = data.filter(mov => {
              if (!mov.date) return false;
              try {
                const movDate = parseDate(mov.date);
                return movDate >= start && movDate <= end;
              } catch {
                return false;
              }
            });
          } catch (err) {
            console.log('Erro ao filtrar datas:', err);
          }
        }

        // Agrupar por categoria (somente despesas)
        const catMap = {};
        const catItems = {};
        filtered.forEach(mov => {
          if (mov.type === 0 || mov.type === '0') {
            const categoria = mov.categoria || 'Sem categoria';
            if (!catMap[categoria]) {
              catMap[categoria] = 0;
              catItems[categoria] = [];
            }
            catMap[categoria] += parseFloat(mov.value) || 0;
            catItems[categoria].push(mov);
          }
        });

        const cats = Object.keys(catMap)
          .filter(cat => catMap[cat] > 0)
          .map((cat, idx) => ({
            name: cat,
            value: catMap[cat],
            items: catItems[cat],
            color: COLORS[idx % COLORS.length],
          }));
        
        setCategorias(cats);
      } catch (error) {
        console.error('Erro ao buscar categorias:', error);
      }
    };
    fetchData();
  }, [dataInicio, dataFim, movimentos]);

  return (
    <View style={styles.container}>
      {categorias.length === 0 ? (
        <Text style={styles.emptyText}>Nenhuma categoria encontrada</Text>
      ) : (
        categorias.map((cat, idx) => (
          <View key={`cat-${cat.name}-${cat.value}-${idx}`} style={styles.itemBox}>
            <TouchableOpacity
              style={[styles.catBtn, { backgroundColor: cat.color }]}
              onPress={() => setOpenIndex(openIndex === idx ? null : idx)}
            >
              <View style={styles.dot} />
              <Text style={styles.catText}>{cat.name} : R$ {cat.value.toFixed(2)}</Text>
            </TouchableOpacity>
            {openIndex === idx && (
              <View style={styles.menuBox}>
                <Text style={styles.menuTitle}>Itens da categoria:</Text>
                {cat.items.map((item, itemIdx) => (
                  <View key={`item-${item.id}-${itemIdx}`} style={styles.itemRow}>
                    <View style={styles.itemInfo}>
                      <Text style={styles.itemLabel}>{item.label}</Text>
                      <Text style={styles.itemDate}>{item.date}</Text>
                    </View>
                    <Text style={styles.itemValue}>R$ {parseFloat(item.value).toFixed(2)}</Text>
                  </View>
                ))}
                <TouchableOpacity style={styles.closeMenuBtn} onPress={() => setOpenIndex(null)}>
                  <Text style={styles.closeMenuText}>Recolher</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        ))
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 12,
    marginBottom: 24,
    paddingHorizontal: 8,
  },
  emptyText: {
    textAlign: 'center',
    fontSize: 14,
    color: '#999',
    marginVertical: 12,
  },
  itemBox: {
    marginBottom: 10,
  },
  catBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 16,
    paddingVertical: 10,
    paddingHorizontal: 12,
  },
  dot: {
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: '#fff',
    marginRight: 8,
    borderWidth: 2,
    borderColor: '#fff',
  },
  catText: {
    fontWeight: 'bold',
    fontSize: 15,
    color: '#fff',
  },
  menuBox: {
    backgroundColor: '#f7f7f7',
    borderRadius: 12,
    padding: 10,
    marginTop: 2,
    borderLeftWidth: 4,
    borderLeftColor: '#FFC100',
  },
  menuTitle: {
    fontWeight: 'bold',
    fontSize: 14,
    color: '#333',
    marginBottom: 8,
  },
  itemRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 10,
    marginBottom: 6,
    borderLeftWidth: 3,
    borderLeftColor: '#FFC100',
  },
  itemInfo: {
    flex: 1,
  },
  itemLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 2,
  },
  itemDate: {
    fontSize: 12,
    color: '#666',
  },
  itemValue: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#e74c3c',
    marginLeft: 8,
  },
  closeMenuBtn: {
    backgroundColor: '#FFC100',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 6,
    marginTop: 8,
    alignSelf: 'flex-end',
  },
  closeMenuText: {
    fontWeight: 'bold',
    fontSize: 14,
    color: '#000',
  },
});
