
import React from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../hooks/useAuth';
import { CURRENCY_SYMBOL, PRIMARY_COLOR } from '../config';

const MenuIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg>;
const LogoutIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>;
// FIX: Update CreditIcon to accept and spread SVG props to allow styling.
const CreditIcon = (props: React.SVGProps<SVGSVGElement>) => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" {...props}><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v.01" /></svg>;

const Header: React.FC<{ sidebarOpen: boolean; toggleSidebar: () => void; }> = ({ sidebarOpen, toggleSidebar }) => {
    const { currentUser, logout } = useAuth();

    return (
        <motion.header
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex-shrink-0 bg-gray-900/30 backdrop-blur-lg border-b border-white/10 p-4 flex items-center justify-between shadow-lg z-10"
        >
            <button onClick={toggleSidebar} className="p-2 rounded-full hover:bg-white/10 transition-colors">
                <MenuIcon />
            </button>
            <div className="flex items-center space-x-4">
                {currentUser && (
                     <div className="hidden sm:flex items-center space-x-2 bg-white/5 px-4 py-2 rounded-full">
                        <CreditIcon style={{color: PRIMARY_COLOR}} />
                        <span className="font-semibold text-white">{currentUser.credits}</span>
                        <span className="text-gray-400">Credits</span>
                    </div>
                )}
                {currentUser && (
                    <div className="flex items-center space-x-3">
                        <div className="text-right hidden sm:block">
                            <p className="font-semibold text-white">{currentUser.name}</p>
                            <p className="text-sm text-gray-400">{currentUser.email}</p>
                        </div>
                         <button
                            onClick={logout}
                            className="flex items-center justify-center bg-gray-700 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded-full transition-all duration-300 transform hover:scale-105 shadow-md"
                        >
                            <LogoutIcon/>
                            Logout
                        </button>
                    </div>
                )}
            </div>
        </motion.header>
    );
};

export default Header;
