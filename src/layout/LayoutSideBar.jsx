import React, { useState } from "react";
import Sidebar from "../pages/sidebar/Sidebar";
import AppHeader from "../layout/MenuBar";
import "./LayoutSideBar.css";
import SessionTimeout from "../layout/SessionTimeout";

const LayoutSideBar = ({ children, currentPage }) => {
    const [loggedIn, setLoggedIn] = useState(true); // Set the initial login state

    return (
        <div className="app-container">
            <Sidebar />
            <div className="content">
                <AppHeader currentPage={currentPage} />
                {children}
            </div>
            <SessionTimeout loggedIn={loggedIn} /> {/* Pass the login state to SessionTimeout */}
        </div>
    );
};

export default LayoutSideBar;
