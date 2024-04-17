
import React, { useState, useRef} from 'react';
import { useForm } from "react-hook-form";
import { FaHome, FaUser, FaEnvelope, FaPlus, FaSignInAlt } from 'react-icons/fa';
function CreatePost() {

  const [itemImages, setItemImages] = useState([]);
  const fileInputRef = useRef(null);

  const handleitemImageChange = (e) => {
    const files = e.target.files[0];
    if (files) {
      const imagesArray = Array.from(files).map((file) => URL.createObjectURL(file));
        setItemImages([...itemImages, imagesArray]);
      };
      
  };

  const handleAddPhotoClick = () => {
    // Trigger the file input click event
    fileInputRef.current.click();
  };

  return (
    <div className="CreatePost">

      <div className="col-md-12">
        <input 
        
          type="file"
          accept="image/*"
          id="profilePicture"
          className="hidden"
          onChange={handleitemImageChange}
          multiple
          ref={fileInputRef}
        />
      
        <button className="custom-file-button" onClick={handleAddPhotoClick}>Add Photo</button>
        {itemImages && itemImages.map((imageUrl, index) => (
          <img key={index} src={imageUrl} alt={`Image ${index}`} className="Item-preview" />
        ))}
      </div>

      <div>
        <h1>Hello</h1>
        <input className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 titleInput"
          type="text" placeholder="Title" />

        <input className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 titleInput"
          type="text" placeholder="Price" />

        <input className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 descriptionInput"
          type="text" placeholder="Description" />
      </div>

      <div className="select-container">
        <select id="dropdownInput" name="dropdownInput"  defaultValue="">
          <option value="" disabled selected hidden>Category</option>
          <option value="Antiques">Antiques & Collectibles</option>
          <option value="Arts">Arts & Crafts</option>
          <option value="AutoParts">Auto Parts & Accessories</option>
          <option value="BabyProducts">Baby Products</option>
          <option value="BooksMovies">Books, Movies & Music</option>
          <option value="CellPhones">Cell Phones & Accessories</option>
          <option value="Clothing">Clothing, Shoes, & Accessories</option>
          <option value="Electronincs">Electronincs</option>
          <option value="Furniture">Furniture</option>
          <option value="HealthBeauty">Health & Beauty</option>
          <option value="HomeKitchen">Home & Kitchen</option>
          <option value="Jewerly">Jewerly & Watches</option>
          <option value="Musical">Musical Instruments</option>
          <option value="Office">Office Supplies</option>
          <option value="Pet">Pet Supplies</option>
          <option value="Patio">Patio & Garden</option>
          <option value="SportingGoods">Sporting Goods</option>
          <option value="Tools">Tools & Home Improvement</option>
          <option value="Toys">Toys & Games</option>
          <option value="Travel">Travel & Luggage</option>
          <option value="VideoGames"> Video Games & Consoles</option>
          <option value="Miscellenous">Miscellenous</option>
        </select>
      </div>

      <div className="select-container">
        <select id="dropdownInput" name="dropdownInput">
          <option value="" disabled selected hidden>Condition</option>
          <option value="New">New</option>
          <option value="UsedLikeNew">Used-Like New</option>
          <option value="UsedGood">Used-Good</option>
          <option value="UsedFair">Used-Fair</option>
        </select>
      </div>
    </div>
  );
}

export default CreatePost;

//TODO
/*
1. Change length of inputs
2. Fix the images to be able to add more than one.
3. Change the format of the dropdowns
4. Remove the arrow on the right of the screen
*/