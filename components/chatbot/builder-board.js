import React, { useRef, useState } from "react";
import styles from '../../styles/components.module.css';

const BuilderBoard = ({elements}) => {
  console.log(elements);
  return (
    <>
        <div className={styles.x_builder_board}>
            {
            Array.isArray(elements) && elements.length ?  
              elements.map((data) => {
                <div style={{ height: 200, width: 200 ,border: "1px solid black"}}>
                      <h3>{ data.name }</h3>
                  </div>
              }): ''
          }
      </div>
    </>
  )
}

export default BuilderBoard