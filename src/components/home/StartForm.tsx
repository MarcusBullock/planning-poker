import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAddUser, UserRow } from '../../hooks/useAddUser';
import { useAddSession } from '../../hooks/useAddSession';
import PlayingCard from './PlayingCard';
import { CardSuit } from '../../types/CardSuit';
import ButtonLoading from '../shared/ButtonLoading';
import { nanoid } from 'nanoid';
import styles from './StartForm.module.scss';

function StartForm() {
    const [username, setUsername] = useState('');
    const { mutate: addUser, isPending, isError, error } = useAddUser();
    const {
        mutate: addSession,
        isPending: isSessionPending,
        isError: isSessionError,
        error: sessionError,
    } = useAddSession();
    const navigate = useNavigate();

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        addUser(
            { name: username, created: new Date().toISOString() },
            {
                onSuccess: (data: UserRow) => {
                    const code = nanoid(8);
                    addSession(
                        {
                            ownerUserId: data.id,
                            created: new Date().toISOString(),
                            code,
                        },
                        {
                            onSuccess: () => {
                                navigate(`/session/${code}`);
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
                <form>
                    <input
                        type="text"
                        placeholder="YOUR NAME"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                    />
                    <button type="submit" disabled={!!username || isPending} onClick={handleSubmit}>
                        {isPending || isSessionPending ? <ButtonLoading /> : 'START'}
                    </button>
                </form>
                {(isError || isSessionError) && (sessionError?.message || error?.message) && (
                    <p className={styles.error}>Error: {sessionError?.message || error?.message}</p>
                )}
            </PlayingCard>
        </div>
    );
}

export default StartForm;
