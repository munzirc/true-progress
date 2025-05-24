import { useState } from 'react'
import './App.css'
import { Routes, Route } from 'react-router-dom';
import LecturerVideoPage from './pages/LecturerVideoPage';
import Login from './pages/LoginPage';
import ProtectedRoute from './components/ProtectedRoute';


function App() {
  const [count, setCount] = useState(0)

  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route
        path="/lecturer-videos"
        element={
          <ProtectedRoute>
            <LecturerVideoPage />
          </ProtectedRoute>
        }
      />
    </Routes>
  )
}

export default App
