import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import Header from "../components/Header";
import { useTheme } from "../context/ThemeContext";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5001";

const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

const SignupPage = () => {
  const { theme, toggleTheme } = useTheme();
  const [step, setStep] = useState("role");
  const [role, setRole] = useState("");
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    firstName: "",
    lastName: "",
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
      const [_, day, time] = name.split(".");
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
      const signupData = {
        email: formData.email,
        password: formData.password,
        firstName: formData.firstName,
        lastName: formData.lastName,
        role: role,
      };
  
      if (role === "business") {
        const salonData = {
          name: formData.businessName,
          location: formData.address,
          description: formData.description,
          phone: formData.phone,
          email: formData.email,
          openingHours: formData.openingHours,
        };
  
        const userResponse = await api.post("/api/auth/register", signupData);
        const salonResponse = await api.post("/api/salons", salonData, {
          headers: {
            Authorization: `Bearer ${userResponse.data.token}`,
          },
        });
        navigate("/login");
      } else {
        const userResponse = await api.post("/api/auth/register", signupData);
        navigate("/login");
      }
    } catch (err) {
      console.error("Signup error:", err);
      setError(
        err.response?.data?.message || "An error occurred during signup"
      );
    }
  };

  return (

    <div className={`min-h-screen font-body transition-colors duration-300 ${
      theme === "light" ? "bg-white text-[#4A4A4A]" : "bg-gray-900 text-gray-200"
    }`}>
      {/* Header */}
      <Header theme={theme} toggleTheme={toggleTheme} />

      <div className="max-w-4xl mx-auto px-4 py-16">
        {step === "role" ? (
          <div className="flex-grow flex items-center justify-center">
            <div className={`max-w-md w-full space-y-8 p-8 rounded-xl shadow-sm ${
              theme === "light" ? "bg-white" : "bg-gray-800"
            }`}>
              <div className="text-center">
                <h2 className="text-3xl font-heading font-semibold mb-2">
                  Create your account
                </h2>
                <div className="w-24 h-1 bg-[#A2B9C6] mx-auto mb-8"></div>
                <p className="text-sm">
                  Choose your account type
                </p>
              </div>
              
              <div className="mt-8 space-y-4">
                <button
                  onClick={() => handleRoleSelect("customer")}
                  className={`w-full py-3 px-4 rounded-lg transition-colors ${
                    theme === "light"
                      ? "bg-[#A2B9C6] text-white hover:bg-[#8fa9b8]"
                      : "bg-[#FADADD] text-[#4A4A4A] hover:bg-[#f0c8cc]"
                  }`}
                >
                  I'm a Customer
                </button>
                <button
                  onClick={() => handleRoleSelect("business")}
                  className={`w-full py-3 px-4 rounded-lg transition-colors ${
                    theme === "light"
                      ? "bg-[#FADADD] text-[#4A4A4A] hover:bg-[#f0c8cc]"
                      : "bg-[#A2B9C6] text-white hover:bg-[#8fa9b8]"
                  }`}
                >
                  I'm a Business
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className={`rounded-xl p-8 shadow-sm ${
            theme === "light" ? "bg-white" : "bg-gray-800"
          }`}>
            <h2 className="text-3xl font-heading font-semibold mb-2 text-center">
              Create your {role} account
            </h2>
            <div className="w-24 h-1 bg-[#A2B9C6] mx-auto mb-8"></div>
            
            {error && (
              <div className={`mb-4 p-3 rounded-lg ${
                theme === "light" 
                  ? "bg-red-100 text-red-700" 
                  : "bg-red-900 text-red-100"
              }`}>
                {error}
              </div>
            )}
                

                <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                  <div className="space-y-4">
                    <div className="flex flex-col md:flex-row gap-4">
                      <input
                        name="firstName"
                        type="text"
                        required
                        className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
                          theme === "light"
                            ? "border-gray-300 focus:ring-[#A2B9C6] focus:border-[#A2B9C6] text-[#4A4A4A]"
                            : "border-gray-600 focus:ring-[#FADADD] focus:border-[#FADADD] bg-gray-700 text-gray-200"
                        }`}
                        placeholder="First Name"
                        value={formData.firstName}
                        onChange={handleChange}
                      />
                      <input
                        name="lastName"
                        type="text"
                        required
                        className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
                          theme === "light"
                            ? "border-gray-300 focus:ring-[#A2B9C6] focus:border-[#A2B9C6] text-[#4A4A4A]"
                            : "border-gray-600 focus:ring-[#FADADD] focus:border-[#FADADD] bg-gray-700 text-gray-200"
                        }`}
                        placeholder="Last Name"
                        value={formData.lastName}
                        onChange={handleChange}
                      />
                    </div>

                    <input
                      name="email"
                      type="email"
                      required
                      className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
                        theme === "light"
                          ? "border-gray-300 focus:ring-[#A2B9C6] focus:border-[#A2B9C6] text-[#4A4A4A]"
                          : "border-gray-600 focus:ring-[#FADADD] focus:border-[#FADADD] bg-gray-700 text-gray-200"
                      }`}
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
                          className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
                            theme === "light"
                              ? "border-gray-300 focus:ring-[#A2B9C6] focus:border-[#A2B9C6] text-[#4A4A4A]"
                              : "border-gray-600 focus:ring-[#FADADD] focus:border-[#FADADD] bg-gray-700 text-gray-200"
                          }`}
                          placeholder="Business Name"
                          value={formData.businessName}
                          onChange={handleChange}
                        />

                        <input
                          name="address"
                          type="text"
                          required
                          className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
                            theme === "light"
                              ? "border-gray-300 focus:ring-[#A2B9C6] focus:border-[#A2B9C6] text-[#4A4A4A]"
                              : "border-gray-600 focus:ring-[#FADADD] focus:border-[#FADADD] bg-gray-700 text-gray-200"
                          }`}
                          placeholder="Business Address"
                          value={formData.address}
                          onChange={handleChange}
                        />

                        <textarea
                          name="description"
                          className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
                            theme === "light"
                              ? "border-gray-300 focus:ring-[#A2B9C6] focus:border-[#A2B9C6] text-[#4A4A4A]"
                              : "border-gray-600 focus:ring-[#FADADD] focus:border-[#FADADD] bg-gray-700 text-gray-200"
                          }`}
                          placeholder="Business Description"
                          value={formData.description}
                          onChange={handleChange}
                          rows={3}
                        />

                        <input
                          name="phone"
                          type="text"
                          className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
                            theme === "light"
                              ? "border-gray-300 focus:ring-[#A2B9C6] focus:border-[#A2B9C6] text-[#4A4A4A]"
                              : "border-gray-600 focus:ring-[#FADADD] focus:border-[#FADADD] bg-gray-700 text-gray-200"
                          }`}
                          placeholder="Phone Number"
                          value={formData.phone}
                          onChange={handleChange}
                        />

                        
                        <div className={`border rounded-lg p-4 ${
                          theme === "light" 
                            ? "border-gray-300 bg-[#F8F8F8]" 
                            : "border-gray-600 bg-gray-700"
                        }`}>
                          <h3 className={`text-lg font-semibold mb-3 ${
                            theme === "light" ? "text-[#4A4A4A]" : "text-gray-200"
                          }`}>

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
                                  setFormData((prev) => ({
                                    ...prev,
                                    openingHours: {
                                      monday: hours,
                                      tuesday: hours,
                                      wednesday: hours,
                                      thursday: hours,
                                      friday: hours,
                                      saturday: hours,
                                      sunday: hours,
                                    },
                                  }));
                                }
                              }}
                            />

                            <label htmlFor="sameHoursAllDays" className={
                              theme === "light" ? "text-[#4A4A4A]" : "text-gray-300"
                            }>

                              Same hours for all days
                            </label>
                          </div>

                          <div className="max-h-60 overflow-y-auto pr-2 space-y-3">
                            {Object.keys(formData.openingHours).map((day) => (

                              <div key={day} className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
                                <label className={`w-24 capitalize font-medium ${
                                  theme === "light" ? "text-[#4A4A4A]" : "text-gray-300"
                                }`}>
                                  {day}:
                                </label>
                                <div className="flex-1 grid grid-cols-2 gap-2">
                                  <select
                                    name={`openingHours.${day}.open`}
                                    value={formData.openingHours[day].open}
                                    onChange={handleChange}
                                    className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
                                      theme === "light"
                                        ? "border-gray-300 focus:ring-[#A2B9C6] focus:border-[#A2B9C6] text-[#4A4A4A]"
                                        : "border-gray-600 focus:ring-[#FADADD] focus:border-[#FADADD] bg-gray-700 text-gray-200"
                                    }`}
                                  >
                                    <option value="">Closed</option>
                                    {Array.from({ length: 49 }, (_, i) => {
                                      const hours = Math.floor(i / 2);
                                      const minutes = i % 2 === 0 ? '00' : '30';
                                      const timeValue = `${String(hours).padStart(2, '0')}:${minutes}`;
                                      return (
                                        <option key={`open-${day}-${i}`} value={timeValue}>
                                          {timeValue}
                                        </option>
                                      );
                                    })}
                                  </select>
                                  
                                  <select
                                    name={`openingHours.${day}.close`}
                                    value={formData.openingHours[day].close}
                                    onChange={handleChange}
                                    className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
                                      theme === "light"
                                        ? "border-gray-300 focus:ring-[#A2B9C6] focus:border-[#A2B9C6] text-[#4A4A4A]"
                                        : "border-gray-600 focus:ring-[#FADADD] focus:border-[#FADADD] bg-gray-700 text-gray-200"
                                    }`}
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
                      className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
                        theme === "light"
                          ? "border-gray-300 focus:ring-[#A2B9C6] focus:border-[#A2B9C6] text-[#4A4A4A]"
                          : "border-gray-600 focus:ring-[#FADADD] focus:border-[#FADADD] bg-gray-700 text-gray-200"
                      }`}
                      placeholder="Password"
                      value={formData.password}
                      onChange={handleChange}
                    />

                    <input
                      name="confirmPassword"
                      type="password"
                      required
                      className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
                        theme === "light"
                          ? "border-gray-300 focus:ring-[#A2B9C6] focus:border-[#A2B9C6] text-[#4A4A4A]"
                          : "border-gray-600 focus:ring-[#FADADD] focus:border-[#FADADD] bg-gray-700 text-gray-200"
                      }`}
                      placeholder="Confirm Password"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                    />
                  </div>

                  <button
                    type="submit"
                    className={`w-full py-3 rounded-lg transition duration-300 ${
                      theme === "light"
                        ? "bg-[#A2B9C6] text-white hover:bg-[#8fa9b8]"
                        : "bg-[#FADADD] text-[#4A4A4A] hover:bg-[#f0c8cc]"
                    }`}
                  >
                    Sign up
                  </button>

                  </form>

          </div>
        )}
      </div>
    </div>
  );
};

export default SignupPage;
