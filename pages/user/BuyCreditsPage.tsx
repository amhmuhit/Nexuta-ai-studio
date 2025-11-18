
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../../hooks/useAuth';
import { CreditPackage } from '../../types';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Modal from '../../components/common/Modal';
import Input from '../../components/common/Input';
import { CURRENCY_SYMBOL } from '../../config';
import { formatCurrency } from '../../utils/helpers';

const BuyCreditsPage: React.FC = () => {
    const { settings, addPaymentRequest, currentUser } = useAuth();
    const [isModalOpen, setModalOpen] = useState(false);
    const [selectedPackage, setSelectedPackage] = useState<CreditPackage | null>(null);
    const [trxId, setTrxId] = useState('');

    const handleBuyClick = (pkg: CreditPackage) => {
        setSelectedPackage(pkg);
        setModalOpen(true);
    };

    const handleModalClose = () => {
        setModalOpen(false);
        setSelectedPackage(null);
        setTrxId('');
    };
    
    const handleSubmitPayment = () => {
        if (!trxId || !selectedPackage || !currentUser) return;
        addPaymentRequest(currentUser.id, currentUser.email, selectedPackage.id, trxId);
        handleModalClose();
    };

    return (
        <div>
            <h1 className="text-3xl font-bold mb-2">Buy Credits</h1>
            <p className="text-gray-400 mb-8">Choose a package that suits your needs. More credits, more creativity!</p>

            <motion.div 
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
                initial="hidden"
                animate="visible"
                variants={{
                    visible: { transition: { staggerChildren: 0.1 } }
                }}
            >
                {settings.creditPackages.map((pkg) => (
                    <motion.div key={pkg.id} variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}>
                        <Card className="flex flex-col h-full text-center">
                            <h2 className="text-2xl font-semibold text-purple-400 mb-2">{pkg.name}</h2>
                            <p className="text-5xl font-bold mb-4">{pkg.credits}</p>
                            <p className="text-gray-400 mb-6">Credits</p>
                            <div className="my-auto"></div>
                            <p className="text-3xl font-semibold mb-6">{formatCurrency(pkg.price, CURRENCY_SYMBOL)}</p>
                            <Button onClick={() => handleBuyClick(pkg)} className="w-full mt-auto">
                                Buy Now
                            </Button>
                        </Card>
                    </motion.div>
                ))}
            </motion.div>

            {selectedPackage && (
                <Modal isOpen={isModalOpen} onClose={handleModalClose} title={`Purchase: ${selectedPackage.name}`}>
                    <div className="space-y-4">
                        <p className="text-gray-300">Please send <span className="font-bold text-white">{formatCurrency(selectedPackage.price, CURRENCY_SYMBOL)}</span> to the following account and enter the Transaction ID below.</p>
                        <div className="bg-gray-800 p-4 rounded-lg text-center">
                            <p className="text-lg font-medium">{settings.paymentDetails.methodName}</p>
                            <p className="text-2xl font-bold text-purple-400 my-2">{settings.paymentDetails.accountNumber}</p>
                            {settings.paymentDetails.qrCodeUrl && (
                                <img src={settings.paymentDetails.qrCodeUrl} alt="Payment QR Code" className="mx-auto my-4 h-40 w-40 rounded-lg" />
                            )}
                        </div>
                        <Input 
                            label="Transaction ID (TrxID)"
                            id="trxId"
                            value={trxId}
                            onChange={(e) => setTrxId(e.target.value)}
                            placeholder="Enter your transaction ID here"
                        />
                         <Button onClick={handleSubmitPayment} disabled={!trxId} className="w-full">
                            Submit for Verification
                        </Button>
                    </div>
                </Modal>
            )}
        </div>
    );
};

export default BuyCreditsPage;
