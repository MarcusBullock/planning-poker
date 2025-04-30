import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useGetSession } from '../../hooks/useGetSession';
import PlayingCard from './PlayingCard';
import { CardSuit } from '../../types/CardSuit';
import styles from './JoinForm.module.scss';

function JoinForm() {
    const [sessionCode, setSessionCode] = useState('');
    const { data: session } = useGetSession(sessionCode);
    const navigate = useNavigate();

    const goToSession = () =>
        session
            ? navigate(`/session/${sessionCode}`)
            : toast.warn('Invalid code', {
                  position: 'top-right',
                  autoClose: 1000,
                  hideProgressBar: true,
                  closeOnClick: true,
              });

    return (
        <div className={styles.joinForm}>
            <PlayingCard suit={CardSuit.Diamonds} rank="J">
                <form>
                    <input
                        placeholder="ENTER CODE"
                        onChange={(e) => setSessionCode(e.target.value)}
                    />
                    <a type="button" onClick={goToSession}>
                        JOIN
                    </a>
                </form>
            </PlayingCard>
        </div>
    );
}

export default JoinForm;
