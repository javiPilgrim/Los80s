// src/components/PantallaInicio.jsx
import React, { useState } from "react";
import "./PantallaInicio.css";

const PantallaInicio = ({ onIniciarJuego }) => {
  const [numJugadores, setNumJugadores] = useState(0);

  const manejarCambioJugadores = (e) => {
    setNumJugadores(parseInt(e.target.value) || 0);
  };

  const iniciarJuego = () => {
    if (numJugadores >= 2 && numJugadores <= 4) {
      onIniciarJuego(numJugadores); // Llama a la función de inicio de juego con el número de jugadores seleccionado
    } else {
      alert("Por favor, selecciona entre 2 y 4 jugadores.");
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
          value={numJugadores}
          onChange={manejarCambioJugadores}
        />
        <button onClick={iniciarJuego}>Iniciar Juego</button>
      </div>
    </div>
  );
};

export default PantallaInicio;
