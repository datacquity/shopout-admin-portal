import React, { useState, useEffect } from "react";
import classes from "./Events.module.css";
import DateTimePicker from "react-datetime-picker";
import DatePicker from "react-datepicker";
import Select from 'react-select';

function Events() {
  const [eventName, setEventName] = useState("");
  const [date, setDate] = useState("");
  const [mainDate, setMainDate] = useState(new Date());
  const [time, setTime] = useState();
  const [mainTime, setMainTime] = useState(new Date());
  const [description, setDescription] = useState("");
  const [capacity, setCapacity] = useState();
  const [tags, setTags] = useState([]);
  const [businessId, setBusinessId] = useState("");
  const [businessList, setBusinessList] = useState();
  const [storeId, setStoreId] = useState("");
  const [storeList, setStoreList] = useState();
  const [eventDuration, setEventDuration] = useState();
  const [image, setImage] = useState("");

  const [value1, onChange1] = useState(new Date());
  const [value, onChange] = useState(new Date());

  useEffect(() => {

    async function fetchData1() {
      setStoreId("");
      if (businessId) {
        const store1 = await fetch("/business/getBusiness/oneBusiness", {
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          method: "Post",
          body: JSON.stringify(
            {
              data: {
                id: businessId
              }
            }
          )
        })
          .then((res) => res.json())
          .then((data) => {
            console.log(data);
            const business = data.business;
            const stores = data.business.stores;
            console.log(stores);
            const storesLength = data.business.stores.length;
            console.log(storesLength);
            var storesList = business && storesLength > 0 && stores.map((store, index) => {
              return (
                <option key={index} value={store._id}>
                  {business.display_name}
                  {store.name && " :-"} {store.name}
                  :- {store._id}{" "}
                </option>
              )
            })
            // setStoreList(storeList1);
            setStoreList(storesList);
          })
      }
    }
    fetchData1();
  }, [businessId])


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
            // console.log(businessLength);
            const businesses = data.business;
            // console.log(businesses);
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

        const store = await fetch("/store/fetch/all")
          .then((res) => res.json())
          .then((data) => {
            console.log(data);
            const storeLength = data.store.length;
            // console.log(storeLength);
            const stores = data.store;
            var storeList1 =
              storeLength > 0 &&
              stores.map((store, index) => {
                if (store.name) {
                  return (
                    <option key={index} value={store._id}>
                      {store.business.display_name}
                      - {store.name}
                      {/* :-{" "} {store._id}{" "} */}
                    </option>
                  );
                } else {
                  return (
                    <option key={index} value={store._id}>
                      {store.business.display_name}
                      {/* :- {store._id}{" "} */}
                    </option>
                  );
                }
              });
            setStoreList(storeList1);
          });
      } catch (e) {
        console.log(e);
      }
    }
    fetchData();
  }, []);

  const toDataURL = (blob) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result);
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });

  async function imageToBase64(e) {
    // console.log(e.target.files[0]);
    if (e.target.files[0]) {
      const resTitle = (await toDataURL(e.target.files[0]))
        .replace("data:", "")
        .replace(/^.+,/, "");
      console.log(resTitle);
      console.log(e.target.files[0]);
      setImage(resTitle);
    }
  }

  async function submitHandler(e) {
    e.preventDefault();

    // var myDate = date;
    // var myTime = time;
    // myDate = myDate.split("-");
    // myTime = myTime.split(":");
    // var newDate = new Date(myDate[0], myDate[1] - 1, myDate[2] );
    // var newTime = new Date(myDate[0], myDate[1] - 1, myDate[2] , myTime[0], myTime[1]);
    // newDate = newDate.toString().substring(0, 24);
    // newTime = newTime.toString().substring(0, 24);
    // console.log(newDate);
    // console.log(newTime);
    // setMainDate(newDate);
    // setMainTime(newTime);

    console.log(eventName);
    console.log(date);
    console.log(time);
    console.log(description);
    console.log(capacity);
    console.log(tags);
    console.log(businessId);
    console.log(storeId);
    console.log(eventDuration);
    console.log(image);
    console.log(value);

    
    const event = await fetch(
      "/user/app/home/demoBooking/upload",
      {
        headers: {
          "Content-Type": "application/json",
          'Accept': "application/json",
        },
        // 'Content-Type' : 'application/x-www-form-urlencoded; charset=UTF-8',
        // mode: 'no-cors',
        // credentials : "include",
        method: "Post",
        body: JSON.stringify({
          demoData: {
            // form.eventName.value
            store: storeId,
            business: businessId,
            demoName: eventName,
            description: description,
            demoDate: value,
            duration: eventDuration,
            startTime: value,
            capacity: capacity,
            image: image,
            tags: tags,
          },
        }),
      }
    )
      .then((res) => {
        res.json()
        console.log(res);
        if (res.status === 413) {
          alert("Display image size should be less than 70kbs.")
        }
        else if (res.status === 200) {
          alert("New Event is Created.")
        }
        else if (res.status === 500) {
          alert("Please refresh the page an select the business & store carefully.")
        }
      }
      ).then((data) => {
        console.log(data);
        if (data) {
          console.log(data.data.demoName);
          alert(`Saved a new event named ${data.data.demoName}.`);
        }
      });
  }

  return (
    <div className={classes.Events}>
      <h1>Create an Event</h1>
      <div className={classes.content}>
        <form action="submit">
          <div className={classes.selects}>
            <label htmlFor="businessId">Business ID (Object ID)</label>
            <select
              // defaultValue={businessList[0]}
              name="businesses"
              id=""
              onChange={(e) => {
                setBusinessId("");
                console.log(e.target.value);
                setBusinessId(e.target.value);
              }}
            >
              <option value="">
                Choose One
              </option>
              {businessList}
            </select>
            {/* <Select name="businesses" id="" options={businessList}  onChange={(e)=>{
              console.log(e.target.value);
              setBusinessId(e.target.value);
            }}/> */}
            <label htmlFor="storeId">Store ID (Object ID)</label>
            <select
              // defaultValue={storeList[0]}
              name="stores"
              id=""
              onChange={(e) => {
                console.log(e.target.value);
                setStoreId(e.target.value);
              }}
            >
              <option value="null" >
                Choose One
              </option>
              {storeList}
            </select>
          </div>
          <label htmlFor="eventName">Event Name</label>
          <input
            type="text"
            name="eventName"
            id="eventName"
            placeholder="Event Name"
            onChange={(e) => {
              setEventName(e.target.value);
            }}
            required
          />
          <label htmlFor="date">Date & Time</label>
          {/* <DateTimePicker 
            onChange={onChange}
            value={value} 
            minDate={value1}
            className={classes.calenderDatePicker}
        /> */}
          <DatePicker
            minDate={value1}
            startDate={value}
            selected={value}
            onChange={(date) => onChange(date)}
            showTimeSelect

            dateFormat="MMMM d, yyyy h:mm aa"
          />
          <label htmlFor="description">Description</label>
          <textarea
            cols="30"
            rows="30"
            type="text"
            name="description"
            id="description"
            placeholder="Describe the business."
            onChange={(e) => {
              setDescription(e.target.value);
            }}
            required
          ></textarea>
          <label htmlFor="capacity">Capacity</label>
          <input
            type="number"
            name="capacity"
            id="capacity"
            placeholder="For e.g. 1000"
            onChange={(e) => {
              setCapacity(e.target.value);
            }}
            required
          />
          <label htmlFor="tags">Tags</label>
          <input
            type="text"
            name="tags"
            id="tags"
            placeholder="For e.g. clothes , fashion , fashion style , men fashion , women fashion"
            onChange={(e) => {
              var tagsArray = e.target.value.split(",");
              //   const resArr = tags.map(element => {
              //     return element.trim();
              // });
              setTags(tagsArray);
            }}
            required
          />
          <label htmlFor="Image">Image</label>
          <input
            type="file"
            name="Image"
            id="Image"
            onChange={(e) => {
              console.log(e.target.files[0]);
              setImage([]);
              imageToBase64(e);
            }}
          />
          <label htmlFor="eventDuration">Event Duration (in mins)</label>
          <input
            type="number"
            name="eventDuration"
            id="eventDuration"
            placeholder="Duration of an event"
            onChange={(e) => {
              setEventDuration(e.target.value);
            }}
            required
          />

          <button className={classes.blueButton} onClick={submitHandler}>
            Next
          </button>
        </form>
      </div>
    </div>
  );
}

export default Events;
