import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import '../css/index.css'
import Login from './Login.tsx'
import Create from './Create.tsx'
import Game from './Game.tsx'
import { GameProvider } from './GameContext.tsx'

createRoot(document.getElementById('root')!).render(
  <GameProvider>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />}/>
        <Route path="/game" element={<Game />}/>
        <Route path="/make" element={<Create />}/>
      </Routes>
    </BrowserRouter>
  </GameProvider>
)
