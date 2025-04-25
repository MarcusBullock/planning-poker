import { useNavigate } from 'react-router-dom';
import styles from './CreateUser.module.scss';
import { useState } from 'react';
import { toast } from 'react-toastify';
import { useAddUser } from '../../hooks/useAddUser';
import ButtonLoading from '../shared/ButtonLoading';
import { UserRow } from '../../types/DbModels';
import { useAddSessionUser } from '../../hooks/useAddSessionUser';
import { useCurrentUser } from '../../hooks/useCurrentUser';
import SessionManagerHub from '../../hubs/SessionManagerHub';

type CreateUserProps = {
    sessionCode: string;
    ownerName?: string;
};

function CreateUser({ sessionCode, ownerName }: CreateUserProps) {
    const navigate = useNavigate();
    const [username, setUsername] = useState('');
    const { setUserId } = useCurrentUser();
    const { mutate: addUser, isPending: isUserPending } = useAddUser();
    const { mutate: addSessionUser, isPending: isSessionUserPending } = useAddSessionUser();

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (!username || username.length > 50) {
            toast.warning('Username must be between 1 - 50 characters', {
                position: 'top-right',
                autoClose: 1000,
                hideProgressBar: true,
                closeOnClick: true,
            });
            return;
        }

        addUser(
            { name: username, created: new Date().toISOString(), role: 'player' },
            {
                onSuccess: (newUser: UserRow) => {
                    addSessionUser(
                        {
                            created: new Date().toISOString(),
                            userId: newUser.id,
                            sessionCode,
                        },
                        {
                            onSuccess: async () => {
                                localStorage.setItem(sessionCode, newUser.id.toString());
                                setUserId(newUser.id.toString());
                                try {
                                    if (SessionManagerHub.connectionState !== 'Connected') {
                                        await SessionManagerHub.startConnection();
                                    }
                                    await SessionManagerHub.joinSession(sessionCode);
                                    await SessionManagerHub.notifyPlayerJoined(sessionCode);
                                } catch (error) {
                                    console.error(
                                        'Failed to notify SignalR hub about new player:',
                                        error,
                                    );
                                }

                                setTimeout(() => {
                                    navigate(`/session/${sessionCode}`);
                                }, 0);
                            },
                            onError: (error) => {
                                console.error('Failed to add session user:', error);
                            },
                        },
                    );
                },
                onError: (error) => {
                    console.error('Failed to add user:', error);
                },
            },
        );
    };

    return (
        <div className={styles.createUser}>
            <div className={styles.mainForm}>
                <p className={styles.welcome}>
                    Welcome to <span>{ownerName}'s </span> game!
                </p>
                <p>Enter your name to join the session.</p>
                <form onSubmit={handleSubmit}>
                    <input onChange={(e) => setUsername(e.target.value)} placeholder="YOUR NAME" />
                    <button
                        type="submit"
                        disabled={!username || isSessionUserPending || isUserPending}
                    >
                        {isSessionUserPending || isUserPending ? <ButtonLoading /> : 'ENTER'}
                    </button>
                </form>
            </div>
        </div>
    );
}

export default CreateUser;
