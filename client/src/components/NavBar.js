import React from 'react'
import { Link } from 'react-router-dom'
import './NavBar.css'

function NavBar({ cartCount, userRole, isLoggedIn, onLogout }) {
  return (
    <div className="navbar">
      <div className="menu-items">
        <Link to="/" className="menu-button">
          Home
        </Link>

        {isLoggedIn ? (
          <>
            <Link to="/cart" className="menu-button">
              Cart ({cartCount})
            </Link>
            {userRole === 'admin' && (
              <>
                <Link to="/add-product" className="menu-button">
                  Add Product
                </Link>
              </>
            )}
            <Link to="/history" className="menu-button">
              Purchase History
            </Link>
            <button className="logout-button" onClick={onLogout}>
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login" className="menu-button">
              Login
            </Link>
            <Link to="/register" className="menu-button">
              Register
            </Link>
          </>
        )}
      </div>
    </div>
  )
}

export default NavBar
