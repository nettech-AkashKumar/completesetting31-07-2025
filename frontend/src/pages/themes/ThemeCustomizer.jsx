import React, { useEffect, useState } from "react";
import { Offcanvas } from "bootstrap";
// import "./theme.css"; // Optional: Style your panel here if needed
import './themeCustomizer.css';
const defaultSettings = {
    theme: "light",
    sidebarTheme: "light",
    color: "primary",
    layout: "default",
    topbar: "white",
    width: "fluid",
    sidebarBg: "",
};

const Theme = () => {
    const [settings, setSettings] = useState(() => {
        const saved = JSON.parse(localStorage.getItem("themeSettings"));
        return saved || defaultSettings;
    });

    // Update attributes on DOM
    const applySettings = () => {
        const html = document.documentElement;
        const body = document.body;

        html.setAttribute("data-theme", settings.theme);
        html.setAttribute("data-layout", settings.layout);
        html.setAttribute("data-sidebar", settings.sidebarTheme);
        html.setAttribute("data-color", settings.color);
        html.setAttribute("data-topbar", settings.topbar);
        html.setAttribute("data-width", settings.width);

        if (settings.sidebarBg) {
            body.setAttribute("data-sidebarbg", settings.sidebarBg);
        } else {
            body.removeAttribute("data-sidebarbg");
        }
    };

    // Save to localStorage
    const saveSettings = (newSettings) => {
        localStorage.setItem("themeSettings", JSON.stringify(newSettings));
        setSettings(newSettings);
    };

    useEffect(() => {
        applySettings();
    }, [settings]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        const newSettings = { ...settings, [name]: value };
        saveSettings(newSettings);
    };

    const resetTheme = () => {
        localStorage.removeItem("themeSettings");
        setSettings(defaultSettings);
        setTimeout(() => {
            applySettings();
        }, 0);
    };

    useEffect(() => {
        const canvas = document.getElementById("theme-settings-offcanvas");
        if (canvas) new Offcanvas(canvas);
    }, []);

    return (
        <>
            {/* Toggle Button */}
            <div className="theme-settings-btn">
                <button
                    className="btn btn-secondary shadow"
                    type="button"
                    data-bs-toggle="offcanvas"
                    data-bs-target="#theme-settings-offcanvas"
                    aria-controls="theme-settings-offcanvas"
                >
                    <i className="bi bi-paint-bucket"></i>
                </button>
            </div>

            {/* Offcanvas Panel */}
            <div
                className="offcanvas offcanvas-end"
                tabIndex="-1"
                id="theme-settings-offcanvas"
                aria-labelledby="theme-settings-title"
            >
                <div className="offcanvas-header">
                    <h5 id="theme-settings-title">Theme Customizer</h5>
                    <button
                        type="button"
                        className="btn-close"
                        data-bs-dismiss="offcanvas"
                        aria-label="Close"
                    ></button>
                </div>
                <div className="offcanvas-body">
                    {/* Theme */}
                    <div className="mb-3">
                        <label className="form-label fw-semibold">Theme</label>
                        <div className="form-check">
                            <input
                                type="radio"
                                name="theme"
                                value="light"
                                className="form-check-input"
                                checked={settings.theme === "light"}
                                onChange={handleChange}
                            />
                            <label className="form-check-label">Light</label>
                        </div>
                        <div className="form-check">
                            <input
                                type="radio"
                                name="theme"
                                value="dark"
                                className="form-check-input"
                                checked={settings.theme === "dark"}
                                onChange={handleChange}
                            />
                            <label className="form-check-label">Dark</label>
                        </div>
                        <div className="form-check">
                            <input
                                type="radio"
                                name="theme"
                                value="system"
                                className="form-check-input"
                                checked={settings.theme === "system"}
                                onChange={handleChange}
                            />
                            <label className="form-check-label">System</label>
                        </div>
                    </div>

                    {/* Sidebar Theme */}
                    <div className="mb-3">
                        <label className="form-label fw-semibold">Sidebar Theme</label>
                        <div className="form-check">
                            <input
                                type="radio"
                                name="sidebarTheme"
                                value="light"
                                className="form-check-input"
                                checked={settings.sidebarTheme === "light"}
                                onChange={handleChange}
                            />
                            <label className="form-check-label">Light</label>
                        </div>
                        <div className="form-check">
                            <input
                                type="radio"
                                name="sidebarTheme"
                                value="dark"
                                className="form-check-input"
                                checked={settings.sidebarTheme === "dark"}
                                onChange={handleChange}
                            />
                            <label className="form-check-label">Dark</label>
                        </div>
                    </div>

                    {/* Color */}
                    <div className="mb-3">
                        <label className="form-label fw-semibold">Color</label>
                        {["primary", "success", "danger", "info", "warning"].map((color) => (
                            <div className="form-check" key={color}>
                                <input
                                    type="radio"
                                    name="color"
                                    value={color}
                                    className="form-check-input"
                                    checked={settings.color === color}
                                    onChange={handleChange}
                                />
                                <label className="form-check-label text-capitalize">{color}</label>
                            </div>
                        ))}
                    </div>

                    {/* Layout */}
                    <div className="mb-3">
                        <label className="form-label fw-semibold">Layout</label>
                        {["default", "mini", "two-column"].map((layout) => (
                            <div className="form-check" key={layout}>
                                <input
                                    type="radio"
                                    name="layout"
                                    value={layout}
                                    className="form-check-input"
                                    checked={settings.layout === layout}
                                    onChange={handleChange}
                                />
                                <label className="form-check-label text-capitalize">{layout}</label>
                            </div>
                        ))}
                    </div>

                    {/* Topbar */}
                    <div className="mb-3">
                        <label className="form-label fw-semibold">Topbar</label>
                        {["light", "dark"].map((topbar) => (
                            <div className="form-check" key={topbar}>
                                <input
                                    type="radio"
                                    name="topbar"
                                    value={topbar}
                                    className="form-check-input"
                                    checked={settings.topbar === topbar}
                                    onChange={handleChange}
                                />
                                <label className="form-check-label text-capitalize">{topbar}</label>
                            </div>
                        ))}
                    </div>

                    {/* Width */}
                    <div className="mb-3">
                        <label className="form-label fw-semibold">Width</label>
                        {["fluid", "boxed"].map((width) => (
                            <div className="form-check" key={width}>
                                <input
                                    type="radio"
                                    name="width"
                                    value={width}
                                    className="form-check-input"
                                    checked={settings.width === width}
                                    onChange={handleChange}
                                />
                                <label className="form-check-label text-capitalize">{width}</label>
                            </div>
                        ))}
                    </div>

                    {/* Sidebar Background Image */}
                    <div className="mb-3">
                        <label className="form-label fw-semibold">Sidebar Background Image</label>
                        <div className="form-check">
                            <input
                                type="radio"
                                name="sidebarBg"
                                value=""
                                className="form-check-input"
                                checked={!settings.sidebarBg}
                                onChange={handleChange}
                            />
                            <label className="form-check-label">None</label>
                        </div>
                        {[1, 2, 3, 4, 5].map((i) => (
                            <div className="form-check" key={i}>
                                <input
                                    type="radio"
                                    name="sidebarBg"
                                    value={`assets/img/sidebar-${i}.jpg`}
                                    className="form-check-input"
                                    checked={settings.sidebarBg === `assets/img/sidebar-${i}.jpg`}
                                    onChange={handleChange}
                                />
                                <label className="form-check-label">Image {i}</label>
                            </div>
                        ))}
                    </div>

                    <button className="btn btn-danger w-100 mt-3" onClick={resetTheme}>
                        Reset to Default
                    </button>
                </div>
            </div>
        </>
    );
};

