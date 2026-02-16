import { Link } from "react-router-dom";
import "./CollectionList.css";

export default function CollectionList({ collections }) {
  if (!collections || collections.length < 5) return null;

  // Asignamos nombres de clase específicos según tu diagrama verde
  const gridPositions = [
    "nuevos-lanzamientos", // Posición 0: Grande arriba izq
    "ediciones-limitadas", // Posición 1: Pequeño arriba der
    "lo-mas-vendido", // Posición 2: Grande vertical der
    "oferta", // Posición 3: Pequeño abajo izq
    "vendido", // Posición 4: Pequeño abajo centro
  ];

  return (
    <section className="collections-container">
      <div className="collections-grid-layout">
        {collections.slice(0, 5).map((col, index) => (
          <Link
            key={col.slug}
            to={`/categoria/${col.slug}`}
            className={`collection-card ${gridPositions[index]}`}
          >
            <img src={col.imagen} alt={col.titulo} />
            <div className="overlay-content">
              <span>{col.titulo}</span>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
