import { useParams } from 'react-router-dom';
import { UserProvider } from '../../providers/UserProvider';
import SessionPage from './SessionPage';

function SessionPageWrapper() {
    const { code } = useParams<{ code: string }>();

    return (
        <UserProvider sessionCode={code!}>
            <SessionPage />
        </UserProvider>
    );
}

export default SessionPageWrapper;
