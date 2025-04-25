import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { motion } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCopy } from '@fortawesome/free-solid-svg-icons';
import CreateUser from './CreateUser';
import SessionManagerHub from '../../hubs/SessionManagerHub';
import { useGetUserByGameCode } from '../../hooks/useGetUserBySessionCode';
import { useGetSessionPlayers } from '../../hooks/useGetSessionPlayers';
import { useCurrentUser } from '../../hooks/useCurrentUser';
import 'react-toastify/dist/ReactToastify.css';
import styles from './SessionPage.module.scss';

function SessionPage() {
    const { code } = useParams<{ code: string }>();
    const { data: sessionOwner } = useGetUserByGameCode(code!);
    const { data: players, refetch: refetchPlayers } = useGetSessionPlayers(code!);
    const { userId, setUserId } = useCurrentUser();

    useEffect(() => {
        const initializeSignalR = async () => {
            console.log('Initializing SignalR...');
            await SessionManagerHub.startConnection();
            console.log('SignalR connection state after start:', SessionManagerHub.connectionState);

            if (SessionManagerHub.connectionState === 'Connected') {
                await SessionManagerHub.joinSession(code!);
                console.log(`Joined SignalR group for session: ${code}`);

                SessionManagerHub.onPlayerJoined((sessionCode) => {
                    console.log('Player joined session:', sessionCode);
                    if (sessionCode === code) {
                        refetchPlayers();
                    }
                });
            } else {
                console.error('SignalR connection is not in the "Connected" state.');
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
        return <CreateUser sessionCode={code!} ownerName={sessionOwner?.name || 'Random person'} />;
    }

    const handleCopy = () => {
        navigator.clipboard.writeText(code!);
        toast.success('Copied to clipboard!', {
            position: 'top-right',
            autoClose: 1000,
            hideProgressBar: true,
            closeOnClick: true,
        });
    };

    const currentUser = players?.find((player) => player.id === parseInt(userId));

    return (
        <div className={styles.sessionPage}>
            <div className={styles.topRow}>
                <motion.h1
                    initial={{ x: -2500 }}
                    animate={{ x: 0 }}
                    transition={{ duration: 1, ease: 'easeOut' }}
                >
                    WELCOME, <span>{currentUser?.name}</span>!
                </motion.h1>
                <div className={styles.overviewCol}>
                    <motion.div
                        className={styles.owner}
                        initial={{ x: 2500 }}
                        animate={{ x: 0 }}
                        transition={{ duration: 1, ease: 'easeOut', delay: 0.2 }}
                    >
                        <h2>
                            <span>OWNER: </span>
                            <span className={styles.name}>{sessionOwner?.name}</span>
                        </h2>
                    </motion.div>
                    <motion.div
                        className={styles.btnRow}
                        initial={{ x: 2500 }}
                        animate={{ x: 0 }}
                        transition={{ duration: 1, ease: 'easeOut', delay: 0.8 }}
                    >
                        <div className={styles.owner}>
                            <h2>
                                <span>CODE: </span>
                                <span className={styles.name}>{code}</span>
                            </h2>
                        </div>
                        <button type="button" onClick={handleCopy}>
                            <FontAwesomeIcon icon={faCopy} size="xl" color="#7d0200" />
                        </button>
                    </motion.div>
                </div>
            </div>
            <div>
                <h3>Players</h3>
                <ul>{players?.map((player) => <li key={player.id}>{player.name}</li>)}</ul>
            </div>
        </div>
    );
}

export default SessionPage;
