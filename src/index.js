import ReactDOM from "react-dom";
import React from "react";
import App from "./App";
import { ThemeProvider } from "@material-ui/styles";
import { Provider } from "react-redux";
import store from "./redux/store";
import { theme } from "./Theme";

ReactDOM.render(
  <ThemeProvider theme={theme}>
    <Provider store={store}>
      <App />
    </Provider>
  </ThemeProvider>,
  document.getElementById("root")
);
