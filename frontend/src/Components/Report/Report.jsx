import React from "react";
import { NavLink, Routes } from "react-router-dom";
import "./Report.css";

const Report = () => {
	return (
		<div className="Navigation">
			<div className="navigation_header">
				<ul>
					<li>
						<NavLink activeclassname="active" to="/event">
							Events
						</NavLink>
					</li>
					<li>
						<NavLink activeclassname="active" to="/booking">
							Bookings
						</NavLink>
					</li>
					<li>
						<NavLink activeclassname="active" to="/orders">
							Orders
						</NavLink>
					</li>
				</ul>
			</div>
		</div>
	);
};

export default Report;
