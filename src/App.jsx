import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Lobby from './pages/Lobby';
import ClueDown from './pages/ClueDown';
import FastFingers from './pages/FastFingers';
import CategoryChaos from './pages/CategoryChaos';
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
            <Route path="cluedown/:id?" element={<ClueDown />} />
            <Route path="fast-fingers" element={<FastFingers />} />
            <Route path="category-chaos/:id?" element={<CategoryChaos />} />
            <Route path="the-final-face-off" element={<FinalFaceOff />} />
            <Route path="admin" element={<Admin />} />
          </Route>
        </Routes>
      </Router>
    </GameProvider>
  );
}

export default App;
