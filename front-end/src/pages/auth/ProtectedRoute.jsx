import { Navigate } from 'react-router-dom';
const ProtectedRoute = ({ children, allowedRole }) => {
    const userRole = localStorage.getItem('userRole');
    if (!userRole || userRole !== allowedRole) return <Navigate to="/" />;
    return children;
};
export default ProtectedRoute;
