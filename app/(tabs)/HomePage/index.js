import React, { useState, useEffect, useContext } from 'react';
import { View, Text, Image, TouchableOpacity, FlatList, TextInput } from 'react-native';
import { parseDate } from '../../../utils/dateHelper';
import { router } from 'expo-router';
import UserMenu from '../../../components/UserMenu';
import { MovementContext } from '../../../context/MovementContext';

import { styles } from "./_styles";
import Balance from '../../../components/input/Balance';
import Header from '../../../components/input/Header';
import Movements from '../../../components/input/Movements';
import Button from '../../../components/input/Button';
import DateFilter from '../../../components/input/DateFilter';
import { initDatabase, getAllMovimentos, addMovimento, updateMovimento, deleteMovimento } from '../../../services/database';

const initialList = [];



export default function HomePage() {
  const [list, setList] = useState(initialList);
  const [filteredList, setFilteredList] = useState([]);
  const [filterActive, setFilterActive] = useState(false);
  const [displayedItems, setDisplayedItems] = useState(5);
  const [searchTerm, setSearchTerm] = useState('');
  const [menuVisible, setMenuVisible] = useState(false);
  const { movements, addMovement, updateMovement, deleteMovement: deleteMovementContext } = useContext(MovementContext);
  const ITEMS_PER_PAGE = 5;

  const loadMovs = async () => {
    const movimentos = await getAllMovimentos();
    setList(movimentos);
    return movimentos;
  };

  // Inicializar banco de dados ao montar o componente
  useEffect(() => {
    initDatabase().then(loadMovs);
  }, []);

  const handleAddMovimento = async (novoMovimento) => {
    console.log('HomePage - handleAddMovimento chamado com:', novoMovimento);
    // Adicionar ao banco de dados e obter o movimento com id garantido
    const saved = await addMovimento(novoMovimento);
    console.log('HomePage - Retorno do banco:', saved);
    if (saved?.duplicate) {
      alert('Já existe uma movimentação com este nome. Escolha outro.');
      return { duplicate: true };
    }
    if (saved) {
      addMovement(saved);
      await loadMovs();
      setDisplayedItems(ITEMS_PER_PAGE);
    }
    return saved;
  };

  const handleUpdateMovimento = async (id, updatedData) => {
    if (await updateMovimento(id, updatedData)) {
      updateMovement(id, updatedData);
      await loadMovs();
    }
  };

  const handleDeleteMovimento = async (id) => {
    if (await deleteMovimento(id)) {
      deleteMovementContext(id);
      await loadMovs();
    }
  };

  const normalizeStr = (str) => {
    if (!str) return '';
    return str
      .toString()
      .trim()
      .replace(/\s+/g, ' ')
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '');
  };

  const handleFilter = async (filtered) => {
    await loadMovs();
    setFilteredList(filtered);
    setFilterActive(filtered.length > 0);
    setDisplayedItems(ITEMS_PER_PAGE);
  };

  useEffect(() => {
    setDisplayedItems(ITEMS_PER_PAGE);
  }, [searchTerm]);

  // Aplicar busca por nome sobre a lista (filtrada por data ou completa)
  const baseList = filterActive ? filteredList : list;
  const searchedList = searchTerm
    ? baseList.filter((item) => normalizeStr(item.label).includes(normalizeStr(searchTerm)))
    : baseList;
  const displayList = searchedList.slice(0, displayedItems);

  const handleLoadMore = () => {
    if (displayedItems < searchedList.length) {
      setDisplayedItems(prev => prev + ITEMS_PER_PAGE);
    }
  };

  const handleEndReached = () => {
    if (displayedItems < searchedList.length) {
      handleLoadMore();
    }
  };

  return (
    <View style={styles.container}>
      <UserMenu visible={menuVisible} onClose={() => setMenuVisible(false)} onLogoff={() => { setMenuVisible(false); router.replace('/Login'); }} />
      <Header onUserPress={() => setMenuVisible(true)} />
      <View style={styles.MiddleBox}>

        <Balance movimentos={filterActive ? filteredList : list}></Balance>

        <DateFilter movimentos={list} onFilter={handleFilter}></DateFilter>

          <Text style={styles.Title}> Extrato</Text>
          <TextInput
            style={styles.searchInput}
            placeholder="Buscar por nome"
            placeholderTextColor="#777"
            value={searchTerm}
            onChangeText={setSearchTerm}
          />
                         <FlatList 
                           style={styles.list} 
                           contentContainerStyle={{ paddingBottom: 140 }}
                           data={displayList} 
                           keyExtractor={(item)=> String(item.id)} 
                           scrollEnabled={true}
                           nestedScrollEnabled={true}
                           showsVerticalScrollIndicator={false}
                           onEndReached={handleEndReached}
                           onEndReachedThreshold={0.1}
                            ListFooterComponent={() => 
                              displayedItems < searchedList.length ? (
                                <View style={styles.loadingContainer}>
                                  <Text style={styles.loadingText}>Carregando mais...</Text>
                                </View>
                              ) : displayList.length > 0 ? (
                                <View style={styles.endContainer}>
                                  <Text style={styles.endText}>Fim da lista</Text>
                                </View>
                              ) : null
                            }
                            renderItem={({item}) => <Movements 
                              data={item}
                              onUpdate={handleUpdateMovimento}
                              onDelete={handleDeleteMovimento}
                            />}
                            />
                        
 
      </View>

      <Button onAddMovimento={handleAddMovimento}></Button>
    </View>
  );
}