export default Theme;



// import React, { useState } from 'react';
// import './themeCustomizer.css';

// const ThemeCustomizer = () => {
//     const [layout, setLayout] = useState('default');
//     const [layoutWidth, setLayoutWidth] = useState('fluid');
//     const [topbarColor, setTopbarColor] = useState('light');
//     const [sidebarColor, setSidebarColor] = useState('light');
//     const [themeMode, setThemeMode] = useState('light');
//     const [sidebarBg, setSidebarBg] = useState('bg1');
//     const [themeColor, setThemeColor] = useState('default');

//     const layouts = ['default', 'mini', 'two-column', 'horizontal', 'detached', 'without-header', 'rtl'];
//     const solidColors = ['light', 'white', 'gray', 'black', 'blue', 'purple', 'green', 'custom'];
//     const gradients = ['grad1', 'grad2', 'grad3', 'grad4', 'grad5', 'grad6', 'grad7'];
//     const sidebarBgs = ['bg1', 'bg2', 'bg3', 'bg4', 'bg5', 'bg6'];
//     const themeColors = ['red', 'green', 'blue', 'orange', 'cyan', 'teal', 'custom'];

//     return (
//         <div className="theme-customizer">
//             <h4>Theme Customizer</h4>
//             <p>Choose your themes & layouts etc.</p>

