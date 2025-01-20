import React, { useState } from "react";
import "./PantallaInicio.css";
import introAudio from "/intro.mp3";
import TabIndividual from "./TabIndividual";
import { FaEnvelope, FaInfoCircle } from "react-icons/fa";

const PantallaInicio = ({ onIniciarJuego }) => {
  const [numJugadores, setNumJugadores] = useState("");
  const [error, setError] = useState("");
  const [modoJuego, setModoJuego] = useState(null);
  const [isTooltipVisible, setIsTooltipVisible] = useState(false); // Tooltip para correo
  const [isInfoTooltipVisible, setIsInfoTooltipVisible] = useState(false); // Tooltip para información
  const [isIndividual, setIsIndividual] = useState(false);
  const [showInstructions, setShowInstructions] = useState(false); // Controla si se muestran las instrucciones
  const [userName, setUserName] = useState(""); // Almacena el nombre del jugador
  const [isNameConfirmed, setIsNameConfirmed] = useState(false); // Confirma el nombre del jugador

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
      const audio = new Audio(introAudio);
      audio.play();
      onIniciarJuego(numJugadores);
    } else {
      setError("Por favor, selecciona entre 2 y 4 jugadores.");
    }
  };

  const manejarSeleccionModoJuego = (modo) => {
    setModoJuego(modo);
    setError("");
    setNumJugadores("");

    if (modo === "individual") {
      setIsIndividual(true);
    }
  };

  const handleNameChange = (e) => {
    setUserName(e.target.value);
  };

  const confirmName = () => {
    if (userName.trim() !== "") {
      setIsNameConfirmed(true);
    } else {
      setError("Por favor, introduce un nombre válido.");
    }
  };

  const handleCloseFullScreen = () => {
    setIsIndividual(false);
    setIsNameConfirmed(false);
    setUserName("");
  };

  const toggleInstructions = () => {
    setShowInstructions(!showInstructions); // Cambia entre mostrar y ocultar instrucciones
  };

  return (
    <div className="pantalla-inicio">
      {/* Ícono de correo */}
      <div
        className="icono-correo"
        onMouseEnter={() => setIsTooltipVisible(true)}
        onMouseLeave={() => setIsTooltipVisible(false)}
      >
        <a href="mailto:javimacias@gmail.com">
          <FaEnvelope size={24} />
        </a>
        {isTooltipVisible && (
          <div className="tooltip">
            Envía tus comentarios, ideas o sugerencias al creador del juego.
          </div>
        )}
      </div>

      {/* Ícono de información */}
      <div
        className="icono-info"
        onMouseEnter={() => setIsInfoTooltipVisible(true)}
        onMouseLeave={() => setIsInfoTooltipVisible(false)}
        onClick={toggleInstructions}
      >
        <FaInfoCircle size={24} />
        {isInfoTooltipVisible && (
          <div className="tooltip">
            Pincha para conocer las instrucciones del juego.
          </div>
        )}
      </div>

      {/* Ventana de instrucciones */}
      {showInstructions && (
        <div className="ventana-instrucciones">
          <h2>Instrucciones del Juego</h2>
          <p>1. Selecciona un modo de juego: individual o colectivo.</p>
          <h3>Modo Individual:</h3>
          <p>
            El objetivo es llegar a la cima de la pirámide acertando todas las
            preguntas que se te hagan sobre la década del los 80. Tendrás
            únicamente tres posibilidades de fallo. Si resuelves todas las
            preguntas sin llegar a los tres errores habrás conquistado la
            década. Si no es así, habrás perdido la partida.
          </p>
          <h3>Modo Colectivo:</h3>
          <p>
            El juego permite jugar de dos a cuatro jugadores (o equipos). El
            ordenador decidirá de forma aleatoria quién comienza el juego. Por
            turnos, a cada equipo se le irá haciendo una pregunta. Si esta se
            falla, el rebote pasará al siguiente equipo y así se irá procediendo
            hasta que uno de los equipos o jugadores llegue hasta el centro del
            tablero.
          </p>
          <p>
            2.- Ahora selecciona qué tipo de juego quieres. Si es el colectivo,
            no te olvides de introducir el número de jugadores y darle a
            "iniciar juego". Cuando se te haga una pregunta, solo tendrás que
            apretar la respuesta que creas correcta y esperar a ver si has
            acertado.
          </p>
          <p>Muchas suerte y ¡bienvenido a los 80!</p>
          <button onClick={toggleInstructions}>Cerrar</button>
        </div>
      )}

      <div className="contenedor-seleccion">
        {!isIndividual && (
          <div className="botones-modos">
            <h1>Bienvenido al Juego de los 80s</h1>
            <button onClick={() => manejarSeleccionModoJuego("individual")}>
              Juego Individual
            </button>
            <button onClick={() => manejarSeleccionModoJuego("colectivo")}>
              Juego Colectivo (de 2 a 4 jugadores)
            </button>
          </div>
        )}

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

        {isIndividual && !isNameConfirmed && (
          <div>
            <p>Introduce tu nombre para empezar:</p>
            <input
              type="text"
              placeholder="Tu nombre"
              value={userName}
              onChange={handleNameChange}
            />
            <button onClick={confirmName}>Confirmar Nombre</button>
            {error && <p className="error">{error}</p>}
          </div>
        )}

        {isIndividual && isNameConfirmed && (
          <TabIndividual user={{ name: userName, points: 0 }} onClose={handleCloseFullScreen} />
        )}
      </div>
    </div>
  );
};

export default PantallaInicio;
