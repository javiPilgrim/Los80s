// src/components/Tablero.jsx
import React, { useRef, useEffect, useState } from "react";

const Tablero = ({ posicionRoja, posicionAzul, posicionAmarilla, posicionVerde, tamañoFicha, numJugadores }) => {
  const tableroRef = useRef(null);
  const [dimensiones, setDimensiones] = useState({ width: 1920, height: 1080 }); // Dimensiones base del tablero

  useEffect(() => {
    // Actualiza las dimensiones al tamaño de la pantalla
    const actualizarDimensiones = () => {
      if (tableroRef.current) {
        const { width, height } = tableroRef.current.getBoundingClientRect();
        setDimensiones({ width, height });
      }
    };

    actualizarDimensiones();
    window.addEventListener("resize", actualizarDimensiones);
    return () => window.removeEventListener("resize", actualizarDimensiones);
  }, []);

  // Función para calcular las posiciones en base al tamaño del tablero dinámico
  const calcularPosicionRelativa = (posicion) => {
    if (!posicion) {
      // Devuelve una posición por defecto si no está definida
      return { left: '0px', top: '0px' };
    }

    return {
      left: `${(posicion.x / 1920) * dimensiones.width}px`,
      top: `${(posicion.y / 1080) * dimensiones.height}px`,
    };
  };

  const estiloTablero = {
    position: "relative",
    width: "100vw", // Tablero ocupa el ancho completo de la ventana
    height: "100vh", // Tablero ocupa el alto completo de la ventana
    overflow: "hidden",
  };

  return (
    <div style={estiloTablero} ref={tableroRef}>
      <img src="/Tablero.jpg" alt="Tablero" style={{ width: "100%", height: "100%" }} />
      
           {/* Ficha Roja - Jugador 1 */}
           {numJugadores >= 1 && (
        <img
          src="/ficha.png"
          alt="Ficha Roja"
          style={{
            ...calcularPosicionRelativa(posicionRoja),
            position: "absolute",
            width: `${tamañoFicha}px`,
            height: `${tamañoFicha}px`,
            transition: "left 0.5s ease, top 0.5s ease",
          }}
        />
      )}

      {/* Ficha Azul - Jugador 2 */}
      {numJugadores >= 2 && (
        <img
          src="/fichaAzul.png"
          alt="Ficha Azul"
          style={{
            ...calcularPosicionRelativa(posicionAzul),
            position: "absolute",
            width: `${tamañoFicha}px`,
            height: `${tamañoFicha}px`,
            transition: "left 0.5s ease, top 0.5s ease",
          }}
        />
      )}

      {/* Ficha Amarilla - Jugador 3 */}
      {numJugadores >= 3 && (
        <img
          src="/fichaAmarilla.png"
          alt="Ficha Amarilla"
          style={{
            ...calcularPosicionRelativa(posicionAmarilla),
            position: "absolute",
            width: `${tamañoFicha}px`,
            height: `${tamañoFicha}px`,
            transition: "left 0.5s ease, top 0.5s ease",
          }}
        />
      )}

      {/* Ficha Verde - Jugador 4 */}
      {numJugadores >= 4 && (
        <img
          src="/fichaVerde.png"
          alt="Ficha Verde"
          style={{
            ...calcularPosicionRelativa(posicionVerde),
            position: "absolute",
            width: `${tamañoFicha}px`,
            height: `${tamañoFicha}px`,
            transition: "left 0.5s ease, top 0.5s ease",
          }}
        />
      )}
    </div>
  );
};

export default Tablero;
