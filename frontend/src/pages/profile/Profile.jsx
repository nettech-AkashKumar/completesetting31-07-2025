import React, { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import UserProfile from "../../components/componentsetting28-07-2025/profile/Profile.jsx"

const UserProfiles = ({ userId }) => {
  const [profile, setProfile] = useState(null);
  const [formData, setFormData] = useState({
    fullName: "",
    contactNumber: "",
    address: "",
    dateOfBirth: "",
    profilePicture: "",
    bio: "",
  });

  const token = localStorage.getItem("token");

  const fetchProfile = async () => {
    try {
      const response = await axios.get(`/api/profile/${userId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setProfile(response.data);
      setFormData(response.data); // populate form with existing data
    } catch (err) {
      if (err.response?.status === 404) {
        toast("No profile found. You can create one.");
      } else {
        toast.error("Error fetching profile");
      }
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (profile) {
        // Update
        await axios.put(`/api/profile/${userId}`, formData, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        toast.success("Profile updated");
      } else {
        // Create
        await axios.post("/api/profile", { userId, ...formData }, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        toast.success("Profile created");
      }
      fetchProfile(); // refresh
    } catch (err) {
      toast.error("Error saving profile");
    }
  };

  useEffect(() => {
    if (userId) fetchProfile();
  }, [userId]);

  return (
    // <div className="max-w-xl mx-auto p-4 shadow-lg bg-white rounded-md">
    //   <h2 className="text-2xl font-bold mb-4">{profile ? "Edit" : "Create"} Profile</h2>
    //   <form onSubmit={handleSubmit} className="space-y-4">
    //     <input
    //       type="text"
    //       name="fullName"
    //       value={formData.fullName}
    //       onChange={handleChange}
    //       placeholder="Full Name"
    //       className="w-full p-2 border rounded"
    //     />
    //     <input
    //       type="text"
    //       name="contactNumber"
    //       value={formData.contactNumber}
    //       onChange={handleChange}
    //       placeholder="Contact Number"
    //       className="w-full p-2 border rounded"
    //     />
    //     <input
    //       type="text"
    //       name="address"
    //       value={formData.address}
    //       onChange={handleChange}
    //       placeholder="Address"
    //       className="w-full p-2 border rounded"
    //     />
    //     <input
    //       type="date"
    //       name="dateOfBirth"
    //       value={formData.dateOfBirth?.split("T")[0] || ""}
    //       onChange={handleChange}
    //       className="w-full p-2 border rounded"
    //     />
    //     <input
    //       type="text"
    //       name="profilePicture"
    //       value={formData.profilePicture}
    //       onChange={handleChange}
    //       placeholder="Profile Picture URL"
    //       className="w-full p-2 border rounded"
    //     />
    //     <textarea
    //       name="bio"
    //       value={formData.bio}
    //       onChange={handleChange}
    //       placeholder="Bio"
    //       className="w-full p-2 border rounded"
    //     />
    //     <button
    //       type="submit"
    //       className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
    //     >
    //       {profile ? "Update" : "Create"} Profile
    //     </button>
    //   </form>
    // </div>
    <div>
      <UserProfile/>
    </div>
  );
};

export default UserProfiles;
