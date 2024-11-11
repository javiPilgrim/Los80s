import React, { useState, useEffect } from 'react';
import preguntas from '../data/preguntas';

const TabIndividual = ({ onClose }) => {
  const [imageIndex, setImageIndex] = useState(0); 
  const [preguntaActual, setPreguntaActual] = useState(null);

  useEffect(() => {
    seleccionarPreguntaAleatoria();
  }, []);

  const seleccionarPreguntaAleatoria = () => {
    const preguntaAleatoria = preguntas[Math.floor(Math.random() * preguntas.length)];
    setPreguntaActual(preguntaAleatoria);
  };

  const handleOptionClick = (opcion) => {
    if (opcion === preguntaActual.respuesta) {
      setImageIndex((prevIndex) => (prevIndex + 1) % 31);
    } else {
      alert("Respuesta incorrecta. Intenta de nuevo.");
    }
    seleccionarPreguntaAleatoria();
  };

  return (
    <div style={styles.fullScreenContainer}>
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
    width: '100vw',
    height: '100vh',
    minWidth: '100vw',
    minHeight: '100vh',
    backgroundColor: 'black',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'column',
    zIndex: 1000,
    overflow: 'hidden'
  },
  fullScreenImage: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100vw',
    height: '100vh',
    objectFit: 'contain',  // Cambié de 'cover' a 'contain' para evitar que la imagen se recorte
    zIndex: -1,
  },
  questionContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    color: 'black',
    padding: '20px',
    borderRadius: '10px',
    textAlign: 'center',
    zIndex: 10,
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
