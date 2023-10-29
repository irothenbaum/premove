import './App.scss'
import React, {useState} from 'react'
import PremoveGameDaily from './components/PremoveGameDaily'
import PremoveGameSeries from './components/PremoveGameSeries'

function App() {
  const [playInfinite, setPlayInfinite] = useState(true)
  return playInfinite ? (
    <PremoveGameSeries />
  ) : (
    <PremoveGameDaily onPlayInfinite={() => setPlayInfinite(true)} />
  )
}

export default App
