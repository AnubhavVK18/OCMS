const User = require('../models/user');
const OTP = require('../models/otp');
const cookieToken = require('../utilities/cookieToken');
const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const generateOtp = () => Math.floor(100000 + Math.random() * 900000).toString();

exports.sendOtp = async (req, res) => {
    try {
        const { email } = req.body;

        if (!email) {
            return res.status(400).json({ message: "Email is required" });
        }

        const otp = generateOtp();
        const expiresAt = Date.now() + 5 * 60 * 1000;

        await OTP.deleteMany({ email });
        const createdOTP = await OTP.create({ email, otp, expiresAt });
        if (!createdOTP) {
            return res.status(500).json({ message: "Error storing OTP in database" });
        }

        const msg = {
            to: email,
            from: process.env.EMAIL_USER,
            subject: "Your OTP for the-weather-forecasting",
            text: `Your OTP code is ${otp}. It will expire in 5 minutes.`,
        };
        await sgMail.send(msg);

        return res.status(200).json({ message: "Message sent successfully" });
    } catch (error) {
        console.error("Error sending OTP:", error);
        return res.status(500).json({ message: "Failed to send OTP" });
    }
};

exports.verifyOtp = async (req, res) => {
    try {
        const { email, otp } = req.body;

        if (!(email && otp)) {
            return res.status(400).json({ message: "Both email and OTP are required for verification" });
        }

        const otpDocument = await OTP.findOne({ email });
        if (!otpDocument) {
            return res.status(400).json({ message: "OTP not found for this email" });
        }
        if (otpDocument.expiresAt < Date.now()) {
            return res.status(400).json({ message: "OTP has expired" });
        }
        if (otpDocument.otp !== otp) {
            return res.status(400).json({ message: "Wrong OTP" });
        }

        await OTP.deleteMany({ email });
        return res.status(200).json({ message: "OTP matched successfully" });
    } catch (error) {
        console.error("Error verifying OTP:", error);
        return res.status(500).json({ message: "Failed to verify OTP" });
    }
};

exports.signup = async (req, res) => {
    try {
        const { name, email, password, role } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({ message: 'Invalid name, email, or password', success: false });
        }

        const user = await User.create({ name, email, password, role });
        user.password = undefined;

        cookieToken(user, res);
        return res.status(200).json({ user });
    } catch (error) {
        console.error("Error in signup:", error);
        return res.status(500).json({ message: "Signup failed" });
    }
};

exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: "Invalid email or password", success: false });
        }

        const user = await User.findOne({ email }).select('+password');
        if (!user) {
            return res.status(400).json({ message: "User doesn't exist", success: false });
        }

        const pass = await user.comparePassword(password);
        if (!pass) {
            return res.status(400).json({ message: "Incorrect password", success: false });
        }

        cookieToken(user, res);
        return res.status(200).json({ message: "Logged in successfully", success: true });
    } catch (error) {
        console.error("Error in login:", error);
        return res.status(500).json({ message: "Login failed" });
    }
};

exports.logout = async (req, res) => {
    try {
        res.clearCookie('token', null, {
            expires: new Date(Date.now()),
            httpOnly: true,
        });
        return res.status(200).json({ success: true, message: "Logged out successfully" });
    } catch (error) {
        console.error("Error in logout:", error);
        return res.status(500).json({ message: "Logout failed" });
    }
};

exports.getLoggedInUserDetail = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        return res.status(200).json({ success: true, user });
    } catch (error) {
        console.error("Error fetching user details:", error);
        return res.status(500).json({ message: "Failed to fetch user details" });
    }
};
