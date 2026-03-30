import userModel from '../models/userModel.js';
import bcrypt from 'bcrypt';
import validator from 'validator';
import jwt from 'jsonwebtoken';




const createToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: '1d',
    });

}

// Routes for userLogin, signup, profile management, etc.
const loginUser = async(req, res) => {
    try {
        const { email, password } = req.body;
        
        // Check if user exists
        const user = await userModel.findOne({ email });
        if (!user) {
            return res.json({ success: false, message: 'User not found' });
        }

        // Compare password
        const isMatch = await bcrypt.compare(password, user.password);
        if (isMatch){

        const token = createToken(user._id);
        res.status(200).json({ success: true, token });
        }
        else{
            res.json({ success: false, message: 'Invalid credentials' });
        }
        
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: 'Error logging in user' });
    }

}

// Routes for user Registration
const registerUser = async(req, res) => {
    try {
        const { name, email, password } = req.body || {};

        // Check if user already exists
        const exists = await userModel.findOne({ email });
        if (exists) {
            return res.json({ success: false, message: 'User already exists' });
        }

        // Valid email and password checks can be added here
        if (!validator.isEmail(email)) {
            return res.json({ success: false, message: 'Please Enter Valid Email!!' });
        }

        if (password.length < 8) {
            return res.json({ success: false, message: 'Password is not strong enough' });
        }
        // Hash the password
        const salt=await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create new user
        const newUser = new userModel({
            name,
            email,
            password: hashedPassword,
        });

        const user= await newUser.save();
        const token = createToken(user._id);

        res.status(201).json({ success: true, token });
        
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Error registering user', error: error.message });
    }

}

// Route for admin login
const adminLogin = async(req, res) => {
    try {
        const { email, password } = req.body;

        if (email === process.env.ADMIN_EMAIL && password === process.env.ADMIN_PASSWORD) {
            const token = jwt.sign({ email, password }, process.env.JWT_SECRET);
            res.status(200).json({ success: true, token });
        } else {
            res.json({ success: false, message: 'Invalid admin credentials' });
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: 'Error logging in admin' });
    }

}

export { loginUser, registerUser, adminLogin };