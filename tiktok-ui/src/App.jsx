/*App.jsx*/
import { useState } from 'react';
import styles from './App.module.css';
import SplashScreen from './components/SplashScreen/SplashScreen';
import VideoFeed from './components/VideoFeed/VideoFeed';
import BottomNav from './components/BottomNav/BottomNav';
import logo from './assets/cecytok-logo.svg';

function App() {
  const [loading, setLoading] = useState(true);

  return (
    <div className={styles.app}>
      {loading && <SplashScreen onFinish={() => setLoading(false)} />}
      {!loading && (
        <>
          <header className={styles.header}>
            <img src={logo} alt="CecyTok Logo"/>
          </header>
          <VideoFeed />
          <BottomNav />
        </>
      )}
    </div>
  );
}

export default App;