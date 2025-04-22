import { CardSuit } from '../../types/CardSuit';
import PlayingCard from './PlayingCard';
import styles from './StartForm.module.scss';

interface StartFormProps {
    isVisible: boolean;
}

function StartForm({ isVisible }: StartFormProps) {
    return (
        <div className={`${styles.startForm} ${isVisible ? styles.enter : styles.exit}`}>
            <PlayingCard suit={CardSuit.Hearts} rank="Q">
                <input className={styles.input} placeholder="YOUR NAME" />
            </PlayingCard>
        </div>
    );
}

export default StartForm;
