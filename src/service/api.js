import { triggerBackendError } from "./backendError";

const API_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:3000";
const currentLang = localStorage.getItem("preferredLanguage") || "en";

class ApiService {
  async request(url, options = {}) {
    try {
      const response = await fetch(url, options);

      if (!response.ok) {
        const serverDownMessages = {
          en: "Server is running but returned an error. Please try again later.",
          sv: "Servern körs men returnerade ett fel. Vänligen försök igen senare.",
        };
        const message =
          serverDownMessages[currentLang] || serverDownMessages.en;
        const errorObj = { message, returncode: response.status };

        triggerBackendError(errorObj);
        return errorObj;
      }

      return await response.json();
    } catch (error) {
      console.warn("⚠️ Backend unreachable or request failed:", error.message);
      const noConnectionMessages = {
        en: "No internet connection. Please check your network.",
        sv: "Ingen internetanslutning. Kontrollera ditt nätverk.",
      };
      const message =
        noConnectionMessages[currentLang] || noConnectionMessages.en;

      const errorObj = { message, returncode: 405 };
      triggerBackendError(errorObj);

      return errorObj;
    }
  }

  async login(email, password) {
    return this.request(`${API_URL}/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "accept-language": currentLang,
      },
      body: JSON.stringify({ email, password }),
    });
  }

  async changeLanguage(lang) {
    return this.request(`${API_URL}/translation/change`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ lang }),
    });
  }

  async getSupportedLanguages() {
    return this.request(`${API_URL}/translation/support`);
  }

  async getTerms() {
    const currentLang = localStorage.getItem("preferredLanguage") || "en";
    return this.request(`${API_URL}/terms`, {
      method: "GET",
      headers: { "Accept-Language": currentLang },
    });
  }
}

export default new ApiService();
