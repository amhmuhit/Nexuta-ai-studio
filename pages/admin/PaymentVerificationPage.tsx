
import React from 'react';
import { useAuth } from '../../hooks/useAuth';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import { formatDate } from '../../utils/helpers';

const PaymentVerificationPage: React.FC = () => {
    const { payments, approvePayment, rejectPayment } = useAuth();

    const pendingPayments = payments.filter(p => p.status === 'pending');

    return (
        <Card>
            <h1 className="text-3xl font-bold mb-6">Payment Verification Queue</h1>
            {pendingPayments.length > 0 ? (
                 <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="border-b border-gray-700">
                            <tr>
                                <th className="p-4">User Email</th>
                                <th className="p-4">Package</th>
                                <th className="p-4">TrxID</th>
                                <th className="p-4">Date</th>
                                <th className="p-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {pendingPayments.map(payment => (
                                <tr key={payment.id} className="border-b border-gray-800 hover:bg-gray-800/50">
                                    <td className="p-4">{payment.userEmail}</td>
                                    <td className="p-4">{payment.packageName}</td>
                                    <td className="p-4 font-mono">{payment.trxId}</td>
                                    <td className="p-4">{formatDate(payment.createdAt)}</td>
                                    <td className="p-4 text-right space-x-2">
                                        <Button onClick={() => approvePayment(payment.id)} className="bg-green-600 hover:bg-green-700 py-2 px-4 text-sm">
                                            Approve
                                        </Button>
                                        <Button onClick={() => rejectPayment(payment.id)} className="bg-red-600 hover:bg-red-700 py-2 px-4 text-sm">
                                            Reject
                                        </Button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            ) : (
                <p className="text-gray-400 text-center py-8">No pending payments to verify.</p>
            )}
        </Card>
    );
};

export default PaymentVerificationPage;
