// ==========================================
// EventSphere Customer - API Client
// Gọi API thật từ Spring Boot backend (không còn dữ liệu mock)
// ==========================================

const API = {
  BASE_URL: "/api",

  async request(method, endpoint, body) {
    const token = localStorage.getItem("authToken");

    const response = await fetch(this.BASE_URL + endpoint, {
      method,
      headers: {
        "Content-Type": "application/json",
        ...(token && { Authorization: "Bearer " + token }),
      },
      ...(body !== undefined && { body: JSON.stringify(body) }),
    });

    if (!response.ok) {
      let message = "Có lỗi xảy ra, vui lòng thử lại";
      try {
        const data = await response.json();
        message = data.message || data.error || message;
      } catch (e) {
        // response không phải JSON
      }
      const err = new Error(message);
      err.status = response.status;
      throw err;
    }

    if (response.status === 204) return null;

    const text = await response.text();
    return text ? JSON.parse(text) : null;
  },

  GET(endpoint) {
    return this.request("GET", endpoint);
  },
  POST(endpoint, body) {
    return this.request("POST", endpoint, body ?? {});
  },
  PUT(endpoint, body) {
    return this.request("PUT", endpoint, body ?? {});
  },
  DELETE(endpoint) {
    return this.request("DELETE", endpoint);
  },
};
