const API_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:3000";
const currentLang = localStorage.getItem("preferredLanguage") || "en";
class ApiService {
  async login(email, password) {
    const response = await fetch(`${API_URL}/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "accept-language": currentLang,
      },
      body: JSON.stringify({ email, password }),
    });
    return response.json();
  }

  async changeLanguage(lang) {
    const response = await fetch(`${API_URL}/translation/change`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ lang }),
    });
    return response.json();
  }

  async getSupportedLanguages() {
    const response = await fetch(`${API_URL}/translation/support`);
    return response.json();
  }
  async getTerms() {
    const currentLang = localStorage.getItem("preferredLanguage") || "en";
    const response = await fetch(`${API_URL}/terms`, {
      method: "GET",
      headers: {
        "Accept-Language": currentLang,
      },
    });
    return await response.json();
  }
}
export default new ApiService();
