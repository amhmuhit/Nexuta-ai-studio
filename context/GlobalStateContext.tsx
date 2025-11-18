
import React, { createContext, useState, useEffect, ReactNode, useCallback } from 'react';
import toast from 'react-hot-toast';
import { User, AppSettings, PaymentRequest, CreditPackage } from '../types';
import { ADMIN_EMAIL, ADMIN_PASSWORD } from '../config';

interface GlobalState {
  currentUser: User | null;
  isAuthenticated: boolean;
  users: User[];
  payments: PaymentRequest[];
  settings: AppSettings;
  login: (email: string, pass: string) => boolean;
  signup: (name: string, email: string, pass: string) => boolean;
  logout: () => void;
  addPaymentRequest: (userId: string, userEmail: string, packageId: string, trxId: string) => void;
  approvePayment: (paymentId: string) => void;
  rejectPayment: (paymentId: string) => void;
  updateUser: (updatedUser: User) => void;
  addOrRemoveCredits: (userId: string, amount: number) => void;
  updateSettings: (newSettings: AppSettings) => void;
  deductCredit: (userId: string, amount: number) => boolean;
}

export const GlobalStateContext = createContext<GlobalState | undefined>(undefined);

const initialSettings: AppSettings = {
    paymentDetails: {
      methodName: 'Bkash/Nagad',
      accountNumber: '01700000000',
      qrCodeUrl: 'https://i.ibb.co/3sS7xPZ/placeholder-qr.png'
    },
    creditPackages: [
      { id: 'pkg1', name: 'Starter Pack', credits: 100, price: 50 },
      { id: 'pkg2', name: 'Pro Pack', credits: 500, price: 200 },
      { id: 'pkg3', name: 'Premium Pack', credits: 1500, price: 500 }
    ]
};

const getInitialState = <T,>(key: string, defaultValue: T): T => {
    try {
        const item = window.localStorage.getItem(key);
        return item ? JSON.parse(item) : defaultValue;
    } catch (error) {
        console.error(`Error reading from localStorage key “${key}”:`, error);
        return defaultValue;
    }
};

