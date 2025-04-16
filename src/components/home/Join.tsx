import CardButton from './CardButton';
import styles from './Join.module.scss';

function Join() {
    return (
        <CardButton className={styles.join} suit={'♣'} rank="K" onSubmit={() => {}}>
            JOIN
        </CardButton>
    );
}

export default Join;
