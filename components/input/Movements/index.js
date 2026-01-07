import React,{useState, useEffect} from "react";
import {View, Text, StyleSheet, TouchableOpacity, Modal, Pressable, TextInput, ScrollView} from 'react-native';
import { handleDateInput, handleValueInput } from '../../../utils/dateHelper';
import { getCategoriasCustomizadas } from '../../../services/database';

export default function Movements({data, onUpdate, onDelete}){
    const [showValue, setShowValue] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);
    const [editData, setEditData] = useState(data.date);
    const [editLabel, setEditLabel] = useState(data.label);
    const [editValue, setEditValue] = useState(data.value);
    const [editCategoria, setEditCategoria] = useState(data.categoria || '');
    const [seletorCategoriaVisible, setSeletorCategoriaVisible] = useState(false);
    const [categoriasPredefinidas] = useState(['Alimentos', 'Contas', 'Lazer', 'Investimentos']);
    const [categorias, setCategorias] = useState([]);

    useEffect(() => {
        const loadCategorias = async () => {
            const cats = await getCategoriasCustomizadas();
            setCategorias(cats || []);
        };
        loadCategorias();
    }, []);

    const handleOpenModal = () => {
        setModalVisible(true);
        setShowValue(false);
    };

    const handleSaveChanges = () => {
        if (!editData || !editLabel || !editValue || !editCategoria) {
            alert('Preencha todos os campos e selecione uma categoria');
            return;
        }

        const updatedData = {
            ...data,
            date: editData,
            label: editLabel,
            value: editValue,
            categoria: editCategoria,
        };

        if (onUpdate) {
            onUpdate(data.id, updatedData);
        }

        setModalVisible(false);
        alert('Movimento atualizado com sucesso!');
    };

    const handleDelete = () => {
        if (onDelete) {
            onDelete(data.id);
            setModalVisible(false);
            alert('Movimento removido com sucesso!');
        }
    };

    return(
        <>
            <TouchableOpacity style={styles.container} onPress={handleOpenModal}>
                <Text style={styles.date}>{data.date}</Text>

                <View style={styles.content}>
                    <Text style={styles.label}>{data.label}</Text>
                    <Pressable onPress={() => setShowValue(!showValue)}>
                        {showValue ?(
                            <Text 
                            style={data.type === 1 ? styles.value : styles.expenses}
                            >
                            {data.type === 1 ? `R$ ${data.value}`:`R$ -${data.value}`}
                            </Text>

                            ): (
                                <View style={styles.skeleton}>
                                </View>          
                        )}
                    </Pressable>
                 </View>    
            </TouchableOpacity>

            <Modal
                animationType="fade"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => setModalVisible(false)}
            >
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        <View style={styles.modalHeader}>
                            <Text style={styles.modalTitle}>Editar Movimento</Text>
                            <Pressable 
                                onPress={() => setModalVisible(false)}
                                style={styles.closeButton}
                            >
                                <Text style={styles.closeButtonText}>✕</Text>
                            </Pressable>
                        </View>

                        <Text style={styles.label}>Data:</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="DD/MM/YYYY"
                            value={editData}
                            onChangeText={(text) => setEditData(handleDateInput(text))}
                            placeholderTextColor="#999"
                            keyboardType="numeric"
                            maxLength={10}
                        />

                        <Text style={styles.label}>Nome:</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="Nome da transação"
                            value={editLabel}
                            onChangeText={setEditLabel}
                            placeholderTextColor="#999"
                        />

                        <Text style={styles.label}>Valor (R$):</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="0,00"
                            value={editValue}
                            onChangeText={(text) => setEditValue(handleValueInput(text))}
                            keyboardType="decimal-pad"
                            placeholderTextColor="#999"
                            maxLength={10}
                        />

                        <Text style={styles.label}>Categoria:</Text>
                        <Pressable
                            style={styles.categoriaSelect}
                            onPress={() => setSeletorCategoriaVisible(true)}
                        >
                            <Text style={[styles.categoriaText, !editCategoria && { color: '#999' }]}>
                                {editCategoria || 'Selecione uma categoria'}
                            </Text>
                        </Pressable>

                        <View style={styles.buttonsContainer}>
                            <Pressable 
                                style={[styles.button, styles.buttonSave]}
                                onPress={handleSaveChanges}
                            >
                                <Text style={styles.buttonText}>Salvar</Text>
                            </Pressable>
                            <Pressable 
                                style={[styles.button, styles.buttonDelete]}
                                onPress={handleDelete}
                            >
                                <Text style={styles.buttonText}>Remover</Text>
                            </Pressable>
                        </View>
                    </View>
                </View>
            </Modal>

            <Modal
                animationType="fade"
                transparent={true}
                visible={seletorCategoriaVisible}
                onRequestClose={() => setSeletorCategoriaVisible(false)}
            >
                <View style={styles.modalContainer}>
                    <View style={styles.seletorContent}>
                        <Text style={styles.seletorTitle}>Selecione uma Categoria</Text>

                        <ScrollView style={styles.categoriasScroll}>
                            {categoriasPredefinidas.map((cat) => (
                                <Pressable
                                    key={cat}
                                    style={[
                                        styles.categoriaOption,
                                        editCategoria === cat && styles.categoriaOptionSelected
                                    ]}
                                    onPress={() => {
                                        setEditCategoria(cat);
                                        setSeletorCategoriaVisible(false);
                                    }}
                                >
                                    <Text style={styles.categoriaOptionText}>{cat}</Text>
                                </Pressable>
                            ))}
                            {categorias.map((cat) => (
                                <Pressable
                                    key={cat}
                                    style={[
                                        styles.categoriaOption,
                                        editCategoria === cat && styles.categoriaOptionSelected
                                    ]}
                                    onPress={() => {
                                        setEditCategoria(cat);
                                        setSeletorCategoriaVisible(false);
                                    }}
                                >
                                    <Text style={styles.categoriaOptionText}>{cat}</Text>
                                </Pressable>
                            ))}
                        </ScrollView>

                        <Pressable 
                            style={styles.closeModalButton}
                            onPress={() => setSeletorCategoriaVisible(false)}
                        >
                            <Text style={styles.closeModalButtonText}>Fechar</Text>
                        </Pressable>
                    </View>
                </View>
            </Modal>
        </>
    )
}

