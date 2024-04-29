
import React, { useState, useRef, useEffect } from 'react';

function Browse({ userProfile, onMessageClick }) {



  //Hook to track and unpdate the post Catalog. Holds all of the posts.
  const [postCatalog, setPostCatalog] = useState([]);

  //Created for sorting purposes. We can't change postCatalog when sorting or we would destroy data. 
  const [sortedPostCatalog, setSortedPostCatalog] = useState([]);

  //Hook that determines whether to show the popup or not.
  const [viewPostPopup, setViewPostPopup] = useState(false);

  //Hook for holding the value of the post that was clicked on.
  const [selectedPost, setSelectedPost] = useState(null);

  //Hook for the selected posts index.
  const [selectedPostIndex, setSelectedPostIndex] = useState(null);

  const [sellerInfo, setSellerInfo] = useState(null);

  const [search, setSearch] = useState('');

  //Using useEffect we are ensureing that the fetch is only being run 1 time 
  useEffect(() => {
    fetch("http://localhost:8081/listPosts")
      .then(response => response.json())
      //imgIndex: 0 tells us the code to display img at index 0 by default
      .then(posts => {
        const postsWithIndex = posts.map(post => ({ ...post, imgIndex: 0 }));
        setPostCatalog(postsWithIndex);
        setSortedPostCatalog(postsWithIndex);
      })
      .catch(error => {
        console.error('Error fetching data:', error);
      });
  }, []);


  function getSellerInfo(id) {
    fetch("http://localhost:8081/profile/" + id)
      .then(response => response.json())
      .then(sellerProfile => {
        setSellerInfo(sellerProfile);
      })
      .catch(error => {
        console.error('Error fetching data:', error);
      });
  }



  //Closes the popup when the close button is clicked
  const handleClosePopup = () => {
    setSelectedPost(null);
    setViewPostPopup(false);
  }

  //Displays the popup and sets the current post and the index. 
  const handlePostClick = (post, index) => {
    getSellerInfo(post.userID);
    setSelectedPost(post);
    setSelectedPostIndex(index);
    setViewPostPopup(true);
    console.log(sellerInfo);
  }

  const handleCategoryButtonClick = (category) => {
    let results = [];
    console.log("this is the cat:", category);
    if (category !== "All Listings") {
      results = postCatalog.filter(allItems => {
        return allItems.category.toLowerCase().includes(category.toLowerCase());
      });
    } else {
      results = postCatalog;
    }

    console.log("these are the results", results);
    return setSortedPostCatalog(results);

  }





  //Shows the popup takes the parameters post and index which are the two hooks set at the top. 
  function PostPopup({ post, index }) {

    //This allwos the user to click the left arrow and flip through the images.
    const switchLeft = () => {
      setSortedPostCatalog(prevCatalog => {
        //Copy of the postCatalog
        const updatedCatalog = [...prevCatalog];
        //index is what post you are looking at in the postCatalog
        //imgIndex is the index of the image array within the current post.
        if (updatedCatalog[index].imgIndex === 0) {
          updatedCatalog[index].imgIndex = updatedCatalog[index].imageUrl.length - 1;
        }
        else {
          updatedCatalog[index].imgIndex--;
        }
        return updatedCatalog;
      });
    };


    //Allows user to click through the photes by clicking the right button.
    const switchRight = () => {
      setSortedPostCatalog(prevCatalog => {
        const updatedCatalog = [...prevCatalog];
        if (updatedCatalog[index].imageUrl.length - 1 === updatedCatalog[index].imgIndex) {
          updatedCatalog[index].imgIndex = 0;
        }
        else {
          updatedCatalog[index].imgIndex++;
        }
        return updatedCatalog;
      });
    };


    //Returns the popup and the content from the post. 
    return (
      <div className='popup-overlay'>
        <div className='popup-content-browse'>
          <div className='popup-close-button'>
            <div>
              <img src="https://img.icons8.com/?size=48&id=13903&format=png" alt="Exit Button" onClick={handleClosePopup} className='close-button' />
            </div>
          </div>
          <div className="preview-div-browse">
            <div>
              <div className='img-preview-div-popup'>
                {post.imageUrl && post.imageUrl.length > 0 && (
                  <img className="bd-placeholder-img card-img-top max-width" height="225" src={post.imageUrl[post.imgIndex]} alt={post.title} />
                )}
                <div>
                  <img src="https://img.icons8.com/?size=48&id=19175&format=png" alt="Left Arrow" onClick={switchLeft} className='img-arrow1' />
                  <img src='https://img.icons8.com/?size=48&id=19175&format=png' alt="Right Arrow" onClick={switchRight} className='img-arrow2' />
                </div>
              </div>
            </div>

            <div className="preview-info2">
              <div className="preview-info-content">
                <h2 className='preview-info-h1'>{post.title}</h2>
                <h4 className='preview-info-h3'>${post.price}</h4>
                <h3 className='preview-info-h3'>Condition: {post.condition}</h3>
                <p className='preview-info-h3'>{post.description}</p>
                <hr />
                {sellerInfo && (
                  <div className='seller-info-pic'>
                    <div>
                      <h3 className='preview-info-h3'>Seller Information:</h3>
                      <p className='preview-info-name'>{sellerInfo.fullName}</p>
                      <p className='preview-info-email'>{sellerInfo.email}</p>
                    </div>
                    <img src={sellerInfo.profilePicture} alt="Profile Picture" className='seller-picture' />
                  </div>
                )}

              </div>

              <div className='bottom-preview'>
                <div className='bottom-preview-right'>
                <button className="Message-button" onClick={() => onMessageClick(post.userID)}>Message</button>

                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }



  //This is the overall list of posts that are displayed on the browse screen.
  const listPosts = sortedPostCatalog.map((post, index) => {
    if (!userProfile || post.userID !== userProfile.id) {
      return (
        <div className='posts-div' key={index} onClick={() => handlePostClick(post, index)}>
          <div className="card-browse">

            {post.imageUrl && post.imageUrl.length > 0 && (
              <img className="bd-placeholder-img card-img-top max-width" height="225" src={post.imageUrl[post.imgIndex]} alt={post.title} />
            )}
            <div className="card-body">
              <p className="card-price">${parseFloat(post.price).toLocaleString()}</p>
              <p className="title-post">{post.title}</p>
              <p className="title-post">Condition: {post.condition}</p>

            </div>
          </div>
        </div>
      );
    }
  });

  const handleSearch = (event) => {
    const searchText = event.target.value.toLowerCase();
    setSearch(searchText);

    setSortedPostCatalog(prevCatalog => {
      if (searchText === "") return postCatalog; // Return the original array if search text is empty
      return prevCatalog.filter(post => post.title.toLowerCase().includes(searchText));
    });
  }
  //List of the categorys from users to easily filter through items on the market.
  return (
    <div className="Browse">

      <div className="left-section-browse">
        <div className="browse-title">
          <h1>Market
            <span>Your One-Stop Shop</span>
          </h1>
          <hr />
        </div>

        <div>
          <input className="search-bar"
            type="search" placeholder="Search" value={search} onChange={handleSearch} />
        </div>


        <div className='category-buttons-div'>
          <h3 className='category-buttons-header'>Category</h3>
          <hr />

          <button className="category-buttons" onClick={() => handleCategoryButtonClick("All Listings")}>
            <img src="https://img.icons8.com/?size=50&id=78230&format=png" alt="Image1" />
            All Listings
          </button>
          <button className="category-buttons" onClick={() => handleCategoryButtonClick("Antiques & Collectibles")}>
            <img src="https://img.icons8.com/?size=80&id=RWBvrURKeNaa&format=png" alt="Image1" />
            Antiques & Collectibles
          </button>

          <button className="category-buttons" onClick={() => handleCategoryButtonClick("Arts & Crafts")}>
            <img src="https://img.icons8.com/?size=80&id=111471&format=png" alt="Image2" />
            Arts & Crafts
          </button>

          <button className="category-buttons" onClick={() => handleCategoryButtonClick("Auto Parts & Accessories")}>
            <img src="https://img.icons8.com/?size=50&id=24548&format=png" alt="Image3" />
            Auto Parts & Accessories
          </button>

          <button className="category-buttons" onClick={() => handleCategoryButtonClick("Baby Products")}>
            <img src="https://img.icons8.com/ios-filled/2x/onesie.png" alt="Image4" />
            Baby Products
          </button>

          <button className="category-buttons" onClick={() => handleCategoryButtonClick("Books, Movies & Music")}>
            <img src="https://img.icons8.com/?size=50&id=9480&format=png" alt="Image5" />
            Books, Movies & Music
          </button>

          <button className="category-buttons" onClick={() => handleCategoryButtonClick("Cell Phones & Accessories")}>
            <img src="https://img.icons8.com/?size=50&id=yCeoujsiNAwK&format=png" alt="Image6" />
            Cell Phones & Accessories
          </button>

          <button className="category-buttons" onClick={() => handleCategoryButtonClick("Clothing, Shoes, & Accessories")}>
            <img src="https://img.icons8.com/?size=64&id=TiPE0w163waq&format=png" alt="Image7" />
            Clothing, Shoes, & Accessories
          </button>

          <button className="category-buttons" onClick={() => handleCategoryButtonClick("Electronics")}>
            <img src="https://img.icons8.com/?size=50&id=8576&format=png" alt="Image8" />
            Electronics
          </button>

          <button className="category-buttons" onClick={() => handleCategoryButtonClick("Furniture")}>
            <img src="https://img.icons8.com/?size=50&id=8034&format=png" alt="Image9" />
            Furniture
          </button>

          <button className="category-buttons" onClick={() => handleCategoryButtonClick("Health & Beauty")}>
            <img src="https://img.icons8.com/?size=80&id=RpFbZUCbp8X6&format=png" alt="Image10" />
            Health & Beauty
          </button>

          <button className="category-buttons" onClick={() => handleCategoryButtonClick("Home & Kitchen")}>
            <img src="https://img.icons8.com/?size=50&id=6qMXiF4hK09X&format=png" alt="Image11" />
            Home & Kitchen
          </button>

          <button className="category-buttons" onClick={() => handleCategoryButtonClick("Jewelry & Watches")}>
            <img src="https://img.icons8.com/?size=80&id=jXfQurfp3MQM&format=png" alt="Image12" />
            Jewelry & Watches
          </button>

          <button className="category-buttons" onClick={() => handleCategoryButtonClick("Musical Instruments")}>
            <img src="https://img.icons8.com/?size=80&id=bts1JjTAeYAG&format=png" alt="Image13" />
            Musical Instruments
          </button>

          <button className="category-buttons" onClick={() => handleCategoryButtonClick("Office Supplies")}>
            <img src="https://img.icons8.com/?size=50&id=mBUZsi8BBR6a&format=png" alt="Image14" />
            Office Supplies
          </button>

          <button className="category-buttons" onClick={() => handleCategoryButtonClick("Pet Supplies")}>
            <img src="https://img.icons8.com/?size=80&id=121381&format=png" alt="Image15" />
            Pet Supplies
          </button>

          <button className="category-buttons" onClick={() => handleCategoryButtonClick("Patio & Garden")}>
            <img src="https://img.icons8.com/?size=50&id=5I9mgW1o2sOm&format=png" alt="Image16" />
            Patio & Garden
          </button>

          <button className="category-buttons" onClick={() => handleCategoryButtonClick("Sporting Goods")}>
            <img src="https://img.icons8.com/?size=80&id=CVJwB14NKRXA&format=png" alt="Image17" />
            Sporting Goods
          </button>

          <button className="category-buttons" onClick={() => handleCategoryButtonClick("Tools & Home Improvement")}>
            <img src="https://img.icons8.com/?size=50&id=11219&format=png" alt="Image18" />
            Tools & Home Improvement
          </button>

          <button className="category-buttons" onClick={() => handleCategoryButtonClick("Toys & Games")}>
            <img src="https://img.icons8.com/?size=80&id=fvMafQHrTSEc&format=png" alt="Image19" />
            Toys & Games
          </button>

          <button className="category-buttons" onClick={() => handleCategoryButtonClick("Travel & Luggage")}>
            <img src="https://img.icons8.com/?size=50&id=pkoXh07CXQvX&format=png" alt="Image20" />
            Travel & Luggage
          </button>

          <button className="category-buttons" onClick={() => handleCategoryButtonClick("Miscellenous")}>
            <img src="https://img.icons8.com/?size=80&id=112518&format=png" alt="Image21" />
            Miscellenous
          </button>
        </div>


      </div>

      <div className='middle-section-browse'>
        <div className='row'>
          {listPosts}
        </div>
      </div>
      {/*This checks if the two hooks viewPostPopup and selectedPost are not null and are truthy. 
      If the two hooks are truthy then the PostPopup function is called with the correct parameters.*/}
      {viewPostPopup && selectedPost && <PostPopup post={selectedPost} index={selectedPostIndex} />}
    </div>
  );
}

export default Browse;