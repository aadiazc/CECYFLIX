import { useEffect } from 'react';
import styles from './SplashScreen.module.css';
import logo from '../../assets/cecytok-logo.svg';
function SplashScreen({ onFinish }) {

    useEffect(() => {
        const timer = setTimeout(() => {
            onFinish();}, 2500);    //dura 2.5 segundos
        return () => clearTimeout(timer);
    }, [onFinish]);

    return (
        <div className={styles.splash}>
            <img src={logo} alt="CecyTok Logo" className={styles.logo} />
        </div>
    );
 }

export default SplashScreen;
