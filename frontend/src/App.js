import './App.css';
import React, { useState } from 'react';
import { useForm } from "react-hook-form";
import { FaHome, FaUser, FaEnvelope, FaPlus, FaSignInAlt } from 'react-icons/fa';


import Browse from './Browse';
import Profile from './Profile';
import Messages from './Messages';
import CreatePost from './CreatePost';


function App() {

  const [activePage, setActivePage] = useState('browse');
  const [signInPopup, setSignInPopup] = useState(false);
  const [signUpPopup, setSignUpPopup] = useState(false);

  const handlePageChange = (page) => {
    setActivePage(page);
  };

  const toggleSignInPopup = () => {
    setSignUpPopup(false);
    setSignInPopup(!signInPopup);
  };

  const toggleSignUpPopup = () => {
    setSignInPopup(false);
    setSignUpPopup(!signUpPopup);
  };


  function SignIn() {
    const { register, handleSubmit, formState: { errors } } = useForm();

    const onSignIn = data => {
      console.log(data); // log all data
      // update hooks
      setSignInPopup(false);

    }

    return (
      <div className="popup">
        <div className="popup-content">
          {/* Sign-in form */}
          <form onSubmit={handleSubmit(onSignIn)} className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {/* Form fields */}
            <div className="col-md-6">
              <label htmlFor="email" className="form-label">Email</label>
              <input {...register("email", { required: true })} type="email" className="form-control" id="email" placeholder="Email" />
              {errors.email && <p className="text-danger">Email is required.</p>}
            </div>
            <div className="col-md-6">
              <label htmlFor="Password" className="form-label">Password</label>
              <input {...register("password", { required: true })} type="password" className="form-control" id="password" placeholder="Password" />
              {errors.password && <p className="text-danger">Password is required</p>}
            </div>
          </form>
          <button type="submit">Sign In</button>
          <button className="close-btn" onClick={toggleSignInPopup}>Close</button>
          <button className="close-btn" onClick={toggleSignUpPopup}>Sign Up</button>

        </div>
      </div>);
  }

  function SignUp() {
    const [profileImage, setProfileImage] = useState(null);
    const { register, handleSubmit, formState: { errors } } = useForm();

    const onCreateAccount = data => {
      console.log(data); // log all data
      // update hooks
      setSignUpPopup(false);

    }

    const validatePassword = (value) => {
      const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$/;
      return passwordRegex.test(value);
    };

    const handleProfileImageChange = (e) => {
      const file = e.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = () => {
          setProfileImage(reader.result);
        };
        reader.readAsDataURL(file);
      }
    };

    return (
      <div className="popup">
        <div className="popup-content">
          {/* Sign-up form */}
          <form onSubmit={handleSubmit(onCreateAccount)} className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {/* Form fields */}
            <div className="col-md-12">
              <label htmlFor="profilePicture" className="form-label">Profile Picture</label>
              <input {...register("profilePicture")} type="file" accept="image/*" className="form-control" id="profilePicture" onChange={handleProfileImageChange} />
              {profileImage && <img src={profileImage} alt="Profile" className="profile-preview" />}
            </div>
            <div className="col-md-6">
              <label htmlFor="fullName" className="form-label">Full Name</label>
              <input {...register("fullName", { required: true })} type="text" className="form-control" id="fullName" placeholder="Full Name" />
              {errors.fullName && <p className="text-danger">Full Name is required.</p>}
            </div>
            <div className="col-md-6">
              <label htmlFor="email" className="form-label">Email</label>
              <input {...register("email", { required: true, pattern: /^\S+@\S+$/i })} type="email" className="form-control" id="email" placeholder="Email" />
              {errors.email && <p className="text-danger">Email is required.</p>}
            </div>
            <div className="col-md-6">
              <label htmlFor="address" className="form-label">Address</label>
              <input {...register("address", { required: true })} type="text" className="form-control" id="address" placeholder="Address" />
              {errors.address && <p className="text-danger">Address is required.</p>}
            </div>
            <div className="col-md-6">
              <label htmlFor="Password" className="form-label">Password</label>
              <input {...register("password", { required: true, validate: validatePassword })} type="password" className="form-control" id="password" placeholder="Password" />
              {errors.password && <p className="text-danger">Password must be at least 6 characters long and contain at least one letter and one number</p>}
            </div>
            <button type="submit">Create Account</button>
            <button className="close-btn" onClick={toggleSignInPopup}>Back</button>
          </form>
        </div>
      </div>

    );
  }

  function Header() {
    return (
      <header className="header">
        <div className="logo">
          <img src="logo.png" alt="MarketPal Logo" />
        </div>
        <nav className="navbar">
          <button type="button" className="nav-link" onClick={toggleSignInPopup}>
            <FaSignInAlt /> Sign In
          </button>
          <button className={activePage === 'browse' ? 'active' : ''} onClick={() => handlePageChange('browse')}>
            <FaHome /> Browse
          </button>
          <button className={activePage === 'profile' ? 'active' : ''} onClick={() => handlePageChange('profile')}>
            <FaUser /> Profile
          </button>
          <button className={activePage === 'messages' ? 'active' : ''} onClick={() => handlePageChange('messages')}>
            <FaEnvelope /> Messages
          </button>
          <button className={activePage === 'create_post' ? 'active' : ''} onClick={() => handlePageChange('create_post')}>
            <FaPlus /> Create Post
          </button>
        </nav>
      </header>
    );
  }

  return (
    <div className="App">
      <Header />

      {(signInPopup) && <SignIn />}
      {(signUpPopup) && <SignUp />}
      {(activePage === 'browse') && <Browse />}
      {(activePage === 'profile') && <Profile />}
      {(activePage === 'messages') && <Messages />}
      {(activePage === 'create_post') && <CreatePost />}

    </div>
  );
}

export default App;
