import { useContext } from 'react';
import { UserContext } from '../context/CurrentUserContext';

export const useCurrentUser = () => {
    const context = useContext(UserContext);
    if (!context) {
        throw new Error('useCurrentUser must be used within a UserProvider');
    }
    return context;
};
