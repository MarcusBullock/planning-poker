import PlayingCard from './PlayingCard';
import { CardSuit } from '../../types/CardSuit';
import styles from './JoinForm.module.scss';

function JoinForm() {
    return (
        <div className={styles.joinForm}>
            <PlayingCard suit={CardSuit.Diamonds} rank="J">
                <form>
                    <input placeholder="ENTER CODE" />
                    <button type="button">JOIN</button>
                </form>
            </PlayingCard>
        </div>
    );
}

export default JoinForm;
