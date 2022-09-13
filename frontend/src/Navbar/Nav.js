import React from "react";
import classes from "./Nav.module.css";

function Nav() {
  return (
    <div className={classes.nav}>
      <div className={classes.title}>
        <h1>Shop<span style={{color : "white"}}>Out</span> Admin Portal</h1>
      </div>
    </div>
  );
}

export default Nav;
