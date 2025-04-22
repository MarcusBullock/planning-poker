import PlayingCard from './PlayingCard';
import styles from './Join.module.scss';

function Join() {
    return (
        <PlayingCard className={styles.join} suit={'♣'} rank="K" onClick={() => {}}>
            JOIN
        </PlayingCard>
    );
}

export default Join;
