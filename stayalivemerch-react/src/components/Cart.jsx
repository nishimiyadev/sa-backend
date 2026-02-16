import React from "react";
import { useState } from "react";
import { db, auth } from "../firebaseConfig";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";

export default function Cart({
  cart,
  removeFromCart,
  clearCart,
  increaseQuantity,
  decreaseQuantity,
}) {
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [mensaje, setMensaje] = useState("");

  const total = cart.reduce(
    (sum, item) => sum + item.precio * item.cantidad,
    0,
  );

  // Crear orden en Firestore
  const handleCheckout = async () => {
    if (cart.length === 0) return;

    const user = auth.currentUser;
    if (!user) {
      setMensaje("Debes iniciar sesión para completar la compra.");
      return;
    }

    setLoading(true);
    setMensaje("");

    try {
      // Crea una nueva orden en Firestore
      await addDoc(collection(db, "ordenes"), {
        usuarioId: user.uid,
        email: user.email,
        fecha: serverTimestamp(),
        total,
        estado: "pendiente", // estado general de la orden
        estadoPago: "pendiente", // estado específico del pago
        metodoPago: "mercadopago", // método elegido
        items: cart.map((item) => ({
          id: item.id,
          nombre: item.nombre,
          precio: item.precio,
          cantidad: item.cantidad,
          subtotal: item.precio * item.cantidad,
        })),
      });

      // Limpiar carrito y mostrar mensaje
      clearCart();
      setSuccess(true);
      setMensaje("✅ Orden creada con éxito. Gracias por tu compra!");
    } catch (error) {
      console.error("Error al crear la orden:", error);
      setMensaje("❌ Ocurrió un error al crear la orden.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto p-4 border rounded-lg shadow-sm bg-white">
      <h3 className="text-xl font-semibold mb-3">🛒 Tu carrito</h3>
      {success && (
        <p
          style={{
            background: "#c8f7c5",
            padding: "8px",
            borderRadius: "5px",
            color: "#1a7f1a",
            marginBottom: "10px",
          }}
        >
          ✅ Compra realizada con éxito. ¡Gracias por tu pedido!
        </p>
      )}

      {cart.length === 0 ? (
        <p className="text-gray-500 text-center">Tu carrito está vacío.</p>
      ) : (
        <>
          <ul className="divide-y divide-gray-200 mb-3">
            {cart.map((item, i) => (
              <li key={i} className="flex justify-between items-center py-2">
                <div>
                  <p>{item.nombre}</p>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => decreaseQuantity(item.id)}
                      className="px-2 bg-gray-200 rounded"
                    >
                      -
                    </button>

                    <span>{item.cantidad}</span>

                    <button
                      onClick={() => increaseQuantity(item.id)}
                      disabled={item.cantidad >= item.stock}
                      className={`px-2 rounded ${
                        item.cantidad >= item.stock
                          ? "bg-gray-300 cursor-not-allowed"
                          : "bg-gray-200"
                      }`}
                    >
                      +
                    </button>
                    {item.cantidad >= item.stock && (
                      <p className="text-xs text-red-500">
                        Stock máximo alcanzado
                      </p>
                    )}
                  </div>

                  <p>
                    <strong>
                      S/ {(item.precio * item.cantidad).toFixed(2)}
                    </strong>
                  </p>
                </div>

                <button
                  onClick={() => removeFromCart(item.id)}
                  className="text-red-500 hover:underline"
                >
                  ❌
                </button>
              </li>
            ))}
          </ul>

          <div className="flex justify-between items-center font-semibold mb-3">
            <span>Total:</span>
            <span>S/ {total.toFixed(2)}</span>
          </div>

          <div className="flex gap-2">
            <button
              onClick={clearCart}
              className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 py-2 rounded"
            >
              Vaciar carrito
            </button>
            <button
              onClick={handleCheckout}
              disabled={loading}
              className="flex-1 bg-black hover:bg-gray-800 text-white py-2 rounded"
            >
              {loading ? "Procesando..." : "Finalizar compra"}
            </button>
          </div>

          {mensaje && <p className="mt-3 text-center text-sm">{mensaje}</p>}
        </>
      )}
    </div>
  );
}
