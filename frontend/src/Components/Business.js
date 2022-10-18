import React, { useState, useEffect, useRef } from "react";
import classes from "./Business.module.css";
import { Form } from "react-bootstrap";

function Business() {
  const [name, setName] = useState("");
  const [display_name, setDisplayName] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNo, setPhoneNo] = useState("");
  //   const [password, setPassword] = useState("shopout@123");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [categoryList, setCategoryList] = useState("");
  const [businessTags, setBusinessTags] = useState([]);
  const [brands, setBrands] = useState([]);
  const [hasCallNow, setHasCallNow] = useState(false);
  const [image, setImage] = useState("");
  const [imageList, setImageList] = useState([]);
  const [isFashion, setIsFashion] = useState(false);
  const gstNumberRef = useRef();
  const commissionRef = useRef();
  const businessUrlRef = useRef();
  // const [mainImageList,setMainImageList]=useState([]);
  const password = "shopout@123";

  useEffect(() => {
    async function fetchData() {
      try {
        const categories = await fetch(
          "/admin/category/get"
        )
          .then((res) => res.json())
          .then((data) => {
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

  const toDataURL = (blob) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result);
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });

  async function imageToBase64(e) {
    if (e.target.files[0]) {
      const resTitle = (await toDataURL(e.target.files[0]))
        .replace("data:", "")
        .replace(/^.+,/, "");
      setImage(resTitle);
    }
  }

  async function imagesToBase64(e) {
    if (e.target.files) {
      for (let i = 0; i < e.target.files.length; i++) {
        const res = (await toDataURL(e.target.files[i]))
          .replace("data:", "")
          .replace(/^.+,/, "");
        // imageList.push(res);
        setImageList((previous) => [...previous, res]);
      }
    }
  }

  async function submitHandler(e) {
    e.preventDefault();

    if (phoneNo.length < 10){
      alert("Please enter valid Phone Number.")
      return;
    }

    try {
      const res = await fetch(
        "/business/create/business",
        {
          headers: {
            "Content-Type": "application/json",
            'Accept': "application/json",
          },
          method: "POST",
          body: JSON.stringify({
            businessData: {
              tags: businessTags,
              images: imageList,
              title_image: image,
              hasCallNow: hasCallNow,
              brands,
              category,
              name,
              display_name,
              password,
              phone: phoneNo,
              email,
              description,
              isFashion,
              GSTIN: gstNumberRef.current.value,
              commission: commissionRef.current.value,
              businessUrl: businessUrlRef.current.value,
            },
          }),
        }
      )
        .then((res) => {
          if (res.status === 413){
            alert("Display image size & consolidated size of Title images should be less than 70kbs.")
          }
          else if (res.status === 200){
            alert("New Business is Created.")
          }
          return res.json();
        })
        .then((data) => {
          if (data) {
            alert(
              `Saved a new business named ${data.business.name} with a display name of ${data.business.display_name}.`
            );
          }
        });
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <div className={classes.Business}>
      <h1>Create a Business</h1>
      <div className={classes.content}>
        <form action="submit" onSubmit={submitHandler}>
        <label htmlFor="fashion">Is Beauty</label>
          <input
            type="checkbox"
            name="fashion"
            id="fashion"
            checked={isFashion}
            onChange={(e) => {
              setIsFashion(!isFashion)
            }}
          />
          <label htmlFor="businessName">Business Name</label>
          <input
            type="text"
            name="businessName"
            id="businessName"
            placeholder="Legal/Official Name"
            onChange={(e) => {
              setName(e.target.value);
            }}
            required
          />
          <label htmlFor="gstNumber">GSTIN Number</label>
          <input
            type="text"
            name="gstNumber"
            id="gstNumber"
            placeholder="GSTIN Number"
            maxLength="15"
            ref={gstNumberRef}
            required
          />
          <label htmlFor="commission">Commission</label>
          <input
            type="number"
            name="commission"
            id="commission"
            placeholder="Enter Commission"
            max="99"
            min="0"
            ref={commissionRef}
            required
          />
          <label htmlFor="titleName">Title Name</label>
          <input
            type="text"
            name="titleName"
            id="titleName"
            placeholder="Title Name"
            required
            onChange={(e) => {
              setDisplayName(e.target.value);
            }}
          />
          <label htmlFor="businessUrl">Business Url</label>
          <input
            type="text"
            name="businessUrl"
            id="businessUrl"
            placeholder="Business URL"
            ref={businessUrlRef}
            required
          />
          <label htmlFor="email">Email</label>
          <input
            type="text"
            name="email"
            id="email"
            placeholder="example@gmail.com"
            onChange={(e) => {
              setEmail(e.target.value);
            }}
            required
          />
          <label htmlFor="phoneNo">Phone Number</label>
          <input
            type="text"
            name="phoneNo"
            id="phoneNo"
            placeholder="8314567895"
            onChange={(e) => {
              setPhoneNo(e.target.value);
            }}
            required
          />
          <label htmlFor="password">Password</label>
          <input
            type="text"
            name="password"
            id="password"
            placeholder="shopout@123"
            value={password}
            contentEditable="false"
            onChange={(e) => {
              // setPass(e.target.value);
            }}
            required
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
          <label htmlFor="categories">Categories</label>
          <select
            name="categories"
            id="categories"
            onChange={(e) => {
              setCategory(e.target.value);
            }}
          >
            <option value="" defaultChecked disabled>
              Choose One
            </option>
            {categoryList}
          </select>
          <label htmlFor="displayImage">Display Image</label>
          <input
            type="file"
            name="displayImage"
            id="displayImage"
            onChange={(e) => {
              setImage([]);
              imageToBase64(e);
            }}
          />
          <label htmlFor="images">Tiles Images</label>
          <input
            type="file"
            name="images"
            multiple
            id="images"
            onChange={(e) => {
              setImageList([]);
              imagesToBase64(e);
            }}
          />
          <label htmlFor="tags">Tags (Comma Seperated)</label>
          <input
            type="text"
            name="tags"
            id="tags"
            placeholder="For e.g. clothes , fashion , fashion style , men fashion , women fashion"
            required
            onChange={(e) => {
              var tags = e.target.value.split(",");
              setBusinessTags(tags);
            }}
          />
          <label htmlFor="brands">Brands (Comma Seperated)</label>
          <input
            type="text"
            name="brands"
            id="brands"
            placeholder="For e.g. YWC , Nike , H&M , Adidas , Zara"
            required
            onChange={(e) => {
              var brands = e.target.value.split(",");
              setBrands(brands);
            }}
          />
          <div className={classes.hasCallNow}>
            <label htmlFor="physical">
              Does your business has 'call agent' feature (hasCallNow)?
            </label>
            <Form>
              {["radio"].map((type) => (
                <div key={`inline-${type}`} className={classes.mb}>
                  <Form.Check
                    className={classes.form}
                    inline
                    value={true}
                    label="Yes"
                    name="group1"
                    type={type}
                    id={`inline-${type}-1`}
                    onChange={(e) => {
                      setHasCallNow(e.target.value);
                    }}
                  />
                  <Form.Check
                    className={classes.form}
                    inline
                    value={false}
                    label="No"
                    name="group1"
                    type={type}
                    id={`inline-${type}-2`}
                    onChange={(e) => {
                      setHasCallNow(e.target.value);
                    }}
                  />
                </div>
              ))}
            </Form>
          </div>
          <button>Next</button>
        </form>
      </div>
    </div>
  );
}

export default Business;
