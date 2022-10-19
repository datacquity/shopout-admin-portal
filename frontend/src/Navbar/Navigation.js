import React from "react";
// import classes from "./Navigation.module.css";
import "./Navigation.css";
import { NavLink } from "react-router-dom";

function Navigation() {
  return (
    <div className="Navigation">
      <div className="navigation_header">
        <ul>
          <li>
            <NavLink activeclassname="active" to="/business">
              Create Business
            </NavLink>
          </li>
          <li>
            <NavLink activeclassname="active" to="/store">
              Create Store
            </NavLink>
          </li>
          <li>
            <NavLink activeclassname="active" to="/events">
              Create Events
            </NavLink>
          </li>
          <li>
            <NavLink activeclassname="active" to="/product">
              Create Product
            </NavLink>
          </li>
          <li>
            <NavLink activeclassname="active" to="/agent">
              Create Agent
            </NavLink>
          </li>
          <li>
            <NavLink activeclassname="active" to="/video">
              Create Video
            </NavLink>
          </li>
          <li>
            <NavLink activeclassname="active" to="/report">
              Reports
            </NavLink>
          </li>
        </ul>
      </div>
    </div>
  );
}

export default Navigation;
