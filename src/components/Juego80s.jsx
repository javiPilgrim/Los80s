import React, { useState, useEffect, useRef } from "react";
import Tablero from "./Tablero";
import PantallaInicio from "./PantallaInicio";
import preguntas from "../data/preguntas"; // Importa las preguntas
import "./Juego80s.css";

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
  const [preguntasRestantes, setPreguntasRestantes] = useState([]);
  const [turno, setTurno] = useState(0);
  const [finJuego, setFinJuego] = useState(false);
  const [tamañoFicha, setTamañoFicha] = useState(100);
  const [mostrarMensaje, setMostrarMensaje] = useState(false);
  const [respuestaIncorrecta, setRespuestaIncorrecta] = useState(false);
  const [ganador, setGanador] = useState(null);
  const [juegoIniciado, setJuegoIniciado] = useState(false);
  const [mostrarInicio, setMostrarInicio] = useState(true);
  const [mostrarSeleccionInicial, setMostrarSeleccionInicial] = useState(false);
  const [jugadorInicial, setJugadorInicial] = useState(null);

  const audioRef = useRef(null);
  const aplausoRef = useRef(new Audio("/aplauso.mp3"));
  const aplausoFinalRef = useRef(new Audio("/aplausofinal.mp3"));
  const movFichaRef = useRef(new Audio("/movficha.mp3"));
  const abucheoRef = useRef(new Audio("/abucheo.mp3"));
  const introRef = useRef(new Audio("/intro.mp3"));

  useEffect(() => {
    const ajustarTamañoFicha = () => {
      const tamaño = Math.min(window.innerWidth, window.innerHeight) * 0.07;
      setTamañoFicha(tamaño);
    };

    ajustarTamañoFicha();
    window.addEventListener("resize", ajustarTamañoFicha);

    return () => window.removeEventListener("resize", ajustarTamañoFicha);
  }, []);

  useEffect(() => {
    if (audioRef.current) {
      const pregunta = preguntasRestantes[0];
      if (pregunta && pregunta.music) {
        audioRef.current.src = pregunta.music;
        audioRef.current.play().catch((error) => {
          console.log("El navegador bloqueó la reproducción automática de audio:", error);
        });
      } else {
        audioRef.current.pause();
        audioRef.current.src = "";
      }
    }
  }, [preguntasRestantes]);

  const verificarRespuesta = (opcion) => {
    const preguntaActual = preguntasRestantes[0];
    const respuestaCorrecta = opcion === preguntaActual.respuesta;
  
    if (respuestaCorrecta) {
      // Verificar si el jugador gana antes de reproducir aplauso normal
      if (jugadores[turno].giro + 1 === 12) {
        setGanador(turno + 1);
        setFinJuego(true);
        
        aplausoFinalRef.current.play().catch((error) => {
          console.error("Error al reproducir aplauso final:", error);
        });
  
        return; // Salir de la función para evitar que el aplauso normal se reproduzca
      }
  
      // Reproducir aplauso normal si aún no ha ganado
      aplausoRef.current.play();
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
  
        movFichaRef.current.play(); // Reproducir sonido de movimiento al mover la ficha
  
        // Avanzar a la siguiente pregunta
        setPreguntasRestantes((prev) => prev.slice(1));
      }, 1000);
    } else {
      abucheoRef.current.play(); // Reproducir abucheo al fallar
      setRespuestaIncorrecta(true);
      setTimeout(() => setRespuestaIncorrecta(false), 1000);
    }
  
    // Cambiar de turno
    setTurno((turno + 1) % jugadores.length);
  };

  const elegirJugadorInicial = (num) => {
    const turnoAleatorio = Math.floor(Math.random() * num)

    setTimeout(() => {
        setJuegoIniciado(true)
        setTurno(turnoAleatorio);
        console.log('el turno es para:', turnoAleatorio)
        console.log('num de jugadores', numJugadores)
        setJugadorInicial(turnoAleatorio)
        setMostrarSeleccionInicial(false);
    }, 3000);
};
  
  

  const reiniciarJuego = () => {
    setJugadorInicial(null)
    setJugadores(inicializarJugadores(numJugadores));
    setGanador(null);
    setFinJuego(false);
    setPreguntasRestantes(shuffleArray(preguntasRestantes));
    setJuegoIniciado(true); // Da el valor true a JuegoIniciado
    setMostrarInicio(true);
    setMostrarSeleccionInicial(true)
    introRef.current.play();
    setTimeout(() => {
      setMostrarInicio(false); // a los dos segundos borra el mensaje de inicio
      setMostrarSeleccionInicial(true); // Muestra la ventana de selección inicial
      elegirJugadorInicial(numJugadores); // llama a la elección de jugador inicial
  }, 2000);
  };

  const salirDelJuego = () => {
    setJuegoIniciado(false); // Regresa al componente PantallaInicio
    setFinJuego(false);      // Reinicia el estado de fin de juego
    setGanador(null);         // Reinicia el ganador
  };

  const iniciarJuego = (num) => {
    setNumJugadores(num);  //  fija el numero de jugadores
    setJugadores(inicializarJugadores(num)); // posiciona los jugadores en el tablero
    setJuegoIniciado(true); // Da el valor true a JuegoIniciado
    setPreguntasRestantes(shuffleArray(preguntas)); //Mezcla las preguntas que se utilizarán a partir de ahora
    setMostrarInicio(true); // muestra el mensaje de comienzo de juego
    setTimeout(() => {
        setMostrarInicio(false); // a los dos segundos borra el mensaje de inicio
        setMostrarSeleccionInicial(true); // Muestra la ventana de selección inicial
        elegirJugadorInicial(num); // llama a la elección de jugador inicial
    }, 2000);
};


  const volverAEscuchar = () => {
    if (audioRef.current) {
      audioRef.current.currentTime = 0;
      audioRef.current.play().catch((error) => {
        console.error("Error al volver a reproducir el audio:", error);
      });
    }
  };

  if (!juegoIniciado) {
    return <PantallaInicio onIniciarJuego={iniciarJuego} />;
  }

  const pregunta = preguntasRestantes[0];

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

      {mostrarInicio && (
        <div className="imagen-inicio">
          <img src="/intro.jpg" alt="Comienza el Juego" />
        </div>
      )}

