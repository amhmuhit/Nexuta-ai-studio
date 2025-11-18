
import React, { useState, ChangeEvent } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { AppSettings, CreditPackage } from '../../types';
import Card from '../../components/common/Card';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import { fileToBase64, formatCurrency } from '../../utils/helpers';
import { CURRENCY_SYMBOL } from '../../config';
import toast from 'react-hot-toast';

const WebsiteSettingsPage: React.FC = () => {
    const { settings, updateSettings } = useAuth();
    const [localSettings, setLocalSettings] = useState<AppSettings>(settings);

    const handlePaymentDetailsChange = (e: ChangeEvent<HTMLInputElement>) => {
        setLocalSettings(prev => ({
            ...prev,
            paymentDetails: {
                ...prev.paymentDetails,
                [e.target.name]: e.target.value,
            }
        }));
    };

    const handleQrCodeChange = async (e: ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            try {
                const base64 = await fileToBase64(e.target.files[0]);
                setLocalSettings(prev => ({
                    ...prev,
                    paymentDetails: { ...prev.paymentDetails, qrCodeUrl: base64 }
                }));
                 toast.success('QR Code ready to be saved.');
            } catch (error) {
                toast.error('Failed to upload QR code.');
            }
        }
    };
    
    const handlePackageChange = (id: string, field: keyof CreditPackage, value: string | number) => {
        setLocalSettings(prev => ({
            ...prev,
            creditPackages: prev.creditPackages.map(pkg => 
                pkg.id === id ? { ...pkg, [field]: value } : pkg
            )
        }));
    };
    
    const addPackage = () => {
        const newPackage: CreditPackage = {
            id: `pkg_${Date.now()}`,
            name: 'New Package',
            credits: 0,
            price: 0
        };
        setLocalSettings(prev => ({
            ...prev,
            creditPackages: [...prev.creditPackages, newPackage]
        }));
    };

    const removePackage = (id: string) => {
        setLocalSettings(prev => ({
            ...prev,
            creditPackages: prev.creditPackages.filter(pkg => pkg.id !== id)
        }));
    };

    const handleSaveChanges = () => {
        updateSettings(localSettings);
    };

    return (
        <div className="space-y-8">
            <h1 className="text-3xl font-bold">Website Configuration</h1>
            
            <Card>
                <h2 className="text-2xl font-bold mb-4">Payment Details</h2>
                <div className="space-y-4">
                    <Input label="Method Name" name="methodName" value={localSettings.paymentDetails.methodName} onChange={handlePaymentDetailsChange} />
                    <Input label="Account Number" name="accountNumber" value={localSettings.paymentDetails.accountNumber} onChange={handlePaymentDetailsChange} />
                    <div>
                        <label className="block mb-2 text-sm font-medium text-gray-300">QR Code</label>
                        <div className="flex items-center space-x-4">
                            <img src={localSettings.paymentDetails.qrCodeUrl} alt="QR Code" className="w-24 h-24 rounded-lg bg-white p-1" />
                            <Input type="file" onChange={handleQrCodeChange} accept="image/*" />
                        </div>
                    </div>
                </div>
            </Card>

            <Card>
                 <div className="flex justify-between items-center mb-4">
                    <h2 className="text-2xl font-bold">Credit Packages</h2>
                    <Button onClick={addPackage} variant="secondary">Add Package</Button>
                </div>
                <div className="space-y-4">
                    {localSettings.creditPackages.map(pkg => (
                        <div key={pkg.id} className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end bg-gray-800 p-4 rounded-lg">
                            <Input label="Package Name" value={pkg.name} onChange={(e) => handlePackageChange(pkg.id, 'name', e.target.value)} />
                            <Input label="Credits" type="number" value={pkg.credits} onChange={(e) => handlePackageChange(pkg.id, 'credits', parseInt(e.target.value, 10) || 0)} />
                            <Input label={`Price (${CURRENCY_SYMBOL})`} type="number" value={pkg.price} onChange={(e) => handlePackageChange(pkg.id, 'price', parseInt(e.target.value, 10) || 0)} />
                            <Button onClick={() => removePackage(pkg.id)} className="bg-red-600 hover:bg-red-700 h-12">Remove</Button>
                        </div>
                    ))}
                </div>
            </Card>
            
            <div className="flex justify-end">
                <Button onClick={handleSaveChanges} className="w-full md:w-auto">Save All Changes</Button>
            </div>
        </div>
    );
};

export default WebsiteSettingsPage;
