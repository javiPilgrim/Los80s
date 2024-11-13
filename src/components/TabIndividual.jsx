import React, { useState, useEffect, useRef } from 'react';
import preguntas from '../data/preguntas';
import '../components/TabIndividual.css'

const TabIndividual = ({ onClose }) => {
  const [imageIndex, setImageIndex] = useState(0);
  const [preguntaActual, setPreguntaActual] = useState(null);
  const [mostrarMensaje, setMostrarMensaje] = useState(false);
  const [respuestaIncorrecta, setRespuestaIncorrecta] = useState(false);
  const [aciertos, setAciertos] = useState(0);
  const [finJuego, setFinJuego] = useState(false);

  const aplausoRef = new Audio('/aplauso.mp3');
  const abucheoRef = new Audio('/abucheo.mp3');
  const audioPreguntaRef = useRef(null);

  useEffect(() => {
    seleccionarPreguntaAleatoria();
  }, []);

  useEffect(() => {
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
      if (aciertos + 1 >= 31) {
        setFinJuego(true);
      }
      setImageIndex((prevIndex) => (prevIndex + 1) % 31);
      setTimeout(() => {
        setMostrarMensaje(false);
        seleccionarPreguntaAleatoria();
      }, 1000);
    } else {
      abucheoRef.play();
      setRespuestaIncorrecta(true);
      setTimeout(() => setRespuestaIncorrecta(false), 1000);
    }
  };

  const salirDelJuego = () => {
    window.location.reload();
  };

  const reiniciarJuego = () => {
    setAciertos(0);
    setFinJuego(false);
    setImageIndex(0);
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
    <div
      className="full-screen-container"
      style={{ backgroundImage: `url(/tabIndividual/Tablero${imageIndex}.png)` }}
    >
      {preguntaActual && (
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
      {respuestaIncorrecta && <div className="mensaje-incorrecto">Respuesta incorrecta.</div>}

      <button onClick={onClose} className="close-button">X</button>

      <audio ref={audioPreguntaRef} />

      {finJuego && (
        <div className="fin-juego-overlay">
          <img src="/victoria.jpg" alt="Victoria" />
          <h3>¡Felicidades! Has ganado la partida.</h3>
          <button onClick={reiniciarJuego}>Reiniciar partida</button>
          <button onClick={salirDelJuego}>Salir del juego</button>
        </div>
      )}
    </div>
  );
};

export default TabIndividual;
