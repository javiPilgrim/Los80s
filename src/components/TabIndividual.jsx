import React, { useState, useEffect, useRef } from 'react';
import preguntas from '../data/preguntas';
import '../components/TabIndividual.css';

const TabIndividual = ({ onClose }) => {
  const [imageIndex, setImageIndex] = useState(0);
  const [preguntaActual, setPreguntaActual] = useState(null);
  const [mostrarMensaje, setMostrarMensaje] = useState(false);
  const [aciertos, setAciertos] = useState(0);
  const [finJuego, setFinJuego] = useState(false);
  const [errores, setErrores] = useState(0);
  const [mostrarError, setMostrarError] = useState(false); // Controla el popup de error
  const [mostrarVentanaInicio, setMostrarVentanaInicio] = useState(true);
  const [imagenErrorActual, setImagenErrorActual] = useState('/errores/fotoMcfly.jpeg'); // Imagen actual de error
  const [mostrarMensajePerdida, setMostrarMensajePerdida] = useState(false); // Nuevo estado para mostrar el mensaje de "Has perdido"
  const [preguntasUsadas, setPreguntasUsadas] = useState([]); // Nuevo estado para preguntas usadas
  const [mostrarVentanaVictoria, setMostrarVentanaVictoria] = useState(false); // Estado para la ventana de victoria
  


  const aplausoRef = new Audio('/aplauso.mp3');
  const campanillasRef = new Audio('/campanillas.mp3');
  const audioPreguntaRef = useRef(null);
  const movFichaRef = useRef(new Audio("/movficha.mp3"));
  const introRef = useRef(new Audio("/intro.mp3"));
  const aplausofinalRef = new Audio('/aplausofinal.mp3');

  // Lista de imágenes para cada error
  const imagenesErrores = [
    '/errores/fotoMcfly1.jpeg',
    '/errores/fotoMcfly2.jpeg',
    '/errores/fotoMcfly3.jpeg',
  ];

  useEffect(() => {
    if (mostrarVentanaInicio) {
      // Reproducir la pista de intro cuando se abre la ventana de inicio
      introRef.current.play().catch((error) => {
        console.log("El navegador bloqueó la reproducción automática de audio:", error);
      });
    }
  }, [mostrarVentanaInicio]);

  useEffect(() => {
    seleccionarPreguntaAleatoria();
  }, []);

  useEffect(() => {
    if (audioPreguntaRef.current) {
      audioPreguntaRef.current.pause();
      audioPreguntaRef.current.currentTime = 0;
    }
    if (preguntaActual && preguntaActual.music && audioPreguntaRef.current) {
      audioPreguntaRef.current.src = preguntaActual.music;
      audioPreguntaRef.current.play().catch(error => {
        console.log("El navegador bloqueó la reproducción automática de audio:", error);
      });
    }
  }, [preguntaActual]);

  const seleccionarPreguntaAleatoria = () => {
    const preguntasDisponibles = preguntas.filter((_, index) => !preguntasUsadas.includes(index));
    if (preguntasDisponibles.length === 0) {
      // Reinicia preguntas usadas si todas ya han sido usadas
      setPreguntasUsadas([]);
      return;
    }
    const preguntaAleatoria = preguntasDisponibles[Math.floor(Math.random() * preguntasDisponibles.length)];
    setPreguntaActual(preguntaAleatoria);
    setPreguntasUsadas([...preguntasUsadas, preguntas.indexOf(preguntaAleatoria)]); // Agrega pregunta actual a preguntas usadas
  };

  const handleOptionClick = (opcion) => {
    if (opcion === preguntaActual.respuesta) {
      setAciertos(aciertos + 1);
      aplausoRef.play();
      setMostrarMensaje(true);
      movFichaRef.current.play();

      if (aciertos + 1 === 31) {
        setMostrarMensaje(false)
        mostrarVictoria(); // Llamamos a la función para mostrar la ventana de victoria
      }

      setImageIndex((prevIndex) => (prevIndex + 1) % 31);
      setTimeout(() => {
        setMostrarMensaje(false);
        seleccionarPreguntaAleatoria();
      }, 1000);
    } else {
      campanillasRef.play();
      mostrarTransicionError();
      setErrores(errores + 1);
      if (errores + 1 >= 3) {
        setFinJuego(true);
      }
    }
  };
  const mostrarTransicionError = () => {
    setMostrarError(true);
    setImagenErrorActual(errores === 0 ? '/errores/fotoMcfly.jpeg' : imagenesErrores[errores - 1]);
    setTimeout(() => {
      if (errores + 1 < 3) {
        setImagenErrorActual(imagenesErrores[errores]);
      } else {
        setImagenErrorActual(imagenesErrores[2]);
      }
      const ventanaErrorElement = document.querySelector(".imagen-error-container");
      ventanaErrorElement.classList.add("fade-out");
      setTimeout(() => {
        setMostrarError(false);
        if (errores + 1 >= 3) {
          setMostrarMensajePerdida(true);
        }
      }, 2000);
    }, 500);
  };

  const mostrarVictoria = () => {
    setMostrarVentanaVictoria(true); // Muestra la ventana de victoria
    aplausofinalRef.current.play().catch(error => {
      console.log("Error al reproducir el audio final:", error);
    });
  };

  const cerrarVentanaInicio = () => {
    setMostrarVentanaInicio(false);
  };

  const salirDelJuego = () => {
    window.location.reload();
  };

  const reiniciarJuego = () => {
    setAciertos(0);
    setErrores(0);
    setFinJuego(false);
    setImageIndex(0);
    setMostrarVentanaInicio(true);
    setMostrarMensajePerdida(false);
    setMostrarVentanaVictoria(false);
  };

  const volverAEscuchar = () => {
    if (audioPreguntaRef.current) {
      audioPreguntaRef.current.currentTime = 0;
      audioPreguntaRef.current.play().catch(error => {
        console.error("Error al volver a reproducir el audio:", error);
      });
    }
  };


  return (
    <div className="full-screen-container">

            {/* Ventana de victoria */}
            {mostrarVentanaVictoria && (
        <div className="ventana-inicio">
          <img src="/victoria.jpg" alt="Victoria" className="imagen-victoria" />
          <h1>¡Felicidades, has ganado!</h1>
          <button onClick={reiniciarJuego} className="boton-reiniciar">Reiniciar partida</button>
          <button onClick={salirDelJuego} className="boton-salir">Salir del juego</button>
        </div>
      )}

      {/* Ventana inicial */}
      {mostrarVentanaInicio && (
        <div className="ventana-inicio">
          <img src="/errores/fotoMcfly.jpeg" alt="Marty McFly" className="imagen-bienvenida" />
          <h4>
            Marty McFly está a punto de desaparecer. Solo puedes cometer tres errores si quieres que Marty y sus hermanos puedan seguir existiendo. ¡Suerte!
          </h4>
          <button onClick={cerrarVentanaInicio} className="boton-cerrar">Cerrar ventana y empezar el juego</button>
        </div>
      )}

      <img src={`/tabIndividual/Tablero${imageIndex}.png`} alt="Tablero" className="full-screen-image" />

      {/* Ventana de error con transición de imagen */}
      {mostrarError && errores <= 3 && (
        <div className="imagen-error-container">
          <img
            src={imagenErrorActual}
            alt={`Error ${errores}`}
            className="imagen-error"
          />
        </div>
      )}

      {preguntaActual && !finJuego && !mostrarVentanaInicio && (
        <div className="question-container">
          <h2>{preguntaActual.pregunta}</h2>
          {preguntaActual.imagen && (
            <img src={preguntaActual.imagen} alt="Imagen de la pregunta" className="imagen-pregunta" />
          )}
          <div className="options-container">
            {preguntaActual.opciones.map((opcion, index) => (
              <button key={index} onClick={() => handleOptionClick(opcion)} className="option-button">
                {opcion}
              </button>
            ))}
          </div>
          {preguntaActual.music && (
            <button onClick={volverAEscuchar}>Volver a Escuchar</button>
          )}
        </div>
      )}

      {mostrarMensaje && <div className="mensaje-correcto">¡RESPUESTA CORRECTA!</div>}

      {/* Mostrar el mensaje de "Has perdido" después de la transición */}
      {mostrarMensajePerdida && (
        <div className="ventana-fin">
          <h1>GAME OVER</h1>
          <img
            src="/doc.png"
            alt="doc image"
            className="lost-image"
          />
          <button onClick={reiniciarJuego}>Reiniciar partida</button>
          <button onClick={salirDelJuego}>Salir del juego</button>
        </div>
      )}

      <button onClick={onClose} className="close-button">X</button>

      <audio ref={audioPreguntaRef} />
    </div>
  );
};

export default TabIndividual;
