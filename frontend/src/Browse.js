import React, { useState, useRef } from 'react';

function Browse() {
  return (
    <div className="Browse">


      <div className="left-section-browse">
        <div class="browse-title">
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
          <hr/>
          <button class="category-buttons">
            <img src="https://img.icons8.com/?size=80&id=RWBvrURKeNaa&format=png" alt="Image Description"/>
             Antiques & Collectibles
          </button>

          <button class="category-buttons">
            <img src="https://img.icons8.com/?size=80&id=RWBvrURKeNaa&format=png" alt="Image Description"/>
            Arts & Crafts
          </button>

          <button class="category-buttons">
            <img src="https://img.icons8.com/?size=80&id=RWBvrURKeNaa&format=png" alt="Image Description"/>
            Auto Parts & Accessories
          </button>

          <button class="category-buttons">
            <img src="https://img.icons8.com/?size=80&id=RWBvrURKeNaa&format=png" alt="Image Description"/>
            Baby Products
          </button>

          <button class="category-buttons">
            <img src="https://img.icons8.com/?size=80&id=RWBvrURKeNaa&format=png" alt="Image Description"/>
            Books, Movies & Music
          </button>

          <button class="category-buttons">
            <img src="https://img.icons8.com/?size=80&id=RWBvrURKeNaa&format=png" alt="Image Description"/>
            Cell Phones & Accessories
          </button>

          <button class="category-buttons">
            <img src="https://img.icons8.com/?size=80&id=RWBvrURKeNaa&format=png" alt="Image Description"/>
            Clothing, Shoes, & Accessories
          </button>

          <button class="category-buttons">
            <img src="https://img.icons8.com/?size=80&id=RWBvrURKeNaa&format=png" alt="Image Description"/>
            Electronincs
          </button>

          <button class="category-buttons">
            <img src="https://img.icons8.com/?size=80&id=RWBvrURKeNaa&format=png" alt="Image Description"/>
            Furniture
          </button>

          <button class="category-buttons">
            <img src="https://img.icons8.com/?size=80&id=RWBvrURKeNaa&format=png" alt="Image Description"/>
            Health & Beauty
          </button>

          <button class="category-buttons">
            <img src="https://img.icons8.com/?size=80&id=RWBvrURKeNaa&format=png" alt="Image Description"/>
            Home & Kitchen
          </button>

          <button class="category-buttons">
            <img src="https://img.icons8.com/?size=80&id=RWBvrURKeNaa&format=png" alt="Image Description"/>
            Jewerly & Watches
          </button>

          <button class="category-buttons">
            <img src="https://img.icons8.com/?size=80&id=RWBvrURKeNaa&format=png" alt="Image Description"/>
            Musical Instruments
          </button>

          <button class="category-buttons">
            <img src="https://img.icons8.com/?size=80&id=RWBvrURKeNaa&format=png" alt="Image Description"/>
            Office Supplies
          </button>

          <button class="category-buttons">
            <img src="https://img.icons8.com/?size=80&id=RWBvrURKeNaa&format=png" alt="Image Description"/>
            Pet Supplies
          </button>

          <button class="category-buttons">
            <img src="https://img.icons8.com/?size=80&id=RWBvrURKeNaa&format=png" alt="Image Description"/>
            Patio & Garde
          </button>

          <button class="category-buttons">
            <img src="https://img.icons8.com/?size=80&id=RWBvrURKeNaa&format=png" alt="Image Description"/>
            Sporting Goods
          </button>

          <button class="category-buttons">
            <img src="https://img.icons8.com/?size=80&id=RWBvrURKeNaa&format=png" alt="Image Description"/>
            Tools & Home Improvement
          </button>

          <button class="category-buttons">
            <img src="https://img.icons8.com/?size=80&id=RWBvrURKeNaa&format=png" alt="Image Description"/>
            Toys & Games
          </button>

          <button class="category-buttons">
            <img src="https://img.icons8.com/?size=80&id=RWBvrURKeNaa&format=png" alt="Image Description"/>
            Travel & Luggage
          </button>

          <button class="category-buttons">
            <img src="https://img.icons8.com/?size=80&id=RWBvrURKeNaa&format=png" alt="Image Description"/>
            Miscellenous
          </button>
        </div>


      </div>

      <div className='middle-section-browse'>

      </div>
    </div>
  );
}

export default Browse;