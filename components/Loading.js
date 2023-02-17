import React from 'react'
import { Loader } from 'rsuite'

const Loading = () => {
  return (
    <div>
      <Loader center color='black' content="Đang tải..." vertical />
    </div>
  )
}

export default Loading