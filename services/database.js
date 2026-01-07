import * as SQLite from 'expo-sqlite';


function getDb() {
  return SQLite.openDatabaseSync('myapp.db');
}

// Inicializar banco de dados - criar tabela se não existir
export const initDatabase = async () => {
  const db = getDb();
  try {
    await db.execAsync(`
      CREATE TABLE IF NOT EXISTS movimentos (
        id TEXT PRIMARY KEY,
        label TEXT NOT NULL,
        value TEXT NOT NULL,
        date TEXT NOT NULL,
        type INTEGER NOT NULL,
        categoria TEXT NOT NULL,
        createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
      );
      CREATE TABLE IF NOT EXISTS usuarios (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        nome TEXT NOT NULL,
        sobrenome TEXT NOT NULL,
        email TEXT NOT NULL UNIQUE,
        senha TEXT NOT NULL
      );
      CREATE TABLE IF NOT EXISTS categorias_customizadas (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        nome TEXT NOT NULL UNIQUE,
        createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log('Banco de dados inicializado com sucesso');
  } catch (error) {
    console.error('Erro ao inicializar banco de dados:', error);
  } finally {
    db.closeSync && db.closeSync();
  }
};

// Adicionar usuário
export const addUsuario = async (usuario) => {
  const db = getDb();
  try {
    const { nome, sobrenome, email, senha } = usuario;
    await db.runAsync(
      `INSERT INTO usuarios (nome, sobrenome, email, senha) VALUES (?, ?, ?, ?)`,
      [nome, sobrenome, email, senha]
    );
    return true;
  } catch (error) {
    console.error('Erro ao adicionar usuário:', error);
    return false;
  } finally {
    db.closeSync && db.closeSync();
  }
};

// Buscar usuário por email e senha
export const getUsuarioByEmailSenha = async (email, senha) => {
  const db = getDb();
  try {
    const result = await db.getFirstAsync(
      `SELECT * FROM usuarios WHERE email = ? AND senha = ?`,
      [email, senha]
    );
    return result;
  } catch (error) {
    console.error('Erro ao buscar usuário:', error);
    return null;
  } finally {
    db.closeSync && db.closeSync();
  }
};

// Adicionar movimento
export const addMovimento = async (movimento) => {
  const db = getDb();
  try {
    const { id, label, value, date, type, categoria } = movimento;

    // Impedir nomes duplicados (case-insensitive)
    const duplicated = await db.getFirstAsync(
      `SELECT id FROM movimentos WHERE LOWER(label) = LOWER(?) LIMIT 1`,
      [label]
    );
    if (duplicated) {
      console.log('Movimento com label duplicado, bloqueando inserção:', label);
      return { duplicate: true };
    }
    
    // Verificar se já existe movimento com esse ID
    const existing = await db.getFirstAsync(
      `SELECT id FROM movimentos WHERE id = ?`,
      [id]
    );
    
    if (existing) {
      console.log('Movimento com ID', id, 'já existe no banco, pulando inserção');
      return null;
    }
    
    const result = await db.runAsync(
      `INSERT INTO movimentos (id, label, value, date, type, categoria) 
       VALUES (?, ?, ?, ?, ?, ?)`,
      [id, label, value, date, type, categoria]
    );
    console.log('Movimento adicionado ao banco de dados');
    // Retornar o movimento com id garantido
    return { ...movimento, id: id || result.lastInsertRowId || Date.now() };
  } catch (error) {
    console.error('Erro ao adicionar movimento:', error);
    return null;
  } finally {
    db.closeSync && db.closeSync();
  }
};

// Obter todos os movimentos
export const getAllMovimentos = async () => {
  const db = getDb();
  try {
    const result = await db.getAllAsync(
      `SELECT * FROM movimentos ORDER BY createdAt DESC`
    );
    return result || [];
  } catch (error) {
    console.error('Erro ao obter movimentos:', error);
    return [];
  } finally {
    db.closeSync && db.closeSync();
  }
};

// Atualizar movimento
export const updateMovimento = async (id, updatedData) => {
  const db = getDb();
  try {
    const { label, value, date, type, categoria } = updatedData;
    await db.runAsync(
      `UPDATE movimentos SET label = ?, value = ?, date = ?, type = ?, categoria = ? 
       WHERE id = ?`,
      [label, value, date, type, categoria, id]
    );
    console.log('Movimento atualizado no banco de dados');
    return true;
  } catch (error) {
    console.error('Erro ao atualizar movimento:', error);
    return false;
  } finally {
    db.closeSync && db.closeSync();
  }
};

// Deletar movimento
export const deleteMovimento = async (id) => {
  const db = getDb();
  try {
    await db.runAsync(`DELETE FROM movimentos WHERE id = ?`, [id]);
    console.log('Movimento deletado do banco de dados');
    return true;
  } catch (error) {
    console.error('Erro ao deletar movimento:', error);
    return false;
  } finally {
    db.closeSync && db.closeSync();
  }
};

// Limpar todos os movimentos (útil para testes)
export const clearAllMovimentos = async () => {
  const db = getDb();
  try {
    await db.runAsync(`DELETE FROM movimentos`);
    console.log('Todos os movimentos foram deletados');
    return true;
  } catch (error) {
    console.error('Erro ao limpar movimentos:', error);
    return false;
  } finally {
    db.closeSync && db.closeSync();
  }
};

// Adicionar categoria customizada
export const addCategoriaCustomizada = async (nome) => {
  const db = getDb();
  try {
    await db.runAsync(
      `INSERT INTO categorias_customizadas (nome) VALUES (?)`,
      [nome]
    );
    console.log('Categoria customizada adicionada:', nome);
    return true;
  } catch (error) {
    console.error('Erro ao adicionar categoria:', error);
    return false;
  } finally {
    db.closeSync && db.closeSync();
  }
};

// Obter todas as categorias customizadas
export const getCategoriasCustomizadas = async () => {
  const db = getDb();
  try {
    const result = await db.getAllAsync(`SELECT nome FROM categorias_customizadas ORDER BY nome`);
    return result.map(row => row.nome);
  } catch (error) {
    console.error('Erro ao buscar categorias:', error);
    return [];
  } finally {
    db.closeSync && db.closeSync();
  }
};

// Remover categoria customizada
export const removeCategoriaCustomizada = async (nome) => {
  const db = getDb();
  try {
    await db.runAsync(
      `DELETE FROM categorias_customizadas WHERE nome = ?`,
      [nome]
    );
    console.log('Categoria customizada removida:', nome);
    return true;
  } catch (error) {
    console.error('Erro ao remover categoria:', error);
    return false;
  } finally {
    db.closeSync && db.closeSync();
  }
};
