function Profile(userProfile) {
    const profile = userProfile.userProfile;
    return (
      <div className="Profile">
        <h1>Profile</h1>
        <p>Name: {profile.fullName}</p>
        <p>Email: {profile.email}</p>
        <p>Address: {profile.address}</p>

      </div>
    );
  }
  
  export default Profile;