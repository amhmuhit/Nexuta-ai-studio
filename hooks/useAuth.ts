
import { useContext } from 'react';
import { GlobalStateContext } from '../context/GlobalStateContext';

export const useAuth = () => {
  const context = useContext(GlobalStateContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within a GlobalStateProvider');
  }
  return context;
};
