// src/App.js

import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
    const [peliculas, setPeliculas] = useState([]);
    const [input, setInput] = useState('');
    const [peliculasFiltradas, setPeliculasFiltradas] = useState([]);
    const [recomendacionIA, setRecomendacionIA] = useState('');
    const [peliculasRecomendadas, setPeliculasRecomendadas] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showMessageBox, setShowMessageBox] = useState(false);
    const [messageBoxContent, setMessageBoxContent] = useState('');

    const showMessage = (message) => {
        setMessageBoxContent(message);
        setShowMessageBox(true);
        setTimeout(() => {
            setShowMessageBox(false);
            setMessageBoxContent('');
        }, 3000);
    };

    useEffect(() => {
        const fetchPeliculas = async () => {
            try {
                const response = await fetch('https://recomendaciones-backend-gjal.onrender.com/api/peliculas');
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const data = await response.json();
                console.log('Datos de películas recibidos del backend:', data); // Mantener para depuración
                setPeliculas(data);
                setPeliculasFiltradas(data);
            } catch (err) {
                console.error('Error al cargar películas desde el backend:', err);
                setError('No se pudieron cargar las películas. Intenta de nuevo más tarde.');
            } finally {
                setLoading(false);
            }
        };

        fetchPeliculas();
    }, []);

    const handleBuscarTexto = () => {
        setRecomendacionIA('');
        setPeliculasRecomendadas([]);
        setError(null);
        setShowMessageBox(false);

        const texto = input.toLowerCase();
        if (!texto.trim()) {
            showMessage('Por favor, ingresa texto para buscar.');
            setPeliculasFiltradas(peliculas);
            return;
        }

        const filtradas = peliculas.filter((peli) =>
            peli.titulo.toLowerCase().includes(texto) ||
            peli.genero.toLowerCase().includes(texto) ||
            peli.titulo.toLowerCase().startsWith(texto)
        );
        setPeliculasFiltradas(filtradas);
    };

    const handleBuscarDescripcion = async () => {
        setRecomendacionIA('');
        setPeliculasRecomendadas([]);
        setPeliculasFiltradas([]);
        setError(null);
        setShowMessageBox(false);

        if (!input.trim()) {
            showMessage('Por favor, proporciona una descripción detallada para la IA.');
            return;
        }

        setRecomendacionIA('Pensando...');
        try {
            const response = await fetch('https://recomendaciones-backend-gjal.onrender.com/api/recomendaciones', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    prompt: `Tengo una base de datos con estas películas:
                    ${peliculas.map(p => p.titulo).join(', ')}.
                    Quiero que me digas solo los títulos de las películas que coincidan con esta
                    descripción: "${input}".
                    Devuélveme únicamente los títulos separados por comas.`
                }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            const textoIA = data.recomendacion.toLowerCase();
            setRecomendacionIA(data.recomendacion);

            const coincidencias = peliculas.filter((peli) =>
                textoIA.includes(peli.titulo.toLowerCase())
            );
            setPeliculasRecomendadas(coincidencias);
        } catch (err) {
            console.error('Error al obtener recomendación IA:', err);
            setRecomendacionIA('❌ Error al obtener recomendación IA.');
            setError(`Error: ${err.message}. Asegúrate de que el backend esté funcionando.`);
        }
    };

    if (loading) {
        return <div className="App"><h1 className="titulo">Cargando películas...</h1></div>;
    }

    if (error && !loading) {
        return (
            <div className="App">
                <h1 className="titulo">Error</h1>
                <p className="error-message">{error}</p>
                <button onClick={() => window.location.reload()}>Recargar página</button>
            </div>
        );
    }

    return (
        <div className="App">
            <h1 className="titulo">CECYFLIX</h1>
            <div className="buscador">
                <input
                    type="text"
                    // *** CAMBIO AQUÍ: Añadido el atributo id ***
                    id="search-input"
                    placeholder="¿Qué te gustaría ver hoy?"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                />
                <button onClick={handleBuscarTexto}>Buscar</button>
                <button onClick={handleBuscarDescripcion} className="btn-ia">
                    Buscar por descripción
                </button>
            </div>

            {showMessageBox && (
                <div className="message-box">
                    <p>{messageBoxContent}</p>
                </div>
            )}

            {recomendacionIA && (
                <div className="bloque-recomendaciones">
                    <h2>✨ Recomendación IA</h2>
                    <p>{recomendacionIA}</p>
                </div>
            )}

            {peliculasRecomendadas.length > 0 && (
                <div className="galeria">
                    <h2>🎞 Películas recomendadas por IA</h2>
                    <div className="grid">
                        {peliculasRecomendadas.map((peli) => (
                            <div className="tarjeta" key={peli.id}>
                                <img src={peli.poster} alt={peli.titulo} />
                                <div className="info">
                                    <h3>{peli.titulo}</h3>
                                    <p>{peli.descripcion}</p>
                                    <span>{peli.genero}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {peliculasFiltradas.length > 0 && (
                <div className="galeria">
                    <h2>🎬 Todas las películas</h2>
                    <div className="grid">
                        {peliculasFiltradas.map((peli) => (
                            <div className="tarjeta" key={peli.id}>
                                <img src={peli.poster} alt={peli.titulo} />
                                <div className="info">
                                    <h3>{peli.titulo}</h3>
                                    <p>{peli.descripcion}</p>
                                    <span>{peli.genero}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {!loading && peliculasFiltradas.length === 0 && peliculasRecomendadas.length === 0 && !recomendacionIA && input && (
                <p className="no-results">No se encontraron películas para "{input}". Intenta otra búsqueda.</p>
            )}
            {!loading && peliculas.length === 0 && !input && (
                <p className="no-results">No hay películas disponibles. Asegúrate de que los datos estén en MongoDB Atlas.</p>
            )}
        </div>
    );
}

export default App;
