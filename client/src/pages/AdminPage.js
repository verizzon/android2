import React from 'react'
import { Link } from 'react-router-dom'

function AdminPage() {
  return (
    <div>
      <h2>Admin Page</h2>
      <Link to="/add-product">Add Product</Link>
    </div>
  )
}

export default AdminPage
