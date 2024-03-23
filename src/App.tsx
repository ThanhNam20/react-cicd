import { useContext, useEffect } from 'react'
import { AppContext } from './contexts/app.context'
import useRouteElements from './hooks/useRouteElements'
import { LocalStorageEventTarget } from './utils/auth'

function App() {
  const useRoutesElements = useRouteElements()
  const { reset } = useContext(AppContext)
  useEffect(() => {
    LocalStorageEventTarget.addEventListener('clearLS', reset)
    return () => {
      LocalStorageEventTarget.removeEventListener('clearLS', reset)
    }
  }, [reset])

  return <>{useRoutesElements}</>
}

export default App
