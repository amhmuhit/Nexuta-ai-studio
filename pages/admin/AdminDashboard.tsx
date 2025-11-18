
import React from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../../hooks/useAuth';
import Card from '../../components/common/Card';
import { CURRENCY_SYMBOL } from '../../config';

const StatCard: React.FC<{ title: string; value: string | number; icon: React.ReactNode }> = ({ title, value, icon }) => (
    <Card className="flex items-center p-6">
        <div className="p-4 bg-purple-600/20 rounded-full mr-4 text-purple-400">
            {icon}
        </div>
        <div>
            <p className="text-sm text-gray-400">{title}</p>
            <p className="text-3xl font-bold text-white">{value}</p>
        </div>
    </Card>
);

const UsersIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M15 21a6 6 0 00-9-5.197m0 0A5.975 5.975 0 0112 13a5.975 5.975 0 013 5.197m0 0A7.963 7.963 0 0112 13a7.963 7.963 0 01-3-5.197" /></svg>;
const ClockIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>;
const MoneyIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" /></svg>;

const AdminDashboard: React.FC = () => {
    const { users, payments, settings } = useAuth();

    const totalUsers = users.length;
    const pendingApprovals = payments.filter(p => p.status === 'pending').length;
    
    const sessionRevenue = payments
        .filter(p => p.status === 'approved')
        .reduce((total, p) => {
            const pkg = settings.creditPackages.find(cp => cp.id === p.packageId);
            return total + (pkg?.price || 0);
        }, 0);

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
            }
        }
    };

    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: { y: 0, opacity: 1 }
    };

    return (
        <div>
            <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>
            <motion.div 
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
            >
                <motion.div variants={itemVariants}>
                    <StatCard title="Total Session Users" value={totalUsers} icon={<UsersIcon />} />
                </motion.div>
                <motion.div variants={itemVariants}>
                    <StatCard title="Pending Approvals" value={pendingApprovals} icon={<ClockIcon />} />
                </motion.div>
                <motion.div variants={itemVariants}>
                    <StatCard title="Session Revenue" value={`${CURRENCY_SYMBOL}${sessionRevenue}`} icon={<MoneyIcon />} />
                </motion.div>
            </motion.div>
        </div>
    );
};

export default AdminDashboard;
