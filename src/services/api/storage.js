export function setTokenInStorage({ token }) {
  localStorage.setItem("app-auth-token", token);
}

export const getTokenFromStorage = () => {
  localStorage.getItem("app-auth-token");
};
