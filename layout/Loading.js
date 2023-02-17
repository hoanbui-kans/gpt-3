import React from 'react'
import { Loader } from 'rsuite';

const Loading = () => {
  return (
    <div style={{ width: '100%', height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
       <Loader size="md" />
    </div>
  )
}

export default Loading