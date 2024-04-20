import React, { useState } from 'react';

// Popup component for confirmation
function ConfirmationPopup({ isOpen, onClose, onConfirm }) {
  if (!isOpen) return null;

  return (
    <div className="popup">
      <div className="popup-content">
        <h2>Confirmation</h2>
        <p>Are you sure you want to delete your profile?</p>
        <button onClick={onConfirm}>Yes, Delete</button>
        <button onClick={onClose}>Cancel</button>
      </div>
    </div>
  );
}

function Profile({ userProfile, onDeleteProfile }) {
  const [isConfirmationOpen, setConfirmationOpen] = useState(false);

  const handleDeleteProfile = () => {
    setConfirmationOpen(true);
  };

  const handleConfirmDelete = () => {
    onDeleteProfile();
    setConfirmationOpen(false); // Close the confirmation popup
  };

  const handleCancelDelete = () => {
    setConfirmationOpen(false); // Close the confirmation popup
  };

  const profile = userProfile || {}; // If userProfile is null, assign an empty object
  return (
    <div className="Profile">
      <h1>Profile</h1>
      <img src={profile.image} alt="Profile" className="profile-image" />
      <p>Name: {profile.fullName || ''}</p>
      <p>Email: {profile.email || ''}</p>
      <p>Address: {profile.address || ''}</p>
      <button onClick={handleDeleteProfile}>Delete Profile</button>
      <ConfirmationPopup
        isOpen={isConfirmationOpen}
        onClose={handleCancelDelete}
        onConfirm={handleConfirmDelete}
      />
    </div>
  );
}

export default Profile;
