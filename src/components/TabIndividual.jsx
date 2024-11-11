import React, { useState, useEffect } from 'react';
import preguntas from '../data/preguntas'; // Importar las preguntas

const TabIndividual = ({ onClose }) => {
  const [imageIndex, setImageIndex] = useState(0); // Estado para el índice de la imagen actual
  const [preguntaActual, setPreguntaActual] = useState(null); // Estado para la pregunta actual

  // Seleccionar una pregunta aleatoria al montar el componente
  useEffect(() => {
    seleccionarPreguntaAleatoria();
  }, []);

  const seleccionarPreguntaAleatoria = () => {
    const preguntaAleatoria = preguntas[Math.floor(Math.random() * preguntas.length)];
    setPreguntaActual(preguntaAleatoria);
  };

  const handleOptionClick = (opcion) => {
    if (opcion === preguntaActual.respuesta) {
      setImageIndex((prevIndex) => (prevIndex + 1) % 31);  // Cambiar imagen
    } else {
      alert("Respuesta incorrecta. Intenta de nuevo.");
    }
    seleccionarPreguntaAleatoria();  // Seleccionar nueva pregunta
  };

  return (
    <div style={styles.fullScreenContainer}>
      {/* Imagen ocupando toda la pantalla sin recortarse */}
      <img src={`/tabIndividual/Tablero${imageIndex}.png`} alt="Tablero" style={styles.fullScreenImage} />
      
      {preguntaActual && (
        <div style={styles.questionContainer}>
          <h2>{preguntaActual.pregunta}</h2>
          <div style={styles.optionsContainer}>
            {preguntaActual.opciones.map((opcion, index) => (
              <button key={index} onClick={() => handleOptionClick(opcion)} style={styles.optionButton}>
                {opcion}
              </button>
            ))}
          </div>
        </div>
      )}
      
      <button onClick={onClose} style={styles.closeButton}>X</button>
    </div>
  );
};

const styles = {
  fullScreenContainer: {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100vw',    // Ocupa todo el ancho de la ventana
    height: '100vh',   // Ocupa toda la altura de la ventana
    backgroundColor: 'black',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'column',
    zIndex: 1000,
    overflow: 'hidden', // Evita el desbordamiento
  },
  fullScreenImage: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',    // Hace que la imagen ocupe todo el ancho de la ventana
    height: '100%',   // Hace que la imagen ocupe toda la altura de la ventana
    objectFit: 'contain',  // Ajuste de la imagen sin recortes, pero con relleno si es necesario
    zIndex: -1,       // La imagen siempre queda detrás de los otros elementos
  },
  questionContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.8)', // Fondo translúcido
    color: 'black',
    padding: '20px',
    borderRadius: '10px',
    textAlign: 'center',
    zIndex: 10,
    width: '80%',
    maxWidth: '600px',
    position: 'relative',
    top: '20px',
  },
  optionsContainer: {
    display: 'flex',
    flexDirection: 'column',
    marginTop: '10px',
  },
  optionButton: {
    padding: '10px',
    fontSize: '18px',
    margin: '5px 0',
    cursor: 'pointer',
    border: 'none',
    borderRadius: '5px',
    backgroundColor: '#007BFF',
    color: 'white',
  },
  closeButton: {
    position: 'absolute',
    top: '20px',
    right: '20px',
    padding: '5px 10px',
    fontSize: '16px',
    backgroundColor: 'red',
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
  },
};

export default TabIndividual;

