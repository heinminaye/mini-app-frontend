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
import { useEffect, useRef, useState } from "react";
import ServerError from "./components/ServerError/ServerError";
import { onBackendError, onTokenError } from "./service/backendError";
import apiService from "./service/api";
import PriceList from "./components/PriceList/PriceList";

function App() {
  const isLogin = !!localStorage.getItem("token");
  const [backendError, setBackendError] = useState(null);
  const [languageData, setLanguageData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const menuButtonRef = useRef(null);

  useEffect(() => {
    loadInitialLanguageData();

    const unsubscribe = onBackendError((error) => {
      setBackendError(error);
    });

    const unsubscribeToken = onTokenError((error) => {
      alert(error.message);
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      window.location.href = "/login";
    });

    return () => {
      unsubscribe?.();
      unsubscribeToken?.();
    };
  }, []);

  useEffect(() => {
    if (!isLogin) return;
    const handleResize = () => {
      if (window.innerWidth <= 1024) {
        setIsSidebarOpen(false);
      }
      else {
        setIsSidebarOpen(true);
      }
    };

    handleResize();

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
    setIsSidebarOpen(prev => !prev);
  };

  const handleSidebarClose = () => {
    setIsSidebarOpen(false);
  };

  const handleRetry = () => {
    setBackendError(null);
    window.location.reload();
  };

  if (loading && !languageData) {
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
            menuButtonRef={menuButtonRef}
          />
          <main className="main-content">
            {isLogin && (
              <Sidebar isOpen={isSidebarOpen} onClose={handleSidebarClose} menuButtonRef={menuButtonRef}/>
            )}
            <div
              className={`content-area ${
                isSidebarOpen ? "sidebar-open" : "sidebar-closed"
              }`}
            >
              <Routes>
                <Route
                  path="/login"
                  element={isLogin ? <Navigate to="/price-list" /> : <Login />}
                />
                <Route path="/terms" element={<Terms />} />
                <Route
                  path="*"
                  element={
                    isLogin ? (
                      <Navigate to="/price-list" />
                    ) : (
                      <Navigate to="/login" />
                    )
                  }
                />
                <Route path="/price-list" element={<PriceList />} />
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
