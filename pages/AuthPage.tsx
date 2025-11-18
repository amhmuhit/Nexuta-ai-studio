
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../hooks/useAuth';
import Input from '../components/common/Input';
import Button from '../components/common/Button';
import { APP_NAME, PRIMARY_COLOR } from '../config';

const AuthPage: React.FC = () => {
    const [isLogin, setIsLogin] = useState(true);
    const { login, signup } = useAuth();

    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (isLogin) {
            login(email, password);
        } else {
            // FIX: Pass password to the signup function to match its definition.
            signup(name, email, password);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-900 p-4 bg-grid-white/[0.05]">
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, type: 'spring' }}
                className="w-full max-w-md bg-gray-900/50 backdrop-blur-lg border border-white/10 rounded-2xl shadow-2xl p-8"
            >
                <h1 className="text-4xl font-bold text-center mb-2 text-white">
                     <span style={{color: PRIMARY_COLOR}}>{APP_NAME.split(' ')[0]}</span> {APP_NAME.split(' ')[1]}
                </h1>
                <p className="text-center text-gray-400 mb-8">Unleash Your Creativity</p>

                <div className="flex justify-center mb-6 bg-gray-800 rounded-full p-1">
                    <button
                        onClick={() => setIsLogin(true)}
                        className={`w-1/2 p-2 rounded-full text-sm font-semibold transition-colors ${isLogin ? 'bg-purple-600 text-white' : 'text-gray-300'}`}
                        style={{ backgroundColor: isLogin ? PRIMARY_COLOR : 'transparent' }}
                    >
                        Login
                    </button>
                    <button
                        onClick={() => setIsLogin(false)}
                        className={`w-1/2 p-2 rounded-full text-sm font-semibold transition-colors ${!isLogin ? 'bg-purple-600 text-white' : 'text-gray-300'}`}
                        style={{ backgroundColor: !isLogin ? PRIMARY_COLOR : 'transparent' }}
                    >
                        Sign Up
                    </button>
                </div>

                <form onSubmit={handleSubmit}>
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={isLogin ? 'login' : 'signup'}
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            transition={{ duration: 0.3 }}
                        >
                            {!isLogin && (
                                <div className="mb-4">
                                    <Input label="Name" id="name" type="text" value={name} onChange={(e) => setName(e.target.value)} required />
                                </div>
                            )}
                            <div className="mb-4">
                                <Input label="Email" id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                            </div>
                            <div className="mb-6">
                                <Input label="Password" id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
                                {isLogin && <p className="text-xs text-right mt-2 text-gray-400 hover:text-purple-400 cursor-pointer">Forgot Password?</p>}
                            </div>
                            <Button type="submit" className="w-full">
                                {isLogin ? 'Login' : 'Create Account'}
                            </Button>
                        </motion.div>
                    </AnimatePresence>
                </form>
            </motion.div>
        </div>
    );
};

export default AuthPage;
