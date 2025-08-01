import React, { useEffect, useState } from "react";
import { HiOutlineListBullet } from "react-icons/hi2";
import { LiaBoxSolid } from "react-icons/lia";
import { FaMapLocationDot } from "react-icons/fa6";
import { CiFileOn } from "react-icons/ci";
import './Localization.css'
import axios from "axios";
import { toast } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import { useTranslation } from 'react-i18next';
import { format } from "date-fns"
import BASE_URL from "../../../pages/config/config";



const Localization = () => {
  const [isOnSwitcher, setIsOnSwitcher] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false)
  const { t, i18n } = useTranslation();
  const [formData, setFormData] = useState({
    language: "",
    timezone: "",
    dateformat: "",
    timeformat: "",
    financialyear: "",
    startingmonth: "",
    currency: "",
    currencysymbol: "",
    currencyposition: "",
    decimalseparator: "",
    thousandseparator: "",
  })

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }
  const fetchLocalization = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/api/localizationsetting/get`)
      console.log("Fetched Localization data:", res.data.data);
      setFormData(res.data.data)
    } catch (error) {
      toast.error("Error fetching localization", {
        position: "top-center"
      })
    }
  }
  useEffect(() => {
    fetchLocalization();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(`${BASE_URL}/api/localizationsetting/update`, formData)
      localStorage.setItem("Localization info", JSON.stringify(formData))
      if (res.status === 200 || res.status === 201) {
        toast.success(`Localization setting ${isUpdating ? "updated" : "created"} successfully`, {
          position: 'top-center'
        })
        await fetchLocalization();
      }
    } catch (error) {
      toast.error("Error while saving localization setting", {
        position: 'top-center'
      })
    }
  }

  // Time Format
  const [localTime, setLocalTime] = useState("")
  useEffect(() => {
    if (formData.timezone) {
      const interval = setInterval(() => {
        const now = new Date();
        const formattedTime = new Intl.DateTimeFormat('en-US', {
          timeZone: formData.timezone,
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
          hour12: formData.timeformat === "12h"
        }).format(now);
        setLocalTime(formattedTime);
      }, 1000)
      return () => clearInterval(interval)
    }
  }, [formData.timezone, formData.timeformat]);

  // Date Format
  const formatOptions = [
    { labelFormat: "dd MMM yyyy", value: "dd MMM yyyy" },      // 02 Jan 2025
    { labelFormat: "MMM dd, yyyy", value: "MMM dd, yyyy" },      // Jan 02, 2025
  ];

  const [formattedDate, setFormattedDate] = useState("")

  useEffect(() => {
    if (formData.dateformat) {
      try {
        const now = new Date();
        const validFormats = ["dd MMM yyyy", "MMM dd, yyyy"]
        const selectedFormat = validFormats.includes(formData.dateformat) ? formData.dateformat : "dd MMMM yyyy";
        setFormattedDate(format(now, selectedFormat))
      } catch (error) {
        toast.error("Invalid date format selected", {
          position: 'top-center'
        })
      }
    }
  }, [formData.dateformat]);

  // financial year
  const currentYear = new Date().getFullYear();
  const financialYears = Array.from({ length: 10 }, (_, i) => currentYear - 5 + i)

  // financial month
  const indianFiscalMonths = [
    "april", "may", "june", "july", "august", "september",
    "october", "november", "december", "january", "february", "march"
  ];

  const calendarMonths = [
    "january", "february", "march", "april", "may", "june",
    "july", "august", "september", "october", "november", "december"
  ];
  const getMonthOptions = () => {
    if (formData.financialyear) {
      return indianFiscalMonths;
    }
    return calendarMonths;
  }

  return (
    <div>
      <div
        className="localization-container"
        style={{
          backgroundColor: "white",
          borderRadius: "5px",
          border: "1px solid rgb(211, 211, 211)",
          overflowY: "auto",
        }}
      >
        <div>
          <h1 className="py-2 px-3" style={{ fontSize: "17px" }}>
            {t("localization")}
          </h1>
          <hr style={{ margin: "0" }} />
        </div>
        <div>
          <form onSubmit={handleSubmit}>
            <div className="basic-information-content px-3">
              <label
                htmlFor=""
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "5px",
                  fontWeight: "600",
                  padding: "18px 0",
                }}
              >
                <HiOutlineListBullet style={{ color: "#007AFF" }} />
                {t("basic_info")}
              </label>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  padding: "12px 0",
                }}
              >
                <div style={{ display: "flex", flexDirection: "column" }}>
                  <span>{t("language")}</span>
                  <span style={{ color: "rgb(92, 91, 91)" }}>
                    {t("select_language")}
                  </span>
                </div>
                <div>
                  <select
                    name="language"
                    onChange={(e) => {
                      const selectedLang = e.target.value;
                      handleChange(e)
                      i18n.changeLanguage(selectedLang)
                    }}
                    value={formData.language}
                    style={{
                      border: "1px solid rgb(203, 198, 198)",
                      padding: "8px 5px",
                      borderRadius: "5px",
                      width: "250px",
                    }}
                  >
                    <option value="">Select</option>
                    <option value="en">English</option>
                    <option value="hi">Hindi</option>
                  </select>
                </div>
              </div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  padding: "12px 0",
                }}
              >
              </div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  padding: "12px 0",
                }}
              >
                <div style={{ display: "flex", flexDirection: "column" }}>
                  <span>{t("timezone")}</span>
                  <span style={{ color: "rgb(92, 91, 91)" }}>
                    {t("select_timezone")}
                  </span>
                </div>
                <div>
                  <select
                    name="timezone"
                    value={formData.timezone}
                    onChange={handleChange}
                    style={{
                      border: "1px solid rgb(203, 198, 198)",
                      padding: "8px 5px",
                      borderRadius: "5px",
                      width: "250px",
                    }}
                  >
                    <option value="">Select TimeZone</option>
                    <option value="Asia/Kolkata">UTC+5:30 (Asia/Kolkata)</option>
                    <option value="America/New_York">UTC-5:00 (America/New_York)</option>


                  </select>
                  {formData.timezone && (
                    <div className="" style={{ marginTop: '10px', color: 'gray' }}>
                      Current Time in <strong>{formData.timezone}</strong>:{localTime}
                    </div>
                  )}
                </div>
              </div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  padding: "12px 0",
                }}
              >
                <div style={{ display: "flex", flexDirection: "column" }}>
                  <span>{t("date_format")}</span>
                  <span style={{ color: "rgb(92, 91, 91)" }}>
                    {t("select_date_format")}
                  </span>
                </div>
                <div>
                  <select
                    name="dateformat"
                    value={formData.dateformat}
                    onChange={handleChange}
                    style={{
                      border: "1px solid rgb(203, 198, 198)",
                      padding: "8px 5px",
                      borderRadius: "5px",
                      width: "250px",
                    }}
                  >
                    <option value="">Date Format</option>
                    {formatOptions.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {format(new Date(), opt.labelFormat)}
                      </option>
                    ))}
                  </select>
                  {formData.dateformat && (
                    <div style={{ marginTop: "10px", color: "gray" }}>
                      Today’s date: <strong>{formattedDate}</strong>
                    </div>
                  )}

                </div>
              </div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  padding: "12px 0",
                }}
              >
                <div style={{ display: "flex", flexDirection: "column" }}>
                  <span>{t("time_format")}</span>
                  <span style={{ color: "rgb(92, 91, 91)" }}>
                    {t("select_time_format")}
                  </span>
                </div>
                <div>
                  <select
                    name="timeformat"
                    value={formData.timeformat}
                    onChange={handleChange}
                    style={{
                      border: "1px solid rgb(203, 198, 198)",
                      padding: "8px 5px",
                      borderRadius: "5px",
                      width: "250px",
                    }}
                  >
                    <option value="">Time Format</option>
                    <option value="12h">12 Hours</option>
                    <option value="24h">24 Hours</option>
                  </select>
                </div>
              </div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  padding: "12px 0",
                }}
              >
                <div style={{ display: "flex", flexDirection: "column" }}>
                  <span>{t("financial_year")}</span>
                  <span style={{ color: "rgb(92, 91, 91)" }}>
                    {t("select_financial_year")}
                  </span>
                </div>
                <div>
                  <select
                    name="financialyear"
                    value={formData.financialyear}
                    onChange={handleChange}
                    style={{
                      border: "1px solid rgb(203, 198, 198)",
                      padding: "8px 5px",
                      borderRadius: "5px",
                      width: "250px",
                    }}
                  >
                    <option value="">Financial Year</option>
                    {financialYears.map((year) => (
                      <option key={year} value={year}>{year}-{year + 1}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  padding: "12px 0",
                }}
              >
                <div style={{ display: "flex", flexDirection: "column" }}>
                  <span>{t("starting_month")}</span>
                  <span style={{ color: "rgb(92, 91, 91)" }}>
                    {t("select_starting_month")}
                  </span>
                </div>
                <div>
                  <select
                    name="startingmonth"
                    value={formData.startingmonth}
                    onChange={handleChange}
                    style={{
                      border: "1px solid rgb(203, 198, 198)",
                      padding: "8px 5px",
                      borderRadius: "5px",
                      width: "250px",
                    }}
                  >
                    <option value="">Starting Month</option>
                    {getMonthOptions().map((month) => (
                      <option key={month} value={month}>{month.charAt(0).toUpperCase() + month.slice(1)}</option>
                    ))}
                  </select>
                </div>
              </div>
              <hr />
            </div>

            <div className="currency-settings-content px-3">
              <label
                htmlFor=""
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "5px",
                  fontWeight: "600",
                  padding: "18px 0",
                }}
              >
                <LiaBoxSolid style={{ color: "#007AFF" }} />
                {t("currency_settings")}
              </label>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  padding: "12px 0",
                }}
              >
                <div style={{ display: "flex", flexDirection: "column" }}>
                  <span>{t("currency")}</span>
                  <span style={{ color: "rgb(92, 91, 91)" }}>
                    {t("select_currency")}
                  </span>
                </div>
                <div>
                  <select
                    name="currency"
                    value={formData.currency}
                    onChange={handleChange}
                    style={{
                      border: "1px solid rgb(203, 198, 198)",
                      padding: "8px 5px",
                      borderRadius: "5px",
                      width: "250px",
                    }}
                  >
                    <option value="">Currency</option>
                    <option value="usd">USA</option>
                    <option value="inr">INDIA</option>
                  </select>
                </div>
              </div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  padding: "12px 0",
                }}
              >
                <div style={{ display: "flex", flexDirection: "column" }}>
                  <span>{t("currency_symbol")}</span>
                  <span style={{ color: "rgb(92, 91, 91)" }}>
                    {t("select_currency_symbol")}
                  </span>
                </div>
                <div>
                  <select
                    name="currencysymbol"
                    value={formData.currencysymbol}
                    onChange={handleChange}
                    style={{
                      border: "1px solid rgb(203, 198, 198)",
                      padding: "8px 5px",
                      borderRadius: "5px",
                      width: "250px",
                    }}
                  >
                    <option value="$">$</option>
                    <option value="₹">₹</option>
                  </select>
                </div>
              </div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  padding: "12px 0",
                }}
              >
                <div style={{ display: "flex", flexDirection: "column" }}>
                  <span>{t("currency_position")}</span>
                  <span style={{ color: "rgb(92, 91, 91)" }}>
                    {t("select_currency_position")}
                  </span>
                </div>
                <div>
                  <select
                    name="currencyposition"
                    value={formData.currencyposition}
                    onChange={handleChange}
                    style={{
                      border: "1px solid rgb(203, 198, 198)",
                      padding: "8px 5px",
                      borderRadius: "5px",
                      width: "250px",
                    }}
                  >
                    <option value="">Currency Position</option>
                    <option value="prefix">$100</option>
                    <option value="suffix">100$</option>
                  </select>
                </div>
              </div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  padding: "12px 0",
                }}
              >
                <div style={{ display: "flex", flexDirection: "column" }}>
                  <span>{t("decimal_separator")}</span>
                  <span style={{ color: "rgb(92, 91, 91)" }}>
                    {t("select_decimal_separator")}
                  </span>
                </div>
                <div>
                  <select
                    name="decimalseparator"
                    value={formData.decimalseparator}
                    onChange={handleChange}
                    style={{
                      border: "1px solid rgb(203, 198, 198)",
                      padding: "8px 5px",
                      borderRadius: "5px",
                      width: "250px",
                    }}
                  >
                    <option value="">Decimal Separator</option>
                    <option value=".">.</option>
                    <option value=",">,</option>
                  </select>
                </div>
              </div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  padding: "12px 0",
                }}
              >
                <div style={{ display: "flex", flexDirection: "column" }}>
                  <span>{t("thousand_separator")}</span>
                  <span style={{ color: "rgb(92, 91, 91)" }}>
                    {t("select_thousand_separator")}
                  </span>
                </div>
                <div>
                  <select
                    name="thousandseparator"
                    value={formData.thousandseparator}
                    onChange={handleChange}
                    style={{
                      border: "1px solid rgb(203, 198, 198)",
                      padding: "8px 5px",
                      borderRadius: "5px",
                      width: "250px",
                    }}
                  >
                    <option value="">Thousand Separator</option>
                    <option value=",">,</option>
                    <option value=".">.</option>
                  </select>
                </div>
              </div>


              <hr />
            </div>
            <div style={{ display: "flex", justifyContent: "end", gap: "10px", padding: '20px' }}>
              <button type="submit" onClick={() => window.location.reload()} className="settingbtn" style={{ border: "none", padding: "10px", backgroundColor: "#81BDff", color: "white", borderRadius: "5px" }}>Cancel</button>
              <button type="submit" className="settingbtn" style={{ border: "none", padding: "10px", backgroundColor: "#007AFF", color: "white", borderRadius: "5px" }}>Save Changes</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Localization;
