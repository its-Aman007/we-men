import { assets } from "../assets/assets";
import { useState } from "react";
import axios from "axios";
import {backendUrl} from "../App"
import { toast } from "react-toastify";


const Add = ({ token }) => {
  const [image1, setImages1] = useState(false);
  const [image2, setImages2] = useState(false);
  const [image3, setImages3] = useState(false);
  const [image4, setImages4] = useState(false);

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("Men");
  const [subCategory, setSubCategory] = useState("Top-wear");
  const [price, setPrice] = useState("");
  const [sizes, setSizes] = useState([]);
  const [bestSeller, setBestSeller] = useState("");

  const onsubmitHandler = async(e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append("name", name);
      formData.append("description", description);
      formData.append("category", category);
      formData.append("subCategory", subCategory);
      formData.append("price", price);
      formData.append("sizes", JSON.stringify(sizes));
      formData.append("bestSeller", bestSeller ? "true" : "false");
      if(image1) formData.append("image1", image1);
      if(image2) formData.append("image2", image2);
      if(image3) formData.append("image3", image3);
      if(image4) formData.append("image4", image4);

      const response = await axios.post(`${backendUrl}/api/product/add`, formData,{headers: { Authorization: `Bearer ${token}` }});
     
      if(response.data.success){
        toast.success("Product added successfully");
        setName("");
        setDescription("");
        setCategory("Men");
        setSubCategory("Top-wear");
        setPrice("");
        setSizes([]);
        setBestSeller(false);
        setImages1(false);
        setImages2(false);
        setImages3(false);
        setImages4(false);
      } else {
        toast.error("Failed to add product");
      }


    } catch (error) {
      console.error(error.response?.data || error.message);
    }
  }
  return (
    <form onSubmit={onsubmitHandler} className="flex flex-col w-full items-start gap-4">
      <div>
        <p className="mb-2">Upload Image</p>
        <div className="flex gap-2">
          {[1, 2, 3, 4].map((num) => {
            let image;
            if (num === 1) image = image1;
            if (num === 2) image = image2;
            if (num === 3) image = image3;
            if (num === 4) image = image4;
            return(
            <label key={num} htmlFor={`image${num}`}>
              <img
                className="w-6 h-6 object-cover cursor-pointer rounded"
                src={!image ? assets.upload_area : URL.createObjectURL(image)}
                alt=""
              />
              <input
                onChange={(e) => {
                  if (num === 1) setImages1(e.target.files[0]);
                  if (num === 2) setImages2(e.target.files[0]);
                  if (num === 3) setImages3(e.target.files[0]);
                  if (num === 4) setImages4(e.target.files[0]);
                }}
                type="file"
                id={`image${num}`}
                hidden
              />
            </label>
            );
    })}
        </div>
      </div>

      {/* Product Name */}
      <div className="w-full">
        <p className="mb-2">Product Name</p>
        <input onChange={(e)=>setName(e.target.value)} value={name}
          className="w-full  max-w-[500px] px-4 py-2 border rounded"
          type="text"
          placeholder="Type here"
          required
        />
      </div>

      {/* Product Description */}
      <div className="w-full">
        <p className="mb-2">Product Description</p>
        <textarea onChange={(e)=>setDescription(e.target.value)} value={description}
          className="w-full max-w-[500px] px-4 py-2 border rounded"
          placeholder="Write content here"
          required
        />
      </div>

      {/* Category Row */}
      <div className="flex flex-row gap-6 items-end">
        <div className="flex flex-col">
          <p className="mb-2">Product Category</p>
          <select onChange={(e)=>setCategory(e.target.value)} value={category} className="px-4 py-2 border rounded w-[150px]">
            <option value="Men">Men</option>
            <option value="Women">Women</option>
            <option value="Kids">Kids</option>
          </select>
        </div>

        <div className="flex flex-col">
          <p className="mb-2">Sub Category</p>
          <select onChange={(e)=>setSubCategory(e.target.value)} value={subCategory} className="px-4 py-2 border rounded w-[150px]">
            <option value="Top-wear">Topwear</option>
            <option value="Bottom-wear">Bottomwear</option>
            <option value="Winter-wear">Winterwear</option>
          </select>
        </div>

        <div className="flex flex-col">
          <p className="mb-2">Product Price</p>
          <input onChange={(e)=>setPrice(e.target.value)} value={price}
            className=" w-full px-4 py-2 sm:w-[150px]"
            type="number"
            placeholder="25"
          />
        </div>
      </div>

      <div>
  <p className="mb-2">Product Sizes</p>

  <div className="flex gap-8 mt-2 flex-wrap">

    {["S","M","L","XL","XXL"].map((size)=>(
      
      <div
        key={size}
        onClick={() =>
          setSizes(prev =>
            prev.includes(size)
              ? prev.filter(item => item !== size)
              : [...prev, size]
          )
        }

        className={`cursor-pointer px-4 py-2 border rounded
        ${sizes.includes(size) ? "bg-black text-white " : "bg-gray-100 hover:bg-gray-200"}
        `}
      >
        {size}
      </div>

    ))}

  </div>
</div>

      <div className="flex gap-3 mt-2">
        <input onChange={(e)=>setBestSeller(e.target.checked)} checked={bestSeller} type="checkbox" id="bestseller"  />
        <label className="cursor-pointer" htmlFor="bestseller">
          Add to bestseller
        </label>
      </div>
      <button type="submit" className="w-28 py-3 mt-4 bg-black text-white hover:bg-gray-800 rounded">
        Add
      </button>
    </form>
  );
};

export default Add;
