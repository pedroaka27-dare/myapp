import React, { createContext, useState } from 'react';

export const MovementContext = createContext();

export function MovementProvider({ children }) {
  const [movements, setMovements] = useState([]);

  const addMovement = (newMovement) => {
    setMovements([newMovement, ...movements]);
  };

  const updateMovement = (id, updatedData) => {
    setMovements(movements.map(item => item.id === id ? updatedData : item));
  };

  const deleteMovement = (id) => {
    setMovements(movements.filter(item => item.id !== id));
  };

  return (
    <MovementContext.Provider value={{ movements, addMovement, updateMovement, deleteMovement }}>
      {children}
    </MovementContext.Provider>
  );
}
