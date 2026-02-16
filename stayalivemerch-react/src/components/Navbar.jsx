import { Link } from "react-router-dom";
import { useState } from "react";
import "./Navbar.css";

export default function Navbar({ cartCount, user, handleLogout }) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <div className="topbar">🚚 Envío gratis en compras mayores a S/150</div>

      <nav className="navbar">
        {/* IZQUIERDA */}
        <div className="nav-left">
          <Link to="/">Poleras</Link>
          <Link to="/">Accesorios</Link>
          <Link to="/">Ofertas</Link>
        </div>

        {/* CENTRO */}
        <Link to="/" className="logo">
          STAYALIVE
        </Link>

        {/* DERECHA */}
        <div className="nav-right">
          {!user ? (
            <Link to="/login">Login</Link>
          ) : (
            <div className="dropdown">
              <span onClick={() => setOpen(!open)}>Cuenta ▾</span>

              {open && (
                <div className="dropdown-menu">
                  <Link to="/mis-ordenes">Mis órdenes</Link>
                  <button onClick={handleLogout}>Salir</button>
                </div>
              )}
            </div>
          )}

          <Link to="/cart" className="cart">
            🛒 ({cartCount})
          </Link>
        </div>
      </nav>
    </>
  );
}
