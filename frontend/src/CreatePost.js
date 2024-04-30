
import React, { useState, useRef, useEffect } from 'react';
import './App.css';
function CreatePost({ userProfile }) {

  const [itemImages, setItemImages] = useState([]);
  const [imgIndex, setImageIndex] = useState(0);
  const [title, setTitle] = useState('');
  const [price, setPrice] = useState(0);
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [condition, setCondition] = useState('');


  const fileInputRef = useRef(null);

  const handleitemImageChange = (e) => {
    const files = Array.from(e.target.files); // Convert FileList to Array
  
    // Map over each file to read and handle them individually
    Promise.all(files.map(file => {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
  
        reader.onload = () => {
          resolve(reader.result); // Resolve with the result when reading is done
        };
  
        reader.onerror = reject; // Reject in case of error
  
        reader.readAsDataURL(file);
      });
    }))
    .then(images => {
      // 'images' is an array containing base64 data of all the selected images
      setItemImages(images);
    })
    .catch(error => {
      // Handle any errors that occurred during reading
      console.error('Error reading files:', error);
    });
  };


  const handleAddPhotoClick = () => {
    // Trigger the file input click event
    fileInputRef.current.click();
  };

  const switchLeft = () => {
    let currIndex = imgIndex;
    if (currIndex !== 0) {
      setImageIndex(--currIndex)
    }
  }

  const switchRight = () => {
    let currIndex = imgIndex;
    if (itemImages.length - 1 > currIndex) {
      setImageIndex(++currIndex)
    }
  }

  const handleTitle = (e) => {
    const title = e.target.value;
    setTitle(title);
  }

  const handlePrice = (e) => {
    const price = parseFloat(e.target.value);
    setPrice(price);
  }

  const handleDescription = (e) => {
    const Description = e.target.value;
    setDescription(Description);
  }

  const handleCategory = (e) => {
    const Category = e.target.value;
    setCategory(Category);
  }

  const handleCondition = (e) => {
    const Condition = e.target.value;
    setCondition(Condition);
  }

  function addNewPost() {
    fetch('http://localhost:8081/addPost', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({
        "title": title,
        "price": price,
        "description": description,
        "category": category,
        "userID": userProfile.id,
        "condition": condition,
        "imageUrl": itemImages
      })
    }).then(response => response.json()).then(data => { alert('Post Added successfuly'); });


  }

  return (
    <div className="Create-Post">
      <div className="left-section">
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


        </div>

        <div className="imageGrid">
          <button className="custom-file-button" onClick={handleAddPhotoClick}>Add Photo</button>
          {itemImages && itemImages.map((imageUrl, index) => (
            <img key={index} src={imageUrl} alt={`Image ${index}`} className="Item-preview" />
          ))}
        </div>

        <div>
          <input className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 titleInput"
            type="text" placeholder="Title" onChange={handleTitle} />

          <input className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 titleInput"
            type="number" placeholder="Price" onChange={handlePrice} />


          <textarea className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full py-2.5 px-4 resize-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 descriptionInput"
            placeholder="Description" onChange={handleDescription}></textarea>

        </div>

        <div className="select-container">
          <select id="dropdownInput" name="dropdownInput" defaultValue="" onChange={handleCategory}>
            <option value="" disabled hidden>Select a category</option>
            <option value="Antiques & Collectibles">Antiques & Collectibles</option>
            <option value="Arts & Crafts">Arts & Crafts</option>
            <option value="Auto Parts & Accessories">Auto Parts & Accessories</option>
            <option value="Baby Products">Baby Products</option>
            <option value="Books, Movies & Music">Books, Movies & Music</option>
            <option value="Cell Phones & Accessories">Cell Phones & Accessories</option>
            <option value="Clothing, Shoes, & Accessories">Clothing, Shoes, & Accessories</option>
            <option value="Electronics">Electronics</option>
            <option value="Furniture">Furniture</option>
            <option value="Health & Beauty">Health & Beauty</option>
            <option value="Home & Kitchen">Home & Kitchen</option>
            <option value="Jewelry & Watches">Jewelry & Watches</option>
            <option value="Musical Instruments">Musical Instruments</option>
            <option value="Office Supplies">Office Supplies</option>
            <option value="Pet Supplies">Pet Supplies</option>
            <option value="Patio & Garden">Patio & Garden</option>
            <option value="Sporting Goods">Sporting Goods</option>
            <option value="Tools & Home Improvement">Tools & Home Improvement</option>
            <option value="Toys & Games">Toys & Games</option>
            <option value="Travel & Luggage">Travel & Luggage</option>
            <option value="Miscellaneous">Miscellaneous</option>
          </select>
        </div>

        <div className="select-container">
          <select id="dropdownInput" name="dropdownInput" onChange={handleCondition}>
            <option value="" disabled selected hidden>Condition</option>
            <option value="New">New</option>
            <option value="Used-Like New">Used-Like New</option>
            <option value="Used-Good">Used-Good</option>
            <option value="Used-Fair">Used-Fair</option>
          </select>
        </div>
      </div>

      <div className="middle-section">
        <div className='background-mid'>
          <div className="preview-div">
            <div>
              <div className="preview-header">
                <h1>Preview</h1>
              </div>
              <div className='img-preview-div'>
                {itemImages.length > 0 && (
                  <img src={itemImages[imgIndex]} alt={`Image 1`} className="preview-img" />
                )}
                {itemImages.length > 0 && (
                  <>
                    <img src="https://img.icons8.com/?size=48&id=9NUOGb9gL5Wb&format=gif" alt="Left Arrow" onClick={switchLeft} className='img-arrow1' />
                    <img src='https://img.icons8.com/?size=48&id=9NUOGb9gL5Wb&format=gif' alt="Right Arrow" onClick={switchRight} className='img-arrow2' />
                  </>
                )}
              </div>
            </div>

            <div className="preview-info">
              <div className="preview-info-content">
                <h2 className='preview-info-h1'>{title}</h2>
                <h4 className='preview-info-h3'>${price.toLocaleString()}</h4>
                <h3 className='preview-info-h3'>Condition:     {condition}</h3>
                <p className='preview-info-h3'>Description: {description}</p>
                <hr />
                <div className='seller-info-pic'>
                  <div>
                    <h3 className='preview-info-h3'>Seller Information:</h3>
                    <p className='preview-info-name'>{userProfile.fullName}</p>
                    <p className='preview-info-email'>{userProfile.email}</p>
                  </div>
                  <img src={userProfile.profilePicture} alt="Profile Picture" className='seller-picture' />
                </div>


                <button className='publish-button' onClick={(addNewPost)}>Publish</button>


              </div>
            </div>

          </div>

        </div>
      </div>


    </div>
  );
}

export default CreatePost;

