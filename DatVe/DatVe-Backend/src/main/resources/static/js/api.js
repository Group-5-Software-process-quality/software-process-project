// ==========================================
// EventSphere API Configuration
// ==========================================

const API = {
  BASE_URL: "/api",

  async GET(endpoint) {
    const token = localStorage.getItem("adminToken");

    const response = await fetch(this.BASE_URL + endpoint, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        ...(token && { Authorization: "Bearer " + token }),
      },
    });

    if (!response.ok) {
      throw new Error(await response.text());
    }

    return await response.json();
  },

  async POST(endpoint, body) {
    const token = localStorage.getItem("adminToken");

    const response = await fetch(this.BASE_URL + endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(token && { Authorization: "Bearer " + token }),
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      throw new Error(await response.text());
    }

    return await response.json();
  },

  async PUT(endpoint, body) {
    const token = localStorage.getItem("adminToken");

    const response = await fetch(this.BASE_URL + endpoint, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        ...(token && { Authorization: "Bearer " + token }),
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      throw new Error(await response.text());
    }

    return await response.json();
  },

  async DELETE(endpoint) {
    const token = localStorage.getItem("adminToken");

    const response = await fetch(this.BASE_URL + endpoint, {
      method: "DELETE",
      headers: {
        ...(token && { Authorization: "Bearer " + token }),
      },
    });

    if (!response.ok) {
      throw new Error(await response.text());
    }

    if (response.status === 204) return true;

    return await response.json();
  },
};
