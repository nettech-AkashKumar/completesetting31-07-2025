import React from "react";
import { Routes, Route } from "react-router-dom";
import Login from "../components/auth/Login/Login";
import Register from "../components/auth/Register/Register";
import ForgotPassword from "../components/auth/ForgotPassword/ForgotPassword";
import Dashboard from "../components/Dashboard/Dashboard";
import AuthLayout from "../components/layouts/autlayout/AuthLayout";
import Setting from "../settings/Setting";
// import ResetPassword from "../components/auth/ResetPassword/ResetPassword";
import ChangePassword from "../components/auth/ChangePassword/ChangePassword";
import Profile from "../pages/profile/Profile";
import PrivateRoute from "../utils/PrivateRoute";
//------------------------------- invetory------------------------------//

import Product from "../components/features/inventory/product/Product";
import ProductCreate from "../components/features/inventory/product/ProductCreate";
import ExpriedProduct from "../components/features/inventory/product/ExpriedProduct";
import Category from "../components/features/category/Category";
import SubCategory from "../components/features/category/subcategory/SubCategory";
import Country from "../pages/Location/country/Country";
import State from "../pages/Location/state/State.jsx";
import City from "../pages/Location/city/City";
import LocationTable from "../pages/Location/LocationTable";
import Brand from "../components/features/brand/Brand";
import Units from "../components/features/units/Units";
import Stores from "../components/features/stores/Stores";
import Users from "../components/auth/users/Users";
import Role from "../pages/Role/Role";
import Permission from "../pages/permission/Permission";
import RolePermissionEditor from "../pages/permission/RolePermissionEditor";
import Warranty from "../components/features/inventory/warranty/Warranty";
import Logout from "../components/auth/Logout/Logout.jsx"; // adjust path if needed
import Coupons from "../components/features/Promo/Coupons.jsx";
// ... all your imports remain same
import GiftCard from "../components/features/Promo/GiftCard.jsx"
import "../i18n.js"; // Import here
import Chat from "../components/features/Chat/Chat.jsx";
// import Mail from "../components/features/Mail/mail.jsx"

// ------------------ Mail Components ------------------ //
// import MailPage from "../Pages/MailPage";
// import Inbox from "../components/EmailLayout/Inbox";
import MailPage from "../components/features/Mail/Pages/MailPage.jsx";

import Inbox from "../components/features/Mail/EmailLayout/Inbox.jsx"
import Starred from "../components/features/Mail/EmailLayout/Starred.jsx";
import Sent from "../components/features/Mail/EmailLayout/Sent.jsx";
import Drafts from "../components/features/Mail/EmailLayout/Drafts";
import Importants from "../components/features/Mail/EmailLayout/Importants.jsx";
import Spam from "../components/features/Mail/EmailLayout/Spam.jsx";
import Deleted from "../components/features/Mail/EmailLayout/Deleted.jsx";
import EmailMessages from "../components/features/Mail/EmailMessages/EmailMessages.jsx";


import ManageStock from "../components/features/stock/manageStock/ManageStock";
import StockAdujestment from "../components/features/stock/stockAdujestment/StockAdujestment";
import StockTransfer from "../components/features/stock/stockTransfer/StockTransfer";

import Purchase from "../components/features/purchase/Purchases/Purchase.jsx";
import PurchaseReturn from "../components/features/purchase/PurchaseReturn//PurchaseReturn.jsx";
import PurchaseOrder from "../components/features/purchase/PurchaseOrder/PurchaseOrder.jsx";
import PurchaseSettings from "../settings/purchase/PurchaseSettings.jsx";
import Hsn from "../components/features/inventory/hsn/Hsn.jsx";
import Warehouse from "../components/features/warehouse/Warehouse.jsx";
import RackSettings from "../settings/warehouse/RackSettings.jsx";
import SidebarSettings from "../settings/sidebar/SidebarSettings.jsx";
import Variant from "../components/features/variant/Variant.jsx";
import AdminDashboard from "../components/Dashboard/Admin/AdminDashboard.jsx";
import ThemeCustomizer from "../pages/themes/ThemeCustomizer.jsx";
import LanguageSwitcher from "../utils/LanguageSwitch/LanguageSwitcher.jsx";
import ResetPassword from "../components/auth/ResetPassword.jsx";
import Settings from "../pages/setting28-07-2025/Settings.jsx";
import UserProfiles from "../components/componentsetting28-07-2025/profile/Profile.jsx";
import Security from "../components/componentsetting28-07-2025/security/Security.jsx";
import Notification from "../components/componentsetting28-07-2025/notification/Notification.jsx";
import ConnectedApps from "../components/componentsetting28-07-2025/connectedApps/ConnectedApps.jsx";
import SystemSettings from "../components/componentsetting28-07-2025/systemsettings/SystemSettings.jsx";
import Companysettings from "../components/componentsetting28-07-2025/companySettings/Companysettings.jsx";
import Localization from "../components/componentsetting28-07-2025/localization/Localization.jsx";
import Prefixes from "../components/componentsetting28-07-2025/prefixes/Prefixes.jsx";
import Preferance from "../components/componentsetting28-07-2025/prefrance/Preferance.jsx";
import Appearance from "../components/componentsetting28-07-2025/appearance/Appearance.jsx";
import SocialAuthentications from "../components/componentsetting28-07-2025/socialAuthentication/SocialAuthentication.jsx";
import Language from "../components/componentsetting28-07-2025/language/Language.jsx";
import OtpVerification from "../components/auth/OtpVerification.jsx";

