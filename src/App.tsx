import React, { useState } from 'react'
import useRouteElements from './hooks/useRouteElements'

function App() {
  const useRoutesElements = useRouteElements()
  return <>{useRoutesElements}</>
}

export default App
