function getStoredToken() {
  return sessionStorage.getItem("kleaning_token");
}

export function clearStoredToken() {
  sessionStorage.removeItem("kleaning_token");
}

export function apiCall(path, method = "GET", body = null) {
  const token = getStoredToken();
  return fetch(path, {
    method,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    ...(body ? { body: JSON.stringify(body) } : {}),
  }).then((response) => response.json());
}

export const authApi = {
  me() {
    const token = getStoredToken();
    if (!token) return Promise.resolve({});
    return fetch("/api/auth/me", {
      headers: { Authorization: `Bearer ${token}` },
    }).then((response) => response.json());
  },
  clearSession: clearStoredToken,
};

export const extrasApi = {
  list: () => apiCall("/api/extras"),
  create: (nom) => apiCall("/api/extras", "POST", { nom }),
  remove: (id) => apiCall(`/api/extras/${id}`, "DELETE"),
};

export const lieuxApi = {
  list: () => apiCall("/api/lieux"),
  create: (lieu) => apiCall("/api/lieux", "POST", lieu),
  update: (id, data) => apiCall(`/api/lieux/${id}`, "PUT", data),
  remove: (id) => apiCall(`/api/lieux/${id}`, "DELETE"),
};

export const usersApi = {
  list: () => apiCall("/api/users"),
  create: (payload) => apiCall("/api/users", "POST", payload),
  update: (id, payload) => apiCall(`/api/users/${id}`, "PUT", payload),
  updatePassword: (id, password) => apiCall(`/api/users/${id}/password`, "PUT", { password }),
  remove: (id) => apiCall(`/api/users/${id}`, "DELETE"),
};

export const equipeApi = {
  list: () => apiCall("/api/equipe"),
  create: (payload) => apiCall("/api/equipe", "POST", payload),
  update: (id, payload) => apiCall(`/api/equipe/${id}`, "PUT", payload),
  remove: (id) => apiCall(`/api/equipe/${id}`, "DELETE"),
};

export const configApi = {
  listTypes: () => apiCall("/api/config/types"),
  saveTypes: (types) => apiCall("/api/config/types", "POST", { types }),
};

export const planningApi = {
  calendar: (date) => apiCall(`/api/calendar?date=${date}`),
  listHistory: () => apiCall("/api/planning"),
  historyDetail: (date) => apiCall(`/api/planning/${date}`),
  save: (payload) => apiCall("/api/planning", "POST", payload),
};
