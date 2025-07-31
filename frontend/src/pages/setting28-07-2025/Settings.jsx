import React, { useState } from "react";
import { LuRefreshCcw } from "react-icons/lu";
import { MdKeyboardArrowUp } from "react-icons/md";
import { RiArrowDropDownLine } from "react-icons/ri";
import { CiSettings } from "react-icons/ci";
import { AiOutlineGlobal } from "react-icons/ai";
import { CiMobile2 } from "react-icons/ci";
import { AiOutlineDesktop } from "react-icons/ai";
import { TbSettingsCog } from "react-icons/tb";
import { TbSettings2 } from "react-icons/tb";
import { RxDotFilled } from "react-icons/rx";
import "./Settings.css";
import { Link, Outlet } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useAuth } from "../../components/auth/AuthContext.jsx";

const Settings = () => {
  const [showGeneralSettings, setShowGeneralSettings] = useState(false);
  const [showWebsiteSettings, setShowWebsitelSettings] = useState(false);
  const [openDropdown, setOpenDropdown] = useState(null);
  const { user } = useAuth();
  const id = user?.id;


  const toggleDropdown = (name) => {
    setOpenDropdown((prev) => (prev === name ? null : name))
  }
  const { t } = useTranslation();

  return (
    <div>
      <div className="mainsetting" style={{ backgroundColor: "#f7f7f7" }}>
        {/* SETTING-HEADER? */}
        <div
          className="header-settings py-2 px-4"
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <div>
            <strong style={{ fontSize: "17px" }}>{t("settings")}</strong>
            <p>{t("manage_settings")}</p>
          </div>
          <div style={{ display: "flex", gap: "10px" }}>
            <span
              style={{
                backgroundColor: "white",
                padding: "3px 6px",
                borderRadius: "4px",
                border: "1px solid #d3d3d3",
              }}
            >
              <LuRefreshCcw />
            </span>
            <span
              style={{
                backgroundColor: "white",
                padding: "3px 6px",
                borderRadius: "4px",
                border: "1px solid #d3d3d3",
              }}
            >
              <MdKeyboardArrowUp />
            </span>
          </div>
        </div>
        {/* MAIN-COMPONENT? */}
        <div className="py-2 px-4 d-flex gap-4">
          <div
            className="left-setting-sidebar"
            style={{
              backgroundColor: "white",
              padding: "5px 10px",
              borderRadius: "5px",
              border: "1px solid #d3d3d3",
              width: "330px",
              overflowY: "auto",
              height: "400px",
            }}
          >
            <div>
              <h1 style={{ fontSize: "17px" }}>{t("settings")}</h1>
              <hr />
            </div>
            <div className="sidebar-nav-link">
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  paddingBottom: "30px",
                  position: "relative",
                  cursor: "pointer",
                }}
                onClick={() => toggleDropdown("general")}
              >
                <span style={{ color: "#212B36" }}>
                  {" "}
                  <CiSettings /> {t("general_settings")}
                </span>
                <span>
                  <RiArrowDropDownLine
                    style={{
                      backgroundColor: "#F2F2F2",
                      borderRadius: "50%",
                      width: "17px",
                      height: "17px",
                      transition: "transform 0.3s",
                      transform: openDropdown === "general" ? "rotate(180deg)" : "rotate(0deg)"
                    }}
                  />
                </span>
              </div>
              {/* DROPDOWN CONTENT */}
              {openDropdown === "general" && (
                <div
                  style={{
                    paddingBottom: "20px",
                    display: "flex",
                    flexDirection: "column",
                  }}
                >
                  <Link to={`profile/${id}`} style={{ textDecoration: "none", color: "black" }}>
                    {" "}
                    <span
                      className="genersettingdropdown"
                      style={{
                        marginLeft: "10px",
                        marginRight: "10px",
                        padding: "10px",
                        borderRadius: "5px",
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                      }}
                    >
                      {" "}
                      {t("profile")} <RxDotFilled />
                    </span>
                  </Link>
                  <Link to="security" style={{ textDecoration: "none", color: "black" }}>
                    <span
                      className="genersettingdropdown"
                      style={{
                        marginLeft: "10px",
                        marginRight: "10px",
                        padding: "10px",
                        borderRadius: "5px",
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                      }}
                    >
                      {t("security")} <RxDotFilled />
                    </span>
                  </Link>
                  <Link to="notification" style={{ textDecoration: "none", color: "black" }}>
                    <span
                      className="genersettingdropdown"
                      style={{
                        marginLeft: "10px",
                        marginRight: "10px",
                        padding: "10px",
                        borderRadius: "5px",
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                      }}
                    >
                      {t("notification")} <RxDotFilled />
                    </span>
                  </Link>
                  <Link to="connectedApps" style={{ textDecoration: "none", color: "black" }}>
                    <span
                      className="genersettingdropdown"
                      style={{
                        marginLeft: "10px",
                        marginRight: "10px",
                        padding: "10px",
                        borderRadius: "5px",
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                      }}
                    >
                      {t("connected_apps")} <RxDotFilled />
                    </span>
                  </Link>
                </div>
              )}
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  paddingBottom: "30px",
                  cursor: "pointer",
                }}
                onClick={() => toggleDropdown("website")}
              >
                <span style={{ color: "#212B36", fontSize: "17px" }}>
                  {" "}
                  <AiOutlineGlobal /> {t("website_settings")}
                </span>
                <span>
                  <RiArrowDropDownLine
                    style={{
                      backgroundColor: "#F2F2F2",
                      borderRadius: "50%",
                      width: "20px",
                      height: "20px",
                      transition: "transform 0.3s",
                      transform: openDropdown === "website" ? "rotate(180deg)" : "rotate(0deg)"
                    }}
                  />
                </span>
              </div>
              {/* DROPDOWN CONTENT */}
              {openDropdown === "website" && (
                <div
                  style={{
                    paddingBottom: "20px",
                    display: "flex",
                    flexDirection: "column",
                  }}
                >
                  <Link to="system_settings" style={{ textDecoration: "none", color: "black" }}>
                    {" "}
                    <span
                      className="genersettingdropdown"
                      style={{
                        marginLeft: "10px",
                        marginRight: "10px",
                        padding: "10px",
                        borderRadius: "5px",
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                      }}
                    >
                      {" "}
                      {t("system_settings")} <RxDotFilled />
                    </span>
                  </Link>
                  <Link to="company_settings" style={{ textDecoration: "none", color: "black" }}>
                    <span
                      className="genersettingdropdown"
                      style={{
                        marginLeft: "10px",
                        marginRight: "10px",
                        padding: "10px",
                        borderRadius: "5px",
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                      }}
                    >
                      {t("company_settings")}<RxDotFilled />
                    </span>
                  </Link>
                  <Link to="localization" style={{ textDecoration: "none", color: "black" }}>
                    <span
                      className="genersettingdropdown"
                      style={{
                        marginLeft: "10px",
                        marginRight: "10px",
                        padding: "10px",
                        borderRadius: "5px",
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                      }}
                    >
                      {t("localization")} <RxDotFilled />
                    </span>
                  </Link>
                  <Link to="prefixes" style={{ textDecoration: "none", color: "black" }}>
                    <span
                      className="genersettingdropdown"
                      style={{
                        marginLeft: "10px",
                        marginRight: "10px",
                        padding: "10px",
                        borderRadius: "5px",
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                      }}
                    >
                      {t("prefixes")} <RxDotFilled />
                    </span>
                  </Link>
                  <Link to="preferance" style={{ textDecoration: "none", color: "black" }}>
                    <span
                      className="genersettingdropdown"
                      style={{
                        marginLeft: "10px",
                        marginRight: "10px",
                        padding: "10px",
                        borderRadius: "5px",
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                      }}
                    >
                      {t("preferance")} <RxDotFilled />
                    </span>
                  </Link>
                  <Link to="appearance" style={{ textDecoration: "none", color: "black" }}>
                    <span
                      className="genersettingdropdown"
                      style={{
                        marginLeft: "10px",
                        marginRight: "10px",
                        padding: "10px",
                        borderRadius: "5px",
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                      }}
                    >
                      {t("appearance")} <RxDotFilled />
                    </span>
                  </Link>
                  <Link to="socialauth" style={{ textDecoration: "none", color: "black" }}>
                    <span
                      className="genersettingdropdown"
                      style={{
                        marginLeft: "10px",
                        marginRight: "10px",
                        padding: "10px",
                        borderRadius: "5px",
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                      }}
                    >
                      {t("social_auth")} <RxDotFilled />
                    </span>
                  </Link>
                  <Link to="language" style={{ textDecoration: "none", color: "black" }}>
                    <span
                      className="genersettingdropdown"
                      style={{
                        marginLeft: "10px",
                        marginRight: "10px",
                        padding: "10px",
                        borderRadius: "5px",
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                      }}
                    >
                      {t("language")} <RxDotFilled />
                    </span>
                  </Link>
                </div>
              )}
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  paddingBottom: "30px",
                }}
              >
                <span style={{ color: "#212B36", fontSize: "17px" }}>
                  {" "}
                  <CiMobile2 /> {t("app_settings")}
                </span>
                <span>
                  <RiArrowDropDownLine
                    style={{
                      backgroundColor: "#F2F2F2",
                      borderRadius: "50%",
                      width: "20px",
                      height: "20px",
                    }}
                  />
                </span>
              </div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  paddingBottom: "30px",
                }}
              >
                <span style={{ color: "#212B36", fontSize: "17px" }}>
                  {" "}
                  <AiOutlineDesktop /> {t("system_settings_secondary")}
                </span>
                <span>
                  <RiArrowDropDownLine
                    style={{
                      backgroundColor: "#F2F2F2",
                      borderRadius: "50%",
                      width: "20px",
                      height: "20px",
                    }}
                  />
                </span>
              </div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  paddingBottom: "30px",
                }}
              >
                <span style={{ color: "#212B36", fontSize: "17px" }}>
                  {" "}
                  <TbSettingsCog /> {t("financial_settings")}
                </span>
                <span>
                  <RiArrowDropDownLine
                    style={{
                      backgroundColor: "#F2F2F2",
                      borderRadius: "50%",
                      width: "20px",
                      height: "20px",
                    }}
                  />
                </span>
              </div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  paddingBottom: "20px",
                }}
              >
                <span style={{ color: "#212B36", fontSize: "17px" }}>
                  {" "}
                  <TbSettings2 />{t("other_settings")}
                </span>
                <span>
                  <RiArrowDropDownLine
                    style={{
                      backgroundColor: "#F2F2F2",
                      borderRadius: "50%",
                      width: "20px",
                      height: "20px",
                    }}
                  />
                </span>
              </div>
            </div>
          </div>

          <div className="right-setting-content w-100">
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
