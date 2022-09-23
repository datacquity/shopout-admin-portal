import React, { useState, useEffect } from "react";
import classes from "./Video.module.css";
import 'react-datepicker/dist/react-datepicker.css';

function Video() {
  const [videoTitle, setVideoTitle] = useState("");
  const [mainDate, setMainDate] = useState(new Date());
  const [mainTime, setMainTime] = useState(new Date());
  const [tags, setTags] = useState([]);
  const [businessId, setBusinessId] = useState("");
  const [businessList, setBusinessList] = useState();
  const [category, setCategory] = useState("");
  const [categoryList, setCategoryList] = useState();
  const [likes, setLikes] = useState();
  const [disLikes, setDisLikes] = useState();
  const [description, setDescription] = useState("");
  const [thumbnail, setThumbnail] = useState("");
  const [source, setSource] = useState("");
  const [isFashion,setIsFashion] = useState(false)
  const [date, setDate] = useState(new Date());

  const [value1, onChange1] = useState(new Date());
  const [value, onChange] = useState(new Date());

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

        const categories = await fetch(
          "/admin/category/get"
        )
          .then((res) => res.json())
          .then((data) => {
            console.log(data);
            // console.log(data.categories.length);
            const categories = data.categories;
            const categoryLength = data.categories.length;
            var categoryList1 =
              categoryLength > 0 &&
              categories.map((category, index) => {
                return (
                  <option key={index} value={category.name}>
                    {category.name}
                  </option>
                );
              });
            setCategoryList(categoryList1);
          });
      } catch (e) {
        console.log(e);
      }
    }
    fetchData();
  }, []);

  async function submitHandler(e) {
    e.preventDefault();

    // console.log(videoTitle);
    console.log(businessId);
    // console.log(category);
    // console.log(description);
    // console.log(capacity);
    // console.log(likes);
    // console.log(disLikes);
    // console.log(description);
    // console.log(thumbnail);
    console.log(source);
    // console.log(date);

    const video = await fetch(
      "/rtc-video/uploadVideo/video",
      {
        headers: {
          "Content-Type": "application/json",
          'Accept': "application/json",
        },
        method: "Post",
        body: JSON.stringify({
          videoData: {
            likes: likes,
            businessId: businessId,
            disLikes: disLikes,
            source: source,
            description: description,
            thumbnail: thumbnail,
            title: videoTitle,
            date: date,
            isFashion
          }
        }),
      }
    )
      .then((res) => res.json()
        // console.log(res);
        // if (res.status === 200) {
        //   alert("New Event is Created.");
        // } else if (res.status === 500) {
        //   alert(
        //     "Please refresh the page an select the business carefully."
        //   );
        // }
      )
      .then((data) => {
        if (data) {
          console.log(data);
          alert(`New video is uploaded named ${data.video.title} for business named ${data.business.display_name}.`);
        }
      });
  }

  return (
    <div className={classes.Video}>
      <h1>Upload a Video</h1>
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
              <option value="">Choose One</option>
              {businessList}
            </select>
            <label htmlFor="fashion">Is Beauty</label>
            <input
              type="checkbox"
              name="fashion"
              id="fashion"
              checked={isFashion}
              onChange={(e) => {
                setIsFashion(!isFashion)
              }}
              required
            />
            {/* <label htmlFor="categories">Categories</label>
            <select
              name="categories"
              id="categories"
              onChange={(e) => {
                console.log(e.target.value);
                setCategory(e.target.value);
              }}
            >
              <option value="" >
                Choose One
              </option>
              {categoryList}
            </select> */}
          </div>
          {/* <label htmlFor="videoTitle">Video Title</label>
          <input
            type="text"
            name="videoTitle"
            id="videoTitle"
            placeholder="Event Name"
            onChange={(e) => {
              setVideoTitle(e.target.value);
            }}
            required
          /> */}
          {/* <label htmlFor="description">Description</label>
          <textarea
            cols="30"
            rows="30"
            type="text"
            name="description"
            id="description"
            placeholder="Description of a video."
            onChange={(e) => {
              setDescription(e.target.value);
            }}
            required
          ></textarea> */}
          {/* <label htmlFor="likes">Likes</label>
          <input
            type="number"
            name="number"
            id="likes"
            placeholder="No. of likes to the youtube videos."
            onChange={(e) => {
              setLikes(e.target.value);
            }}
          />
          <label htmlFor="disLikes">Dislikes</label>
          <input
            type="number"
            name="number"
            id="disLikes"
            placeholder="No. of disLikes to the youtube videos."
            onChange={(e) => {
              setDisLikes(e.target.value);
            }}
          /> */}
          {/* <label htmlFor="tags">Tags</label>
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
              const resArr = tagsArray.map((element) => {
                return element.trim();
              });
              console.log(resArr);
              setTags(tagsArray);
            }}
            required
          />
          <label htmlFor="thumbnail">Thumbnail Link</label>
          <input
            type="text"
            name="thumbnail"
            id="thumbnail"
            placeholder="Link of thumbnail image."
            onChange={(e)=>{
                setThumbnail(e.target.value);
            }}
          /> */}
          <label htmlFor="source">Source of a Video</label>
          <input
            type="text"
            name="source"
            id="source"
            placeholder="Link / Source of a Video"
            onChange={(e) => {
              setSource(e.target.value);
            }}
          />
          {/* <label htmlFor="date">Date (Video uploaded On)</label>
          <input type="date" name="date" id="date" onChange={(e)=>{
                console.log(e.target.value);
                setDate(e.target.value);
            }}/> */}
          <button className={classes.blueButton} onClick={submitHandler}>
            Next
          </button>
        </form>
      </div>
    </div>
  );
}

export default Video;
