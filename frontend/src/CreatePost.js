
import React, { useState, useRef } from 'react';

function CreatePost() {

  const [itemImages, setItemImages] = useState([]);
  const [imgIndex, setImageIndex] = useState(0);
  const [title, setTitle] = useState('');
  const [price, setPrice] = useState(0);
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [condition, setCondition] = useState('');

  const fileInputRef = useRef(null);

  const handleitemImageChange = (e) => {
    const files = e.target.files;
    if (files) {
      const imagesArray = Array.from(files).map((file) => URL.createObjectURL(file));
      setItemImages([...itemImages, ...imagesArray]);
    };

  };


  const handleAddPhotoClick = () => {
    // Trigger the file input click event
    fileInputRef.current.click();
  };

  const switchLeft = () => {
    let currIndex = imgIndex;
    if (currIndex != 0) {
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
        body: JSON.stringify(
            {
              "title": title, 
              "price": price, 
              "description": description, 
              "category": category,
              "condition": condition,
              "imageUrl": itemImages
            }
        )
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
            <option value="Miscellenous">Miscellenous</option>
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
                <div>
                  <img src="https://img.icons8.com/?size=48&id=9NUOGb9gL5Wb&format=gif" alt="Left Arrow" onClick={switchLeft} className='img-arrow1' />
                  <img src='https://img.icons8.com/?size=48&id=9NUOGb9gL5Wb&format=gif' alt="Right Arrow" onClick={switchRight} className='img-arrow2'/>
                </div>
              </div>
            </div>

            <div className="preview-info">
              <div className="preview-info-content">
                <h2 className='preview-info-h1'>{title}</h2>
                <h4 className='preview-info-h3'>${price.toLocaleString()}</h4>
                <h3 className='preview-info-h3'>Condition:     {condition}</h3>
                <p className='preview-info-h3'>Description: {description}</p>
                <hr />

                <h3 className='preview-info-h3'>Seller Information:</h3>

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

//TODO
/*
1. Change length of inputs
2. Fix the images to be able to add more than one.
3. Change the format of the dropdowns
4. Remove the arrow on the right of the screen
*/