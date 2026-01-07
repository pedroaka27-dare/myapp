import { TouchableOpacity, View, Image, StyleSheet, Modal, Text, Pressable, TextInput, ScrollView } from "react-native";
import { useState, useEffect } from "react";
import { handleDateInput, handleValueInput } from '../../../utils/dateHelper';
import { addCategoriaCustomizada, getCategoriasCustomizadas, removeCategoriaCustomizada } from '../../../services/database';

export default function Button({ onAddMovimento }){
    const [modalVisible, setModalVisible] = useState(false);
    const [categoriaModalVisible, setCategoriaModalVisible] = useState(false);
    const [seletorCategoriaVisible, setSeletorCategoriaVisible] = useState(false);
    const [data, setData] = useState('');
    const [nome, setNome] = useState('');
    const [valor, setValor] = useState('');
    const [categoria, setCategoria] = useState('');
    const [novaCategoria, setNovaCategoria] = useState('');
    const [categoriasPredefinidas] = useState(['Alimentos', 'Contas', 'Lazer', 'Investimentos']);
    const [categorias, setCategorias] = useState([]);
    const [isProcessing, setIsProcessing] = useState(false);

    // Carregar categorias customizadas do banco ao montar
    useEffect(() => {
        const loadCategorias = async () => {
            const cats = await getCategoriasCustomizadas();
            setCategorias(cats);
        };
        loadCategorias();
    }, []);

    const handleAddMovimento = async (tipo) => {
        // Prevenir duplo clique
        if (isProcessing) {
            console.log('Já processando, aguarde...');
            return;
        }
        
        // Validar campos (categoria agora é obrigatória)
        if (!data || !nome || !valor || !categoria) {
            alert('Preencha todos os campos e selecione uma categoria');
            return;
        }
        
        // Marcar como processando
        setIsProcessing(true);
        
        // Formatar valor para o padrão do app (remover vírgulas e converter para número)
        const valorFormatado = valor.replace(',', '.');
        
        // Criar objeto de movimento
        const novoMovimento = {
            id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
            label: nome,
            value: valorFormatado,
            date: data,
            type: tipo === 'credito' ? 1 : 0, // 1 = receita/crédito, 0 = despesa/débito
            categoria: categoria,
        };
        
        // Log para debug
        console.log('Criando novo movimento:', novoMovimento);
        
        // Chamar callback para adicionar à lista e tratar duplicados
        if (onAddMovimento) {
            const result = await onAddMovimento(novoMovimento);
            if (result?.duplicate) {
                setIsProcessing(false);
                return;
            }
        }
        
        // Limpar campos e fechar modal
        setData('');
        setNome('');
        setValor('');
        setCategoria('');
        setModalVisible(false);
        
        // Resetar flag após um delay para permitir próximo clique
        setTimeout(() => {
            setIsProcessing(false);
        }, 1000);
        
        // Alerta de sucesso
        alert('Movimento adicionado com sucesso!');
    };

    const handleAddCategoria = async () => {
        if (!novaCategoria.trim()) {
            alert('Digite o nome da categoria');
            return;
        }
        
        // Adicionar categoria ao banco de dados
        const success = await addCategoriaCustomizada(novaCategoria);
        if (success) {
            // Adicionar categoria à lista local
            setCategorias([...categorias, novaCategoria]);
            setCategoria(novaCategoria);
            setNovaCategoria('');
            setCategoriaModalVisible(false);
            setSeletorCategoriaVisible(false);
            
            // Alertar sucesso
            alert(`Categoria "${novaCategoria}" criada com sucesso!`);
        }
    };

    const handleRemoveCategoria = async (categoriaRemover) => {
        const success = await removeCategoriaCustomizada(categoriaRemover);
        if (success) {
            setCategorias(categorias.filter(cat => cat !== categoriaRemover));
            if (categoria === categoriaRemover) {
                setCategoria('');
            }
        }
    };

    return(
        <>
            <View style={styles.addbutton}>
                <TouchableOpacity onPress={() => setModalVisible(true)}>
                    <Image source={require('../../../assets/button.png')} style={{width:86, height:86}}/>
                </TouchableOpacity>
            </View>

            <Modal
                animationType="fade"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => setModalVisible(false)}
            >
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        <View style={styles.modalHeader}>
                            <Text style={styles.modalTitle}>Adicionar Crédito/ Débito:</Text>
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
                            value={data}
                            onChangeText={(text) => setData(handleDateInput(text))}
                            placeholderTextColor="#999"
                            keyboardType="numeric"
                            maxLength={10}
                        />

                        <Text style={styles.label}>Nome:</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="Nome da transação"
                            value={nome}
                            onChangeText={setNome}
                            placeholderTextColor="#999"
                        />

                        <Text style={styles.label}>Valor (R$):</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="0,00"
                            value={valor}
                            onChangeText={(text) => setValor(handleValueInput(text))}
                            keyboardType="decimal-pad"
                            placeholderTextColor="#999"
                            maxLength={10}
                        />

                        <View style={styles.categoriaContainer}>
                            <Text style={styles.label}>Categoria:</Text>
                            <Pressable
                                style={styles.input}
                                onPress={() => setSeletorCategoriaVisible(true)}
                            >
                                <Text style={[styles.inputText, !categoria && { color: '#999' }]}>
                                    {categoria || 'Selecione uma categoria'}
                                </Text>
                            </Pressable>
                            <Pressable 
                                style={styles.plusButton}
                                onPress={() => setCategoriaModalVisible(true)}
                            >
                                <Text style={styles.plusButtonText}>+</Text>
                            </Pressable>
                        </View>

                        <View style={styles.buttonContainer}>
                            <Text style={styles.adicionarLabel}>Adicionar:</Text>
                            <View style={styles.buttonsRow}>
                                <Pressable 
                                    style={[styles.button, styles.buttonDebito]}
                                    onPress={() => handleAddMovimento('debito')}
                                >
                                    <Text style={styles.buttonText}>Débito</Text>
                                </Pressable>
                                <Pressable 
                                    style={[styles.button, styles.buttonCredito]}
                                    onPress={() => handleAddMovimento('credito')}
                                >
                                    <Text style={styles.buttonText}>Crédito</Text>
                                </Pressable>
                            </View>
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
                                        categoria === cat && styles.categoriaOptionSelected
                                    ]}
                                    onPress={() => {
                                        setCategoria(cat);
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
                                        categoria === cat && styles.categoriaOptionSelected
                                    ]}
                                    onPress={() => {
                                        setCategoria(cat);
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

            <Modal
                animationType="fade"
                transparent={true}
                visible={categoriaModalVisible}
                onRequestClose={() => setCategoriaModalVisible(false)}
            >
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        <View style={styles.modalHeader}>
                            <Text style={styles.modalTitle}>Adicionar Categoria</Text>
                            <Pressable 
                                onPress={() => setCategoriaModalVisible(false)}
                                style={styles.closeButton}
                            >
                                <Text style={styles.closeButtonText}>✕</Text>
                            </Pressable>
                        </View>

                        <Text style={styles.label}>Nome da Categoria:</Text>
                        <View style={styles.inputAddCategoriaContainer}>
                            <TextInput
                                style={[styles.input, styles.inputAddCategoria]}
                                placeholder="Ex: Alimentação, Transporte..."
                                value={novaCategoria}
                                onChangeText={setNovaCategoria}
                                placeholderTextColor="#999"
                                autoFocus
                            />
                            <Pressable 
                                style={styles.addCategoriaButton}
                                onPress={handleAddCategoria}
                            >
                                <Text style={styles.addCategoriaButtonText}>Adicionar</Text>
                            </Pressable>
                        </View>

                        {categorias.length > 0 && (
                            <>
                                <Text style={[styles.label, { marginTop: 20 }]}>Categorias Customizadas:</Text>
                                <ScrollView style={styles.categoriasCustomScroll}>
                                    {categorias.map((cat) => (
                                        <View key={cat} style={styles.categoriaCustomItem}>
                                            <Text style={styles.categoriaCustomText}>{cat}</Text>
                                            <Pressable 
                                                style={styles.removeButton}
                                                onPress={() => handleRemoveCategoria(cat)}
                                            >
                                                <Text style={styles.removeButtonText}>✕</Text>
                                            </Pressable>
                                        </View>
                                    ))}
                                </ScrollView>
                            </>
                        )}
                    </View>
                </View>
            </Modal>
        </>
    )
}

