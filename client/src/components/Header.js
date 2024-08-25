import React from 'react'
import { Link } from 'react-router-dom'
import './Header.css' // Styles for the header

function Header() {
  return (
    <header className="header">
      <div className="logo">
        <Link to="/">MyEcommerce</Link>
      </div>
      <nav>
        <ul>
          <li>
            <Link to="/">Home</Link>
          </li>
          <li>
            <Link to="/cart">Cart</Link>
          </li>
        </ul>
      </nav>
    </header>
  )
}

export default Header
