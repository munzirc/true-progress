import { useState } from 'react'
import './App.css'
import { Routes, Route } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import LectureVideoPage from './pages/LectureVideoPage';

function App() {
  const [count, setCount] = useState(0)

  return (
    <Routes>
      <Route path="/" element={<LoginPage />} />
      <Route path="/lectures" element={<LectureVideoPage />} />
    </Routes>
  )
}

export default App
