import { ReactNode, useState } from 'react';
import { UserContext } from '../context/CurrentUserContext';

interface UserProviderProps {
    children: ReactNode;
    sessionCode: string;
}

export const UserProvider: React.FC<UserProviderProps> = ({ sessionCode, children }) => {
    const [userId, setUserId] = useState<string | null>(localStorage.getItem(sessionCode));

    return <UserContext.Provider value={{ userId, setUserId }}>{children}</UserContext.Provider>;
};
