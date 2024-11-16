const User = require('../models/user');
const OTP=require("../models/otp")
const cookieToken = require('../utilities/cookieToken');
const sgMail=require("@sendgrid/mail")
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const generateOtp = () =>
  Math.floor(100000 + Math.random() * 900000).toString();

  exports.sendOtp = async (req, res) => {
    try {
      const { email } = req.body;
  
      if (!email) {
        throw new Error("Email is required");
      }
  
      const otp = generateOtp();
      const expiresAt = Date.now() + 5 * 60 * 1000;
  
      await OTP.deleteMany({ email });
      const createdOTP = await OTP.create({
        email,
        otp,
        expiresAt,
      });
      if (!createdOTP) {
        throw new Error("Error while storing otp inside mongodb");
      } else {
        console.log("otp stored successfully");
      }
  
      const msg = {
        to: email,
        from: process.env.EMAIL_USER,
        subject: "Your OTP for the-weather-forecasting",
        text: `Your OTP code is ${otp}. It will expire in 5 minutes.`,
        // html: '<strong>and easy to do anywhere, even with Node.js</strong>',
      };
      sgMail
        .send(msg)
        .then(() => {
          console.log(`Email sent from ${process.env.EMAIL_USER} to ${email}`);
        })
        .catch((error) => {
          console.error(error);
        });
      return res.status(200).json({ message: "Message sent successfully" });
    } catch (error) {
      console.error("Error sending OTP:", error);
      res.status(500).json({ message: "Failed to send OTP" });
    }
  };
  
  exports.verifyOtp = async (req, res) => {
    const { email, otp } = req.body;
    console.log(`${email}+${otp}`)
    if (!(email && otp)) {
      return res
        .status(400)
        .json({ message: "Both email and OTP are required for verification" });
    }
    const otpDocument = await OTP.findOne({ email });
    if (!otpDocument) {
      return res.status(400).json({ message: "OTP not found for this email" });
    }
    if (otpDocument.expiresAt < Date.now()) {
      return res.status(400).json({ message: "OTP has expired" });
    }
  
    // Compare OTP
    if (otpDocument.otp !== otp) {
      return res.status(400).json({ message: "Wrong OTP" });
    }
  
    await OTP.deleteMany({ email });
    return res.status(200).json({ message: "otp matched successfully" });
  };


exports.signup = (async (req, res) => {
    try {

        const { name, email, password, role } = req.body;

        //check input parameters
        if (!name || !email || !password) {
            return res.status(400).json({
                message: 'Invalid name or email or password',
                success: false
            })
        }
        const user = await User.create({     
            name,   
            email,
            password,
            role
        })
        user.password = undefined
        
        cookieToken(user, res);
        return res.status(200).json({
            user
        })
    }
    catch (error) {
        console.log(error)
    }
});

exports.login = (async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                message: "Invalid",
                success: false
            })
        }

        const user = await User.findOne({ email }).select('+password');
        // return res.status(200).json({
        //     user
        // })
        if (!user) {
            return res.status(400).json({
                msg: "User Does'nt Exists",
                success: false
            })
        }

        const pass = await user.comparePassword(password);
        // return res.status(200).json({pass})
        if (!pass) {
            return res.status(400).json({
                msg: "Password Does'nt Match",
                success: false
            })
        }

        cookieToken(user, res);
        // return res.status(200).json({
        //     msg:"Logged In Successfully",
        //     success:true
        // })
    }
    catch (error) {
        console.log(error);
    }
})

exports.logout = (async (req, res) => {
    try {
        res.clearCookie('token', null, {
            expires: new Date(Date.now()),
            httpOnly: true
        }).status(200).json({
            success: true,
            message: "Logged Out Successfully"
        })
    } catch (error) {
        console.log(error)
    }
})

exports.getLoggedInUserDetail = (async (req, res) => {
    try {
        const user = await User.findById(req.user.id)
        return res.status(200).json({
            success: true,
            user
        })
    }
    catch (error) {
        console.log(error)
    }
})