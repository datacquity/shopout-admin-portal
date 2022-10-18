import React from 'react'

const OrderRow = ({goToProductOrders, order}) => {
  return (
    <tr key={order._id} onClick={() => goToProductOrders(order._id)}>
        <td>{`${order.user.firstName} ${order.user.lastName}`}</td>
        <td>{order.email}</td>
        <td>{order.date.toString().slice(0, 10)}</td>
        <td>{order.address}</td>
        <td>{order.amount}</td>
        <td>{order.status}</td>
    </tr>
  )
}

export default OrderRow