import { useParams } from 'react-router-dom';
import { useGetUserByGameCode } from '../../hooks/useGetUserBySessionCode';
import { motion } from 'framer-motion';
import ButtonLoading from '../shared/ButtonLoading';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCopy } from '@fortawesome/free-solid-svg-icons';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import styles from './SessionPage.module.scss';

function SessionPage() {
    const { code } = useParams<{ code: string }>();
    const { data: user, isLoading, isError, error } = useGetUserByGameCode(code!);

    if (isLoading) return <ButtonLoading />;
    if (isError) return <p>Error: {error?.message}</p>;

    const handleCopy = () => {
        navigator.clipboard.writeText(code || '');
        toast.success('Copied to clipboard!', {
            position: 'top-right',
            autoClose: 2000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: false,
            progress: undefined,
        });
    };

    return (
        <div className={styles.sessionPage}>
            <div className={styles.topRow}>
                <motion.h1
                    initial={{ x: -2500 }}
                    animate={{ x: 0 }}
                    transition={{ duration: 1, ease: 'easeOut' }}
                >
                    WELCOME!
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
                            <span className={styles.name}>{user?.name}</span>
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
                                <span>SESSION ID: </span>
                                <span className={styles.name}>XXX5</span>
                            </h2>
                        </div>
                        <button type="button" onClick={handleCopy}>
                            <FontAwesomeIcon icon={faCopy} size="xl" color="#7d0200" />
                        </button>
                    </motion.div>
                </div>
            </div>
            <ToastContainer />
        </div>
    );
}

export default SessionPage;
