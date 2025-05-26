import React, { useEffect } from "react"
import { useState } from "react"

function Popup() {
  const [count, setCount] = useState(0)
  const handleClick = () => {
    console.log("Button clicked!")
    setCount(count + 1)
  }

  return (
    <div style={{ padding: 20 }}>
      <h1>Hello Plasmo!</h1>
      <button onClick={() => setCount(count + 1)}>Clicked {count} times</button>
      <button onClick={handleClick}>Log to console</button>
    </div>
  )
}

export default Popup
