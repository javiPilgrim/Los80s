import React, { useState, useEffect } from "react";
import "./PantallaInicio.css";
import introAudio from "/intro.mp3"; // Asegúrate de que la ruta al archivo de audio sea correcta
import TabIndividual from "./TabIndividual";

const PantallaInicio = ({ onIniciarJuego }) => {
  const [numJugadores, setNumJugadores] = useState("");
  const [error, setError] = useState("");
  const [modoJuego, setModoJuego] = useState(null); // Añadido para controlar el modo de juego
  const [mensajeEnConstruccionVisible, setMensajeEnConstruccionVisible] = useState(false); // Controla la visibilidad del mensaje
  const audio = new Audio(introAudio); // Crear el objeto de audio
  const [isIndividual, setIsIndividual] = useState(false);


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

  const manejarSeleccionModoJuego = (modo) => {
    setModoJuego(modo); // Cambiar el modo de juego
    setError(""); // Limpiar el error cuando cambie el modo
    setNumJugadores(""); // Limpiar el número de jugadores cuando cambie el modo

    if (modo === "individual") {
      
      setIsIndividual(true);
    }
  };

  const handleCloseFullScreen = () => {
    setIsIndividual(false);
  };

  return (
    <div className="pantalla-inicio">
      <div className="contenedor-seleccion">
        <h1>Bienvenido al Juego de los 80s</h1>

        {/* Botones para seleccionar el modo de juego */}
        <div className="botones-modos">
          <button onClick={() => manejarSeleccionModoJuego("individual")}>
            Juego Individual
          </button>
          <button onClick={() => manejarSeleccionModoJuego("colectivo")}>
            Juego Colectivo (de 2 a 4 jugadores)
          </button>
        </div>

        {/* Condicionalmente mostrar input para número de jugadores si se selecciona "colectivo" */}
        {modoJuego === "colectivo" && (
          <div>
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
        )}

{isIndividual && <TabIndividual onClose={handleCloseFullScreen} />}

      </div>
    </div>
  );
};

export default PantallaInicio;
