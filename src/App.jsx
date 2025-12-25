import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import Lobby from './pages/Lobby';
import ClueDown from './pages/ClueDown';
import MindSnap from './pages/MindSnap';
import Elimino from './pages/Elimino';
import FinalFaceOff from './pages/FinalFaceOff';
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
              <Route index element={<Elimino />} />
              <Route path=":id" element={<Elimino />} />
            </Route>

            <Route path="the-final-face-off" element={<FinalFaceOff />} />
            <Route path="admin" element={<Admin />} />
          </Route>
        </Routes>
      </Router>
    </GameProvider>
  );
}

export default App;
