import { Navigate, Route, Routes } from "react-router-dom";


import SignUpPage from "./pages/SignUpPage";
import LoginPage from "./pages/LoginPage";
import EmailVerificationPage from "./pages/EmailVerificationPage";
import DashboardPage from "./pages/DashboardPage";
import ForgotPasswordPage from "./pages/ForgotPasswordPage";
import ResetPasswordPage from "./pages/ResetPasswordPage";

import LoadingSpinner from "./components/LoadingSpinner";

import { Toaster } from "react-hot-toast";
import { useAuthStore } from "./store/authStore";
import { useEffect } from "react";
import ProductList from "./pages/ProductListPage";
import ProductDetails from "./pages/ProductDetails";
import Navbar from "./components/Navbar";
import Aboutpage from "./pages/Aboutpage";
import ContactPage from "./pages/ContactPage";
import ProfilePage from "./pages/ProfilePage";
import AddProductPage from "./pages/AddProductPage";
import CartPage from "./pages/cartpage";


const ProtectedRoute = ({ children }) => {
	const { isAuthenticated, user } = useAuthStore();
    
	if (!isAuthenticated) {
		return <Navigate to='/login' replace />;
	}

	if (!user.isVerified) {
		return <Navigate to='/verify-email' replace />;
	}

	return children;
};


const RedirectAuthenticatedUser = ({ children }) => {
	const { isAuthenticated, user } = useAuthStore();

	if (isAuthenticated && user.isVerified) {
		return <Navigate to='/' replace />;
	}

	return children;
};

function App() {
	const { isCheckingAuth, checkAuth } = useAuthStore();

	useEffect(() => {
		checkAuth();
	}, [checkAuth]);

	if (isCheckingAuth) return <LoadingSpinner />;

	return (
		<div
			className='min-h-screen bg-gradient-to-br
    from-gray-900   flex items-center justify-center relative overflow-hidden'
		>
	

			<Routes>
				<Route
					path='/'
					element={
						  <ProtectedRoute>
							<Navbar/>
							<ProductList/>
						  </ProtectedRoute> 
					}
				/>
				<Route
					path='/product/:id'
					element={
						  <ProtectedRoute>
							<Navbar/>
							<ProductDetails/>
						  </ProtectedRoute> 
					}
				/>
				<Route
					path='/about'
					element={
						  <ProtectedRoute>
							<Navbar/>
							<Aboutpage/>
						  </ProtectedRoute> 
					}
				/>
				<Route
					path='/profile'
					element={
						  <ProtectedRoute>
							<Navbar/>
							<ProfilePage/>
						  </ProtectedRoute> 
					}
				/>
					<Route
					path='/add-product'
					element={
						  <ProtectedRoute>
							<Navbar/>
							<AddProductPage/>
						  </ProtectedRoute> 
					}
				/>
				<Route
					path='/contact'
					element={
						  <ProtectedRoute>
							<Navbar/>
							<ContactPage/>
						  </ProtectedRoute> 
					}
				/>
				<Route
					path='/Cart'
					element={
						  <ProtectedRoute>
							<Navbar/>
							<CartPage/>
						  </ProtectedRoute> 
					}
				/>
				<Route
					path='/signup'
					element={
						<RedirectAuthenticatedUser>
							<SignUpPage />
						</RedirectAuthenticatedUser>
					}
				/>
				<Route
					path='/login'
					element={
						<RedirectAuthenticatedUser>
							<LoginPage />
						</RedirectAuthenticatedUser>
					}
				/>
				<Route path='/verify-email' element={<EmailVerificationPage />} />
				<Route
					path='/forgot-password'
					element={
						<RedirectAuthenticatedUser>
							<ForgotPasswordPage />
						</RedirectAuthenticatedUser>
					}
				/>

				<Route
					path='/reset-password/:token'
					element={
						<RedirectAuthenticatedUser>
							<ResetPasswordPage />
						</RedirectAuthenticatedUser>
					}
				/>
				
				<Route path='*' element={<Navigate to='/' replace />} />
			</Routes>
			<Toaster />
		</div>
	);
}

export default App;
