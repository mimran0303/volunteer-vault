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
  const userId = req.user.userId; // jwt token user id

  try {
    const db_con = await db();

    const [rows] = await db_con.query('SELECT * FROM UserProfile WHERE profile_owner_id = ?', [userId]);

    // query returned an empty data array
    if (rows.length === 0) {
      return res.status(404).send('User not found while fetching');
    }

    // returning retrieved profile to the client    
    return res.status(200).json(rows[0]); 
  } catch (error) {
    console.error('Error fetching user profile:', error);
    return res.status(500).send('Server error while fetching user profile');
  }
};

exports.updateUserProfileById = async (req, res) => {
  const userId = parseInt(req.params.id); 

  const { fullName, address1, address2, city, state, zipcode, skills, preferences, availability } = req.body;

  try {
    const db_con = await db();

    const [existingUser] = await db_con.query('SELECT * FROM UserProfile WHERE profile_owner_id = ?', [userId]);

    if (existingUser.length === 0) {
      return res.status(404).json({ Error: 'User not found' });
    }

    // Update the user profile
    const [result] = await db_con.query(
      'UPDATE UserProfile SET full_name = ?, address_1 = ?, address_2 = ?, city = ?, state = ?, zip_code = ?, skills = ?, preferences = ?, availability = ? WHERE profile_owner_id = ?',
      [fullName, address1, address2, city, state, zipcode, skills, preferences, availability, userId]
    );

    if (result.affectedRows === 0) {
      return res.status(500).json({ Error: 'Failed to update user profile' });
    }

    return res.status(200).json({ Message: 'User profile updated successfully' });
  } catch (error) {
    console.error('Error updating user profile:', error);
    return res.status(500).json({ Error: 'Server error while updating user profile' });
  }
};