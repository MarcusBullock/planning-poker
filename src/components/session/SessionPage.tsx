import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-toastify';
import CreateUser from './CreateUser';
import Info from './Info';
import Players from './Players';
import SessionManagerHub from '../../hubs/SessionManagerHub';
import { useGetUserByGameCode } from '../../hooks/useGetUserBySessionCode';
import { useGetSessionPlayers } from '../../hooks/useGetSessionPlayers';
import { useCurrentUser } from '../../hooks/useCurrentUser';
import { useGetSession } from '../../hooks/useGetSession';
import { useUpdateSession } from '../../hooks/useUpdateSession';
import 'react-toastify/dist/ReactToastify.css';
import styles from './SessionPage.module.scss';

function SessionPage() {
    const { code } = useParams<{ code: string }>();
    const { data: session } = useGetSession(code!);
    const { data: sessionOwner } = useGetUserByGameCode(code!);
    const { data: players, refetch: refetchPlayers } = useGetSessionPlayers(code!);
    const { userId, setUserId } = useCurrentUser();

    const queryClient = useQueryClient();
    const { mutate: updateSession } = useUpdateSession({
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['GetSession', code] });
        },
        onError: (err) => {
            console.error('Failed to update session:', err.message);
        },
    });

    const notEnoughPlayers = !!players && players.length == 1;

    const handleGame = (start: boolean) => {
        if (notEnoughPlayers) {
            toast.warn('You need at least 2 players to start a game', {
                position: 'top-right',
                autoClose: 1000,
                hideProgressBar: true,
                closeOnClick: true,
            });
        }

        updateSession({
            code: code!,
            status: start ? 'active' : 'inactive',
        });
    };

    useEffect(() => {
        const initializeSignalR = async () => {
            await SessionManagerHub.startConnection();

            if (SessionManagerHub.connectionState === 'Connected') {
                await SessionManagerHub.joinSession(code!);

                SessionManagerHub.onPlayerJoined((sessionCode) => {
                    console.log('Player joined session:', sessionCode);
                    if (sessionCode === code) {
                        refetchPlayers();
                    }
                });
            } else {
                console.error('SignalR not connected');
            }
        };

        initializeSignalR();

        return () => {
            SessionManagerHub.stopConnection();
        };
    }, [code, refetchPlayers]);

    useEffect(() => {
        const storedUserId = localStorage.getItem(code!);
        if (storedUserId !== userId) {
            setUserId(storedUserId);
        }
    }, [code, userId, setUserId]);

    if (!userId) {
        return <CreateUser sessionCode={code!} ownerName={sessionOwner?.name} />;
    }

    const currentUser = players?.find((player) => player.id === parseInt(userId));

    return (
        <div className={styles.sessionPage}>
            <Info
                gameStatus={session?.status}
                ownerName={sessionOwner?.name}
                currentUserName={currentUser?.name}
                code={code!}
                notEnoughPlayers={notEnoughPlayers}
                handleGame={handleGame}
            />
            <Players players={players} />
        </div>
    );
}

export default SessionPage;
