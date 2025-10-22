import { triggerBackendError, triggerTokenError } from "./backendError";

const API_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:3000";
const currentLang = localStorage.getItem("preferredLanguage") || "en";

class ApiService {
  async request(url, options = {}) {
    try {
      const response = await fetch(url, options);
      const data = await response.json();

      if (data.returncode !== "200") {
        if (data.returncode === "300" || data.returncode === "301") {
          const tokenMessages = {
            en: data.returncode === "300" ? "Invalid token" : "Token expired",
            sv:
              data.returncode === "300" ? "Ogiltig token" : "Token har gått ut",
          };
          const message = tokenMessages[currentLang] || tokenMessages.en;

          triggerTokenError({ message, returncode: data.returncode });
          throw { message, returncode: data.returncode };
        }

        return data;
      }

      return data;
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
    return this.request(`${API_URL}/terms/`, {
      method: "GET",
      headers: {
        "accept-language": currentLang,
      },
    });
  }

  async getPricelist(search = "") {
    const token = localStorage.getItem("token");
    let url = `${API_URL}/pricelist`;
    if (search) {
      url += `?search=${encodeURIComponent(search)}`;
    }

    return this.request(url, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "accept-language": currentLang,
      },
    });
  }

  async createPricelist(item) {
    const token = localStorage.getItem("token");
    return this.request(`${API_URL}/pricelist`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
        "accept-language": currentLang,
      },
      body: JSON.stringify(item),
    });
  }

  async updatePricelist(id, item) {
    const token = localStorage.getItem("token");
    return this.request(`${API_URL}/pricelist/${id}`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
        "accept-language": currentLang,
      },
      body: JSON.stringify(item),
    });
  }

  async deletePricelist(id) {
    const token = localStorage.getItem("token");
    return this.request(`${API_URL}/pricelist/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
        "accept-language": currentLang,
      },
    });
  }
}

export default new ApiService();
