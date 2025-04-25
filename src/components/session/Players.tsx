import { UserRow } from '../../types/DbModels';
import styles from './Players.module.scss';

type PlayerProps = {
    players?: UserRow[];
};

function Players({ players }: PlayerProps) {
    return (
        <div className={styles.players}>
            <h2>PLAYERS</h2>
            <ol>{players?.map((player) => <li key={player.id}>{player.name}</li>)}</ol>
        </div>
    );
}

export default Players;
