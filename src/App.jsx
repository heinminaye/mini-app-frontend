import "./App.css";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Login from "./components/Login/Login";
import Header from "./components/Header/Header";
import { LanguageProvider } from "./context/LanguageContext";
import Sidebar from "./components/Sidebar/Sidebar";
function App() {
  const isLogin = !!localStorage.getItem("token");

  return (
    <LanguageProvider>
      <Router>
        <div className="app">
          <Header />
          <main className="main-content">
            {isLogin && <Sidebar />}
            <Routes>
              <Route
                path="/login"
                element={isLogin ? <Navigate to="/" /> : <Login />}
              />
              <Route
                path="*"
                element={
                  isLogin ? <Navigate to="/" /> : <Navigate to="/login" />
                }
              />
            </Routes>
          </main>
        </div>
      </Router>
    </LanguageProvider>
  );
}

export default App;
