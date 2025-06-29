import { Navigate, Outlet } from 'react-router-dom';
import appLocalStorage from '../util/appLocalStorage';
import { localKeyItem } from '../util/localKeyItem';
import { User } from '../model.ts/user';

interface ProtectedRouteProps {
    requiredRole?: string;
}

const ProtectedRoute = ({ requiredRole = 'admin' }: ProtectedRouteProps) => {
    const userInfoString: User = appLocalStorage.getItem(localKeyItem.userInfo);
    
    // Check if user is logged in
    if (!userInfoString || !userInfoString.id) {
        // Redirect to login if not authenticated
        return <Navigate to="/login" replace />;
    }
    
    // Check if user has the required role
    if (requiredRole && userInfoString.role !== requiredRole) {
        // Redirect to home page if not authorized
        return <Navigate to="/" replace />;
    }
    
    // User is authenticated and authorized, render the protected component
    return <Outlet />;
};

export default ProtectedRoute;
