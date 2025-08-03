
import React, { useContext, useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import "../../../styles/auth.css";
import { TbBell, TbCirclePlus, TbCommand, TbDeviceLaptop, TbDotsVertical, TbFileText, TbLanguage, TbLogout, TbMail, TbMaximize, TbSearch, TbSettings, TbUserCircle } from 'react-icons/tb';
import UsFlag from "../../../assets/img/flags/us-flag.svg"
import English from "../../../assets/img/flags/english.svg"
import Arabic from "../../../assets/img/flags/arabic.svg"
import Logo from "../../../assets/img/logo/munclogotm.png"
import { useSidebar } from '../../../Context/sidetoggle/SidebarContext';
import { AiOutlineMenuFold, AiOutlineMenuUnfold } from 'react-icons/ai';
import axios from 'axios';
import BASE_URL from '../../../pages/config/config';
import Profile from "../../../assets/img/profile.jpeg";
import { LanguageContext } from '../../../Context/Language/LanguageContext';
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import Activities from './activities.jsx';
import { io } from 'socket.io-client';


function Navbar() {
  // const { language, switchLanguage } = useContext(LanguageContext);
  const mobileBtnRef = useRef(null);
  const fullscreenBtnRef = useRef(null);
  const toggleBtnRef = useRef(null);
  const { mobileOpen, handleMobileToggle } = useSidebar();
  
  // Notification badge state
  const [unreadCount, setUnreadCount] = useState(0);
  const userData = JSON.parse(localStorage.getItem("user"));
  const backendurl = import.meta.env.BACKEND_URL || 'http://localhost:5000';
  
  // Socket ref to prevent multiple connections
  const socketRef = useRef(null);
  const userIdRef = useRef(null);

  // Fetch unread notification count
  const fetchUnreadCount = async () => {
    try {
      const token = localStorage.getItem('token');
      const userId = userData?._id || userData?.id;
      
      if (!userId) {
        console.log('🔔 Navbar: No user ID available');
        return;
      }
      
      console.log('🔔 Navbar: Fetching unread count for user:', userId);
      
      const response = await fetch(`${backendurl}/api/notifications/unread/${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      
      if (response.ok) {
        const data = await response.json();
        console.log('🔔 Navbar: Unread count response:', data);
        setUnreadCount(data.count);
      } else {
        console.log('🔔 Navbar: Failed to fetch unread count:', response.status);
      }
    } catch (error) {
      console.error('🔔 Navbar: Error fetching unread count:', error);
    }
  };

  // Socket event handling for real-time notification updates
  useEffect(() => {
    if (!userData) return;

    const currentUserId = userData._id || userData.id;
    
    // Only create new socket connection if user ID has changed or no socket exists
    if (!socketRef.current || userIdRef.current !== currentUserId) {
      // Disconnect existing socket if user ID changed
      if (socketRef.current) {
        console.log('🔔 Navbar: Disconnecting existing socket for user change');
        socketRef.current.disconnect();
      }
      
      console.log('🔔 Navbar: Creating new socket connection for user:', currentUserId);
      
      // Connect to socket for real-time notifications
      socketRef.current = io(backendurl);
      userIdRef.current = currentUserId;
      
      console.log('🔔 Navbar: Socket connected for notifications');
      console.log('🔔 Navbar: Current user ID:', currentUserId);
      
      // Add user to online users list
      socketRef.current.emit('add-user', currentUserId);
      
      socketRef.current.on('notification-received', (data) => {
        console.log('🔔 Navbar: Received notification event:', data);
        console.log('🔔 Navbar: Event recipient:', data.recipient);
        console.log('🔔 Navbar: Current user ID:', currentUserId);
        
        if (data.recipient === currentUserId) {
          console.log('🔔 Navbar: Updating badge count from', unreadCount, 'to', unreadCount + 1);
          setUnreadCount(prev => prev + 1);
        } else {
          console.log('🔔 Navbar: Notification not for current user');
        }
      });

      // Listen for new-notification events (alternative event name)
      socketRef.current.on('new-notification', (data) => {
        console.log('🔔 Navbar: Received new-notification event:', data);
        if (data.recipient === currentUserId) {
          console.log('🔔 Navbar: Updating badge count from', unreadCount, 'to', unreadCount + 1);
          setUnreadCount(prev => prev + 1);
        }
      });
    }

    // Fetch initial unread count
    fetchUnreadCount();

    // Cleanup function
    return () => {
      if (socketRef.current) {
        console.log('🔔 Navbar: Disconnecting socket');
        socketRef.current.disconnect();
        socketRef.current = null;
        userIdRef.current = null;
      }
    };
  }, [userData, backendurl]); // Removed unreadCount from dependencies

  // Handle notification dropdown click
  const handleNotificationClick = async () => {
    try {
      const token = localStorage.getItem('token');
      const userId = userData?._id || userData?.id;
      
      if (!userId || unreadCount === 0) return;
      
      // Mark all notifications as read
      await fetch(`${backendurl}/api/notifications/read-all/${userId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });
      
      // Reset unread count
      setUnreadCount(0);
    } catch (error) {
      console.error('Error marking notifications as read:', error);
    }
  };

  // Callback function to reset navbar badge when notifications are marked as read
  const handleNotificationsRead = () => {
    setUnreadCount(0);
  };


  useEffect(() => {
    const handleFullscreen = () => {
      if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen?.();
      } else {
        document.exitFullscreen?.();
      }
    };

    const handleMobileToggle = () => {
      document.body.classList.toggle('slide-nav');
      document.querySelector('.sidebar-overlay')?.classList.toggle('opened');
      document.documentElement.classList.add('menu-opened');
      document.getElementById('task_window')?.classList.remove('opened');
    };

    const handleHoverExpand = (e) => {
      const isMini = document.body.classList.contains('mini-sidebar');
      const toggleVisible = toggleBtnRef.current?.offsetParent !== null;
      if (isMini && toggleVisible) {
        const inside = e.target.closest('.sidebar, .header-left');
        if (inside) {
          document.body.classList.add('expand-menu');
          document.querySelectorAll('.subdrop + ul').forEach(ul => ul.style.display = 'block');
        } else {
          document.body.classList.remove('expand-menu');
          document.querySelectorAll('.subdrop + ul').forEach(ul => ul.style.display = 'none');
        }
      }
    };


    fullscreenBtnRef.current?.addEventListener('click', handleFullscreen);
    mobileBtnRef.current?.addEventListener('click', handleMobileToggle);
    document.addEventListener('mouseover', handleHoverExpand);

    return () => {
      fullscreenBtnRef.current?.removeEventListener('click', handleFullscreen);
      mobileBtnRef.current?.removeEventListener('click', handleMobileToggle);
      document.removeEventListener('mouseover', handleHoverExpand);
    };
  }, []);


  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await axios.post(`${BASE_URL}/api/auth/logout`);
      // Optionally clear localStorage/session
      localStorage.removeItem("token");
      // Redirect to login page
      navigate("/login");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };


  const { t, i18n } = useTranslation();


  const languageOptions = {
    en: { name: t("english"), flag: English },
    hi: { name: t("hindi"), flag: Arabic }, // Replace with Hindi flag if available
    ar: { name: t("arabic"), flag: Arabic },
  };

  const [currentLang, setCurrentLang] = useState(i18n.language || "en");

  const handleChangeLanguage = (lang) => {
    i18n.changeLanguage(lang);
    document.documentElement.dir = lang === "ar" ? "rtl" : "ltr";
    setCurrentLang(lang);
  };

  // state for company logo
  const [companyImages, setCompanyImages] = useState(null)
  const [isDarkMode, setIsDarkMode] = useState(false)

  // fetch company details
  useEffect(() => {
    const fetchCompanyDetails = async () => {
      try {
        const res = await axios.get(`${BASE_URL}/api/companyprofile/get`)
        if (res.status === 200) {
          setCompanyImages(res.data.data)
          console.log("res.data", res.data.data)
        }
      } catch (error) {
        toast.error("Unable to find company details", {
          position: 'top-center'
        })
      }
    }
    fetchCompanyDetails();
  }, []);

  useEffect(() => {
    if (companyImages?.companyFavicon) {
      let favicon = document.querySelector("link[rel*='icon']");
      if (!favicon) {
        favicon = document.createElement("link")
        favicon.rel = "icon";
        document.head.appendChild(favicon)
      }
      favicon.type = "image/png";
      favicon.href = companyImages.companyFavicon
    }
  }, [companyImages])

  const userId = userData._id;

  return (
    <div className="header">
      <div className="main-header">
        {companyImages ? (
          <>
            <div className="header-left active">
              <Link to="/home" className="logo logo-normal">
                {/* <img src={Logo} alt="Logo" /> */}
                <img style={{ height: "35px", width: "35px" }} src={isDarkMode ? companyImages.companyDarkLogo : companyImages.companyLogo} alt="company logo" />
              </Link>
              <Link to="/home" className="logo logo-white">
                <img src="/assets/img/logo-white.svg" alt="Logo" />
              </Link>
              <Link to="/home" className="logo-small">
                <img src="/assets/img/logo-small.png" alt="Logo" />
              </Link>
            </div>

            {/* Logo */}


            <a id="mobile_btn" className="mobile_btn" onClick={handleMobileToggle} ref={mobileBtnRef}>
              {mobileOpen ? <AiOutlineMenuFold /> : <AiOutlineMenuUnfold />}
            </a>
            <button id="toggle_btn" ref={toggleBtnRef} style={{ display: 'none' }}></button>

            {/* Header Right Menu */}

            <ul className="nav user-menu">
              {/* Search */}
              <li className="nav-item nav-searchinputs">
                <div className="top-nav-search">
                  <button className="responsive-search"><TbSearch /></button>
                  <form className="dropdown">
                    <div className="searchinputs input-group dropdown-toggle" data-bs-toggle="dropdown" data-bs-auto-close="outside">
                      <input type="text" placeholder="Search" />
                    </div>
                    <div className="dropdown-menu search-dropdown"></div>
                  </form>
                </div>
              </li>

              {/* Store Dropdown */}
              <li className="nav-item dropdown has-arrow main-drop select-store-dropdown">
                <a className="dropdown-toggle nav-link select-store" data-bs-toggle="dropdown" href="#">
                  <span className="user-info">
                    <span className="user-letter">
                      <img style={{ width: "25px", height: "25px" }} src={''} alt="Store" className="img-fluid" />
                    </span>
                    <span className="user-detail">
                      <span className="user-name">Freshmart</span>
                    </span>
                  </span>
                </a>
                <div className="dropdown-menu dropdown-menu-end">
                  <Link className="dropdown-item" to="#"><img src="/assets/img/store/store-01.png" alt="Store" /> Freshmart</Link>
                  <Link className="dropdown-item" to="#"><img src="/assets/img/store/store-02.png" alt="Store" /> Grocery Apex</Link>
                </div>
              </li>


              {/* Add New Dropdown */}
              <li className="nav-item dropdown link-nav">
                <button className="btn btn-primary btn-md d-inline-flex align-items-center" data-bs-toggle="dropdown">
                  <TbCirclePlus className="me-1" />
                  {t("addNew")}
                </button>
                <div className="dropdown-menu dropdown-xl dropdown-menu-center">
                  <div className="row g-2">
                    <div className="col-md-2">
                      <Link to="/category-list" className="link-item">
                        <span className="link-icon"><i className="ti ti-brand-codepen" /></span>
                        <p>{t("category")}</p>
                      </Link>
                    </div>
                    <div className="col-md-2">
                      <Link to="/add-product" className="link-item">
                        <span className="link-icon"><i className="ti ti-square-plus" /></span>
                        <p>{t("product")}</p>
                      </Link>
                    </div>
                  </div>
                </div>
              </li>

              {/* POS Button */}
              <li className="nav-item pos-nav">
                <Link to="/pos" className="btn btn-dark btn-md d-inline-flex align-items-center">
                  <TbDeviceLaptop className=" me-1" />
                  {t("pos")}
                </Link>
              </li>
              <li className="nav-item dropdown has-arrow flag-nav nav-item-box">
                <a className="nav-link dropdown-toggle" data-bs-toggle="dropdown">
                  <img
                    src={languageOptions[currentLang]?.flag}
                    // alt={languageOptions[currentLang].name}
                    style={{ width: "20px" }}
                  />
                  {/* <span>{languageOptions[currentLang].name}</span> */}
                  {/* <TbLanguage /> */}
                </a>

                <div className="dropdown-menu dropdown-menu-end">
                  {Object.entries(languageOptions).map(([code, { name, flag }]) => (
                    <button
                      key={code}
                      className={`dropdown-item d-flex align-items-center ${currentLang === code ? "active" : ""}`}
                      onClick={() => handleChangeLanguage(code)}
                    >
                      <img src={flag} alt={name} style={{ width: "20px", marginRight: "8px" }} />
                      {name}
                    </button>
                  ))}
                </div>
              </li>
              {/* Fullscreen */}
              <li className="nav-item nav-item-box">
                <a id="btnFullscreen" ref={fullscreenBtnRef}>
                  <TbMaximize />
                </a>
              </li>

              {/* Email */}
              <li className="nav-item nav-item-box">
                <Link to="/mail">
                  <TbMail />
                  <span className="badge rounded-pill">1</span>
                </Link>
              </li>
              <li className="nav-item dropdown nav-item-box">
                <a href="#" className="dropdown-toggle nav-link" data-bs-toggle="dropdown" onClick={(e) => {
                  e.preventDefault();
                  // Removed automatic marking as read - let user control this manually
                }}>
                  <TbBell />
                  {unreadCount > 0 && (
                    <span 
                      className="badge rounded-pill" 
                      style={{
                        position: 'absolute',
                        top: '-5px',
                        right: '-5px',
                        backgroundColor: '#ff4757',
                        color: 'white',
                        fontSize: '10px',
                        minWidth: '18px',
                        height: '18px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        borderRadius: '50%',
                        border: '2px solid white'
                      }}
                    >
                      {unreadCount > 99 ? '99+' : unreadCount}
                    </span>
                  )}
                </a>
                <div className="dropdown-menu notifications">
                  
                  <Activities onNotificationsRead={handleNotificationsRead} />
                  
                </div>
              </li>
              {/* Settings */}
              <li className="nav-item nav-item-box">
                <Link to="/general-settings"><TbSettings className="ti" /></Link>
              </li>

              {/* Profile */}
              {userData ? (
                <>

                  <li className="nav-item dropdown has-arrow main-drop profile-nav">
                    <a className="nav-link userset" data-bs-toggle="dropdown" href="#">
                      <span className="user-info p-0">
                        <span className="user-letter">
                          <img style={{ height: '25px', width: '25px' }} src={userData.profileImage.url} alt="User" />
                        </span>
                      </span>
                    </a>
                    <div className="dropdown-menu menu-drop-user">
                      <div className="profileset d-flex align-items-center">
                        <span className="user-img me-2"><img src={userData.profileImage.url} alt="User" /></span>
                        <div>
                          <h6 className="fw-medium">{userData.firstName}</h6>
                          <p>{userData.role.roleName}</p>
                        </div>
                      </div>
                      <Link className="dropdown-item" to="/profile"><TbUserCircle className="me-2" /> {t("myProfile")}</Link>
                      <Link className="dropdown-item" to="/sales-report"><TbFileText className=" me-2" /> {t("reports")}</Link>
                      <Link className="dropdown-item" to="/general-settings"><TbSettings className=" me-2" /> {t("settings")}</Link>
                      <hr className="my-2" />
                      <Link className="dropdown-item logout pb-0" onClick={handleLogout}><TbLogout className=" me-2" /> {t("logout11")}</Link>
                    </div>
                  </li>
                </>
              ) : (<p>
                No User found
              </p>)}
            </ul>
          </>
        ) : (
          <p>No Company Logo Image</p>
        )}
        <div className="dropdown mobile-user-menu">
          <a className="nav-link dropdown-toggle" data-bs-toggle="dropdown" href="#">
            <TbDotsVertical />
          </a>
          <div className="dropdown-menu dropdown-menu-end">
            <Link className="dropdown-item" to="/profile">{t("myProfile")}</Link>
            <Link className="dropdown-item" to="/general-settings">{t("settings")}</Link>
            <Link className="dropdown-item" onClick={handleLogout}>{t("logout")}</Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Navbar;