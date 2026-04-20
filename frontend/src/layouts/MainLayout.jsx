import { Outlet } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const MainLayout = () => {
    return (
        <div className="min-h-screen flex flex-col bg-white overflow-x-hidden">
            <div className="relative">
                <Navbar />
            </div>
            <main className="flex-grow">
                <Outlet />
            </main>
            <Footer />
        </div>
    );
};

export default MainLayout;

