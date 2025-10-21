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
import Terms from "./components/Terms/Terms";
import { useEffect, useState } from "react";
import ServerError from "./components/ServerError/ServerError";
import { onBackendError } from "./service/backendError";
import apiService from "./service/api";
import { Home } from "lucide-react";
import PriceList from "./components/PriceList/PriceList";

function App() {
  const isLogin = !!localStorage.getItem("token");
  const [backendError, setBackendError] = useState(null);
  const [languageData, setLanguageData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    loadInitialLanguageData();

    const unsubscribe = onBackendError((error) => {
      setBackendError(error);
    });

    return () => {
      unsubscribe?.();
    };
  }, []);

  useEffect(() => {
    if (!isLogin) return;
    const handleResize = () => {
      if (window.innerWidth <= 768) {
        setIsSidebarOpen(false);
      } else {
        setIsSidebarOpen(true);
      }
    };

    handleResize()

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [isLogin]);

  const loadInitialLanguageData = async () => {
    try {
      setLoading(true);
      const savedLang = localStorage.getItem("preferredLanguage") || "en";

      const [supportedData, translationData] = await Promise.all([
        apiService.getSupportedLanguages(),
        apiService.changeLanguage(savedLang),
      ]);

      setLanguageData({
        supportedLanguages:
          supportedData.returncode === "200" ? supportedData.languages : [],
        initialLanguage:
          translationData.returncode === "200"
            ? translationData.currentLanguage
            : savedLang,
        translations:
          translationData.returncode === "200"
            ? translationData.translations
            : {},
      });
    } catch (error) {
      console.error("Failed to load language data:", error);
      setLanguageData({
        supportedLanguages: [],
        initialLanguage: "en",
        translations: {},
      });
    } finally {
      setLoading(false);
    }
  };

  const handleMenuToggle = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const handleSidebarClose = () => {
    setIsSidebarOpen(false);
  };

  const handleRetry = () => {
    setBackendError(null);
    window.location.reload();
  };

  if (loading) {
    return (
      <div className="content-area loading">
        <span className="loading-circle"></span>
      </div>
    );
  }

  return (
    <LanguageProvider initialData={languageData}>
      <Router>
        <div className="app">
          <Header
            onMenuToggle={handleMenuToggle}
            isSidebarOpen={isSidebarOpen}
          />
          <main className="main-content">
            {isLogin && (
              <Sidebar isOpen={isSidebarOpen} onClose={handleSidebarClose} />
            )}
            <div
              className={`content-area ${
                isSidebarOpen ? "sidebar-open" : "sidebar-closed"
              }`}
            >
              <Routes>
                <Route
                  path="/login"
                  element={isLogin ? <Navigate to="/" /> : <Login />}
                />
                <Route path="/terms" element={<Terms />} />
                <Route
                  path="*"
                  element={isLogin ? <Navigate to="/" />: <Navigate to="/login" />}
                />
                 <Route
                  path="/price-list"
                  element={<PriceList/>}
                />
              </Routes>
            </div>
          </main>
          {isSidebarOpen && (
            <div
              className={`sidebar-overlay ${isSidebarOpen ? "active" : ""}`}
              onClick={handleSidebarClose}
            />
          )}
          {backendError && (
            <ServerError error={backendError} onRetry={handleRetry} />
          )}
        </div>
      </Router>
    </LanguageProvider>
  );
}

export default App;
