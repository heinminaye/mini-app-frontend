import './App.css'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/Login/Login';
function App() {
   const isLogin = !!localStorage.getItem('token');

  return (
    <Router>
      <div>
        <Routes>
          <Route path="/login" element={isLogin ? <Navigate to="/" /> : <Login />} />
          <Route path="*" element={isLogin ? <Navigate to="/" /> : <Navigate to="/login" />} />
        </Routes>
      </div>
    </Router>
  )
}

export default App
