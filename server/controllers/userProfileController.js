const userProfiles = require('../data/userProfile');

exports.createUserProfile = (req, res) => {
    const { fullName, address1, address2, city, state, zipcode, skills, preferences, availability } = req.body;
    const newUserProfile = {
      id: userProfiles.length + 1,
      fullName,
      address1,
      address2,
      city,
      state,
      zipcode,
      skills,
      preferences,
      availability,
    };
    console.debug("Hello from createUserProfilt");
    userProfiles.push(newUserProfile);
    res.status(201).json(newUserProfile);
  };

  // get user profiles

  exports.getAllUserProfiles = (req, res) => { res.status(200).json(userProfiles);};

  // get a user profile by ID
  exports.getUserProfileById = (req, res) => { 
    const { id } = req.params;
    const profile = userProfiles.find((user) => user.id === parseInt(id)); 
    if (!profile) return res.status(404).send("User not found");
    res.status(200).json(profile);
  };

  // update the profile (using ID)
  exports.updateUserProfileById = (req, res) => {
    const { id } = req.params;
    const index = userProfiles.findIndex((user) => user.id === parseInt(id));
    if (index === -1) return res.status(404).send("User not found");
    const updatedProfile = { ...userProfiles[index], ...req.body };
    userProfiles[index] = updatedProfile;
    res.status(200).json(updatedProfile);
  };

  // delete the profile
  exports.deleteUserProfileById = (req, res) => {
    const { id } = req.params;
    const index = userProfiles.findIndex((user) => user.id === parseInt(id));
    if (index === -1) return res.status(404).send("User not found");
    const deletedProfile = userProfiles.splice(index, 1);
    res.status(200).json(deletedProfile);
  };
