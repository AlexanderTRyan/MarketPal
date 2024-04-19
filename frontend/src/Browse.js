import React, { useState, useRef, useEffect } from 'react';

function Browse() {




  const [postCatalog, setPostCatalog] = useState([]);

  //Using useEffect we are ensureing that the fetch is only being run 1 time 
  useEffect(() => {
    fetch("http://localhost:8081/listPosts")
      .then(response => response.json())
      .then(posts => {
        const postsWithIndex = posts.map(post => ({ ...post, imgIndex: 0 }));
        setPostCatalog(postsWithIndex);
      })
      .catch(error => {
        console.error('Error fetching data:', error);
      });
  }, []);

 


  const listPosts = postCatalog.map((post, index) => {
    const switchLeft = () => {
      setPostCatalog(prevCatalog => {
        const updatedCatalog = [...prevCatalog];
        if (updatedCatalog[index].imgIndex === 0) {
          updatedCatalog[index].imgIndex = updatedCatalog[index].imageUrl.length - 1;
        }
        else{
          updatedCatalog[index].imgIndex--;
        }
        return updatedCatalog;
      });
    };
  
    const switchRight = () => {
      setPostCatalog(prevCatalog => {
        const updatedCatalog = [...prevCatalog];
        if (updatedCatalog[index].imageUrl.length - 1 === updatedCatalog[index].imgIndex) {
            updatedCatalog[index].imgIndex = 0;
        }
        else{
          updatedCatalog[index].imgIndex++;
        }
        return updatedCatalog;
      });
    };

    return (
      <div className="col-4 mb-4" key={index}>
        <div className="card shadow-sm">
          <h3 className="title">{post.title}</h3>
          {post.imageUrl && post.imageUrl.length > 0 && (
            <img className="bd-placeholder-img card-img-top max-width" height="225" src={post.imageUrl[post.imgIndex]} alt={post.title} />
          )}
          <div className="card-body">
            <div>
              <img src="https://img.icons8.com/?size=48&id=9NUOGb9gL5Wb&format=gif" alt="Left Arrow" onClick={switchLeft} className='img-arrow1' />
              <img src='https://img.icons8.com/?size=48&id=9NUOGb9gL5Wb&format=gif' alt="Right Arrow" onClick={switchRight} className='img-arrow2' />
            </div>
            <p className="card-text">{post.description}</p>
            <div className="d-flex justify-content-between align-items-center">
              <div className="btn-group">
                <p className="card-body">Price: {post.price.toLocaleString()}</p>
                <p className="card-body">Condition: {post.condition}</p>
                <p className="card-body">Category: {post.category}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  });


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
            type="search" placeholder="Search" />
        </div>

        <div className='category-buttons-div'>
          <h3 className='category-buttons-header'>Category</h3>
          <hr />
          <button className="category-buttons">
            <img src="https://img.icons8.com/?size=80&id=RWBvrURKeNaa&format=png" alt="Image1" />
            Antiques & Collectibles
          </button>

          <button className="category-buttons">
            <img src="https://img.icons8.com/?size=80&id=111471&format=png" alt="Image2" />
            Arts & Crafts
          </button>

          <button className="category-buttons">
            <img src="https://img.icons8.com/?size=50&id=24548&format=png" alt="Image3" />
            Auto Parts & Accessories
          </button>

          <button className="category-buttons">
            <img src="https://img.icons8.com/ios-filled/2x/onesie.png" alt="Image4" />
            Baby Products
          </button>

          <button className="category-buttons">
            <img src="https://img.icons8.com/?size=50&id=9480&format=png" alt="Image5" />
            Books, Movies & Music
          </button>

          <button className="category-buttons">
            <img src="https://img.icons8.com/?size=50&id=yCeoujsiNAwK&format=png" alt="Image6" />
            Cell Phones & Accessories
          </button>

          <button className="category-buttons">
            <img src="https://img.icons8.com/?size=64&id=TiPE0w163waq&format=png" alt="Image7" />
            Clothing, Shoes, & Accessories
          </button>

          <button className="category-buttons">
            <img src="https://img.icons8.com/?size=50&id=8576&format=png" alt="Image8" />
            Electronincs
          </button>

          <button className="category-buttons">
            <img src="https://img.icons8.com/?size=50&id=8034&format=png" alt="Image9" />
            Furniture
          </button>

          <button className="category-buttons">
            <img src="https://img.icons8.com/?size=80&id=RpFbZUCbp8X6&format=png" alt="Image10" />
            Health & Beauty
          </button>

          <button className="category-buttons">
            <img src="https://img.icons8.com/?size=50&id=6qMXiF4hK09X&format=png" alt="Image11" />
            Home & Kitchen
          </button>

          <button className="category-buttons">
            <img src="https://img.icons8.com/?size=80&id=jXfQurfp3MQM&format=png" alt="Image12" />
            Jewerly & Watches
          </button>

          <button className="category-buttons">
            <img src="https://img.icons8.com/?size=80&id=bts1JjTAeYAG&format=png" alt="Image13" />
            Musical Instruments
          </button>

          <button className="category-buttons">
            <img src="https://img.icons8.com/?size=50&id=mBUZsi8BBR6a&format=png" alt="Image14" />
            Office Supplies
          </button>

          <button className="category-buttons">
            <img src="https://img.icons8.com/?size=80&id=121381&format=png" alt="Image15" />
            Pet Supplies
          </button>

          <button className="category-buttons">
            <img src="https://img.icons8.com/?size=50&id=5I9mgW1o2sOm&format=png" alt="Image16" />
            Patio & Garden
          </button>

          <button className="category-buttons">
            <img src="https://img.icons8.com/?size=80&id=CVJwB14NKRXA&format=png" alt="Image17" />
            Sporting Goods
          </button>

          <button className="category-buttons">
            <img src="https://img.icons8.com/?size=50&id=11219&format=png" alt="Image18" />
            Tools & Home Improvement
          </button>

          <button className="category-buttons">
            <img src="https://img.icons8.com/?size=80&id=fvMafQHrTSEc&format=png" alt="Image19" />
            Toys & Games
          </button>

          <button className="category-buttons">
            <img src="https://img.icons8.com/?size=50&id=pkoXh07CXQvX&format=png" alt="Image20" />
            Travel & Luggage
          </button>

          <button className="category-buttons">
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
    </div>
  );
}

export default Browse;