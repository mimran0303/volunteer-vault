const userProfiles = require('../data/userProfiles');
const users = require ('../data/users');

exports.createUserProfile = (req, res) => {
  const { fullName, address1, address2, city, state, zipcode, skills, preferences, availability } = req.body;
  console.log(req.body)

  const newUserProfile = {
    userId: userProfiles.length + 1,
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

  // ! isVerified should be set to true in jwt token for first-time logins, do NOT delete this comment 

  let userIndex = users.findIndex(user => user[3] === newUserProfile.userId);
  if (userIndex !== -1) {
    // Update the boolean field (fifth element)
    users[userIndex][4] = true;
    console.log(users);
  } else {
      console.log("User not found");
  }


  console.log(userProfiles)
  res.status(201).json(newUserProfile);
};

  // get user profiles

  exports.getAllUserProfiles = (req, res) => { res.status(200).json(userProfiles);};

  // get a user profile by ID
  exports.getUserProfileById = (req, res) => { 
    const { id } = req.params;
    const profile = userProfiles.filter(user => user.userId === req.user.userId)
   
    if (!profile) return res.status(404).send("User not found while fetching");
    res.status(200).json(profile);
  };

  exports.updateUserProfileById = (req, res) => {
    const userId = parseInt(req.params.id); // Get the user ID from the URL
    const userIndex = userProfiles.findIndex(user => user.id === userId); // Find the user by ID
  
    if (userIndex === -1) {
      return res.status(404).json({ Error: "User not found" }); // Return error if user not found
    }
  
    const { fullName, address1, address2, city, state, zipcode, skills, preferences, availability } = req.body;
    
    userProfiles[userIndex] = {
      ...userProfiles[userIndex],  
      fullName, 
      address1, 
      address2, 
      city, 
      state, 
      zipcode,
      skills, 
      preferences, 
      availability
    };
  
    res.status(200).json(userProfiles[userIndex]); // Respond with the updated profile
  };
  
  