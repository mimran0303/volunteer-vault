const userProfiles = require('../data/userProfiles');

const db = require('../config/index')

// POST request: POST data to the database 
exports.createUserProfile = async (req, res) => {
  const sql = "INSERT INTO UserProfile (profile_owner_id, full_name, address_1, address_2, city, state, zip_code, skills, preferences, availability) VALUES (?)";

  try {
    // req.user. => jwt token fields, req.body. => client-side form inputs 
    const profileValues = [
      req.user.userId, // jwt token user id
      req.body.fullName, 
      req.body.address1, 
      req.body.address2, 
      req.body.city, 
      req.body.state, 
      req.body.zipcode, 
      req.body.skills, 
      req.body.preferences,
      req.body.availability
    ];  

    // Get database connection
    const db_con = await db();

    // Insert the profile values into UserProfile
    await db_con.query(sql, [profileValues]);

    // Update is_verified in UserCredentials to 1 for the user
    const sql_update = "UPDATE UserCredentials SET is_verified = 1 WHERE user_id = ?";
    await db_con.query(sql_update, [req.user.userId]);

    return res.status(201).json({ message: "Profile created and user verified" });
  } catch (err) {
    return res.status(500).json({ error: "Failed to create user profile and verify user" });
  } 
};

exports.getUserProfileById = async (req, res) => { 
  const userId = req.user.userId;

  try {
    const db_con = await db();

    const [rows] = await db_con.query('SELECT * FROM UserProfile WHERE profile_owner_id = ?', [userId]);

    if (rows.length === 0) {
      return res.status(404).send('User not found while fetching');
    }

    res.status(200).json(rows[0]); 
  } catch (error) {
    console.error('Error fetching user profile:', error);
    res.status(500).send('Server error while fetching user profile');
  }
};


// PUT request: PUT edited profile data into database
// user's req.params.id should match 'profile_owner_id'
exports.updateUserProfileById = (req, res) => {
// Get the user ID from the URL, 
// the GET request should get ALL data (profile_id, profile_owner_id, ...)
// id needs to be sent from the client side, the id is gotten from the GET request
const userId = parseInt(req.params.id); 

const userIndex = userProfiles.findIndex(user => user.userId === userId); // Find the user by ID

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