import styles from './BottomNav.module.css';
import { FaHome, FaSearch, FaPlusSquare, FaUser } from 'react-icons/fa';
export default function BottomNav() {

    return (
        <div className={styles.nav}>
            <FaHome className={styles.icon} />
            <FaSearch className={styles.icon} />
            <FaPlusSquare className={styles.add} />
            <FaUser className={styles.icon} />
        </div>
    );
}
