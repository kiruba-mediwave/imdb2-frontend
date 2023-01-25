import { useState, useMemo, useEffect, useContext } from "react";
import Page from "../components/Page";
import { apiLogin } from "../services/api/user";
import axios from "axios";
import { Navigate } from "react-router-dom";
import DispatchContext from "../contexts/DispatchContext";
import StateContext from "../contexts/StateContext";

function LoginPage() {
  const appDispatch = useContext(DispatchContext);
  const appState = useContext(StateContext);

  const [state, setState] = useState({
    name: "",
    password: "",
    isLoading: false,
    callApi: false,
  });

  const isValid = useMemo(() => {
    if (state.name && state.password) {
      return true;
    }
    return false;
  }, [state.name, state.password]);

  useEffect(() => {
    const request = axios.CancelToken.source();

    async function doLogin() {
      setState((prev) => ({ ...prev, isLoading: true }));
      try {
        const { data } = await apiLogin({
          payload: {
            name: state.name,
            password: state.password,
          },
          cancelToken: request.token,
        });
        resetState();
        appDispatch({ type: "login", value: data.token });
      } catch (error) {
        console.log(error);
      } finally {
        setState((prev) => ({ ...prev, isLoading: false, callApi: false }));
      }
    }

    if (state.name && state.password && state.callApi) {
      doLogin();
    }

    return () => {
      request.cancel();
    };
  }, [state.name, state.password, state.callApi]);

  function handleChange({ e, field }) {
    if (field === "name") {
      setState((prev) => ({ ...prev, name: e.target.value }));
    } else if (field === "password") {
      setState((prev) => ({ ...prev, password: e.target.value }));
    }

    setState((prev) => ({ ...prev, isLoading: false }));
  }

  function handleSubmit(e) {
    e.preventDefault();
    setState((prev) => ({ ...prev, callApi: true }));
  }

  function resetState() {
    setState({
      name: "",
      password: "",
      isLoading: false,
      callApi: false,
    });
  }

  return appState.user ? (
    <Navigate to="/" />
  ) : (
    <Page title="Login">
      <h1>Login</h1>
      <form onSubmit={handleSubmit}>
        <label htmlFor="name">
          name
          <input
            type="text"
            id="name"
            name="name"
            placeholder="name"
            required
            value={state.name}
            onChange={(e) => handleChange({ e, field: "name" })}
          />
        </label>

        <label htmlFor="password">
          Password
          <input
            type="password"
            id="password"
            name="password"
            placeholder="Password"
            required
            value={state.password}
            onChange={(e) => handleChange({ e, field: "password" })}
          />
        </label>

        <button aria-busy={state.isLoading} type="submit" disabled={!isValid}>
          Login
        </button>
      </form>
    </Page>
  );
}

export default LoginPage;
