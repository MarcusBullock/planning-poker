import CardButton from './CardButton';
import styles from './Start.module.scss';

function Start() {
    return (
        <CardButton className={styles.start} onSubmit={() => {}} suit={'♠'} rank="A">
            START
        </CardButton>
    );
}

export default Start;
