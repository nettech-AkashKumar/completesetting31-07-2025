// import React, { useState } from 'react';
// import axios from 'axios';
// import BASE_URL from '../../../pages/config/config';
// import { toast } from 'react-toastify';
// import {useNavigate} from "react-router-dom"

// function ForgotPassword() {
//   const [email, setEmail] = useState('');
//   const [step, setStep] = useState(1);
//   const [otp, setOtp] = useState('');
//   const [newPassword, setNewPassword] = useState('');
//   const navigate = useNavigate();

//   const handleRequestOtp = async (e) => {
//     e.preventDefault();
//     try {
//       await axios.post(`${BASE_URL}/api/auth/forgot-password`, { email });
//       toast.success('OTP sent to your email');
//       setStep(2);
//     } catch (err) {
//       alert(err.response?.data?.message || 'Failed to send OTP');
//     }
//   };

//   const handleVerifyOtp = async (e) => {
//     e.preventDefault();
//     try {
//       await axios.post(`${BASE_URL}/api/auth/verify-otp-reset`, {
//         email,
//         otp,
//         newPassword
//       });
//       alert('Password reset successfully!');
//       navigate("/login")
//     } catch (err) {
//       alert(err.response?.data?.message || 'OTP verification failed');
//     }
//   };


//   return (
//     <div className="form-container">
//       {step === 1 ? (
//         <form onSubmit={handleRequestOtp}>
//           <h2>Forgot Password</h2>
//           <input
//             type="email"
//             placeholder="Enter email"
//             value={email}
//             onChange={(e) => setEmail(e.target.value)}
//             required
//           />
//           <button type="submit">Send OTP</button>
//         </form>
//       ) : (
//         <form onSubmit={handleVerifyOtp}>
//           <h2>Enter OTP and Reset Password</h2>
//           <input
//             type="text"
//             placeholder="OTP"
//             value={otp}
//             onChange={(e) => setOtp(e.target.value)}
//             required
//           />
//           <input
//             type="password"
//             placeholder="New Password"
//             value={newPassword}
//             onChange={(e) => setNewPassword(e.target.value)}
//             required
//           />
//           <button type="submit">Reset Password</button>
//         </form>
//       )}
//     </div>
//   );

// }

// export default ForgotPassword;




import React, { useState } from 'react';
import axios from 'axios';
import BASE_URL from '../../../pages/config/config';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import "../../../styles/ForgotPassword.css";

function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState('');
  const navigate = useNavigate();

  const handleRequestOtp = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${BASE_URL}/api/auth/forgot-password`, { email });
      toast.success('OTP sent to your email');
      setOtpSent(true);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to send OTP');
    }
  };

  const handleOtpSubmit = (e) => {
    e.preventDefault();
    navigate('/reset-password/:token', {
      state: {
        email,
        otp
      }
    });
  };

  return (
    <div className="forgot-container">
      <div className="forgot-card">
        <h2 className="forgot-title">Forgot Password</h2>
        <form className="forgot-form" onSubmit={otpSent ? handleOtpSubmit : handleRequestOtp}>
          <input
            type="email"
            className="forgot-input"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            disabled={otpSent}
          />

          {otpSent && (
            <input
              type="text"
              className="forgot-input"
              placeholder="Enter OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              required
            />
          )}

          <button type="submit" className="forgot-button">
            {otpSent ? 'Continue' : 'Send OTP'}
          </button>
        </form>
        <p className="forgot-back" onClick={() => navigate('/login')}>
          Back to Login
        </p>
      </div>
    </div>
  );
}

export default ForgotPassword;
