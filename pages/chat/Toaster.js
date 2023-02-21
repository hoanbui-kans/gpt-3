import React from 'react'
import { Message } from 'rsuite';

const Toaster = ({ type, message}) => {
  return (
    <Message type={type} showIcon>{message}</Message>
  )
}

export default Toaster