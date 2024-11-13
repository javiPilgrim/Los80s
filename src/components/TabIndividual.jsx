import React, { useState, useEffect, useRef } from 'react';
import preguntas from '../data/preguntas';
import '../components/TabIndividual.css';

const TabIndividual = ({ onClose }) => {
  const [imageIndex, setImageIndex] = useState(0);
  const [preguntaActual, setPreguntaActual] = useState(null);
  const [mostrarMensaje, setMostrarMensaje] = useState(false);
  const [respuestaIncorrecta, setRespuestaIncorrecta] = useState(false);
  const [aciertos, setAciertos] = useState(0);
  const [finJuego, setFinJuego] = useState(false);
  const [errores, setErrores] = useState(0);
  const [mostrarError, setMostrarError] = useState(false); // Controla el popup de error
  const [mostrarVentanaInicio, setMostrarVentanaInicio] = useState(true);
  const [imagenErrorActual, setImagenErrorActual] = useState('/errores/fotoMcfly.jpeg'); // Imagen actual de error
  const [mostrarMensajePerdida, setMostrarMensajePerdida] = useState(false); // Nuevo estado para mostrar el mensaje de "Has perdido"

  const aplausoRef = new Audio('/aplauso.mp3');
  const campanillasRef = new Audio('/campanillas.mp3');
  const audioPreguntaRef = useRef(null);
  const movFichaRef = useRef(new Audio("/movficha.mp3"));

  // Lista de imágenes para cada error
  const imagenesErrores = [
    '/errores/fotoMcfly1.jpeg',
    '/errores/fotoMcfly2.jpeg',
    '/errores/fotoMcfly3.jpeg',
  ];

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
      audioPreguntaRef.current.play().catch((error) => {
        console.log("El navegador bloqueó la reproducción automática de audio:", error);
      });
    }
  }, [preguntaActual]);

  const seleccionarPreguntaAleatoria = () => {
    const preguntaAleatoria = preguntas[Math.floor(Math.random() * preguntas.length)];
    setPreguntaActual(preguntaAleatoria);
  };

  const handleOptionClick = (opcion) => {
    if (opcion === preguntaActual.respuesta) {
      setAciertos(aciertos + 1);
      aplausoRef.play();
      setMostrarMensaje(true);
      movFichaRef.current.play();
      if (aciertos + 1 >= 31) {
        setFinJuego(true);
      }
      setImageIndex((prevIndex) => (prevIndex + 1) % 31);
      setTimeout(() => {
        setMostrarMensaje(false);
        seleccionarPreguntaAleatoria();
      }, 1000);
    } else {
      campanillasRef.play();
      mostrarTransicionError(); // Llamar a la función de transición de imagen
      setErrores(errores + 1);
      if (errores + 1 >= 3) {
        setFinJuego(true);
      }
    }
  };

  const mostrarTransicionError = () => {
    // Paso 1: Muestra la ventana de error y la imagen actual
    setMostrarError(true);
    setImagenErrorActual(errores === 0 ? '/errores/fotoMcfly.jpeg' : imagenesErrores[errores - 1]);

    // Después de una breve pausa, cambia a la siguiente imagen
    setTimeout(() => {
      if (errores + 1 < 3) {
        setImagenErrorActual(imagenesErrores[errores]);
      } else {
        setImagenErrorActual(imagenesErrores[2]);
      }

      // Inicia el efecto de desvanecimiento para cerrar la ventana automáticamente
      const ventanaErrorElement = document.querySelector(".imagen-error-container");
      ventanaErrorElement.classList.add("fade-out");

      // Oculta la ventana completamente después de la transición
      setTimeout(() => {
        setMostrarError(false); // Oculta la ventana
        if (errores + 1 >= 3) {
          setMostrarMensajePerdida(true); // Muestra el mensaje de "Has perdido"
        }
      }, 2000); // Duración de la transición de desvanecimiento
    }, 500); // Cambia de imagen después de 0.5 segundos
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
    setMostrarMensajePerdida(false); // Reseteamos el estado de mensaje de pérdida al reiniciar el juego
  };

  const volverAEscuchar = () => {
    if (audioPreguntaRef.current) {
      audioPreguntaRef.current.currentTime = 0;
      audioPreguntaRef.current.play().catch((error) => {
        console.error("Error al volver a reproducir el audio:", error);
      });
    }
  };

  return (
    <div className="full-screen-container">
      {/* Ventana inicial */}
      {mostrarVentanaInicio && (
        <div className="ventana-inicio">
          <img src="/errores/fotoMcfly.jpeg" alt="Marty McFly" className="imagen-bienvenida" />
          <p>
            Marty está a punto de desaparecer. Tienes solo tres oportunidades de fallo para que Marty y sus hermanos puedan volver a casa. ¡Suerte!
          </p>
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
          <h1>Has perdido</h1>
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
