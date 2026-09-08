import { Routes, Route } from "react-router-dom";

import Home from "../pages/home/Home";
import Login from "../pages/auth/Login";
import Register from "../pages/auth/Register";
import Properties from "../pages/properties/Properties";
import Rent from "../pages/properties/Rent";
import Buy from "../pages/properties/Buy";
import Agents from "../pages/properties/Agents";
import PropertyDetails from "../pages/properties/PropertyDetails";
import Dashboard from "../pages/dashboard/Dashboard";
import Bookings from "../pages/dashboard/Bookings";
import ProtectedRoute from "./ProtectedRoute";
import AddProperty from "../pages/properties/AddProperty";
import MyProperties from "../pages/dashboard/MyProperties";
import Payments from "../pages/dashboard/Payments";
import Analytics from "../pages/dashboard/Analytics";
import Favourites from "../pages/dashboard/Favourites";
import Notifications from "../pages/dashboard/Notifications";
import Profile from "../pages/dashboard/Profile";
import Subscriptions from "../pages/dashboard/Subscriptions";
import Settings from "../pages/dashboard/Settings";
import ForgotPassword from "../pages/auth/ForgotPassword";
import VerifyOTP from "../pages/auth/VerifyOTP";
import ResetPassword from "../pages/auth/ResetPassword";
import VerifyPhoneOTP from "../pages/auth/VerifyPhoneOTP";
import VerifyEmail from "../pages/auth/VerifyEmail";
import AgentProfile from "../pages/properties/AgentProfile";
import EditProperty from "../pages/properties/EditProperty";
import Verification from "../pages/dashboard/Verification";
import MyBookings from "../pages/dashboard/MyBookings";
import ManageBookings from "../pages/dashboard/ManageBookings";
import Chat from "../pages/dashboard/Chat";
import ServicesMarketplace from "../pages/services/ServicesMarketplace";
import ServiceDetails from "../pages/services/ServiceDetails";
import MyServiceRequests from "../pages/services/MyServiceRequests";
import ServiceProviderDashboard from "../pages/services/ServiceProviderDashboard";
import ServiceReview from "../pages/services/ServiceReview";
import ServiceProviderProfile from "../pages/services/ServiceProviderProfile";
import ProviderDashboard from "../pages/services/ProviderDashboard";
import AddService from "../pages/services/AddService";
import RequestService from "../pages/services/RequestService";
import ProviderRequests from "../pages/services/ProviderRequests";
import SavedSearches from "../pages/SavedSearches";
import MyRentals from "../pages/tenant/MyRentals";
import RentPaymentModal from "../pages/tenant/RentPaymentModal";
import PaymentHistory from "../pages/tenant/PaymentHistory";
import LeaseDetails from "../pages/tenant/LeaseDetails";
import RentalPassport from "../pages/dashboard/RentalPassport";
import { useAuth } from "../context/AuthContext";

function BookingsByRole() {
    const { user } = useAuth();
    const role = user?.role?.toUpperCase();

    return role === "LANDLORD" || role === "AGENT"
        ? <ManageBookings />
        : <MyBookings />;
}

