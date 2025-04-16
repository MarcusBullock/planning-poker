import classNames from 'classnames';
import styles from './CardButton.module.scss';

interface CardButtonProps {
    className?: string;
    children: React.ReactNode;
    onSubmit: () => void;
    suit: string;
    rank: string;
}

function CardButton({ className, children, onSubmit, suit, rank }: CardButtonProps) {
    return (
        <button
            className={classNames(className, styles.cardButton)}
            type="submit"
            onSubmit={onSubmit}
        >
            <div className={styles.playingCard}>
                <div className={classNames(styles.rankAndSuit, styles.top)}>
                    <div className={styles.rank}>{rank}</div>
                    <div className={classNames(styles.suit, styles.suitLeft)}>{suit}</div>
                </div>
                <div className={styles.cardBody}>{children}</div>
                <div className={classNames(styles.rankAndSuit, styles.bottom, styles.flip)}>
                    <div className={classNames(styles.suit, styles.suitRight)}>{suit}</div>
                    <div className={classNames(styles.rank, styles.rankRight)}>{rank}</div>
                </div>
            </div>
        </button>
    );
}

export default CardButton;