{mostrarSeleccionInicial && (
    <div
        style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            backgroundColor: "rgba(0, 0, 0, 0.8)",
            padding: "20px",
            borderRadius: "10px",
            color: "white",
            fontSize: "1.5rem",
            textAlign: "center",
            zIndex: 1000,
        }}
    >
        <h3>Eligiendo quién comienza...</h3>
        <div style={{ display: "flex", justifyContent: "center", marginTop: "20px" }}>
            {jugadores.map((jugador, index) => (
                <div
                    key={index}
                    style={{
                        width: "50px",
                        height: "50px",
                        backgroundColor: index === 0 ? "red" : index === 1 ? "blue" : index === 2 ? "yellow" : "green",
                        borderRadius: "50%",
                        margin: "0 10px",
                        transform: `rotate(${index === turno ? "360deg" : "0deg"})`,
                        transition: "transform 0.3s",
                    }}
                />
            ))}
        </div>
    </div>
)}
      
      <div className={mostrarMensaje ? "mensaje-correcto" : "mensaje-incorrecto"} style={{ display: mostrarMensaje || respuestaIncorrecta ? "block" : "none" }}>
        <h3>{mostrarMensaje ? "¡RESPUESTA CORRECTA!" : "Respuesta incorrecta."}</h3>
      </div>
      {jugadorInicial !== null && !mostrarMensaje && !finJuego && pregunta && (
        <div className="panel-pregunta">
          <h3>Turno del Jugador {turno + 1}</h3>
          {pregunta.imagen && <img className="imagen-pregunta" src={pregunta.imagen} alt="Imagen de la pregunta" />}
          <h3>{pregunta.pregunta}</h3>
          {pregunta.opciones.map((opcion, index) => (
            <button key={index} onClick={() => verificarRespuesta(opcion)}>
              {opcion}
            </button>
          ))}
          {pregunta.music && <button onClick={volverAEscuchar}>Volver a Escuchar</button>}
        </div>
      )}
      {finJuego && ganador && (
        <div
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            backgroundColor: "rgba(0, 0, 0, 0.8)",
            padding: "20px",
            borderRadius: "10px",
            color: "white",
            fontSize: "2rem",
            textAlign: "center",
            zIndex: 1000,
          }}
        >
          <img src="/victoria.jpg" alt="Victoria" style={{ maxWidth: "300px", marginBottom: "20px" }} />
          <h3>¡Jugador {ganador} ha ganado la partida!</h3>
          <button onClick={reiniciarJuego}>Reiniciar partida</button>
          <button onClick={salirDelJuego}>Salir del juego</button>
        </div>
      )}

      <button className="Reinicio" onClick={reiniciarJuego}>
        Reiniciar
      </button>
    </div>
  );
};

// Función para mezclar las preguntas
const shuffleArray = (array) => {
  return array.sort(() => Math.random() - 0.5);
};

export default Juego80s;