import './App.css';
import React, { useState } from 'react';
import { useForm } from "react-hook-form";
import { FaHome, FaUser, FaEnvelope, FaPlus, FaSignInAlt, FaSignOutAlt } from 'react-icons/fa';


import Browse from './Browse';
import Profile from './Profile';
import Messages from './Messages';
import CreatePost from './CreatePost';

const URL = 'http://localhost:8081';


export function callServer(method, extention, requestBody, handleResponse) {
  fetch(`${URL}/${extention}`, {
    method: method,
    headers: {
      'content-type': 'application/json'
    },
    body: requestBody ? JSON.stringify(requestBody) : null
  })
    .then(response => {
      if (response.status !== 200) {
        throw new Error('Network response was not ok');
      }
      return response.json();
    })
    .then(data => {
      // Call the provided response handling function
      handleResponse(data);
    })
    .catch(error => {
      console.error('Error:', error);
    });
}

function App() {

  const [activePage, setActivePage] = useState('browse');
  const [signInPopup, setSignInPopup] = useState(false);
  const [signUpPopup, setSignUpPopup] = useState(false);
  const [loginError, setLoginError] = useState('');
  const [userProfile, setUserProfile] = useState(null);
  const [userPosts, setUserPosts] = useState([]);


  function handleSignOut() {
    setUserProfile(null);
    setActivePage('browse');
  }

  const handleDeletePost = (post) => {
    callServer('DELETE', 'post/' + post.id, post, (res) => {
      console.log(res);
      if (res.message === 'Post Deleted successfully') {
        alert('post Deleted');

        const updatedPosts = userPosts.filter((p) => p.id !== post.id);
        setUserPosts(updatedPosts);
        setActivePage('browse');

      } else {
        alert('Server Error Try Again Later')
      }
    })
  }

  const handleDeleteProfile = () => {
    callServer('DELETE', 'profile/' + userProfile.id, null, (res) => {
      if (res.message === 'User Deleted successfully') {
        alert('Profile Deleted');
        setActivePage('browse');
        setUserProfile(null);
      } else {
        alert('Server Error Try Again Later')
      }
    })
  }

  const handleUpdateProfile = (profile) => {
    callServer('PUT', 'profile/' + userProfile.id, profile, (res) => {
      if (res.message === 'User updated successfully') {
        alert('Profile Updated');
        setUserProfile(profile);
      } else if (res.message === 'Incorrect Password') {
        alert('Old Password Incorrect Try again');
      } else {
        alert('Server Error Try Again Later');
      }
    })
  }

  function login(profile) {
    if (profile.message == 'Login failed') {
      setLoginError('Login failed. Please try again.');
    } else {
      setUserProfile(profile);
      toggleSignInPopup();
      console.log(userProfile);
      getUserPosts(profile.id);
    }
  }

  function accountCreated(res) {
    console.log("Account created: ");
    console.log(res);
    if (res.message === 'User signed up successfully') {
      alert('Sign up successful!');
      setSignUpPopup(false);
    } else if (res.message === 'Email already exists') {
      alert('Account with this email already exists!');
    } else {
      alert('Sign up failed. Please Try again');
    }
  }

  const handlePageChange = (page) => {
    if (userProfile == null && page != 'browse') {
      setSignInPopup(true);
    } else {
      setSignInPopup(false);
      setSignUpPopup(false);
      setActivePage(page);
    }
  };

  const toggleSignInPopup = () => {
    setSignUpPopup(false);
    setSignInPopup(!signInPopup);
    setLoginError(''); // Reset login error message
  };

  const toggleSignUpPopup = () => {
    setSignInPopup(false);
    setSignUpPopup(!signUpPopup);
  };

  function getUserPosts(id) {
    callServer('GET', 'listPost/' + id, null, (res) => {
      console.log(res);
      setUserPosts(res);
    })
  }



  function SignIn() {
    const { register, handleSubmit, formState: { errors } } = useForm();

    const onSignIn = data => {
      console.log(data); // log all data
      callServer('GET', 'login/' + data.email + '/' + data.password, null, login);
      // update hooks
    }

    return (
      <div className="popup">
        <div className="popup-content">
          <h2>Sign In</h2>
          {/* Sign-in form */}
          <form onSubmit={handleSubmit(onSignIn)} className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {/* Form fields */}
            <div className="col-md-12">
              <label htmlFor="email" className="form-label">Email</label>
              <input {...register("email", { required: true })} type="email" className="form-control" id="email" placeholder="Email" />
              {errors.email && <p className="text-danger">Email is required.</p>}
            </div>
            <div className="col-md-12">
              <label htmlFor="Password" className="form-label">Password</label>
              <input {...register("password", { required: true })} type="password" className="form-control" id="password" placeholder="Password" />
              {errors.password && <p className="text-danger">Password is required</p>}
            </div>
            {loginError && <p className="text-danger">{loginError}</p>}
            <button type="submit">Sign In</button>
            <button className="close-btn" onClick={toggleSignInPopup}>Close</button>
            <button className="close-btn" onClick={toggleSignUpPopup}>Sign Up</button>
          </form>


        </div>
      </div>);
  }

  function SignUp() {
    const [profileImage, setProfileImage] = useState(null);
    const { register, handleSubmit, formState: { errors } } = useForm();

    const onCreateAccount = data => {
      data.profilePicture = profileImage;
      console.log(data); // log all data
      callServer('POST', "profile", data, accountCreated);

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
          <h2>Create an Account</h2>
          {/* Sign-up form */}
          <form onSubmit={handleSubmit(onCreateAccount)} className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {/* Form fields */}
            <div className="col-md-12">
              <label htmlFor="profilePicture" className="form-label">Profile Picture</label>
              <input {...register("profilePicture")} type="file" accept="image/*" className="form-control" id="profilePicture" onChange={handleProfileImageChange} />
              {profileImage && <img src={profileImage} alt="Profile" className="profile-preview" />}
            </div>
            <div className="col-md-12">
              <label htmlFor="fullName" className="form-label">Full Name</label>
              <input {...register("fullName", { required: true })} type="text" className="form-control" id="fullName" placeholder="Full Name" />
              {errors.fullName && <p className="text-danger">Full Name is required.</p>}
            </div>
            <div className="col-md-12">
              <label htmlFor="email" className="form-label">Email</label>
              <input {...register("email", { required: true, pattern: /^\S+@\S+$/i })} type="email" className="form-control" id="email" placeholder="Email" />
              {errors.email && <p className="text-danger">Email is required.</p>}
            </div>
            <div className="col-md-12">
              <label htmlFor="address" className="form-label">Address</label>
              <input {...register("address", { required: true })} type="text" className="form-control" id="address" placeholder="Address" />
              {errors.address && <p className="text-danger">Address is required.</p>}
            </div>
            <div className="col-md-12">
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

  function Header({ userProfile, handleSignOut }) {
    const isSignedIn = userProfile !== null;
    console.log(userProfile);
    const handleSignInOut = () => {
      if (isSignedIn) {
        handleSignOut();
      } else {
        toggleSignInPopup();
      }
    }

    return (
      <header className="header">
        <div className="logo">
          <img src="./logo.png" alt="MarketPal Logo" style={{ width: '40px', height: 'auto' }} />
        </div>
        <nav className="navbar">

          <div className="nav-buttons">
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
            <button type="button" className="nav-link" onClick={handleSignInOut}>
              {isSignedIn ? <FaSignInAlt /> : <FaSignOutAlt />} {isSignedIn ? 'Sign Out' : 'Sign In'}
            </button>
          </div>
        </nav>

        {isSignedIn && (
          <div className="profile-section">
            <div className="profile-picture">
              <img src={userProfile.profilePicture} alt="Profile" style={{ width: '40px', height: '40px', borderRadius: '25%' }} />
            </div>
            <div className="user-name">{userProfile.fullName}</div>
          </div>
        )}
      </header>
    );
  }

  function Footer() {
    return (
      <footer className="footer">
        <div className="container">
          <div className="row">
            <div className="col-md-6">
              <h4>About Us</h4>
              <p>Place some information about your website or company here.</p>
            </div>
            <div className="col-md-6">
              <h4>Contact Us</h4>
              <p>Email: example@example.com</p>
              <p>Phone: +1234567890</p>
            </div>
          </div>
        </div>
      </footer>
    );
  }

  return (
    <div className="App">
      <Header userProfile={userProfile} handleSignOut={handleSignOut} />

      {(signInPopup) && <SignIn />}
      {(signUpPopup) && <SignUp />}
      {(activePage === 'browse') && <Browse userProfile={userProfile} />}
      {(activePage === 'profile') && <Profile userProfile={userProfile} userPosts={userPosts} onDeleteProfile={handleDeleteProfile} onUpdateProfile={handleUpdateProfile} onDeletePost={handleDeletePost} />}
      {(activePage === 'messages') && <Messages userProfile={userProfile} />}
      {(activePage === 'create_post') && <CreatePost userProfile={userProfile} />}

      <Footer />

    </div>
  );
}

export default App;
