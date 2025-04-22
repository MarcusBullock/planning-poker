import styles from './StartForm.module.scss';

interface StartFormProps {
    isVisible: boolean;
}

function StartForm({ isVisible }: StartFormProps) {
    return (
        <div className={`${styles.startForm} ${isVisible ? styles.enter : styles.exit}`}>
            <h2>MEGA FORM</h2>
        </div>
    );
}

export default StartForm;
