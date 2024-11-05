import React, { useState } from "react";
import "./PantallaInicio.css";
import introAudio from "/intro.mp3" // Asegúrate de que la ruta al archivo de audio sea correcta

const PantallaInicio = ({ onIniciarJuego }) => {
  const [numJugadores, setNumJugadores] = useState("");
  const [error, setError] = useState("");
  const audio = new Audio(introAudio); // Crear el objeto de audio

  const manejarCambioJugadores = (e) => {
    const value = parseInt(e.target.value) || "";
    setNumJugadores(value);

    if (value < 2 || value > 4) {
      setError("Por favor, selecciona entre 2 y 4 jugadores.");
    } else {
      setError("");
    }
  };

  const iniciarJuego = () => {
    if (numJugadores >= 2 && numJugadores <= 4) {
      audio.play(); // Reproducir el audio
      onIniciarJuego(numJugadores); // Llama a la función de inicio de juego con el número de jugadores seleccionado
    } else {
      setError("Por favor, selecciona entre 2 y 4 jugadores.");
    }
  };

  return (
    <div className="pantalla-inicio">
      <div className="contenedor-seleccion">
        <h1>Bienvenido al Juego de los 80s</h1>
        <p>Selecciona el número de jugadores (2 a 4):</p>
        <input
          type="number"
          min="2"
          max="4"
          placeholder="Número de jugadores"
          value={numJugadores}
          onChange={manejarCambioJugadores}
        />
        <button onClick={iniciarJuego}>Iniciar Juego</button>
        {error && <p className="error">{error}</p>}
      </div>
    </div>
  );
};

export default PantallaInicio;
