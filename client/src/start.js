import { createRoot } from "react-dom/client";

import * as immutableState from "redux-immutable-state-invariant";
import { composeWithDevTools } from "redux-devtools-extension";
//import rootReducer from "./redux/reducer.js";
import { Provider } from "react-redux";
import { configureStore, applyMiddleware } from "@reduxjs/toolkit";
import App from "./components/App";
import Welcome from "./components/welcome";
import { store } from "./redux/store";
import { init } from "../src/features/chat/socket";

const root = createRoot(document.querySelector("main"));

fetch("/user/id.json")
    .then((response) => response.json())
    .then((data) => {
        if (data.userId) {
            init(store);
            root.render(
                <Provider store={store}>
                    <App />
                </Provider>
            );
        } else {
            root.render(<Welcome />);
        }
    });
