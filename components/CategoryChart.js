import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { getAllMovimentos } from '../services/database';

const PRESET_COLORS = ['#4CAF50', '#2196F3', '#FFC100', '#E91E63', '#FF9800', '#9C27B0', '#00BCD4', '#CDDC39'];

export default function CategoryChart({ dataInicio, dataFim, movimentos = null }) {
  const [categorias, setCategorias] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Usar movimentos prop se fornecido, senão buscar do banco
        let data = movimentos;
        if (!data) {
          data = await getAllMovimentos();
        }
        
        console.log('CategoryChart - Dados carregados:', data?.length, 'movimentos');
        
        if (!Array.isArray(data) || data.length === 0) {
          console.log('Nenhum dado encontrado');
          setCategorias([]);
          setLoading(false);
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
            
            console.log('Filtrando entre', dataInicio, 'e', dataFim);
            console.log('Start:', start, 'End:', end);
            
            filtered = data.filter(mov => {
              if (!mov.date) {
                console.log('Movimento sem data:', mov);
                return false;
              }
              try {
                const movDate = parseDate(mov.date);
                const isInRange = movDate >= start && movDate <= end;
                if (!isInRange) {
                  console.log('Movimento fora do range:', mov.date, 'parseado como:', movDate);
                }
                return isInRange;
              } catch (e) {
                console.log('Erro ao parsear data do movimento:', mov.date, e);
                return false;
              }
            });
            
            console.log('Após filtro de data:', filtered.length, 'movimentos');
          } catch (err) {
            console.log('Erro ao filtrar datas:', err);
          }
        }

        // Agrupar por categoria (somente despesas - type === 0)
        const catMap = {};
        filtered.forEach(mov => {
          if (mov.type === 0 || mov.type === '0') {
            const categoria = mov.categoria || 'Sem categoria';
            if (!catMap[categoria]) catMap[categoria] = 0;
            catMap[categoria] += parseFloat(mov.value) || 0;
          }
        });

        const cats = Object.keys(catMap)
          .filter(cat => catMap[cat] > 0)
          .map((cat, idx) => ({
            name: cat,
            value: catMap[cat],
            color: PRESET_COLORS[idx % PRESET_COLORS.length],
          }));
        
        console.log('Categorias agrupadas:', cats);
        setCategorias(cats);
      } catch (error) {
        console.error('Erro ao buscar dados do gráfico:', error);
        setCategorias([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [dataInicio, dataFim, movimentos]);

  const total = categorias.reduce((sum, cat) => sum + cat.value, 0);

  if (loading) {
    return (
      <View style={styles.container}>
        <Text style={styles.loading}>Carregando gráfico...</Text>
      </View>
    );
  }

  if (categorias.length === 0) {
    return (
      <View style={styles.container}>
        <Text style={styles.emptyText}>Nenhuma despesa encontrada no período</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.chartWrapper}>
        {categorias.map((cat, idx) => {
          const percentage = total > 0 ? (cat.value / total) * 100 : 0;
          return (
            <View key={`bar-${cat.name}-${cat.value}-${idx}`} style={styles.barItem}>
              <Text style={styles.catName}>{cat.name}</Text>
              <View style={styles.barBackground}>
                <View
                  style={[
                    styles.barFill,
                    {
                      backgroundColor: cat.color,
                      width: `${percentage}%`,
                    },
                  ]}
                />
              </View>
              <Text style={styles.barValue}>R$ {cat.value.toFixed(2)}</Text>
            </View>
          );
        })}
      </View>
      <View style={styles.legend}>
        {categorias.map((cat, idx) => (
          <View key={`legend-${cat.name}-${cat.value}-${idx}`} style={styles.legendItem}>
            <View style={[styles.legendDot, { backgroundColor: cat.color }]} />
            <Text style={styles.legendText}>{cat.name}</Text>
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 12,
    paddingHorizontal: 12,
  },
  loading: {
    textAlign: 'center',
    marginVertical: 20,
    fontSize: 16,
    color: '#999',
  },
  emptyText: {
    textAlign: 'center',
    marginVertical: 20,
    fontSize: 16,
    color: '#999',
  },
  chartWrapper: {
    marginBottom: 12,
  },
  barItem: {
    marginBottom: 12,
  },
  catName: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 4,
    color: '#333',
  },
  barBackground: {
    height: 24,
    backgroundColor: '#e0e0e0',
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 4,
  },
  barFill: {
    height: '100%',
    borderRadius: 12,
  },
  barValue: {
    fontSize: 13,
    fontWeight: '600',
    color: '#666',
  },
  legend: {
    borderTopWidth: 1,
    borderTopColor: '#eee',
    paddingTop: 12,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  legendDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 8,
  },
  legendText: {
    fontSize: 13,
    color: '#666',
  },
});
