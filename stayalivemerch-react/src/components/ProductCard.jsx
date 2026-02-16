import { Link } from "react-router-dom";
import "./ProductCard.css";

export default function ProductCard({ product, addToCart }) {
  return (
    <div className="product-card">
      {product.stock === 0 && <span className="badge">Agotado</span>}

      <Link to={`/producto/${product.id}`}>
        <div className="image-container">
          <img src={product.imagen} alt={product.nombre} />
        </div>
      </Link>

      <div className="product-info">
        <Link to={`/producto/${product.id}`}>
          <h3>{product.nombre}</h3>
        </Link>

        <p className="price">S/ {product.precio}</p>

        <button
          onClick={() => addToCart(product)}
          disabled={product.stock === 0}
          className="add-btn"
        >
          {product.stock === 0 ? "Agotado" : "Agregar"}
        </button>
      </div>
    </div>
  );
}
