import classNames from 'classnames';
import styles from './PlayingCard.module.scss';

interface CardButtonProps {
    children: React.ReactNode;
    suit: string;
    rank: string;
    className?: string;
    onClick?: () => void;
}

function PlayingCard({ onClick, rank, suit, children, className }: CardButtonProps) {
    return (
        <div className={classNames(styles.playingCard, className)} onClick={onClick}>
            <div className={styles.wrapper}>
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
        </div>
    );
}

export default PlayingCard;
