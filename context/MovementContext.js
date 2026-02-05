import React, { createContext, useState } from 'react';

export const MovementContext = createContext();
export const UserContext = createContext();

export function MovementProvider({ children }) {
  const [movements, setMovements] = useState([]);
  const [usuario, setUsuario] = useState(null);

  const addMovement = (newMovement) => {
    setMovements([newMovement, ...movements]);
  };

  const updateMovement = (id, updatedData) => {
    setMovements(movements.map(item => item.id === id ? updatedData : item));
  };

  const deleteMovement = (id) => {
    setMovements(movements.filter(item => item.id !== id));
  };

  const setCurrentUser = (user) => {
    setUsuario(user);
  };

  const logoutUser = () => {
    setUsuario(null);
  };

  return (
    <MovementContext.Provider value={{ movements, addMovement, updateMovement, deleteMovement }}>
      <UserContext.Provider value={{ usuario, setCurrentUser, logoutUser }}>
        {children}
      </UserContext.Provider>
    </MovementContext.Provider>
  );
}
