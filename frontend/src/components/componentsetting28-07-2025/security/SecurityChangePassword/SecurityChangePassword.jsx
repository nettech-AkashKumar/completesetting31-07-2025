import React, { useState } from 'react'
import '../SecurityChangePassword/SecurityChangePassword.css'
import { FiEye, FiEyeOff } from 'react-icons/fi'
import axios from 'axios'
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import BASE_URL from '../../../../pages/config/config';

const SecurityChangePassword = ({ isOpen, onClose }) => {
    const [showCurrent, setShowCurrent] = useState(false)
    const [showNew, setShowNew] = useState(false)
    const [showConfirm, setShowConfirm] = useState(false)

    const toggleCurrent = () => setShowCurrent(!showCurrent)
    const toggleNew = () => setShowNew(!showNew)
    const toggleConfirm = () => setShowConfirm(!showConfirm)

    const initialDetails = {
        currentpassword: "",
        newpassword: "",
        confirmpassword: ""
    };
    const [formData, setFormData] = useState(initialDetails)

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }))
    }
    const handleSubmit = async (e) => {
        e.preventDefault();
          const userData = JSON.parse(localStorage.getItem("user"))
          const userId = userData.id
        console.log("userId from account details", userId)

        // validation check for password confirmation
        if (formData.newpassword !== formData.confirmpassword) {
            toast.error("New password and confirm password do not match", {
                position: "top-center",
                autoClose: 5000,
                pauseOnHover: true,
                hideProgressBar: false,
            });
            return;
        }
        try {
            const response = await axios.put(`${BASE_URL}/api/user/update/${userId}`,
                {
                    currentpassword: formData.currentpassword,
                    newpassword: formData.newpassword,
                    confirmpassword: formData.confirmpassword,
                }
            );
            toast.success("Account updated successfully", {
                position: "top-center",
                autoClose: 5000,
                draggable: true,
                closeOnClick: true,
                hideProgressBar: false,
                pauseOnHover: true,
            });
            setFormData((prev) => ({
                ...prev,
                currentpassword: "",
                newpassword: "",
                confirmpassword: "",
            }))
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed Error while updating account",
                {
                    position: "top-center",
                    autoClose: 5000,
                    draggable: true,
                    closeOnClick: true,
                    hideProgressBar: false,
                    pauseOnHover: true,
                })
        }
    }

    if (!isOpen) return null;
    return (
        <div className="securitychangepassword-overlay">
            <div className="securitychangepassword-modal">
                <div className="securitychangepassword-header">
                    <h2>Password</h2>
                    <button className='securitychangepassword-close' onClick={onClose}>x</button>
                </div>
                <form action="" onSubmit={handleSubmit}>
                    <div className="securitychangepassword-body">
                        <label className='securitychnagelabel'>
                            Current Password <span className="required">*</span>
                            <div className="input-wrapper">
                                <input
                                    style={{ outline: "none", width: "100%" }}
                                    type={showCurrent ? "text" : "password"}
                                    name="currentpassword"
                                    id="currentpassword"
                                    value={formData.currentpassword}
                                    onChange={handleInputChange}
                                    required
                                    placeholder="Current passowrd"
                                />
                                <span className='changepasswrdspan' onClick={toggleCurrent}>
                                    {showCurrent ? <FiEye /> : <FiEyeOff />}
                                </span>
                            </div>
                        </label>
                        <label className='securitychnagelabel'>
                            New Password <span className="required">*</span>
                            <div className="input-wrapper">
                                <input
                                    style={{ outline: "none", width: "100%" }}
                                    type={showNew ? "text" : "password"}
                                    name="newpassword"
                                    id="newpassword"
                                    value={formData.newpassword}
                                    onChange={handleInputChange}
                                    required
                                    placeholder="New password"
                                />
                                <span className='changepasswrdspan' onClick={toggleNew}>
                                    {showNew ? <FiEye /> : <FiEyeOff />}
                                </span>
                            </div>
                        </label>

                        <label className='securitychnagelabel'>
                            Confirm Password <span className="required">*</span>
                            <div className="input-wrapper">
                                <input
                                    style={{ outline: "none", width: "100%" }}
                                    type={showConfirm ? "text" : "password"}
                                    name="confirmpassword"
                                    id="confirmpassword"
                                    value={formData.confirmpassword}
                                    onChange={handleInputChange}
                                    required
                                    placeholder="Confirm password"
                                />
                                <span className='changepasswrdspan' onClick={toggleConfirm}>
                                    {showConfirm ? <FiEye /> : <FiEyeOff />}
                                </span>
                            </div>
                        </label>
                    </div>
                    <div className="securitychangepassword-footer">
                        <button className="cancel-btn" onClick={onClose}>Cancel</button>
                        <button className="save-btn">Save Changes</button>
                    </div>
                </form>
            </div>

        </div>
    )
}

export default SecurityChangePassword
