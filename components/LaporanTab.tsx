import React, { useState } from 'react';
import { LaporanData } from '../types';
import LaporanDetailModal from './LaporanDetailModal';
import LaporanFormModal from './LaporanFormModal';

interface LaporanTabProps {
    data: LaporanData[];
    onAdd: (newEntry: Omit<LaporanData, 'id'>) => void;
    onUpdate: (updatedEntry: LaporanData) => void;
    onDelete: (id: string) => void;
}

const LaporanTab: React.FC<LaporanTabProps> = ({ data, onAdd, onUpdate, onDelete }) => {
    const [isFormModalOpen, setIsFormModalOpen] = useState(false);
    const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [selectedData, setSelectedData] = useState<LaporanData | null>(null);

    const handleOpenAddModal = () => {
        setSelectedData(null);
        setIsFormModalOpen(true);
    };

    const handleOpenEditModal = (entry: LaporanData) => {
        setSelectedData(entry);
        setIsFormModalOpen(true);
    };

    const handleOpenDetailModal = (entry: LaporanData) => {
        setSelectedData(entry);
        setIsDetailModalOpen(true);
    };
    
    const handleOpenDeleteModal = (entry: LaporanData) => {
        setSelectedData(entry);
        setIsDeleteModalOpen(true);
    };

    const handleFormSubmit = (entry: Omit<LaporanData, 'id'> | LaporanData) => {
        if ('id' in entry) {
            onUpdate(entry);
        } else {
            onAdd(entry);
        }
        setIsFormModalOpen(false);
    };
    
    const handleDeleteConfirm = () => {
        if (selectedData) {
            onDelete(selectedData.id);
            setIsDeleteModalOpen(false);
            setSelectedData(null);
        }
    };

    return (
        <div className="bg-white p-4 h-full flex flex-col rounded-lg">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-gray-800">Laporan Kandidat</h2>
                <button
                    onClick={handleOpenAddModal}
                    className="bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg shadow hover:bg-blue-700 transition-colors"
                >
                    + Tambah Laporan
                </button>
            </div>
            <div className="flex-grow overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-100 sticky top-0">
                        <tr>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nama Lengkap</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Perusahaan</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Posisi</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status Kandidat</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tanggal Request</th>
                            <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Aksi</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {data.map(d => (
                            <tr key={d.id} className="hover:bg-gray-50">
                                <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{d.namaLengkap}</td>
                                <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">{d.perusahaan}</td>
                                <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">{d.posisiPekerjaan}</td>
                                <td className="px-4 py-4 whitespace-nowrap text-sm">
                                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                                        {d.statusKandidat}
                                    </span>
                                </td>
                                <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">{d.tanggalRequest}</td>
                                <td className="px-4 py-4 whitespace-nowrap text-sm text-center">
                                    <div className="flex items-center justify-center gap-2">
                                        <button onClick={() => handleOpenDetailModal(d)} className="text-blue-600 hover:text-blue-900" title="Lihat Detail"><EyeIcon/></button>
                                        <button onClick={() => handleOpenEditModal(d)} className="text-yellow-600 hover:text-yellow-900" title="Edit"><PencilIcon/></button>
                                        <button onClick={() => handleOpenDeleteModal(d)} className="text-red-600 hover:text-red-900" title="Hapus"><TrashIcon/></button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {isFormModalOpen && (
                <LaporanFormModal 
                    isOpen={isFormModalOpen}
                    onClose={() => setIsFormModalOpen(false)}
                    onSubmit={handleFormSubmit}
                    initialData={selectedData}
                />
            )}
            {isDetailModalOpen && selectedData && (
                <LaporanDetailModal 
                    data={selectedData}
                    onClose={() => setIsDetailModalOpen(false)}
                />
            )}
            {isDeleteModalOpen && selectedData && (
                <DeleteConfirmModal 
                    isOpen={isDeleteModalOpen}
                    onClose={() => setIsDeleteModalOpen(false)}
                    onConfirm={handleDeleteConfirm}
                    itemName={selectedData.namaLengkap}
                />
            )}
        </div>
    );
};

const DeleteConfirmModal: React.FC<{isOpen: boolean, onClose: () => void, onConfirm: () => void, itemName: string}> = ({ isOpen, onClose, onConfirm, itemName }) => {
    if (!isOpen) return null;
    return (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-75 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md">
                <h3 className="text-lg font-bold">Konfirmasi Hapus</h3>
                <p className="mt-2 text-sm text-gray-600">
                    Apakah Anda yakin ingin menghapus laporan untuk <span className="font-semibold">{itemName}</span>? Tindakan ini tidak dapat dibatalkan.
                </p>
                <div className="mt-6 flex justify-end gap-3">
                    <button onClick={onClose} className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300">Batal</button>
                    <button onClick={onConfirm} className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700">Hapus</button>
                </div>
            </div>
        </div>
    )
};

// --- SVG Icons --- //
const EyeIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.522 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.022 7-9.542 7-4.478 0-8.268-2.943-9.542-7z" /></svg>;
const PencilIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.5L15.232 5.232z" /></svg>;
const TrashIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>;

export default LaporanTab;
