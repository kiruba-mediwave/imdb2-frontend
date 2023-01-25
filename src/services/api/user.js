import http from "./index";

export function apiLogin({ payload, cancelToken }) {
  return http.post("/users/login", payload, { cancelToken });
}

export function apiGetUserInfo({ payload, cancelToken }) {
  return http.get("/users/info", { cancelToken });
}
