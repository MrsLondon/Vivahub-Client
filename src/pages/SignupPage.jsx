import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import Navbar from "../components/Navbar";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5001";

const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

const SignupPage = () => {
  const [step, setStep] = useState("role"); // 'role', 'form'
  const [role, setRole] = useState("");
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    firstName: "",
    lastName: "",
    // Business specific fields
    businessName: "",
    address: "",
    description: "",
    phone: "",
    openingHours: {
      monday: { open: "", close: "" },
      tuesday: { open: "", close: "" },
      wednesday: { open: "", close: "" },
      thursday: { open: "", close: "" },
      friday: { open: "", close: "" },
      saturday: { open: "", close: "" },
      sunday: { open: "", close: "" },
    },
  });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleRoleSelect = (selectedRole) => {
    setRole(selectedRole);
    setStep("form");
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name.startsWith("openingHours")) {
      const [_, day, time] = name.split("."); // Exemple: "openingHours.monday.open"
      setFormData((prevFormData) => ({
        ...prevFormData,
        openingHours: {
          ...prevFormData.openingHours,
          [day]: {
            ...prevFormData.openingHours[day],
            [time]: value,
          },
        },
      }));
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
  
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }
  
    try {
      // User data
      const signupData = {
        email: formData.email,
        password: formData.password,
        firstName: formData.firstName,
        lastName: formData.lastName,
        role: role,
      };
  
      // Including salon data if the user is a business
      if (role === "business") {
        // Structure the data to match exactly what your backend expects
        const salonData = {
          name: formData.businessName,
          location: formData.address,
          description: formData.description,
          phone: formData.phone,
          email: formData.email,
          openingHours: formData.openingHours,
          // Note: closedDays is not in your form but your backend accepts it
          // If you need it, you should add it to your form state
        };
  
        // First create the user
        const userResponse = await api.post("/api/auth/register", signupData);
        console.log("User created:", userResponse.data);
  
        // Then create the salon with the user's ID
        const salonResponse = await api.post("/api/salons", salonData, {
          headers: {
            Authorization: `Bearer ${userResponse.data.token}`, // Assuming your register endpoint returns a token
          },
        });
        console.log("Salon created:", salonResponse.data);
  
        // Redirect the user to the login page
        navigate("/login");
      } else {
        // For customers, just create the user
        const userResponse = await api.post("/api/auth/register", signupData);
        console.log("Signup successful:", userResponse.data);
        navigate("/login");
      }
    } catch (err) {
      console.error("Signup error:", err);
      setError(
        err.response?.data?.message || "An error occurred during signup"
      );
    }
  };

  if (step === "role") {
    return (
      <div className="font-sans bg-[#F8F8F8] min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-grow flex items-center justify-center">
          <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-lg shadow-md">
            <h2 className="text-center text-3xl font-extrabold text-[#4A4A4A]">
              Create your account
            </h2>
            <p className="text-center text-sm text-[#4A4A4A]/80">
              Choose your account type
            </p>
            <div className="mt-8 space-y-4">
              <button
                onClick={() => handleRoleSelect("customer")}
                className="w-full py-3 px-4 bg-[#A2B9C6] text-white rounded-lg hover:bg-[#8fa9b8] transition duration-300"
              >
                I'm a Customer
              </button>
              <button
                onClick={() => handleRoleSelect("business")}
                className="w-full py-3 px-4 bg-[#FADADD] text-[#4A4A4A] rounded-lg hover:bg-[#f0c8cc] transition duration-300"
              >
                I'm a Business
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="font-sans bg-[#F8F8F8] min-h-screen flex flex-col">
      <Navbar />
      <div className="flex-grow flex items-center justify-center p-4">
        <div className="w-full max-w-4xl"> {/* Increased max width for large screens */}
          <div className="bg-white rounded-lg shadow-md overflow-hidden"> {/* Added overflow-hidden */}
            {/* Two-column layout for large screens */}
            <div className="md:flex">
              {/* Left side - decorative image/branding (only on large screens) */}
              <div className="hidden md:block md:w-1/3 bg-[#E0E0E0] p-8 flex items-center justify-center">
                <div className="text-center">
                  <h2 className="text-2xl font-bold text-[#4A4A4A] mb-4">
                    {role === "business" ? "Grow Your Business" : "Find Your Perfect Style"}
                  </h2>
                  <p className="text-[#4A4A4A]">
                    {role === "business" 
                      ? "Join our platform and connect with thousands of potential customers"
                      : "Discover the best salons and book appointments with ease"}
                  </p>
                </div>
              </div>
              
              {/* Right side - form content */}
              <div className="w-full md:w-2/3 p-6 md:p-8">
                <h2 className="text-center text-3xl font-extrabold text-[#4A4A4A]">
                  Create your {role} account
                </h2>
                
                {error && (
                  <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mt-4" role="alert">
                    <span className="block sm:inline">{error}</span>
                  </div>
                )}
                
                <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                  <div className="space-y-4">
                    {/* Name fields in row on large screens */}
                    <div className="flex flex-col md:flex-row gap-4">
                      <input
                        name="firstName"
                        type="text"
                        required
                        className="w-full px-3 py-2 border border-[#E0E0E0] rounded-lg text-[#4A4A4A] focus:outline-none focus:ring-2 focus:ring-[#A2B9C6]"
                        placeholder="First Name"
                        value={formData.firstName}
                        onChange={handleChange}
                      />
                      <input
                        name="lastName"
                        type="text"
                        required
                        className="w-full px-3 py-2 border border-[#E0E0E0] rounded-lg text-[#4A4A4A] focus:outline-none focus:ring-2 focus:ring-[#A2B9C6]"
                        placeholder="Last Name"
                        value={formData.lastName}
                        onChange={handleChange}
                      />
                    </div>
                    
                    <input
                      name="email"
                      type="email"
                      required
                      className="w-full px-3 py-2 border border-[#E0E0E0] rounded-lg text-[#4A4A4A] focus:outline-none focus:ring-2 focus:ring-[#A2B9C6]"
                      placeholder="Email address"
                      value={formData.email}
                      onChange={handleChange}
                    />
                    
                    {role === "business" && (
                      <>
                        <input
                          name="businessName"
                          type="text"
                          required
                          className="w-full px-3 py-2 border border-[#E0E0E0] rounded-lg text-[#4A4A4A] focus:outline-none focus:ring-2 focus:ring-[#A2B9C6]"
                          placeholder="Business Name"
                          value={formData.businessName}
                          onChange={handleChange}
                        />
                        
                        <input
                          name="address"
                          type="text"
                          required
                          className="w-full px-3 py-2 border border-[#E0E0E0] rounded-lg text-[#4A4A4A] focus:outline-none focus:ring-2 focus:ring-[#A2B9C6]"
                          placeholder="Business Address"
                          value={formData.address}
                          onChange={handleChange}
                        />
                        
                        <textarea
                          name="description"
                          className="w-full px-3 py-2 border border-[#E0E0E0] rounded-lg text-[#4A4A4A] focus:outline-none focus:ring-2 focus:ring-[#A2B9C6]"
                          placeholder="Business Description"
                          value={formData.description}
                          onChange={handleChange}
                          rows={3}
                        />
                        
                        <input
                          name="phone"
                          type="text"
                          className="w-full px-3 py-2 border border-[#E0E0E0] rounded-lg text-[#4A4A4A] focus:outline-none focus:ring-2 focus:ring-[#A2B9C6]"
                          placeholder="Phone Number"
                          value={formData.phone}
                          onChange={handleChange}
                        />
                        
                        {/* Opening Hours - now in a scrollable panel */}
                        <div className="border border-[#E0E0E0] rounded-lg p-4">
                          <h3 className="text-lg font-semibold text-[#4A4A4A] mb-3">
                            Opening Hours
                          </h3>
                          
                          <div className="flex items-center mb-4">
                            <input
                              type="checkbox"
                              id="sameHoursAllDays"
                              className="mr-2"
                              onChange={(e) => {
                                if (e.target.checked) {
                                  const hours = formData.openingHours.monday;
                                  setFormData(prev => ({
                                    ...prev,
                                    openingHours: {
                                      monday: hours,
                                      tuesday: hours,
                                      wednesday: hours,
                                      thursday: hours,
                                      friday: hours,
                                      saturday: hours,
                                      sunday: hours
                                    }
                                  }));
                                }
                              }}
                            />
                            <label htmlFor="sameHoursAllDays">Same hours for all days</label>
                          </div>
                          
                          <div className="max-h-60 overflow-y-auto pr-2 space-y-3">
                            {Object.keys(formData.openingHours).map((day) => (
                              <div key={day} className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
                                <label className="w-24 capitalize font-medium">{day}:</label>
                                <div className="flex-1 grid grid-cols-2 gap-2">
                                  {/* Open time dropdown */}
                                  <div className="relative">
                                  <select
                                    name={`openingHours.${day}.open`}
                                    value={formData.openingHours[day].open}
                                    onChange={handleChange}
                                    className="w-full px-3 py-2 border border-[#E0E0E0] rounded-lg text-[#4A4A4A] focus:outline-none focus:ring-2 focus:ring-[#A2B9C6] appearance-none"
                                  >
                                    <option value="">Closed</option>
                                    {Array.from({ length: 49 }, (_, i) => {
                                      // 00:00 to 24:00 in 30-minute increments
                                      const hours = Math.floor(i / 2);
                                      const minutes = i % 2 === 0 ? '00' : '30';
                                      const timeValue = `${String(hours).padStart(2, '0')}:${minutes}`;
                                      
                                      // Display in 24-hour format (e.g., "09:00", "17:30")
                                      return (
                                        <option key={`open-${day}-${i}`} value={timeValue}>
                                          {timeValue}
                                        </option>
                                      );
                                    })}
                                  </select>
                                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                                      <svg className="h-5 w-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                                      </svg>
                                    </div>
                                  </div>
                                  
                                  {/* Close time dropdown */}
                                  <div className="relative">
                                  <select
                                    name={`openingHours.${day}.close`}
                                    value={formData.openingHours[day].close}
                                    onChange={handleChange}
                                    className="w-full px-3 py-2 border border-[#E0E0E0] rounded-lg text-[#4A4A4A] focus:outline-none focus:ring-2 focus:ring-[#A2B9C6] appearance-none"
                                    disabled={!formData.openingHours[day].open}
                                  >
                                    <option value="">Closed</option>
                                    {formData.openingHours[day].open && 
                                      Array.from({ length: 49 }, (_, i) => {
                                        const hours = Math.floor(i / 2);
                                        const minutes = i % 2 === 0 ? '00' : '30';
                                        const timeValue = `${String(hours).padStart(2, '0')}:${minutes}`;
                                        
                                        return (
                                          <option key={`close-${day}-${i}`} value={timeValue}>
                                            {timeValue}
                                          </option>
                                        );
                                      })
                                    }
                                  </select>
                                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                                      <svg className="h-5 w-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                                      </svg>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </>
                    )}
                    
                    <input
                      name="password"
                      type="password"
                      required
                      className="w-full px-3 py-2 border border-[#E0E0E0] rounded-lg text-[#4A4A4A] focus:outline-none focus:ring-2 focus:ring-[#A2B9C6]"
                      placeholder="Password"
                      value={formData.password}
                      onChange={handleChange}
                    />
                    
                    <input
                      name="confirmPassword"
                      type="password"
                      required
                      className="w-full px-3 py-2 border border-[#E0E0E0] rounded-lg text-[#4A4A4A] focus:outline-none focus:ring-2 focus:ring-[#A2B9C6]"
                      placeholder="Confirm Password"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                    />
                  </div>
                  
                  <button
                    type="submit"
                    className="w-full py-3 bg-[#A2B9C6] text-white rounded-lg hover:bg-[#8fa9b8] transition duration-300"
                  >
                    Sign up
                  </button>
                </form>
                
                <div className="text-center mt-4">
                  <Link
                    to="/login"
                    className="text-sm text-[#A2B9C6] hover:text-[#8fa9b8] transition duration-300"
                  >
                    Already have an account? Sign in
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  ); 

};

export default SignupPage;

