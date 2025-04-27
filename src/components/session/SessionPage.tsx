import { useCallback, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { debounce } from 'lodash';
import { useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-toastify';
import CreateUser from './CreateUser';
import Info from './Info';
import GamePanel from './GamePanel';
import VoteControls from './VoteControls';
import { CardSuit } from '../../types/CardSuit';
import SessionManagerHub from '../../hubs/SessionManagerHub';
import { useGetSessionOwner } from '../../hooks/useGetSessionOwner';
import { useGetSessionPlayers } from '../../hooks/useGetSessionPlayers';
import { useCurrentUser } from '../../hooks/useCurrentUser';
import { useGetSession } from '../../hooks/useGetSession';
import { useUpdateSession } from '../../hooks/useUpdateSession';
import { useUpdateUser } from '../../hooks/useUpdateUser';
import { useGetVotes } from '../../hooks/useGetVotes';
import 'react-toastify/dist/ReactToastify.css';
import styles from './SessionPage.module.scss';
import { UserVote } from '../../types/UserVote';

function SessionPage() {
    const { code } = useParams<{ code: string }>();
    const navigate = useNavigate();
    const { data: session, refetch: refetchSession, isError } = useGetSession(code!);

    useEffect(() => {
        if (isError) {
            navigate('/');
        }
    }, [isError, navigate]);

    const [highlightedPlayerId, setHighlightedPlayerId] = useState<number | undefined>(undefined);
    const { data: sessionOwner } = useGetSessionOwner(code!);
    const { data: players, refetch: refetchPlayers } = useGetSessionPlayers(code!);
    const { data: votes, refetch: refetchVotes } = useGetVotes(code!);
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

    const { mutate: updateUser } = useUpdateUser({
        onSuccess: async () => {
            try {
                if (SessionManagerHub.connectionState !== 'Connected') {
                    await SessionManagerHub.startConnection();
                }
                await SessionManagerHub.notifyVoteCast(code!, currentUser?.id || 0);
            } catch (error) {
                console.error('Failed to notify SignalR wrt vote:', error);
            }
        },
        onError: (err) => {
            console.error('Failed to update user:', err.message);
        },
    });

    const currentUser = players?.find((player) => player.id === parseInt(userId!));
    const notEnoughPlayers = !!players && players.length == 1;

    const handleGameStartOrStop = async (start: boolean) => {
        if (notEnoughPlayers) {
            toast.warn('You need at least 2 players to start a game', {
                position: 'top-right',
                autoClose: 1000,
                hideProgressBar: true,
                closeOnClick: true,
            });
            return;
        }

        if (session?.status === (start ? 'active' : 'inactive')) {
            console.warn('Session status is already', session?.status);
            return;
        }

        try {
            updateSession({
                code: code!,
                status: start ? 'active' : 'inactive',
            });

            refetchSession();

            if (SessionManagerHub.connectionState !== 'Connected') {
                await SessionManagerHub.startConnection();
            }

            await SessionManagerHub.notifySessionActive(code!);
        } catch (error) {
            console.error('Failed to update session or notify SignalR:', error);
        }
    };

    const handleVote = async (vote: number) => {
        if (session?.status === 'active') {
            const suits = Object.values(CardSuit);
            const randomIndex = Math.floor(Math.random() * suits.length);

            queryClient.setQueryData(['GetUserVotes', code], (oldVotes: UserVote[] = []) => {
                const existingVote = oldVotes.find((v) => v.userId === currentUser?.id);

                if (existingVote) {
                    return oldVotes.map((v) =>
                        v.userId === currentUser?.id ? { ...v, vote, suit: suits[randomIndex] } : v,
                    );
                }

                return [
                    ...oldVotes,
                    {
                        userId: currentUser?.id || 0,
                        vote,
                        suit: suits[randomIndex],
                    },
                ];
            });

            updateUser({
                id: currentUser?.id || 0,
                vote,
                suit: suits[randomIndex],
            });

            try {
                if (SessionManagerHub.connectionState !== 'Connected') {
                    await SessionManagerHub.startConnection();
                }
                await SessionManagerHub.notifyVoteCast(code!, currentUser?.id || 0);
                await SessionManagerHub.notifyPlayerHighlight(code!, currentUser?.id || 0);
            } catch (error) {
                console.error('Failed to notify SignalR wrt updated status:', error);
            }

            setHighlightedPlayerId(currentUser!.id);
        }
    };

    useEffect(() => {
        if (highlightedPlayerId !== null) {
            const timer = setTimeout(() => {
                setHighlightedPlayerId(undefined);
            }, 1000);

            return () => clearTimeout(timer);
        }
    }, [highlightedPlayerId]);

    const handleShowVotes = async () => {
        if (session?.status === 'active' && players) {
            const hasVotes = players.filter((player) => player.vote !== null).length >= 2;
            if (hasVotes) {
                updateSession({
                    code: code!,
                    status: 'voted',
                });
            } else {
                toast.warn('Need at least 2 votes', {
                    position: 'top-right',
                    autoClose: 1000,
                    hideProgressBar: true,
                    closeOnClick: true,
                });
                return;
            }

            try {
                if (SessionManagerHub.connectionState !== 'Connected') {
                    await SessionManagerHub.startConnection();
                }
                await SessionManagerHub.notifyShowVotes(code!);
            } catch (error) {
                console.error('Failed to notify SignalR wrt updated status:', error);
            }
        }
    };

    const handleResetVotes = async () => {
        if (session?.status === 'voted' || session?.status === 'active') {
            updateSession({
                code: code!,
                status: 'active',
            });
            players?.forEach((player) => {
                if (player.vote) updateUser({ id: player.id, vote: null });
            });
        }

        try {
            if (SessionManagerHub.connectionState !== 'Connected') {
                await SessionManagerHub.startConnection();
            }
            await SessionManagerHub.notifyResetVotes(code!);
        } catch (error) {
            console.error('Failed to notify SignalR wrt reset votes', error);
        }
    };

    const handleResetGame = async () => {
        if (session?.status === 'voted' || session?.status === 'active') {
            updateSession({
                code: code!,
                status: 'inactive',
            });
            players?.forEach((player) => {
                if (player.vote) updateUser({ id: player.id, vote: null });
            });
        }

        try {
            if (SessionManagerHub.connectionState !== 'Connected') {
                await SessionManagerHub.startConnection();
            }
            await SessionManagerHub.notifyResetVotes(code!);
            await SessionManagerHub.notifySessionActive(code!);
        } catch (error) {
            console.error('Failed to notify SignalR wrt reset votes', error);
        }
    };

    const refreshState = useCallback(() => {
        queryClient.invalidateQueries({ queryKey: ['GetSession', code] });
        queryClient.invalidateQueries({ queryKey: ['UsersBySessionCode', code] });
        queryClient.invalidateQueries({ queryKey: ['GetUserVotes', code] });

        queryClient.refetchQueries({ queryKey: ['GetSession', code] });
        queryClient.refetchQueries({ queryKey: ['UsersBySessionCode', code] });
        queryClient.refetchQueries({ queryKey: ['GetUserVotes', code] });
        refetchPlayers();
        refetchVotes();
        refetchSession();
    }, [queryClient, code, refetchPlayers, refetchSession, refetchVotes]);

    useEffect(() => {
        const storedUserId = localStorage.getItem(code!);
        if (storedUserId !== userId) {
            setUserId(storedUserId);
        }
    }, [code, userId, setUserId]);

    useEffect(() => {
        const debouncedRefreshState = debounce(refreshState, 500);

        const initializeSignalR = async () => {
            await SessionManagerHub.startConnection();

            if (SessionManagerHub.connectionState === 'Connected') {
                await SessionManagerHub.joinSession(code!);

                SessionManagerHub.onPlayerJoined((sessionCode: string) => {
                    if (sessionCode === code) {
                        refreshState();
                    }
                });

                SessionManagerHub.onVoteCast(() => {
                    debouncedRefreshState();
                });

                SessionManagerHub.onPlayerHighlight((_sessionCode: string, userId: number) => {
                    refreshState();
                    setHighlightedPlayerId(userId);
                });

                SessionManagerHub.onSessionActive(() => {
                    refreshState();
                });

                SessionManagerHub.onResetVotes(() => {
                    refreshState();
                });

                SessionManagerHub.onShowVotes(() => {
                    refreshState();
                });
            } else {
                console.error('SignalR not connected');
            }
        };

        initializeSignalR();

        return () => {
            SessionManagerHub.stopConnection();
        };
    }, [code, refreshState]);

    if (!userId) {
        return <CreateUser sessionCode={code!} ownerName={sessionOwner?.name} />;
    }

    return (
        <div className={styles.sessionPage}>
            <Info
                gameStatus={session?.status}
                ownerName={sessionOwner?.name}
                currentUserName={currentUser?.name}
                code={code!}
                notEnoughPlayers={notEnoughPlayers}
                startGame={handleGameStartOrStop}
                handleShowVotes={handleShowVotes}
                handleResetVotes={handleResetVotes}
                handleResetGame={handleResetGame}
                voteCount={votes?.filter((x) => !!x.vote).length || 0}
            />
            <GamePanel
                players={players}
                gameStatus={session?.status}
                votes={votes || []}
                highlightedPlayerId={highlightedPlayerId}
            />
            {session?.status === 'active' && <VoteControls onVote={handleVote} />}
        </div>
    );
}

export default SessionPage;
