import { useState, useEffect } from 'react';
import styles from './VideoFeed.module.css';
import VideoActions from '../VideoActions/VideoActions';

const PEXELS_API_KEY =
    'DKGJDimH4UQte2EBdUAbqz4d7VSUifxeFFCMrnrCyEJM233AZatJ36WK';

const VIDEOS_PER_PAGE = 5; // Número de videos a cargar

export default function VideoFeed() {
    const [videos, setVideos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

useEffect(() => {
    const fetchVideos = async () => {
        try {
            const response = await fetch(
            `https://api.pexels.com/videos/popular?per_page=${VIDEOS_PER_PAGE}`,
            {
                headers: {
                    Authorization: PEXELS_API_KEY
                }
            }
        );
        if (!response.ok) {
            throw new Error('Error al cargar videos');
        }
        const data = await response.json();
        const formattedVideos = data.videos.map(video => ({
            id: video.id,
            src: video.video_files.find(file => file.quality === 'sd').link,
            user: `@${video.user.name.toLowerCase().replace(/\s+/g, '')}`,
            caption: video.url.split('/').pop().replace(/-/g, ''),
            likes: Math.floor(Math.random() * 10000), // Simulamos likes
            duration: video.duration
        }));

        setVideos(formattedVideos);
        } catch (err) {
        setError(err.message);
        // Datos de respaldo en caso de error
        setVideos([
            {
                id: 1,
                src: 'https://player.vimeo.com/external/577443060.sd.mp4?s=4c9a9c0c786fb5c4a85fde9418e1f8d9b3088e8b&profile_id=164',
                user: '@naturelover',
                caption: 'hermoso paisaje natural',
                likes: 3421,
                duration: 25
            }
        ]);
    } finally {
        setLoading(false);
    }
  };

fetchVideos();

}, []);

if (loading) return <div className={styles.loading}>Cargando videos...</div>;
if (error) return <div className={styles.error}>Error: {error}</div>;

return (
    <div className={styles.feed}>
        {videos.map((video) => (
            <div key={video.id} className={styles.videoWrapper}>
                <div className={styles.blurBackground}>
                    <video src={video.src} autoPlay loop muted className={styles.blurVideo} />
                    </div>
                    <div className={styles.videoContainer}>
                        <video
                        src={video.src}
                        autoPlay
                        loop
                        muted
                        className={styles.mainVideo}
                        data-duration={video.duration}
                    />
                    <div className={styles.overlay}>
                        <div className={styles.caption}>
                            <p className={styles.user}>{video.user}</p>
                            <p className={styles.text}>{video.caption}</p>
                        </div>
                    <VideoActions
                        likes={video.likes}
                />
             </div>
            </div>
        </div>
    ))}
   </div>
  );
}