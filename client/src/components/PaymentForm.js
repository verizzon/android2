import React, { useState } from 'react'
import './PaymentForm.css'

function PaymentForm({ submitPayment }) {
  const [cardDetails, setCardDetails] = useState({
    cardNumber: '',
    expiryDate: '',
    cvv: '',
  })

  const handleChange = (e) => {
    setCardDetails({ ...cardDetails, [e.target.name]: e.target.value })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    submitPayment(cardDetails)
  }

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label>Card Number:</label>
        <input name="cardNumber" type="text" onChange={handleChange} />
      </div>
      <div>
        <label>Expiry Date:</label>
        <input name="expiryDate" type="text" onChange={handleChange} />
      </div>
      <div>
        <label>CVV:</label>
        <input name="cvv" type="text" onChange={handleChange} />
      </div>
      <button type="submit">Confirm Payment</button>
    </form>
  )
}

export default PaymentForm
