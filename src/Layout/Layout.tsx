import { ReactNode } from 'react';
import TopNavigation from '../component/nav/TopNavigation';

interface LayoutProps {
    children: ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
    return (
        <div>
            <TopNavigation />
            <div className="container mt-4">
                {children}
            </div>
        </div>
    );
}

export default Layout;
