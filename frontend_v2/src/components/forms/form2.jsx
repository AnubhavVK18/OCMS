import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const Form2 = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [otp, setOtp] = useState("");
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [isOtpVerified, setIsOtpVerified] = useState(false);
  const navigate = useNavigate();

  // Function to send OTP
  const handleSendOtp = async () => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_BACKEND_URL}/api/v1/send-otp`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email }),
        }
      );
      const data = await response.json();
      if (response.status === 200) {
        setIsOtpSent(true);
        alert("OTP sent to your email.");
      } else {
        alert("Failed to send OTP. Please try again.");
      }
    } catch (error) {
      console.error("Error sending OTP:", error);
    }
  };

  // Function to verify OTP
  const handleVerifyOtp = async () => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_BACKEND_URL}/api/v1/verifyOtp`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email, otp }),
        }
      );
      const data = await response.json();
      if (response.status === 200) {
        setIsOtpVerified(true);
        alert("OTP verified successfully.");
      } else {
        alert("Invalid OTP. Please try again.");
      }
    } catch (error) {
      console.error("Error verifying OTP:", error);
    }
  };

  // Function to handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(
        `${process.env.REACT_APP_BACKEND_URL}/api/v1/signup`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ name, email, password }),
        }
      );
      const data = await response.json();
      if (data.success) {
        alert("Registration Successful");
        navigate("/");
      } else {
        alert(
          "Password must be at least 5 characters and check the email address"
        );
        navigate("/signup");
      }
    } catch (error) {
      console.error("Error signing up:", error);
    }
  };

  return (
    <>
      <div className="bg-no-repeat bg-cover bg-center relative h-screen bg-sky-600">
        <div className="min-h-screen sm:flex sm:flex-row mx-0 justify-center">
          <div className="flex-col flex self-center p-12 sm:max-w-5xl xl:max-w-2xl z-10">
            <div className="self-start hidden lg:flex flex-col text-white">
              <h1 className="mb-3 font-bold text-5xl">
                No Account!
                <br /> Create an Account
              </h1>
              <p className="pr-3">
                Lorem ipsum is placeholder text commonly used in the graphic,
                print, and publishing industries for previewing layouts and
                visual mockups
              </p>
            </div>
          </div>
          <div className="flex justify-center self-center z-10 shadow-md">
            <div className="p-10 bg-white rounded mx-auto w-100">
              <div className="mb-5">
                <h3 className="font-semibold text-2xl text-zinc-700">
                  Sign Up
                </h3>
                <p className="text-stone-400">Please set up your account</p>
              </div>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <label className="text-md font-medium leading-6 text-zinc-600 tracking-wide">
                    Email
                  </label>
                  <input
                    className="w-full text-base px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-lime-500 focus:border-2"
                    id="email"
                    type="email"
                    autoComplete="email"
                    name="email"
                    placeholder="john@gmail.com"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                  {!isOtpSent && (
                    <button
                      type="button"
                      className="mt-2 text-blue-600 hover:underline"
                      onClick={handleSendOtp}
                    >
                      Send OTP
                    </button>
                  )}
                </div>

                {isOtpSent && !isOtpVerified && (
                  <div className="space-y-2">
                    <label className="text-md font-medium leading-6 text-zinc-600 tracking-wide">
                      OTP
                    </label>
                    <input
                      className="w-full text-base px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-lime-500 focus:border-2"
                      id="otp"
                      type="text"
                      name="otp"
                      placeholder="Enter OTP"
                      value={otp}
                      onChange={(e) => setOtp(e.target.value)}
                    />
                    <button
                      type="button"
                      className="mt-2 text-blue-600 hover:underline"
                      onClick={handleVerifyOtp}
                    >
                      Verify OTP
                    </button>
                  </div>
                )}

                <div className="space-y-2">
                  <label className="text-md font-medium leading-6 text-zinc-600 tracking-wide">
                    Full Name
                  </label>
                  <input
                    className="w-full text-base px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-lime-500 focus:border-2"
                    id="name"
                    type="text"
                    name="text"
                    placeholder="John Champion"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    disabled={!isOtpVerified}
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-md font-medium leading-6 text-zinc-600 tracking-wide">
                    Password
                  </label>
                  <input
                    className="w-full text-base px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-lime-500 focus:border-2"
                    id="password"
                    type="password"
                    autoComplete="password"
                    name="password"
                    placeholder="Enter your password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    disabled={!isOtpVerified}
                  />
                </div>

                <div className="flex flex-row">
                  <label className="ml-2 text-sm text-slate-700 tracking-wide">
                    Already have an account
                    <Link to="/">
                      <span className="inline">
                        <a
                          href="#"
                          className="text-sm text-slate-700 tracking-wide no-underline hover:text-blue-700"
                        >
                          {" "}
                          Sign in
                        </a>
                      </span>
                    </Link>
                  </label>
                </div>
                <div>
                  <button
                    type="submit"
                    className="w-full flex justify-center rounded-full bg-cyan-300 hover:bg-cyan-400 hover:text-white p-3 text-stone-600 font-semibold tracking-wide shadow-lg transistion ease-in-out duration-300"
                    disabled={!isOtpVerified}
                  >
                    Create account
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Form2;
