import "./App.css";
import React from "react";
import Nav from "./Navbar/Nav";
import Navigation from "./Navbar/Navigation";
import Agent from "./Components/Agent";
import Business from "./Components/Business";
import Events from "./Components/Events";
import Store from "./Components/Store";
import Video from "./Components/Video";
import { Route, Routes } from "react-router-dom";
import Report from "./Components/Report/Report.jsx";
import Event from "./Components/Report/Event.jsx";
import Booking from "./Components/Report/Booking.jsx";
import Product from "./Components/Product/Product.jsx";
import EventUsers from "./Components/Event/Users.jsx";
import Orders from "./Components/Orders/Orders";
import ProductOrders from "./Components/ProductOrders/ProductOrders.js";
import OrdersByDate from "./Components/OrdersByDate/OrdersByDate.js";

function App() {
  return (
    <div className="App">
      <header>
        <Nav />
        <Navigation />
      </header>
      <main>
        <Routes>
          <Route exact path="/" element={<Business />}></Route>
          <Route
            exact
            path="/shopout-admin-portal"
            element={<Business />}
          ></Route>
          <Route exact path="/agent" element={<Agent />}></Route>
          <Route exact path="/business" element={<Business />}></Route>
          <Route exact path="/events" element={<Events />}></Route>
          <Route exact path="/store" element={<Store />}></Route>
          <Route exact path="/video" element={<Video />}></Route>
          <Route exact path="/report" element={<Report />}></Route>
          <Route
            exact
            path="/event"
            element={<Event url="/user/demoBooking/get/all-demo-booking" />}
            type="CurrentEvent"
          ></Route>
          <Route
            exact
            path="/previousevents"
            element={
              <Event
                url="/user/demoBooking/get/all-archive-demo-booking"
                type="PreviousEvent"
              />
            }
          ></Route>
          <Route exact path="/orders" element={<Orders />}></Route>
          <Route exact path="/booking" element={<Booking />}></Route>
          <Route exact path="/product" element={<Product />}></Route>
          <Route exact path="/users" element={<EventUsers />}></Route>
          <Route
            exact
            path="/product-orders/:id"
            element={<ProductOrders />}
          ></Route>
          <Route
            exact
            path="/orders-by-date"
            element={<OrdersByDate />}
          ></Route>
        </Routes>
      </main>
    </div>
  );
}

export default App;
