import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { nanoid } from 'nanoid';
import { useAddUser } from '../../hooks/useAddUser';
import { useAddSession } from '../../hooks/useAddSession';
import { useCurrentUser } from '../../hooks/useCurrentUser';
import { CardSuit } from '../../types/CardSuit';
import { UserRow } from '../../types/DbModels';
import PlayingCard from './PlayingCard';
import ButtonLoading from '../shared/ButtonLoading';
import styles from './StartForm.module.scss';

function StartForm() {
    const [username, setUsername] = useState('');
    const { mutate: addUser, isPending } = useAddUser();
    const { mutate: addSession, isPending: isSessionPending } = useAddSession();
    const { setUserId } = useCurrentUser();
    const navigate = useNavigate();

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

        const code = nanoid(8);

        addSession(
            {
                created: new Date().toISOString(),
                code,
                status: 'inactive',
            },
            {
                onSuccess: () => {
                    addUser(
                        {
                            name: username,
                            created: new Date().toISOString(),
                            role: 'owner',
                            sessionCode: code,
                        },
                        {
                            onSuccess: (newUser: UserRow) => {
                                localStorage.setItem(code, newUser.id.toString());
                                setUserId(newUser.id.toString());
                                navigate(`/session/${code}`);
                            },
                            onError: (userError) => {
                                console.error('Failed to create user:', userError);
                            },
                        },
                    );
                },
                onError: (sessionError) => {
                    console.error('Failed to add session:', sessionError);
                },
            },
        );
    };

    return (
        <div className={styles.startForm}>
            <PlayingCard suit={CardSuit.Hearts} rank="Q">
                <form onSubmit={(e) => handleSubmit(e)}>
                    <input
                        type="text"
                        placeholder="YOUR NAME"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                    />
                    <button type="submit" disabled={!username || isPending || isSessionPending}>
                        {isPending || isSessionPending ? <ButtonLoading /> : 'START'}
                    </button>
                </form>
            </PlayingCard>
        </div>
    );
}

export default StartForm;
