/*
const express = require('express');
const router = express.Router();

// Importa el modelo de Película para poder acceder a los datos de las películas
const Pelicula = require('../models/Pelicula');

// Ruta POST para obtener recomendaciones de IA usando OpenRouter
router.post('/', async (req, res) => {
  try {
    const { prompt } = req.body; // Obtiene el prompt (descripción de búsqueda) del cuerpo de la solicitud

    if (!prompt) {
      return res.status(400).json({ mensaje: 'Se requiere un prompt para la recomendación de IA.' });
    }

    // Obtener todas las películas de la base de datos para pasar al modelo de IA
    const peliculas = await Pelicula.find({});
    const catalogoPeliculas = peliculas.map(p => p.titulo).join(', ');

    // Construye los mensajes para la API de chat de OpenRouter (formato OpenAI-compatible)
    const messages = [
      {
        role: "user",
        content: `Dame una recomendación de película basada en esta descripción: "${prompt}". Usa solo películas de este catálogo: ${catalogoPeliculas}. Si no encuentras una coincidencia directa, sugiere la película más cercana o un género relacionado de tu catálogo.`
      }
    ];

    const payload = {
      model: "mistralai/mistral-7b-instruct", // Puedes cambiar este modelo por otro soportado por OpenRouter, por ejemplo: "mistralai/mistral-7b-instruct", "openai/gpt-3.5-turbo"
      messages: messages,
      temperature: 0.7, // Puedes ajustar la temperatura para controlar la creatividad (0.0 a 1.0)
    };

    // Lee la API Key de OpenRouter desde las variables de entorno
    const openRouterApiKey = process.env.OPENROUTER_API_KEY;

    if (!openRouterApiKey) {
      console.error('Error: OPENROUTER_API_KEY no está definida en las variables de entorno.');
      return res.status(500).json({ mensaje: 'Error de configuración del servidor: Clave de API de OpenRouter no encontrada.' });
    }

    const apiUrl = `https://openrouter.ai/api/v1/chat/completions`;

    console.log('Enviando solicitud a la API de OpenRouter...');
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${openRouterApiKey}`, // Encabezado de autorización para OpenRouter
        //'HTTP-Referer': 'https://recomendaciones-backend-gjal.onrender.com', // Opcional: tu dominio de referencia
        'X-Title': 'CineVerse App' // Opcional: nombre de tu aplicación
      },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Error en la respuesta de la API de OpenRouter:', response.status, errorText);
      return res.status(response.status).json({ mensaje: `Error al obtener recomendación de IA: ${errorText}` });
    }

    const result = await response.json();
    console.log('Respuesta de OpenRouter:', JSON.stringify(result, null, 2));

    let recomendacionTexto = 'No se pudo obtener una recomendación.';

    // La respuesta de OpenRouter (formato OpenAI) tiene la recomendación en choices[0].message.content
    if (result.choices && result.choices.length > 0 && result.choices[0].message && result.choices[0].message.content) {
      recomendacionTexto = result.choices[0].message.content;
    } else {
      console.warn('Estructura de respuesta de OpenRouter inesperada o contenido vacío.');
    }

    // Envía la recomendación de vuelta al frontend
    res.json({ recomendacion: recomendacionTexto });

  } catch (error) {
    console.error('Error en la ruta /api/recomendaciones con OpenRouter:', error);
    res.status(500).json({ mensaje: 'Error interno del servidor al procesar la recomendación de IA con OpenRouter.' });
  }
});

module.exports = router;*/

const express = require('express');
const router = express.Router();

// Importa el modelo de Película para poder acceder a los datos de las películas
const Pelicula = require('../models/Pelicula');

// Ruta POST para obtener recomendaciones de IA usando OpenRouter
router.post('/', async (req, res) => {
  try {
    const { prompt } = req.body; // Obtiene el prompt (descripción de búsqueda) del cuerpo de la solicitud

    // --- LOG DEPURACIÓN: Qué prompt está llegando ---
    console.log('Recibida solicitud para recomendación IA. Prompt:', prompt);

    if (!prompt) {
      return res.status(400).json({ mensaje: 'Se requiere un prompt para la recomendación de IA.' });
    }

    // Obtener todas las películas de la base de datos para pasar al modelo de IA
    const peliculas = await Pelicula.find({});
    const catalogoPeliculas = peliculas.map(p => p.titulo).join(', ');

    // --- LOG DEPURACIÓN: Catálogo de películas enviado a la IA ---
    console.log('Catálogo de películas para IA:', catalogoPeliculas ? 'Cargado' : 'Vacío');

    // Construye los mensajes para la API de chat de OpenRouter (formato OpenAI-compatible)
    const messages = [
      {
        role: "user",
        content: `Dame una recomendación de película basada en esta descripción: "${prompt}". Usa solo películas de este catálogo: ${catalogoPeliculas}. Si no encuentras una coincidencia directa, sugiere la película más cercana o un género relacionado de tu catálogo.`
      }
    ];

    const modelToUse = "google/gemini-pro"; // Asegúrate de que este sea el modelo deseado

    const payload = {
      model: modelToUse,
      messages: messages,
      temperature: 0.7,
    };

    // --- LOG DEPURACIÓN: Modelo de IA que se va a usar ---
    console.log('Modelo de IA configurado para la solicitud:', payload.model);

    // Lee la API Key de OpenRouter desde las variables de entorno
    const openRouterApiKey = process.env.OPENROUTER_API_KEY;

    // --- LOG DEPURACIÓN: Estado de la API Key (no el valor completo por seguridad) ---
    console.log('Estado de OPENROUTER_API_KEY:', openRouterApiKey ? 'Presente' : 'NO PRESENTE');

    if (!openRouterApiKey) {
      console.error('Error: OPENROUTER_API_KEY no está definida en las variables de entorno.');
      return res.status(500).json({ mensaje: 'Error de configuración del servidor: Clave de API de OpenRouter no encontrada.' });
    }

    const apiUrl = `https://openrouter.ai/api/v1/chat/completions`;

    console.log('Enviando solicitud a la API de OpenRouter a:', apiUrl);
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${openRouterApiKey}`,
        'HTTP-Referer': 'https://recomendaciones-backend-gjal.onrender.com', // Asegúrate de que este sea el dominio correcto de tu backend en Render
        'X-Title': 'CECYFLIX App'
      },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Error en la respuesta de la API de OpenRouter:', response.status, errorText);
      // Intentar parsear errorText si es JSON, sino usarlo directamente
      let errorMessage = errorText;
      try {
        const parsedError = JSON.parse(errorText);
        errorMessage = parsedError.error.message || errorText;
      } catch (e) {
        // No es JSON, usar el texto plano
      }
      return res.status(response.status).json({ mensaje: `Error al obtener recomendación de IA: ${errorMessage}` });
    }

    const result = await response.json();
    console.log('Respuesta cruda de OpenRouter:', JSON.stringify(result, null, 2));

    let recomendacionTexto = 'No se pudo obtener una recomendación.';

    if (result.choices && result.choices.length > 0 && result.choices[0].message && result.choices[0].message.content) {
      recomendacionTexto = result.choices[0].message.content;
    } else {
      console.warn('Estructura de respuesta de OpenRouter inesperada o contenido vacío.');
    }

    console.log('Recomendación generada por IA:', recomendacionTexto);
    res.json({ recomendacion: recomendacionTexto });

  } catch (error) {
    console.error('ERROR CRÍTICO en la ruta /api/recomendaciones con OpenRouter:', error);
    res.status(500).json({ mensaje: 'Error interno del servidor al procesar la recomendación de IA con OpenRouter.' });
  }
});

module.exports = router;