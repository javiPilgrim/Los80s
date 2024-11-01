// src/components/Juego80s.jsx

import React, { useState, useEffect, useRef } from "react";
import Tablero from "./Tablero";
import PantallaInicio from "./PantallaInicio"; 
import preguntas from "../data/preguntas" // Importa las preguntas
import "./Juego80s.css";



// Inicialización de las posiciones y giros iniciales de los jugadores
const inicializarJugadores = (numJugadores) => {
  const posicionesBase = [
    { id: 1, posicion: { x: 120, y: 170 }, giro: 0 },
    { id: 2, posicion: { x: 1650, y: 170 }, giro: 0 },
    { id: 3, posicion: { x: 120, y: 850 }, giro: 0 },
    { id: 4, posicion: { x: 1650, y: 850 }, giro: 0 },
  ];
  return posicionesBase.slice(0, numJugadores);
};

const moverJugador = (jugador) => {
  const { id, giro, posicion } = jugador;
  let nuevaPosicion = { ...posicion };

  if (id === 1) {
    if ([1, 2, 3, 8, 9, 11].includes(giro)) nuevaPosicion.x += 200;
    else if ([4, 7].includes(giro)) nuevaPosicion.y += 95;
    else if ([5, 6].includes(giro)) nuevaPosicion.x -= 200;
    else if (giro === 10) nuevaPosicion = { x: 320, y: 455 };
    else if (giro === 12) nuevaPosicion = { x: 960, y: 500 };
  } else if (id === 2) {
    if ([1, 2, 3, 8, 9, 11].includes(giro)) nuevaPosicion.x -= 200;
    else if ([4, 7].includes(giro)) nuevaPosicion.y += 95;
    else if ([5, 6].includes(giro)) nuevaPosicion.x += 200;
    else if (giro === 10) nuevaPosicion = { x: 1450, y: 455 };
    else if (giro === 12) nuevaPosicion = { x: 955, y: 500 };
  } else if (id === 3) {
    if ([1, 2, 3, 8, 9, 11].includes(giro)) nuevaPosicion.x += 200;
    else if ([4, 7].includes(giro)) nuevaPosicion.y -= 95;
    else if ([5, 6].includes(giro)) nuevaPosicion.x -= 200;
    else if (giro === 10) nuevaPosicion = { x: 320, y: 565 };
    else if (giro === 12) nuevaPosicion = { x: 955, y: 500 };
  } else if (id === 4) {
    if ([1, 2, 3, 8, 9, 11].includes(giro)) nuevaPosicion.x -= 200;
    else if ([4, 7].includes(giro)) nuevaPosicion.y -= 95;
    else if ([5, 6].includes(giro)) nuevaPosicion.x += 200;
    else if (giro === 10) nuevaPosicion = { x: 1450, y: 565 };
    else if (giro === 12) nuevaPosicion = { x: 955, y: 500 };
  }

  return nuevaPosicion;
};