const styles = StyleSheet.create({
    container:{
        flex:1,
        marginBottom:24,
        borderBottomWidth:0.5,
        borderBottomColor:'#DADADA',

    },
    content:{
        flexDirection:'row',
        justifyContent:'space-between',
        marginTop:2,
        marginBottom: 8,
    },
    date:{
        color:'#DADADA',
        fontWeight:'bold',
        fontSize: 16,
    },
    label:{
        fontWeight:'bold',
        fontSize: 16,
    },
    value:{
        fontSize:16,
        color: '#2ecc71',
        fontWeight:'bold'
    },
    expenses:{
        fontSize:16,
        color: '#e74c36',
        fontWeight:'bold'

    },
    skeleton:{
        marginTop:6,
        width:80,
        height:10,
        backgroundColor:'#DADADA',
        borderRadius:8,

    },
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContent: {
        backgroundColor: '#FFFFFF',
        borderRadius: 20,
        padding: 20,
        width: '90%',
        maxWidth: 400,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
    },
    modalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: '#000000',
    },
    closeButton: {
        width: 30,
        height: 30,
        borderRadius: 15,
        backgroundColor: '#FF4444',
        justifyContent: 'center',
        alignItems: 'center',
    },
    closeButtonText: {
        color: '#FFFFFF',
        fontSize: 18,
        fontWeight: 'bold',
    },
    input: {
        backgroundColor: '#FFC100',
        borderRadius: 25,
        paddingHorizontal: 15,
        paddingVertical: 12,
        fontSize: 14,
        color: '#000000',
        marginBottom: 10,
        marginTop: 5,
    },
    buttonsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        gap: 10,
        marginTop: 15,
    },
    button: {
        borderRadius: 25,
        paddingVertical: 12,
        paddingHorizontal: 15,
        borderWidth: 2,
        flex: 1,
        alignItems: 'center',
    },
    buttonSave: {
        backgroundColor: '#FFC100',
        borderColor: '#000000',
    },
    buttonDelete: {
        backgroundColor: '#FF4444',
        borderColor: '#000000',
    },
    buttonText: {
        color: '#000000',
        fontWeight: '700',
        fontSize: 14,
    },

    categoriaSelect: {
        backgroundColor: '#FFC100',
        borderRadius: 25,
        paddingHorizontal: 15,
        paddingVertical: 12,
        marginBottom: 10,
        marginTop: 5,
    },
    categoriaText: {
        fontSize: 14,
        color: '#000000',
    },
    seletorContent: {
        backgroundColor: '#FFFFFF',
        borderRadius: 20,
        padding: 20,
        width: '90%',
        maxWidth: 400,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
    },
    seletorTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: '#000000',
        marginBottom: 10,
    },
    categoriasScroll: {
        maxHeight: 200,
        marginBottom: 15,
    },
    categoriaOption: {
        paddingVertical: 12,
        paddingHorizontal: 10,
        borderRadius: 12,
        backgroundColor: '#FFC100',
        borderWidth: 2,
        borderColor: '#FFC100',
        marginBottom: 8,
    },
    categoriaOptionSelected: {
        borderColor: '#000000',
    },
    categoriaOptionText: {
        fontSize: 14,
        color: '#000000',
        fontWeight: '600',
    },
    closeModalButton: {
        backgroundColor: '#000000',
        paddingVertical: 12,
        borderRadius: 12,
        alignItems: 'center',
    },
    closeModalButtonText: {
        color: '#FFFFFF',
        fontWeight: '700',
        fontSize: 14,
    },

},)