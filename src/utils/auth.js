export const getToken = () => {
  return localStorage.getItem('token');
};

export const setToken = (token) => {
  localStorage.setItem('token', token);
};

export const removeToken = () => {
  localStorage.removeItem('token');
};

export const isAuthenticated = () => {
  const token = getToken();
  if (!token) return false;

  try {
    const tokenData = JSON.parse(atob(token.split('.')[1]));
    return tokenData.exp > Date.now() / 1000;
  } catch (error) {
    return false;
  }
};

export const getUserData = () => {
  const token = getToken();
  if (!token) return null;

  try {
    const tokenData = JSON.parse(atob(token.split('.')[1]));
    return tokenData.data;
  } catch (error) {
    return null;
  }
};