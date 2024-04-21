import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { FaEdit, FaSave, FaTimes, FaTrash } from 'react-icons/fa';

function Profile({ userProfile, onDeleteProfile, onUpdateProfile }) {
  const { register, handleSubmit, formState: { errors }, reset } = useForm();
  const [isEditMode, setIsEditMode] = useState(false);
  const [tempProfile, setTempProfile] = useState(userProfile);
  const [showDeletePopup, setShowDeletePopup] = useState(false);

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

  function DeletePopup() {
    return (
      <div className="popup">
        <div className="popup-content">
          <h2>Delete Profile</h2>
          <p>Are you sure you want to delete your profile?</p>
          <button className="btn btn-danger mr-2" onClick={handleDeleteConfirm}>
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
                  Profile Picture
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
                    style={{ borderRadius: '50%', width: '150px', height: '150px' }}
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
          </div>
        </div>
      </div>
      {showDeletePopup && <DeletePopup />}
      {!isEditMode && (
        <div className="d-flex justify-content-center mt-3">
          <button className="btn btn-danger" onClick={confirmDeleteProfile}>
            <FaTrash /> Delete Profile
          </button>
        </div>
      )}
    </div>
  );
}

export default Profile;
