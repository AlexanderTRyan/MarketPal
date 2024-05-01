
import React, { useState, useEffect } from 'react';
import { get, useForm } from 'react-hook-form';
import { FaEdit, FaSave, FaTimes, FaTrash } from 'react-icons/fa';

function Profile({ userProfile, onDeleteProfile, onUpdateProfile, onDeletePost }) {
  const { register, handleSubmit, formState: { errors }, reset } = useForm();
  const [isEditMode, setIsEditMode] = useState(false);
  const [tempProfile, setTempProfile] = useState(userProfile);
  const [showDeletePopup, setShowDeletePopup] = useState(false);
  const [showDeletePostPopup, setShowDeletePostPopup] = useState(false);
 
  const [previousIndex, setPreviousIndex] = useState(0);
  const [userPosts, setUserPosts] = useState([]);

  //Hook to track and unpdate the post Catalog. Holds all of the posts.
  const [postCatalog, setPostCatalog] = useState([]);

  //Created for sorting purposes. We can't change postCatalog when sorting or we would destroy data. 
  const [sortedPostCatalog, setSortedPostCatalog] = useState([]);

  const [postToDelete, setPostToDelete] = useState('');


  const toggleEditMode = () => {
    setIsEditMode(!isEditMode);
    if (!isEditMode) {
      setTempProfile(userProfile);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setTempProfile({ ...tempProfile, [name]: value });
  };

  const handleProfileImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setTempProfile({ ...tempProfile, profilePicture: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };


  function deletePost() {
    // Fetch the value from the input field
    let id = postToDelete.id;
    console.log(id);
    fetch(`http://localhost:8081/Posts/${id}`, {
      method: 'DELETE',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify(
        { "id": id }
      )
    })
      .then(response => response.json());
  }

  const cancelChanges = () => {
    setIsEditMode(false);
    setTempProfile(userProfile); // Reset tempProfile to userProfile
    reset(); // Reset form errors
  };

  const saveChanges = () => {
    console.log('Saved changes:', tempProfile);
    onUpdateProfile(tempProfile);
    setIsEditMode(false);
    reset();
  };

  const confirmDeleteProfile = () => {
    setShowDeletePopup(true);
  };

  const handleDeleteConfirm = () => {
    setShowDeletePopup(false);
    onDeleteProfile();
  };

  const closeDeletePopup = () => {
    setShowDeletePopup(false);
  };

  const confirmDeletePost = (post) => {
    setShowDeletePostPopup(true);
    setPostToDelete(post);
  };

  const closeDeletePostPopup = () => {
    setShowDeletePostPopup(false);
  };

  const handlePostDeletion = () => {
    setShowDeletePostPopup(false);
    deletePost();

    let postArray = [...sortedPostCatalog];
    postArray = postArray.filter((removePost) => removePost.id !== postToDelete.id);
    setSortedPostCatalog(postArray);
  }

  function DeletePostPopup() {
    return (
      <div className="popup">
        <div className="popup-content">
          <h2>Delete {postToDelete.title} Post</h2>
          <p>Are you sure you want to delete this post</p>
          <button className="btn btn-danger mr-2" onClick={() => handlePostDeletion()}>
            <FaTrash /> Delete
          </button>
          <button className="btn btn-secondary" onClick={closeDeletePostPopup}>
            Cancel
          </button>
        </div>
      </div>
    );
  }



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


  const updateIndexNext = () => {
    console.log("last prev val: " + previousIndex);
    console.log("post length: " + userPosts.length);
    const nextIndex = previousIndex + 1;
    if (nextIndex < userPosts.length) {
      setPreviousIndex(nextIndex);
      console.log("I was taken");
      console.log("new prv val " + previousIndex);
    }
    else {
      setPreviousIndex(0);
    }
  }

  const updateIndexBack = () => {
    if (previousIndex - 1 >= 0) {
      setPreviousIndex(prevIndex => prevIndex - 1);
    }
    else {
      setPreviousIndex(userPosts.length - 1);
    }
  }

  useEffect(() => {
    const getUserPosts = sortedPostCatalog.map(post => ({
      ...post,
      imgIndex: 0 // Set the imgIndex property for each post
    })).filter(post => !userProfile || post.userID === userProfile.id);
    setUserPosts(getUserPosts);
  }, [sortedPostCatalog, userProfile]);


  const [imgIndex, setImgIndex] = useState(0); // Initialize imgIndex as a state
  // Grabs the pairs of 2 posts EX: 1,2 | 3,4 | 5,6.
  const listPosts = userPosts.slice(previousIndex, previousIndex + 1).map((post, index) => {
    
    const switchLeft = () => {
      const newIndex = imgIndex === 0 ? post.imageUrl.length - 1 : imgIndex - 1;
      setImgIndex(newIndex); // Update imgIndex state for the specific post
    };
    
    const switchRight = () => {
      const newIndex = imgIndex === post.imageUrl.length - 1 ? 0 : imgIndex + 1;
      setImgIndex(newIndex); // Update imgIndex state for the specific post
    };


    return (
      <div className='posts-div-profile' key={index}>
        <div className="card-profile">
          <div className='close-button-profile-div'>
            <img src="https://img.icons8.com/?size=48&id=13903&format=png" alt="Exit Button" onClick={() => confirmDeletePost(post)} className='close-button-profile' />
          </div>
          {post.imageUrl && post.imageUrl.length > 0 && (
            <img className="bd-placeholder-img card-img-top" height="225" src={post.imageUrl[imgIndex]} alt={post.title} />
          )}
          <div>
            <img src="https://img.icons8.com/?size=48&id=19175&format=png" alt="Left Arrow" onClick={switchLeft} className='img-arrow1' />
            <img src='https://img.icons8.com/?size=48&id=19175&format=png' alt="Right Arrow" onClick={switchRight} className='img-arrow2' />
          </div>
          <div className="card-body">
            <p className="card-price">${parseFloat(post.price).toLocaleString()}</p>
            <p className="title-post">{post.title}</p>
            <p className="title-post">Condition: {post.condition}</p>

          </div>
        </div>
      </div>
    );
  });





  function DeletePopup() {
    return (
      <div className="popup">
        <div className="popup-content">
          <h2>Delete Profile</h2>
          <p>Are you sure you want to delete your profile?</p>
          <button className="btn btn-danger mr-2" onClick={() => handleDeleteConfirm()}>
            <FaTrash /> Delete
          </button>
          <button className="btn btn-secondary" onClick={closeDeletePopup}>
            Cancel
          </button>
        </div>
      </div>
    );
  }


 
  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-6">
          <div className="card">
            <div className="card-header d-flex justify-content-between align-items-center">
              <h5>Profile</h5>
              {!isEditMode && (
                <button className="btn btn-primary" onClick={toggleEditMode}>
                  <FaEdit /> Edit
                </button>
              )}
            </div>
            <div className="card-body">
              <div className="mb-3">
                <label htmlFor="profilePicture" className="form-label">

                </label>
                {isEditMode ? (
                  <>
                    <input
                      {...register('profilePicture')}
                      type="file"
                      accept="image/*"
                      className="form-control mb-2"
                      id="profilePicture"
                      onChange={handleProfileImageChange}
                    />
                    {tempProfile.profilePicture && (
                      <img
                        src={tempProfile.profilePicture}
                        alt="Profile"
                        className="img-fluid mb-2"
                        style={{ borderRadius: '50%', width: '150px', height: '150px' }}
                      />
                    )}
                  </>
                ) : (
                  <img
                    src={tempProfile.profilePicture}
                    alt="Profile"
                    className="img-fluid"
                    style={{ borderRadius: '50%', width: '150px', height: '150px', border: 'solid 3px' }}
                  />
                )}
              </div>
              <div className="mb-3">
                <label htmlFor="fullName" className="form-label">
                  Full Name
                </label>
                {isEditMode ? (
                  <input
                    {...register('fullName', { required: true })}
                    type="text"
                    className="form-control"
                    id="fullName"
                    name="fullName"
                    value={tempProfile.fullName}
                    onChange={handleInputChange}
                  />
                ) : (
                  <p>{tempProfile.fullName}</p>
                )}
              </div>
              <div className="mb-3">
                <label htmlFor="email" className="form-label">
                  Email
                </label>
                {isEditMode ? (
                  <input
                    {...register('email', {
                      required: true,
                      pattern: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    })}
                    type="email"
                    className="form-control"
                    id="email"
                    name="email"
                    value={tempProfile.email}
                    onChange={handleInputChange}
                  />
                ) : (
                  <p>{tempProfile.email}</p>
                )}
                {errors.email && <p className="text-danger">Invalid email address</p>}
              </div>
              {isEditMode && (
                <div className="mb-3">
                  <label htmlFor="oldPassword" className="form-label">
                    Old Password
                  </label>
                  <input
                    {...register('oldPassword', { required: true })}
                    type="password"
                    className="form-control"
                    id="oldPassword"
                    name="oldPassword"
                    onChange={handleInputChange}
                  />
                  {errors.oldPassword && <p className="text-danger">Old password is required</p>}
                </div>
              )}
              <div className="mb-3">
                <label htmlFor="password" className="form-label">
                  {isEditMode ? 'New Password' : 'Password'}
                </label>
                {isEditMode ? (
                  <input
                    {...register('password', {
                      required: true,
                      minLength: 6,
                      pattern: /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$/,
                    })}
                    type="password"
                    className="form-control"
                    id="password"
                    name="password"
                    onChange={handleInputChange}
                  />
                ) : (
                  <p>******</p>
                )}
                {errors.password && <p className="text-danger">Password must be at least 6 characters long and contain at least one letter and one number</p>}
              </div>
              <div className="mb-3">
                <label htmlFor="address" className="form-label">
                  Address
                </label>
                {isEditMode ? (
                  <input
                    {...register('address', { required: true })}
                    type="text"
                    className="form-control"
                    id="address"
                    name="address"
                    value={tempProfile.address}
                    onChange={handleInputChange}
                  />
                ) : (
                  <p>{tempProfile.address}</p>
                )}
              </div>
            </div>
            {isEditMode && (
              <div className="card-footer d-flex justify-content-between">
                <button className="btn btn-secondary" onClick={cancelChanges}>
                  <FaTimes /> Cancel
                </button>
                <button className="btn btn-success" onClick={handleSubmit(saveChanges)}>
                  <FaSave /> Save
                </button>
              </div>
            )}
            {!isEditMode && (
              <div className="d-flex justify-content-center mt-3">
                <button className="btn btn-danger" onClick={confirmDeleteProfile}>
                  <FaTrash /> Delete Profile
                </button>
              </div>
            )}
            <br></br>

          </div>
        </div>
        <div className="col-md-6">
          <div className='card'>
            <h1 className='current-posts-h1'>Current Posts</h1>
            <div className='current-post-div'>

              {listPosts}
            </div>

            <div className='next-back-buttons'>
              <button className='back-posts-button' onClick={updateIndexBack}>Back</button>
              <button className='next-posts-button' onClick={updateIndexNext}>Next</button>
            </div>
          </div>
        </div>
      </div>
      {showDeletePopup && <DeletePopup />}
      {showDeletePostPopup && <DeletePostPopup />}
      <br></br>
     
    </div>
  );

}

export default Profile;