const Juego80s = () => {
  const [numJugadores, setNumJugadores] = useState(0);
  const [jugadores, setJugadores] = useState([]);
  const [indicePregunta, setIndicePregunta] = useState(0);
  const [respuesta, setRespuesta] = useState("");
  const [turno, setTurno] = useState(0);
  const [finJuego, setFinJuego] = useState(false);
  const [tamañoFicha, setTamañoFicha] = useState(50);
  const [mostrarMensaje, setMostrarMensaje] = useState(false);
  const [respuestaIncorrecta, setRespuestaIncorrecta] = useState(false);
  const [ganador, setGanador] = useState(null);
  const [juegoIniciado, setJuegoIniciado] = useState(false);

  const audioRef = useRef(null); // Ref para el elemento de audio

  useEffect(() => {
    const ajustarTamañoFicha = () => {
      const tamaño = Math.min(window.innerWidth, window.innerHeight) * 0.05;
      setTamañoFicha(tamaño);
    };

    ajustarTamañoFicha();
    window.addEventListener("resize", ajustarTamañoFicha);

    return () => window.removeEventListener("resize", ajustarTamañoFicha);
  }, []);

  useEffect(() => {
    if (audioRef.current) {
      const pregunta = preguntas[indicePregunta];
      if (pregunta.music) {
        audioRef.current.src = pregunta.music;
        audioRef.current.play().catch((error) => {
          console.log("El navegador bloqueó la reproducción automática de audio:", error);
        });
      } else {
        audioRef.current.pause();
        audioRef.current.src = "";
      }
    }
  }, [indicePregunta]);

  const pasarTurno = () => {
    setTurno((turno + 1) % jugadores.length); // Pasar al siguiente jugador
    setRespuesta(""); // Limpiar la respuesta actual
  };

  const verificarRespuesta = () => {
    const respuestaCorrecta = respuesta.trim().toLowerCase() === preguntas[indicePregunta].respuesta.trim().toLowerCase();

    if (!respuesta.trim()) return;

    if (respuestaCorrecta) {
      setMostrarMensaje(true);

      setTimeout(() => {
        setMostrarMensaje(false);
        setJugadores((prevJugadores) =>
          prevJugadores.map((jugador, index) =>
            index === turno
              ? {
                  ...jugador,
                  giro: jugador.giro + 1,
                  posicion: moverJugador({ ...jugador, giro: jugador.giro + 1 }),
                }
              : jugador
          )
        );

        if (jugadores[turno].giro + 1 === 12) {
          setGanador(turno + 1);
          setFinJuego(true);
        } else {
          setIndicePregunta((prev) => prev + 1);
        }
      }, 1000);
    } else {
      setRespuestaIncorrecta(true);
      setTimeout(() => setRespuestaIncorrecta(false), 1000);
    }
    setTurno((turno + 1) % jugadores.length);
    setRespuesta("");
  };

  const reiniciarJuego = () => {
    setJugadores(inicializarJugadores(numJugadores));
    setGanador(null);
    setFinJuego(false);
    setIndicePregunta(0);
    setTurno(0);
  };

  const iniciarJuego = (num) => {
    setNumJugadores(num);
    setJugadores(inicializarJugadores(num));
    setJuegoIniciado(true); // Cambia el estado a iniciado
  };

  const volverAEscuchar = () => {
    if (audioRef.current) {
      audioRef.current.currentTime = 0; // Reinicia el audio al comienzo
      audioRef.current.play().catch((error) => {
        console.error("Error al volver a reproducir el audio:", error);
      });
    }
  };

  if (!juegoIniciado) {
    return <PantallaInicio onIniciarJuego={iniciarJuego} />; // Muestra la pantalla de inicio
  }

  const pregunta = preguntas[indicePregunta]; // Variable para la pregunta actual

  return (
    <div className="contenedor-principal">
      <Tablero
        posicionRoja={jugadores[0].posicion}
        posicionAzul={jugadores[1]?.posicion}
        posicionAmarilla={jugadores[2]?.posicion}
        posicionVerde={jugadores[3]?.posicion}
        tamañoFicha={tamañoFicha}
        numJugadores={numJugadores}
      />
       <audio ref={audioRef} />
      <div className={mostrarMensaje ? "mensaje-correcto" : "mensaje-incorrecto"} style={{ display: mostrarMensaje || respuestaIncorrecta ? "block" : "none" }}>
        <h3>{mostrarMensaje ? "¡RESPUESTA CORRECTA!" : "Respuesta incorrecta."}</h3>
      </div>
      {!mostrarMensaje && (
        <div className="panel-pregunta">
          <h3>Turno del Jugador {turno + 1}</h3>
          <img className="imagen-pregunta"
        src={preguntas[indicePregunta].imagen} />
          <h3>{preguntas[indicePregunta].pregunta}</h3>
          
          <input type="text" value={respuesta} onChange={(e) => setRespuesta(e.target.value)} />
          <button onClick={verificarRespuesta}>Responder</button>
          <button onClick={pasarTurno}>Pasar</button> 
             {/* Botón de "Volver a Escuchar" si hay música */}
             {pregunta.music && (
            <button onClick={volverAEscuchar}>Volver a Escuchar</button>
          )}
        </div>
      )}
      {finJuego && ganador && (
         <div
         style={{
           position: "absolute",
           top: "50%",
           left: "50%",
           transform: "translate(-50%, -50%)",
           backgroundColor: "rgba(0, 255, 0, 0.8)",
           padding: "20px",
           borderRadius: "10px",
           color: "white",
           fontSize: "2rem",
           textAlign: "center",
           zIndex: 1000,
         }}
       >
         <h3>¡Jugador {ganador} ha ganado la partida!</h3>
         <button onClick={reiniciarJuego}>Reiniciar Juego</button>
       </div>
     )}
     <button className="Reinicio"
        onClick={reiniciarJuego}
      >
        Reiniciar
      </button>
    </div>
  );
};

export default Juego80s;