export const GlobalStateProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [currentUser, setCurrentUser] = useState<User | null>(() => getInitialState('currentUser', null));
    const [users, setUsers] = useState<User[]>(() => getInitialState('users', []));
    const [payments, setPayments] = useState<PaymentRequest[]>(() => getInitialState('payments', []));
    const [settings, setSettings] = useState<AppSettings>(() => getInitialState('settings', initialSettings));

    useEffect(() => {
        try {
            window.localStorage.setItem('currentUser', JSON.stringify(currentUser));
            window.localStorage.setItem('users', JSON.stringify(users));
            window.localStorage.setItem('payments', JSON.stringify(payments));
            window.localStorage.setItem('settings', JSON.stringify(settings));
        } catch (error) {
            console.error('Error writing to localStorage:', error);
        }
    }, [currentUser, users, payments, settings]);

    const isAuthenticated = !!currentUser;

    const login = (email: string, pass: string): boolean => {
        if (email === ADMIN_EMAIL && pass === ADMIN_PASSWORD) {
            const adminUser: User = {
                id: 'admin',
                name: 'Admin',
                email: ADMIN_EMAIL,
                credits: 99999,
                role: 'admin',
                isBlocked: false,
            };
            setCurrentUser(adminUser);
            toast.success('Welcome, Admin!');
            return true;
        }

        const user = users.find(u => u.email === email);
        if (user) {
             if (user.isBlocked) {
                toast.error('Your account has been blocked.');
                return false;
            }
            setCurrentUser(user);
            toast.success(`Welcome back, ${user.name}!`);
            return true;
        }
        toast.error('Invalid credentials.');
        return false;
    };
    
    // FIX: Add `pass` parameter to match the type definition in `GlobalState`.
    const signup = (name: string, email: string, pass: string): boolean => {
        if (users.some(u => u.email === email)) {
            toast.error('An account with this email already exists.');
            return false;
        }
        const newUser: User = {
            id: `user_${Date.now()}`,
            name,
            email,
            credits: 10,
            role: 'user',
            isBlocked: false,
        };
        setUsers(prev => [...prev, newUser]);
        setCurrentUser(newUser);
        toast.success('Account created successfully! You have 10 free credits.');
        return true;
    };

    const logout = () => {
        setCurrentUser(null);
        toast('Logged out.');
    };

    const deductCredit = (userId: string, amount: number): boolean => {
        const user = users.find(u => u.id === userId);
        const adminUser = currentUser?.role === 'admin' ? currentUser : null;

        if (adminUser && adminUser.id === userId) {
            if (adminUser.credits < amount) {
                toast.error('Insufficient credits.');
                return false;
            }
            setCurrentUser({ ...adminUser, credits: adminUser.credits - amount });
            return true;
        }
        
        if (user) {
            if (user.credits < amount) {
                toast.error('Insufficient credits.');
                return false;
            }
            const updatedUsers = users.map(u => u.id === userId ? { ...u, credits: u.credits - amount } : u);
            setUsers(updatedUsers);
             if (currentUser?.id === userId) {
                setCurrentUser(updatedUsers.find(u => u.id === userId) || null);
            }
            return true;
        }
        return false;
    };
    
    const addPaymentRequest = useCallback((userId: string, userEmail: string, packageId: string, trxId: string) => {
        const pkg = settings.creditPackages.find(p => p.id === packageId);
        if (!pkg) {
            toast.error('Invalid package selected.');
            return;
        }
        const newPayment: PaymentRequest = {
            id: `payment_${Date.now()}`,
            userId,
            userEmail,
            packageId,
            packageName: pkg.name,
            trxId,
            status: 'pending',
            createdAt: new Date().toISOString()
        };
        setPayments(prev => [newPayment, ...prev]);
        toast.success('Payment request submitted for verification.');
    }, [settings.creditPackages]);

    const approvePayment = useCallback((paymentId: string) => {
        const payment = payments.find(p => p.id === paymentId);
        if (!payment) return;
        
        const pkg = settings.creditPackages.find(p => p.id === payment.packageId);
        if (!pkg) {
            toast.error("Package not found!");
            return;
        }
        
        setUsers(prev => prev.map(u => u.id === payment.userId ? { ...u, credits: u.credits + pkg.credits } : u));
        setPayments(prev => prev.map(p => p.id === paymentId ? { ...p, status: 'approved' } : p));
        toast.success(`Payment from ${payment.userEmail} approved.`);
    }, [payments, settings.creditPackages]);

    const rejectPayment = useCallback((paymentId: string) => {
        setPayments(prev => prev.map(p => p.id === paymentId ? { ...p, status: 'rejected' } : p));
        const payment = payments.find(p => p.id === paymentId);
        if (payment) {
            toast.error(`Payment from ${payment.userEmail} rejected.`);
        }
    }, [payments]);

    const updateUser = useCallback((updatedUser: User) => {
        setUsers(prev => prev.map(u => u.id === updatedUser.id ? updatedUser : u));
        toast.success('User updated successfully.');
    }, []);

    const addOrRemoveCredits = useCallback((userId: string, amount: number) => {
        setUsers(prev => prev.map(u => {
            if (u.id === userId) {
                const newCredits = Math.max(0, u.credits + amount);
                return { ...u, credits: newCredits };
            }
            return u;
        }));
        toast.success(`Credits adjusted for user.`);
    }, []);

    const updateSettings = (newSettings: AppSettings) => {
        setSettings(newSettings);
        toast.success('Settings updated successfully.');
    }

    return (
        <GlobalStateContext.Provider value={{
            currentUser,
            isAuthenticated,
            users,
            payments,
            settings,
            login,
            signup,
            logout,
            deductCredit,
            addPaymentRequest,
            approvePayment,
            rejectPayment,
            updateUser,
            addOrRemoveCredits,
            updateSettings,
        }}>
            {children}
        </GlobalStateContext.Provider>
    );
};