const AppRoutes = () => {
  return (

    <Routes>
      {/* Auth & 404 remain outside layout */}
      <Route path="/" element={<Login />} />
      <Route path="/login" element={<Login />} />
      <Route path="/otp" element={<OtpVerification/>} />
      <Route path="/register" element={<Register />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password/:token" element={<ResetPassword />} />
      {/* <Route path="/reset-password/:token" element={<ResetPassword />} /> */}
      <Route path="/change-password" element={<ChangePassword />} />
      <Route path="/logout" element={<Logout />} />


      <Route
        element={
          <PrivateRoute>
            <AuthLayout />
          </PrivateRoute>
        }
      >
        <Route path="/home" element={<Dashboard />} />
        <Route path="/dashboard" element={<Dashboard />} />
        {/* <Route path="/general-settings" element={<Setting />} /> */}
        {/* <Route path="/general-settings" element={<Settings />} /> */}
        <Route path="/general-settings" element={<Settings />}>
          <Route path="profile/:id" element={<UserProfiles />} />
          <Route path="security" element={<Security />} />
          <Route path="notification" element={<Notification />} />
          <Route path="connectedapps" element={<ConnectedApps />} />
          <Route path="system_settings" element={<SystemSettings />} />
          <Route path="company_settings" element={<Companysettings />} />
          <Route path="localization" element={<Localization />} />
          <Route path="prefixes" element={<Prefixes />} />
          <Route path="preferance" element={<Preferance />} />
          <Route path="appearance" element={<Appearance />} />
          <Route path="socialauth" element={<SocialAuthentications />} />
          <Route path="language" element={<Language />} />
        </Route>
        <Route path="/profile" element={<Profile />} />
        <Route path="/product" element={<Product />} />
        <Route path="/add-product" element={<ProductCreate />} />
        <Route path="/expired-products" element={<ExpriedProduct />} />
        <Route path="/category-list" element={<Category />} />
        <Route path="/sub-categories" element={<SubCategory />} />
        <Route path="/brand-list" element={<Brand />} />
        <Route path="/units" element={<Units />} />
        <Route path="/users" element={<Users />} />
        <Route path="/roles-permissions" element={<Role />} />
        <Route path="/permissions/:roleId" element={<RolePermissionEditor />} />
        <Route path="/warranty" element={<Warranty />} />
        <Route path="/countries" element={<Country />} />
        <Route path="/states" element={<State />} />
        <Route path="/cities" element={<City />} />
        <Route path="/locations" element={<LocationTable />} />
        <Route path="/store-list" element={<Stores />} />
        <Route path="/coupons" element={<Coupons />} />
        <Route path="/gift-cards" element={<GiftCard />} />
        <Route path="/chat" element={<Chat />} />
        <Route path="/variant-attributes" element={<Variant />} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/theme" element={<ThemeCustomizer />} />
        <Route path="/language" element={<LanguageSwitcher />} />


        {/* purchase */}
        <Route path="/purchase-list" element={<Purchase />} />
        <Route path="/purchase-order" element={<PurchaseOrder />} />
        <Route path="/purchase-returns" element={<PurchaseReturn />} />

        {/* stock */}
        <Route path="/manage-stocks" element={<ManageStock />} />
        <Route path="/stock-adjustment" element={<StockAdujestment />} />
        <Route path="/stock-transfer" element={<StockTransfer />} />
        <Route path="/hsn" element={<Hsn />} />
        <Route path="/warehouse" element={<Warehouse />} />

        {/* settings */}
        <Route path="/Purchase-settings" element={<PurchaseSettings />} />
        <Route path="/warehouse-settings" element={<RackSettings />} />
        <Route path="/sidebar-settings" element={<SidebarSettings />} />






        {/* ------------------ MAIL ROUTES ------------------ */}
        <Route path="/mail" element={<MailPage />}>
          <Route path="inbox" element={<Inbox />} />
          <Route path="starred" element={<Starred />} />
          <Route path="sent" element={<Sent />} />
          <Route path="drafts" element={<Drafts />} />
          <Route path="important" element={<Importants />} />
          {/* <Route path="allemails" element={<EmailMessages />} /> */}
          <Route path="spam" element={<Spam />} />
          <Route path="deleted" element={<Deleted />} />
        </Route>
      </Route>

    </Routes>
  );
};

export default AppRoutes;


