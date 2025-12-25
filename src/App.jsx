import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import Lobby from './pages/Lobby';
import ClueDown from './pages/ClueDown';
import MindSnap from './pages/MindSnap';
import Elimino from './pages/Elimino';
import FlashTrack from './pages/FlashTrack';
import Admin from './pages/Admin';
import { GameProvider } from './context/GameContext';

function App() {
  return (
    <GameProvider>
      <Router>
        <Routes>
          <Route element={<Layout />}>
            <Route index element={<Lobby />} />

            <Route path="cluedown">
              <Route index element={<Navigate to="rules" replace />} />
              <Route path="rules" element={<ClueDown />} />
              <Route path="question/:id" element={<ClueDown />} />
              <Route path="answer/:id" element={<ClueDown />} />
            </Route>

            <Route path="mindsnap">
              <Route index element={<Navigate to="rules" replace />} />
              <Route path="rules" element={<MindSnap />} />
              <Route path="question/:id" element={<MindSnap />} />
              <Route path="answer/:id" element={<MindSnap />} />
            </Route>

            <Route path="elimino">
              <Route index element={<Navigate to="rules" replace />} />
              <Route path="rules" element={<Elimino />} />
              <Route path="question/:id" element={<Elimino />} />
              <Route path="answer/:id" element={<Elimino />} />
            </Route>

            <Route path="flashtrack">
              <Route index element={<Navigate to="rules" replace />} />
              <Route path="rules" element={<FlashTrack />} />
              <Route path="question/:id" element={<FlashTrack />} />
              <Route path="answer/:id" element={<FlashTrack />} />
            </Route>
            <Route path="admin" element={<Admin />} />
          </Route>
        </Routes>
      </Router>
    </GameProvider>
  );
}

export default App;
