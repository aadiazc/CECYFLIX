import styles from './VideoActions.module.css';
import { FaHeart, FaCommentDots, FaShare } from 'react-icons/fa';

export default function VideoActions() {
    return (
        <div className={styles.actions}>
            <div className={styles.action}>
                <FaHeart />
                <span>120</span>
            </div>
            <div className={styles.action}>
                <FaCommentDots />
                <span>30</span>
            </div>
            <div className={styles.action}>
                <FaShare />
                <span>18</span>
            </div>
        </div>
    );
}