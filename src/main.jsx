import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";
import NotificationWrapper from "./components/notify";

ReactDOM.createRoot(document.getElementById("root")).render(
    <React.StrictMode>
        <NotificationWrapper>
            <App />
        </NotificationWrapper>
    </React.StrictMode>
);
