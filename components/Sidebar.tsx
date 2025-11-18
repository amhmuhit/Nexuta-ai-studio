
import React from 'react';
import { NavLink } from 'react-router-dom';
// FIX: Import Variants type from framer-motion.
import { motion, Variants } from 'framer-motion';
import { APP_NAME, PRIMARY_COLOR } from '../config';
import { useAuth } from '../hooks/useAuth';

// Icons
const DashboardIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" /></svg>;
const ImageIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>;
const CreditIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" /></svg>;
const UsersIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M15 21a6 6 0 00-9-5.197m0 0A5.975 5.975 0 0112 13a5.975 5.975 0 013 5.197m0 0A7.963 7.963 0 0112 13a7.963 7.963 0 01-3-5.197" /></svg>;
const PaymentIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 8l3 5m0 0l3-5m-3 5v4m-3-5h6l-3 5-3-5z" /></svg>;
const SettingsIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>;

const userNav = [
  { name: 'Image Generator', href: '/generate', icon: <ImageIcon /> },
  { name: 'Buy Credits', href: '/buy-credits', icon: <CreditIcon /> },
];

const adminNav = [
  { name: 'Dashboard', href: '/admin/dashboard', icon: <DashboardIcon /> },
  { name: 'User Management', href: '/admin/users', icon: <UsersIcon /> },
  { name: 'Payment Queue', href: '/admin/payments', icon: <PaymentIcon /> },
  { name: 'Settings', href: '/admin/settings', icon: <SettingsIcon /> },
];

const Sidebar: React.FC<{ isOpen: boolean; setIsOpen: React.Dispatch<React.SetStateAction<boolean>> }> = ({ isOpen }) => {
    const { currentUser } = useAuth();
    const navItems = currentUser?.role === 'admin' ? [...userNav, ...adminNav] : userNav;
  
    // FIX: Explicitly type `variants` with the `Variants` type from framer-motion.
    const variants: Variants = {
        open: { width: "250px", transition: { type: "spring", stiffness: 300, damping: 30 } },
        closed: { width: "70px", transition: { type: "spring", stiffness: 300, damping: 30 } }
    };

    return (
        <motion.div
            animate={isOpen ? "open" : "closed"}
            variants={variants}
            className="relative flex-shrink-0 h-full bg-gray-900/50 backdrop-blur-lg border-r border-white/10"
        >
            <div className={`p-4 flex items-center ${isOpen ? 'justify-between' : 'justify-center'}`}>
                 {isOpen && (
                    <motion.h1 
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.2 }}
                        className="text-2xl font-bold text-white tracking-wider"
                    >
                        <span style={{color: PRIMARY_COLOR}}>{APP_NAME.split(' ')[0]}</span>
                        <span className="text-white"> {APP_NAME.split(' ')[1]}</span>
                    </motion.h1>
                 )}
            </div>
            <nav className="mt-8 px-2">
                {navItems.map((item) => (
                    <NavLink
                        key={item.name}
                        to={item.href}
                        className={({ isActive }) =>
                            `flex items-center p-3 my-2 rounded-lg text-gray-300 hover:bg-white/10 transition-colors duration-200 ${isActive ? 'bg-white/10 text-white shadow-lg' : ''} ${!isOpen ? 'justify-center' : ''}`
                        }
                        style={({ isActive }) => ({
                            color: isActive ? PRIMARY_COLOR : undefined,
                        })}
                    >
                        {item.icon}
                        {isOpen && (
                            <motion.span 
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.3 }}
                                className="ml-4 font-medium"
                            >
                                {item.name}
                            </motion.span>
                        )}
                    </NavLink>
                ))}
            </nav>
        </motion.div>
    );
};

export default Sidebar;
