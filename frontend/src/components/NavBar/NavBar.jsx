import { Link } from "react-router-dom";
import { ShoppingCart, UserPlus, LogIn, LogOut } from "lucide-react";

const NavBar = () => {
  // لاحقاً بداله تجيب user من Zustand أو context
  const user = true;
  const cartCount = 3; // مثال مؤقت

  return (
    <header className="navbar">
      <div className="navbar__inner">
        {/* Logo / Brand */}
        <Link
          to="/"
          className="navbar__logo"
        >
          <span className="navbar__logo-mark">E-Commerce</span>
        </Link>

        {/* Links */}
        <nav className="navbar__nav">
          <Link
            to="/"
            className="navbar__link navbar__link--active"
          >
            Home
          </Link>

          {user && (
            <Link
              to="/cart"
              className="navbar__link navbar__cart"
            >
              <ShoppingCart
                className="navbar__cart-icon"
                size={18}
              />
              <span className="navbar__cart-label">Cart</span>
              <span className="navbar__cart-count">{cartCount}</span>
            </Link>
          )}

          {!user && (
            <>
              <Link
                to="/login"
                className="navbar__link"
              >
                <LogIn size={16} />
                <span>Login</span>
              </Link>
              <Link
                to="/signup"
                className="navbar__link navbar__link--primary"
              >
                <UserPlus size={16} />
                <span>Sign Up</span>
              </Link>
            </>
          )}

          {user && (
            <button
              type="button"
              className="navbar__link navbar__link--danger"
            >
              <LogOut size={16} />
              <span>Logout</span>
            </button>
          )}
        </nav>
      </div>
    </header>
  );
};

export default NavBar;
