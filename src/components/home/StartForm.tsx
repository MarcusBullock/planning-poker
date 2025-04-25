import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAddUser } from '../../hooks/useAddUser';
import { useAddSession } from '../../hooks/useAddSession';
import PlayingCard from './PlayingCard';
import { CardSuit } from '../../types/CardSuit';
import { UserRow } from '../../types/DbModels';
import ButtonLoading from '../shared/ButtonLoading';
import { nanoid } from 'nanoid';
import styles from './StartForm.module.scss';
import { toast } from 'react-toastify';
import { useAddSessionUser } from '../../hooks/useAddSessionUser';
import { useCurrentUser } from '../../hooks/useCurrentUser';

function StartForm() {
    const [username, setUsername] = useState('');
    const { mutate: addUser, isPending } = useAddUser();
    const { mutate: addSession, isPending: isSessionPending } = useAddSession();
    const { mutate: addSessionUser, isPending: isSessionUserPending } = useAddSessionUser();
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

        addUser(
            { name: username, created: new Date().toISOString(), role: 'owner' },
            {
                onSuccess: (newUser: UserRow) => {
                    const code = nanoid(8);
                    addSession(
                        {
                            ownerUserId: newUser.id,
                            created: new Date().toISOString(),
                            code,
                            status: 'inactive',
                        },
                        {
                            onSuccess: () => {
                                addSessionUser(
                                    {
                                        created: new Date().toISOString(),
                                        userId: newUser.id,
                                        sessionCode: code,
                                    },
                                    {
                                        onSuccess: () => {
                                            localStorage.setItem(code, newUser.id.toString());
                                            setUserId(newUser.id.toString());
                                            navigate(`/session/${code}`);
                                        },
                                        onError: (sessionUserError) => {
                                            console.error(
                                                'Failed to create session user:',
                                                sessionUserError,
                                            );
                                        },
                                    },
                                );
                            },
                            onError: (sessionError) => {
                                console.error('Failed to create session:', sessionError);
                            },
                        },
                    );
                },
                onError: (userError) => {
                    console.error('Failed to add user:', userError);
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
                    <button
                        type="submit"
                        disabled={
                            !username || isPending || isSessionPending || isSessionUserPending
                        }
                    >
                        {isPending || isSessionPending || isSessionUserPending ? (
                            <ButtonLoading />
                        ) : (
                            'START'
                        )}
                    </button>
                </form>
            </PlayingCard>
        </div>
    );
}

export default StartForm;