export const styles = StyleSheet.create({
    addbutton:{
        position:'absolute',
        bottom:0,
        left:'85%',
        marginLeft:-43,
        elevation:999,
        zIndex:9999,
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
    label: {
        fontSize: 14,
        fontWeight: '600',
        color: '#000000',
        marginTop: 10,
        marginBottom: 5,
    },
    input: {
        backgroundColor: '#FFC100',
        borderRadius: 25,
        paddingHorizontal: 15,
        paddingVertical: 12,
        fontSize: 14,
        color: '#000000',
        marginBottom: 10,
    },
    categoriaContainer: {
        position: 'relative',
        marginBottom: 10,
    },
    categoriaInput: {
        paddingRight: 50,
    },
    plusButton: {
        position: 'absolute',
        right: 15,
        top: 35,
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: '#FFC100',
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 2,
        borderColor: '#000000',
    },
    plusButtonText: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#000000',
    },
    buttonContainer: {
        marginTop: 20,
    },
    adicionarLabel: {
        fontSize: 14,
        fontWeight: '700',
        color: '#000000',
        marginBottom: 10,
        textAlign: 'center',
    },
    buttonsRow: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        gap: 10,
    },
    button: {
        borderRadius: 25,
        paddingVertical: 12,
        paddingHorizontal: 30,
        borderWidth: 2,
        flex: 1,
        alignItems: 'center',
    },
    buttonDebito: {
        backgroundColor: '#FFC100',
        borderColor: '#000000',
    },
    buttonCredito: {
        backgroundColor: '#FFC100',
        borderColor: '#000000',
    },
    buttonText: {
        color: '#000000',
        fontWeight: '700',
        fontSize: 14,
    },
    buttonConfirm: {
        backgroundColor: '#FFC100',
        borderColor: '#000000',
        marginTop: 15,
    },
    inputText: {
        color: '#000000',
        fontSize: 14,
    },
    seletorContent: {
        backgroundColor: '#FFFFFF',
        borderRadius: 20,
        padding: 20,
        width: '90%',
        maxWidth: 400,
        maxHeight: '70%',
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
        marginBottom: 15,
        textAlign: 'center',
    },
    categoriasScroll: {
        maxHeight: 200,
        marginBottom: 15,
    },
    categoriaOption: {
        backgroundColor: '#FFC100',
        borderRadius: 25,
        paddingHorizontal: 15,
        paddingVertical: 12,
        marginBottom: 8,
        borderWidth: 2,
        borderColor: 'transparent',
    },
    categoriaOptionSelected: {
        borderColor: '#000000',
        backgroundColor: '#FFD700',
    },
    categoriaOptionText: {
        color: '#000000',
        fontSize: 14,
        fontWeight: '600',
        textAlign: 'center',
    },
    closeModalButton: {
        backgroundColor: '#FFC100',
        borderRadius: 25,
        borderWidth: 2,
        borderColor: '#000000',
        paddingVertical: 12,
        alignItems: 'center',
    },
    closeModalButtonText: {
        color: '#000000',
        fontWeight: '700',
        fontSize: 14,
    },
    categoriasCustomScroll: {
        maxHeight: 150,
        marginBottom: 10,
    },
    categoriaCustomItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: '#FFC100',
        borderRadius: 25,
        paddingHorizontal: 15,
        paddingVertical: 12,
        marginBottom: 8,
        borderWidth: 2,
        borderColor: '#000000',
    },
    categoriaCustomText: {
        color: '#000000',
        fontSize: 14,
        fontWeight: '600',
        flex: 1,
    },
    removeButton: {
        width: 28,
        height: 28,
        borderRadius: 14,
        backgroundColor: '#FF4444',
        justifyContent: 'center',
        alignItems: 'center',
    },
    removeButtonText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: 'bold',
    },
    inputAddCategoriaContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
        marginBottom: 10,
    },
    inputAddCategoria: {
        flex: 1,
        marginBottom: 0,
    },
    addCategoriaButton: {
        backgroundColor: '#FFC100',
        borderRadius: 25,
        paddingHorizontal: 20,
        paddingVertical: 12,
        borderWidth: 2,
        borderColor: '#000000',
        justifyContent: 'center',
        alignItems: 'center',
    },
    addCategoriaButtonText: {
        color: '#000000',
        fontWeight: '700',
        fontSize: 13,
    },
})
