import React, { useState, useEffect } from "react";
// import classes from "./Agent.module.css";
import "./Agent.css";
import { TimePickerComponent } from "@syncfusion/ej2-react-calendars";

function Agent() {
  const [loginId, setLoginId] = useState("");
  const [password, setPassword] = useState("");
  const [agentName, setAgentName] = useState("");
  const [businessId, setBusinessId] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [businessList, setBusinessList] = useState();

  // const [value, setValue] = useState(new Date());
  const [value1, setValue1] = useState("09:00 AM");
  const [value2, setValue2] = useState("05:00 PM");

  useEffect(() => {
    async function fetchData() {
      try {
        const business = await fetch(
          "/business/getBusiness/all"
        )
          .then((res) => res.json())
          .then((data) => {
            console.log(data);
            // console.log(data.categories.length);
            const businessLength = data.business.length;
            console.log(businessLength);
            const businesses = data.business;
            // console.log(typeof businesses);
            var businessList1 =
              businessLength > 0 &&
              businesses.map((business, index) => {
                return (
                  <option key={index} value={business._id}>
                    {business.display_name}
                    {/* :- {business._id}{" "} */}
                  </option>
                );
              });
            // console.log(businessList1);
            setBusinessList(businessList1);
            // document.getElementById("business").innerHTML = options;
            // console.log(options,"OMk");
          });
      } catch (e) {
        console.log(e);
      }
    }
    fetchData();
  }, []);

  async function submitHandler(event) {
    event.preventDefault();
    console.log("clicked");
    console.log(loginId);
    console.log(password);
    console.log(agentName);
    console.log(businessId);
    console.log(startTime);
    console.log(endTime);

    const startMain = startTime.toString().substring(16, 21);
    const endMain = endTime.toString().substring(16, 21);
    console.log(startMain);
    console.log(endMain);

    const start0 = startMain.substring(0, 2);

    const start1 = startMain.substring(3, 5);

    const end0 = endMain.substring(0, 2);

    const end1 = endMain.substring(3, 5);

    const start2 = parseInt(start0);

    const start3 = parseInt(start1);

    const end2 = parseInt(end0);

    const end3 = parseInt(end1);

    if (end2 == start2) {
      if (end3 == start3) {
        alert("Start and End time Cannot be a same.");
        return;
      } else if (end3 < start3) {
        alert("Start time cannot be greater than End time.");
        return;
      }
    } else if (end2 < start2) {
      alert("Start time cannot be greater than End time.");
      return;
    }

    try {
      const res = await fetch(
        "/store/auth/agent/register",
        {
          headers: {
            "Content-Type": "application/json",
            'Accept': "application/json",
          },
          method: "POST",
          body: JSON.stringify({
            agentData: {
              name: agentName,
              password: password,
              start: startMain,
              end: endMain,
              business: businessId,
              loginID: loginId,
            },
          }),
        }
      )
        .then((res) => res.json())
        .then((data) => {
          console.log(data);
          // console.log(data.status);
          if (data) {
            console.log(data.agent.name);
            alert(`Saved a ${data.agent.name} agent.`);
          }
        });
      // console.log(res.status);
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <div className="Agent">
      <h1>Create an Agent</h1>
      <div className="content">
        <form action="submit">
          <label htmlFor="businessId">Business ID (Object ID)</label>
          {/* <input
            type="text"
            name="businessId"
            id="businessId"
            onChange={(e) => {
              setBusinessId(e.target.value);
            }}
            required
          /> */}
          <select
            name="businesses"
            id=""
            onChange={(e) => {
              console.log(e.target.value);
              setBusinessId(e.target.value);
            }}
          >
            <option value="" defaultChecked disabled>
              Choose One
            </option>
            {businessList}
          </select>
          <label htmlFor="loginId">Agent Login - ID</label>
          <input
            type="text"
            name="loginId"
            id="loginId"
            placeholder="For e.g. arihant-01"
            onChange={(e) => {
              setLoginId(e.target.value);
            }}
            required
          />
          <label htmlFor="password">Password</label>
          <input
            type="text"
            name="password"
            id="password"
            placeholder="arihant@123"
            required
            onChange={(e) => {
              setPassword(e.target.value);
            }}
          />
          <label htmlFor="name">Agent Name</label>
          <input
            type="text"
            name="name"
            id="name"
            placeholder="Agent Name"
            onChange={(e) => {
              setAgentName(e.target.value);
            }}
            required
          />
          <label htmlFor="active_hours">Active Hours</label>
          <label htmlFor="start">Start</label>
          {/* <input
            type="time"
            name="start"
            id="start"
            required
            onChange={(e) => {
              setStartTime(e.target.value);
            }}
          /> */}
          <TimePickerComponent
            placeholder="Select Start Timing"
            id="time"
            value={value1}
            onChange={(date) => {
              setStartTime(date.target.value);
            }}
          />
          <label htmlFor="end">end</label>
          {/* <input
            type="time"
            name="start"
            id="start"
            required
            onChange={(e) => {
              setEndTime(e.target.value);
            }}
          /> */}
          <TimePickerComponent
            placeholder="Select End Timing"
            id="time"
            value={value2}
            onChange={(date) => {
              setEndTime(date.target.value);
            }}
          />
          <button onClick={submitHandler}>Next</button>
        </form>
      </div>
    </div>
  );
}

export default Agent;
