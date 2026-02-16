import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebaseConfig";

export default function ProductDetail({ addToCart }) {
  const { id } = useParams();
  const [product, setProduct] = useState(null);

  useEffect(() => {
    const fetchProduct = async () => {
      const ref = doc(db, "productos", id);
      const snap = await getDoc(ref);

      if (snap.exists()) {
        setProduct({ id: snap.id, ...snap.data() });
      }
    };

    fetchProduct();
  }, [id]);

  if (!product) return <p>Cargando producto...</p>;

  return (
    <div className="max-w-4xl mx-auto p-6">
      <img
        src={product.imagen}
        alt={product.nombre}
        className="w-full max-h-96 object-cover rounded"
      />

      <h1 className="text-2xl font-bold mt-4">{product.nombre}</h1>

      <p className="text-gray-600 mt-2">{product.descripcion}</p>

      <p className="text-xl font-semibold mt-4">S/ {product.precio}</p>

      <p className="mt-2">Stock disponible: {product.stock}</p>

      <button
        onClick={() => addToCart(product)}
        disabled={product.stock <= 0}
        className={`mt-4 px-6 py-2 rounded ${
          product.stock <= 0
            ? "bg-gray-400 cursor-not-allowed"
            : "bg-black text-white"
        }`}
      >
        {product.stock <= 0 ? "Agotado" : "Agregar al carrito"}
      </button>
    </div>
  );
}