function AppRoutes() {

    return (
        <Routes>
            {/* Public pages */}
            <Route 
                path="/" 
                element={<Home />} 
            />

            <Route 
                path="/login" 
                element={<Login />} 
            />

            <Route 
                path="/register" 
                element={<Register />} 
            />

            {/* Property pages */}
            <Route 
                path="/properties" 
                element={<Properties />} 
            />

            <Route
                path="/properties/rent"
                element={<Rent />}
            />

            <Route
                path="/properties/buy"
                element={<Buy />}
            />

            <Route
                path="/properties/agents"
                element={<Agents />}
            />

            <Route
                path="/rent"
                element={<Rent />}
            />

            <Route
                path="/buy"
                element={<Buy />}
            />

            <Route
                path="/agents"
                element={<Agents />}
            />

            <Route
                path="/properties/:id"
                element={<PropertyDetails />}
            />

            <Route
                path="/properties/:id/edit"
                element={
                    <ProtectedRoute roles={["LANDLORD", "AGENT"]}>
                        <EditProperty />
                    </ProtectedRoute>
                }
            />

            {/* User dashboards */}
            <Route 
                path="/dashboard" 
                element={
                    <ProtectedRoute>
                        <Dashboard />
                    </ProtectedRoute>
                } 
            />

            <Route
                path="/properties/add"
                element={
                    <ProtectedRoute roles={["LANDLORD", "AGENT"]}>
                        <AddProperty />
                    </ProtectedRoute>
                }
            />

            <Route
                path="/dashboard/my-properties"
                element={
                    <ProtectedRoute roles={["LANDLORD", "AGENT"]}>
                        <MyProperties />
                    </ProtectedRoute>
                }
            />

            <Route
                path="/dashboard/bookings"
                element={
                    <ProtectedRoute>
                        <BookingsByRole />
                    </ProtectedRoute>
                }
            />

            <Route
                path="/dashboard/payments"
                element={
                    <ProtectedRoute roles={["LANDLORD", "AGENT"]}>
                        <Payments />
                    </ProtectedRoute>
                }
            />

            <Route
                path="/dashboard/analytics"
                element={
                    <ProtectedRoute roles={["LANDLORD", "AGENT"]}>
                        <Analytics />
                    </ProtectedRoute>
                }
            />

            <Route
                path="/dashboard/favourites"
                element={
                    <ProtectedRoute>
                        <Favourites />
                    </ProtectedRoute>
                }
            />

            <Route
                path="/dashboard/notifications"
                element={
                    <ProtectedRoute>
                        <Notifications />
                    </ProtectedRoute>
                }
            />

            <Route
                path="/dashboard/profile"
                element={
                    <ProtectedRoute>
                        <Profile />
                    </ProtectedRoute>
                }
            />

            <Route
                path="/dashboard/rental-passport"
                element={
                    <ProtectedRoute roles={["TENANT"]}>
                        <RentalPassport />
                    </ProtectedRoute>
                }
            />

            <Route
                path="/dashboard/settings"
                element={
                    <ProtectedRoute>
                        <Settings />
                    </ProtectedRoute>
                }
            />

            <Route
                path="/dashboard/subscriptions"
                element={
                    <ProtectedRoute roles={["LANDLORD", "AGENT"]}>
                        <Subscriptions />
                    </ProtectedRoute>
                }
            />

            <Route
                path="/forgot-password"
                element={<ForgotPassword />}
            />

            <Route
                path="/verify-otp"
                element={<VerifyOTP />}
            />

            <Route
                path="/reset-password"
                element={<ResetPassword />}
            />

            <Route
                path="/verify-phone"
                element={<VerifyPhoneOTP />}
            />

            <Route
                path="/verify-email/:token"
                element={<VerifyEmail />}
            />

            <Route
                path="/agents/:id"
                element={<AgentProfile />}
            />

            <Route
                path="/dashboard/verification"
                element={
                    <ProtectedRoute>
                        <Verification/>
                    </ProtectedRoute>
                }
            />

            <Route
                path="/dashboard/chat"
                element={
                    <ProtectedRoute>
                        <Chat />
                    </ProtectedRoute>
                }
            />

            <Route
                path="/dashboard/manage-bookings"
                element={
                    <ProtectedRoute roles={["LANDLORD", "AGENT"]}>
                        <ManageBookings />
                    </ProtectedRoute>
                }
            />

            <Route
                path="/services"
                element={<ServicesMarketplace />}
            />

            <Route
                path="/services/:id"
                element={<ServiceDetails />}
            />

            <Route
                path="/services/requests"
                element={<MyServiceRequests />}
            />

            <Route
                path="/services/providers"
                element={<ServiceProviderDashboard />}
            />

            <Route
                path="/services/review"
                element={<ServiceReview />}
            />

            <Route
                path="/services/providers/:id"
                element={<ServiceProviderProfile />}
            />

            <Route
                path="/services/provider/dashboard"
                element={<ProviderDashboard />}
            />

            <Route
                path="/services/provider/listings/new"
                element={<AddService />}
            />

            <Route
                path="/services/:id/request"
                element={<RequestService />}
            />

            <Route
                path="/services/provider/requests"
                element={<ProviderRequests />}
            />

            <Route
                path="/saved-searches"
                element={<SavedSearches />}
            />

            <Route
                path="/tenant/my-rentals"
                element={
                    <ProtectedRoute roles={["TENANT"]}>
                        <MyRentals />
                    </ProtectedRoute>
                }
            />

            <Route
                path="/tenant/rentals"
                element={
                    <ProtectedRoute roles={["TENANT"]}>
                        <MyRentals />
                    </ProtectedRoute>
                }
            />

            <Route
                path="/rentals"
                element={
                    <ProtectedRoute roles={["TENANT"]}>
                        <MyRentals />
                    </ProtectedRoute>
                }
            />

            <Route
                path="/rentals/:leaseId"
                element={
                    <ProtectedRoute roles={["TENANT"]}>
                        <LeaseDetails />
                    </ProtectedRoute>
                }
            />

            <Route
                path="/rentals/:leaseId/pay"
                element={
                    <ProtectedRoute roles={["TENANT"]}>
                        <RentPaymentModal />
                    </ProtectedRoute>
                }
            />

            <Route
                path="/rentals/:leaseId/payments"
                element={
                    <ProtectedRoute roles={["TENANT"]}>
                        <PaymentHistory />
                    </ProtectedRoute>
                }
            />

        </Routes>
    );
}

export default AppRoutes;