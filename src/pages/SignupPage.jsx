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

    // Verify if the password and confirm password match
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
        signupData.businessDetails = {
          businessName: formData.businessName,
          address: formData.address,
          description: formData.description,
          phone: formData.phone,
          email: formData.email, // the same email as the user
          openingHours: formData.openingHours,
        };
      }

      console.log("Signup data being sent:", signupData);

      // Send data to the backend
      const userResponse = await api.post("/api/auth/register", signupData);
      console.log("Signup successful:", userResponse.data);

      // Redirect the user to the login page
      navigate("/login");
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
   
      <div className="flex-grow flex items-center justify-center">
        <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-lg shadow-md">
          <h2 className="text-center text-3xl font-extrabold text-[#4A4A4A]">
            Create your {role} account
          </h2>
          {error && (
            <div
              className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative"
              role="alert"
            >
              <span className="block sm:inline">{error}</span>
            </div>
          )}
          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            <div className="space-y-4">
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
                  />
                  <input
                    name="phone"
                    type="text"
                    className="w-full px-3 py-2 border border-[#E0E0E0] rounded-lg text-[#4A4A4A] focus:outline-none focus:ring-2 focus:ring-[#A2B9C6]"
                    placeholder="Phone Number"
                    value={formData.phone}
                    onChange={handleChange}
                  />

                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-[#4A4A4A]">
                      Opening Hours
                    </h3>
                    {Object.keys(formData.openingHours).map((day) => (
                      <div key={day} className="flex items-center space-x-4">
                        <label className="w-1/4 capitalize">{day}:</label>
                        <input
                          name={`openingHours.${day}.open`}
                          type="time"
                          className="w-1/3 px-3 py-2 border border-[#E0E0E0] rounded-lg text-[#4A4A4A] focus:outline-none focus:ring-2 focus:ring-[#A2B9C6]"
                          placeholder="Open"
                          value={formData.openingHours[day].open}
                          onChange={handleChange}
                        />
                        <input
                          name={`openingHours.${day}.close`}
                          type="time"
                          className="w-1/3 px-3 py-2 border border-[#E0E0E0] rounded-lg text-[#4A4A4A] focus:outline-none focus:ring-2 focus:ring-[#A2B9C6]"
                          placeholder="Close"
                          value={formData.openingHours[day].close}
                          onChange={handleChange}
                        />
                      </div>
                    ))}
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
          <div className="text-center">
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
  );
};

export default SignupPage;

