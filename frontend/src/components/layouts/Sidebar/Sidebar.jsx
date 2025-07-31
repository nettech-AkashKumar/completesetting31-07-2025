import React from "react";
import { Link } from "react-router-dom";
import "../../../styles/sidebar.css";
import Logo from "../../../assets/img/logo/munclogotm.png";
import IconLogo from "../../../assets/img/logo/MuncSmall.svg";
import { AiOutlineMenuFold, AiOutlineMenuUnfold } from "react-icons/ai";
import { getMenuData } from "./MenuData.jsx";
import { useSidebar } from "../../../Context/sidetoggle/SidebarContext";

const Sidebar = () => {
  const { openMenus, toggleMenu, mobileOpen, handleMobileToggle, handleLinkClick } = useSidebar();

  const menuData = getMenuData();
  return (
    <>
      {mobileOpen && <div className="sidebar-overlay" onClick={handleMobileToggle}></div>}

      <div className={`sidebar ${mobileOpen ? "open" : "collapsed "}`}>
        <div className="sidebar-logo">
          <Link to="/home"><img src={IconLogo} className="compact-logo" alt="Logo" /></Link>
          <Link to="/home"><img src={Logo} className="full-logo" alt="Full Logo" /></Link>
          <button className="mobile-toggle-btn" onClick={handleMobileToggle}>
            {mobileOpen ? <AiOutlineMenuFold /> : <AiOutlineMenuUnfold />}
          </button>
        </div>
        
        <div className="sidebar-inner">
          <div className="sidebar-menu">
            <ul>
              {menuData.map((section, idx) => (
                <li key={idx} className={`submenu-open ${openMenus[section.key] ? "active" : ""}`}>
                  {section.section && <h6 className="submenu-hdr">{section.section}</h6>}
                  <ul>
                    {section.items.map((item, i) => (
                      item.subItems ? (
                        <li key={i} className={`submenu ${openMenus[item.key] ? "open" : ""}`}>
                          <div
                            className={`subdrop ${openMenus[item.key] ? "active" : ""}`}
                            onClick={() => toggleMenu(item.key, true)}
                          >
                            <span className="menu-item">
                              {item.icon }
                              <span>{item.title}</span>
                            </span>
                            <span className={`menu-arrow ${openMenus[item.key] ? "rotated" : ""}`} />
                          </div>
                          {openMenus[item.key] && (
                            <ul>
                              {item.subItems.map((sub, subIdx) => (
                                sub.nested ? (
                                  <li key={subIdx} className={`submenu submenu-two ${openMenus[sub.nestedKey] ? "open" : ""}`}>
                                    <div onClick={() => toggleMenu(sub.nestedKey)}>
                                      <span>{sub.label}</span>
                                      <span className={`menu-arrow inside-submenu ${openMenus[sub.nestedKey] ? "rotated" : ""}`} />
                                    </div>
                                    {openMenus[sub.nestedKey] && (
                                      <ul>
                                        {sub.nested.map((n, nIdx) => (
                                          <li key={nIdx}>
                                            <Link to={n.path} onClick={handleLinkClick}>
                                              {n.label}
                                            </Link>
                                          </li>
                                        ))}
                                      </ul>
                                    )}
                                  </li>
                                ) : (
                                  <li key={subIdx}>
                                    <Link to={sub.path} onClick={handleLinkClick}>{sub.label}</Link>
                                  </li>
                                )
                              ))}
                            </ul>
                          )}
                        </li>
                      ) : (
                        <li key={i}>
                          <Link
                            to={item.path}
                            onClick={() => {
                              handleLinkClick();
                              toggleMenu(section.key, true);
                            }}
                          >
                            <span className="menu-item">
                              {item.icon}
                              <span>{item.label}</span>
                            </span>
                          </Link>
                        </li>
                      )
                    ))}
                  </ul>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div class="sidebar-bottom">
          <Link to="/"> <img src={IconLogo} class="compact-logo" alt="Compact Footer Logo" /></Link>
          <Link to="/"> <img src={Logo} class="full-logo" alt="Full Footer Logo" /></Link>

        </div>
      </div>
    </>
  );
};

export default Sidebar;
