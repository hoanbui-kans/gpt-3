import React from 'react'
import { useDrag,  } from 'react-dnd'

const BotSendItem = ({data}) => {
    const[{isDragging}, drag] = useDrag(() => ({
        type: data.type,
        item: data,
        collect: (monitor) => ({
            isDragging: !!monitor.isDragging(),
        })
    }))
    return (
        <div ref={drag} style={{ height: 200, width: 200 ,border: isDragging ? "5px solid pink" : "1px solid black"}}>
            <h3>{ data.name }</h3>
        </div>
    )
}

export default BotSendItem