//             <div className="section">
//                 <h6>Select Layouts</h6>
//                 <div className="layout-options">
//                     {layouts.map((l) => (
//                         <div
//                             key={l}
//                             className={`layout-card ${layout === l ? 'active' : ''}`}
//                             onClick={() => setLayout(l)}
//                         >
//                             <div className={`layout-preview ${l}`}></div>
//                             <span>{l.replace('-', ' ')}</span>
//                         </div>
//                     ))}
//                 </div>
//             </div>

//             <div className="section">
//                 <h6>Layout Width</h6>
//                 <div className="toggle-buttons">
//                     <button className={layoutWidth === 'fluid' ? 'active' : ''} onClick={() => setLayoutWidth('fluid')}>Fluid Layout</button>
//                     <button className={layoutWidth === 'boxed' ? 'active' : ''} onClick={() => setLayoutWidth('boxed')}>Boxed Layout</button>
//                 </div>
//             </div>

//             <div className="section">
//                 <h6>Top Bar Color</h6>
//                 <div className="color-palette">
//                     {solidColors.map(color => (
//                         <div key={color} className={`color-circle ${color} ${topbarColor === color ? 'selected' : ''}`} onClick={() => setTopbarColor(color)}></div>
//                     ))}
//                     {gradients.map(color => (
//                         <div key={color} className={`gradient-circle ${color} ${topbarColor === color ? 'selected' : ''}`} onClick={() => setTopbarColor(color)}></div>
//                     ))}
//                 </div>
//             </div>

//             <div className="section">
//                 <h6>Sidebar Color</h6>
//                 <div className="color-palette">
//                     {solidColors.map(color => (
//                         <div key={color} className={`color-circle ${color} ${sidebarColor === color ? 'selected' : ''}`} onClick={() => setSidebarColor(color)}></div>
//                     ))}
//                     {gradients.map(color => (
//                         <div key={color} className={`gradient-circle ${color} ${sidebarColor === color ? 'selected' : ''}`} onClick={() => setSidebarColor(color)}></div>
//                     ))}
//                 </div>
//             </div>

//             <div className="section">
//                 <h6>Theme Mode</h6>
//                 <div className="toggle-buttons">
//                     <button className={themeMode === 'light' ? 'active' : ''} onClick={() => setThemeMode('light')}>Light</button>
//                     <button className={themeMode === 'dark' ? 'active' : ''} onClick={() => setThemeMode('dark')}>Dark</button>
//                     <button className={themeMode === 'system' ? 'active' : ''} onClick={() => setThemeMode('system')}>System</button>
//                 </div>
//             </div>

//             <div className="section">
//                 <h6>Sidebar Background</h6>
//                 <div className="bg-options">
//                     {sidebarBgs.map(bg => (
//                         <div key={bg} className={`bg-thumb ${bg} ${sidebarBg === bg ? 'selected' : ''}`} onClick={() => setSidebarBg(bg)}></div>
//                     ))}
//                 </div>
//             </div>

//             <div className="section">
//                 <h6>Theme Colors</h6>
//                 <div className="theme-colors">
//                     {themeColors.map(color => (
//                         <div key={color} className={`theme-circle ${color} ${themeColor === color ? 'selected' : ''}`} onClick={() => setThemeColor(color)}></div>
//                     ))}
//                 </div>
//             </div>

//             <div className="footer-buttons">
//                 <button className="reset">🔄 Reset</button>
//                 <button className="buy">🛒 Buy Product</button>
//             </div>
//         </div>
//     );
// };

// export default ThemeCustomizer;
