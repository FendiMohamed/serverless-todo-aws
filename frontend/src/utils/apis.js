const API_BASE_URL = import.meta.env.API_URL

const getAccessToken = () => {
    const sessionStoragKeys = Object.keys(sessionStorage);
    const oidcKey = sessionStoragKeys.find(key => key.startsWith("oidc.user:https://cognito-idp."));
    const oidcContext = JSON.parse(sessionStorage.getItem(oidcKey) || "{}");
    const accessToken = oidcContext?.access_token;
    return accessToken;
};

export const deleteAccessToken = () => {
    const sessionStoragKeys = Object.keys(sessionStorage);
    const oidcKey = sessionStoragKeys.find(key => key.startsWith("oidc.user:https://cognito-idp."));
    sessionStorage.removeItem(oidcKey);
}

export const fetchTodos = async () => {
    // alert(`API_BASE_URL: ${API_BASE_URL}`)
    const response = await fetch(`${API_BASE_URL}/todo`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${getAccessToken()}`,
        },
    });
    return response.json();
};

export const getTodo = async (id) => {
    const response = await fetch(`${API_BASE_URL}/todo/${id}`,
        {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${getAccessToken()}`,
            },
        },
    );
    return response.json();
};

export const createTodo = async (todo) => {
    const response = await fetch(`${API_BASE_URL}/todo`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${getAccessToken()}`
        },
        body: JSON.stringify(todo),
    });
    return response.json();
};

export const updateTodo = async (id, todo) => {
    const response = await fetch(`${API_BASE_URL}/todo/${id}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${getAccessToken()}`
        },
        body: JSON.stringify(todo),
    });
    return response.json();
};

export const deleteTodo = async (id) => {
    const response = await fetch(`${API_BASE_URL}/todo/${id}`, {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${getAccessToken()}`
        },
    });
    return response.json();
};