import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import ReduxCounter from './components/ReduxCounter'
import NormalCounter from './components/NormalInputCounter'
import NormalInputCounter from './components/NormalInputCounter'
import ReduxInputCounter from './components/ReduxInputCounter'
import UserComponent from './components/UserComponent'
import ReduxUser from './components/ReduxUser'

function App() {

  return (
    <>
      {/* <NormalInputCounter/> */}
      {/* <ReduxCounter/> */}
      {/* <ReduxInputCounter/> */}
      {/* <UserComponent/> */}
      <ReduxUser/>
    </>
  )
}

export default App
