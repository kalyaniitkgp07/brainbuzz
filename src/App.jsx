import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Lobby from './pages/Lobby';
import ClueDown from './pages/ClueDown';
import FastFingers from './pages/FastFingers';
import CategoryChaos from './pages/CategoryChaos';
import FinalFaceOff from './pages/FinalFaceOff';

function App() {
  return (
    <Router>
      <Routes>
        <Route element={<Layout />}>
          <Route index element={<Lobby />} />
          <Route path="cluedown" element={<ClueDown />} />
          <Route path="fast-fingers" element={<FastFingers />} />
          <Route path="category-chaos" element={<CategoryChaos />} />
          <Route path="the-final-face-off" element={<FinalFaceOff />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
