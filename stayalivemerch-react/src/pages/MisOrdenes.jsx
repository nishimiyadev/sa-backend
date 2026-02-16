import { useEffect, useState } from "react";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db, auth } from "../firebaseConfig";

export default function MyOrders() {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const fetchOrders = async () => {
      const user = auth.currentUser;
      if (!user) return;

      const q = query(
        collection(db, "ordenes"),
        where("usuarioId", "==", user.uid),
      );

      const snapshot = await getDocs(q);
      const data = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      setOrders(data);
    };

    fetchOrders();
  }, []);

  if (orders.length === 0) {
    return <p className="p-6">No tienes órdenes aún.</p>;
  }

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h2 className="text-xl font-bold mb-4">Mis órdenes</h2>

      {orders.map((order) => (
        <div key={order.id} className="border p-4 mb-4 rounded">
          <p>
            <strong>Orden:</strong> {order.id}
          </p>
          <p>
            <strong>Total:</strong> S/ {order.total}
          </p>
          <p>
            <strong>Estado:</strong> {order.estado}
          </p>
          <p>
            <strong>Estado de pago:</strong> {order.estadoPago}
          </p>

          <ul className="mt-2">
            {order.items.map((item, index) => (
              <li key={index}>
                {item.nombre} x {item.cantidad}
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}
