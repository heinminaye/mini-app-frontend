const API_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';
class ApiService{
    async login(email, password) {
        const response = await fetch(`${API_URL}/auth/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, password }),
        });
        return response.json();
    }
}
export default new ApiService();