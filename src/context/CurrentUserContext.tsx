import { createContext } from 'react';

interface UserContextType {
    userId: string | null;
    setUserId: (id: string | null) => void;
}

export const UserContext = createContext<UserContextType>({
    userId: null,
    setUserId: () => {},
});
