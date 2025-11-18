
import React, { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { User } from '../../types';
import Card from '../../components/common/Card';
import Modal from '../../components/common/Modal';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';

const UserManagementPage: React.FC = () => {
    const { users, updateUser, addOrRemoveCredits } = useAuth();
    const [isModalOpen, setModalOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState<User | null>(null);
    const [creditAmount, setCreditAmount] = useState<number>(0);

    const handleToggleBlock = (user: User) => {
        updateUser({ ...user, isBlocked: !user.isBlocked });
    };

    const openCreditModal = (user: User) => {
        setSelectedUser(user);
        setCreditAmount(0);
        setModalOpen(true);
    };

    const handleCreditChange = () => {
        if (selectedUser && creditAmount !== 0) {
            addOrRemoveCredits(selectedUser.id, creditAmount);
        }
        setModalOpen(false);
        setSelectedUser(null);
    };

    return (
        <Card>
            <h1 className="text-3xl font-bold mb-6">User Management</h1>
            <div className="overflow-x-auto">
                <table className="w-full text-left">
                    <thead className="border-b border-gray-700">
                        <tr>
                            <th className="p-4">Email</th>
                            <th className="p-4">Credits</th>
                            <th className="p-4">Status</th>
                            <th className="p-4 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map(user => (
                            <tr key={user.id} className="border-b border-gray-800 hover:bg-gray-800/50">
                                <td className="p-4">{user.email}</td>
                                <td className="p-4">{user.credits}</td>
                                <td className="p-4">
                                    <span className={`px-2 py-1 text-xs rounded-full ${user.isBlocked ? 'bg-red-500/20 text-red-400' : 'bg-green-500/20 text-green-400'}`}>
                                        {user.isBlocked ? 'Blocked' : 'Active'}
                                    </span>
                                </td>
                                <td className="p-4 text-right space-x-2">
                                    <Button onClick={() => openCreditModal(user)} variant="secondary" className="py-2 px-4 text-sm">
                                        +/- Credits
                                    </Button>
                                    <Button onClick={() => handleToggleBlock(user)} className={`py-2 px-4 text-sm ${user.isBlocked ? 'bg-green-600 hover:bg-green-700' : 'bg-red-600 hover:bg-red-700'}`}>
                                        {user.isBlocked ? 'Unblock' : 'Block'}
                                    </Button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {selectedUser && (
                <Modal isOpen={isModalOpen} onClose={() => setModalOpen(false)} title={`Adjust Credits for ${selectedUser.name}`}>
                    <div className="space-y-4">
                        <p>Current Credits: <span className="font-bold">{selectedUser.credits}</span></p>
                        <Input
                            label="Amount to Add/Remove"
                            id="creditAmount"
                            type="number"
                            value={creditAmount}
                            onChange={(e) => setCreditAmount(parseInt(e.target.value, 10) || 0)}
                            placeholder="e.g., 100 or -50"
                        />
                        <Button onClick={handleCreditChange} className="w-full">
                            Confirm Change
                        </Button>
                    </div>
                </Modal>
            )}
        </Card>
    );
};

export default UserManagementPage;
