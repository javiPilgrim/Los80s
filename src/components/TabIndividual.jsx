import React, { useState, useEffect, useRef } from 'react';
import preguntas from '../data/preguntas';
import '../components/TabIndividual.css'

const TabIndividual = ({ onClose }) => {
  const [imageIndex, setImageIndex] = useState(0);
  const [preguntaActual, setPreguntaActual] = useState(null);
  const [mostrarMensaje, setMostrarMensaje] = useState(false);
  const [respuestaIncorrecta, setRespuestaIncorrecta] = useState(false);
  const [aciertos, setAciertos] = useState(0); // Contador de aciertos
  const [finJuego, setFinJuego] = useState(false); // Estado para finalizar el juego

  // Refs para los sonidos
  const aplausoRef = new Audio('/aplauso.mp3');
  const abucheoRef = new Audio('/abucheo.mp3');
  const audioPreguntaRef = useRef(null);

  useEffect(() => {
    seleccionarPreguntaAleatoria();
  }, []);

  useEffect(() => {
    // Reproduce automáticamente el audio de la pregunta si existe
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
      setAciertos(aciertos + 1)
      aplausoRef.play();
      setMostrarMensaje(true);
      if (aciertos + 1 >= 30) {
        setFinJuego(true); // Termina el juego cuando llega a 30 aciertos
      }

      // Actualizar imagen y pregunta con un pequeño retraso
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
    window.location.reload(); // Recarga la página y sale del juego
  };    

const reiniciarJuego = () => {
   setAciertos(0); // Reinicia el contador de aciertos
   setFinJuego(false); // Reinicia el estado de fin de juego
   setImageIndex(0)
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
      <img src={`/tabIndividual/Tablero${imageIndex}.png`} alt="Tablero" className="full-screen-image" />
      
      {preguntaActual && (
        <div className="question-container">
          <h2>{preguntaActual.pregunta}</h2>
          {preguntaActual.imagen && (
            <img src={preguntaActual.imagen} alt="Imagen de la pregunta" className="imagen-pregunta" />
          )}
          <div className="question-container">
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
      
      {/* Control de audio para las pistas */}
      <audio ref={audioPreguntaRef} />


     {finJuego && (
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
          <img
            src="/victoria.jpg"
            alt="Victoria"
            style={{ maxWidth: "300px", marginBottom: "20px" }}
          />
          <h3>¡Felicidades! Has ganado la partida.</h3>
          <button onClick={reiniciarJuego}>Reiniciar partida</button>
          <button onClick={salirDelJuego}>Salir del juego</button>
        </div>
      )}
    </div>
  );
};

export default TabIndividual;