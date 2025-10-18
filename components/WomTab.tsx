import React, { useState, useRef, useEffect } from 'react';
import { WomData } from '../types';
import WomDetailModal from './WomDetailModal';
import WomFormModal from './WomFormModal';

declare const jspdf: any;
declare const XLSX: any;

interface WomTabProps {
    data: WomData[];
    onAdd: (newEntry: Omit<WomData, 'id'>) => void;
    onUpdate: (updatedEntry: WomData) => void;
    onDelete: (id: string) => void;
}

// --- Export Dropdown Component --- //
const ExportDropdown: React.FC<{ onPdf: () => void; onExcel: () => void }> = ({ onPdf, onExcel }) => {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <div className="relative" ref={dropdownRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="bg-gray-600 text-white font-semibold py-2 px-4 rounded-lg shadow hover:bg-gray-700 transition-colors flex items-center gap-2"
            >
                Ekspor <svg className={`h-5 w-5 transform transition-transform ${isOpen ? 'rotate-180' : ''}`} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
            </button>
            {isOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-xl z-20 py-1 border border-gray-200">
                    <button
                        onClick={() => { onPdf(); setIsOpen(false); }}
                        className="w-full text-left px-4 py-2 text-gray-800 hover:bg-blue-500 hover:text-white flex items-center gap-2"
                    >
                        <FilePdfIcon /> Unduh sebagai PDF
                    </button>
                    <button
                        onClick={() => { onExcel(); setIsOpen(false); }}
                        className="w-full text-left px-4 py-2 text-gray-800 hover:bg-blue-500 hover:text-white flex items-center gap-2"
                    >
                        <FileExcelIcon /> Unduh sebagai Excel
                    </button>
                </div>
            )}
        </div>
    );
};


const WomTab: React.FC<WomTabProps> = ({ data, onAdd, onUpdate, onDelete }) => {
    const [isFormModalOpen, setIsFormModalOpen] = useState(false);
    const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [selectedData, setSelectedData] = useState<WomData | null>(null);

    const handleOpenAddModal = () => {
        setSelectedData(null);
        setIsFormModalOpen(true);
    };

    const handleOpenEditModal = (entry: WomData) => {
        setSelectedData(entry);
        setIsFormModalOpen(true);
    };

    const handleOpenDetailModal = (entry: WomData) => {
        setSelectedData(entry);
        setIsDetailModalOpen(true);
    };
    
    const handleOpenDeleteModal = (entry: WomData) => {
        setSelectedData(entry);
        setIsDeleteModalOpen(true);
    };

    const handleFormSubmit = (entry: Omit<WomData, 'id'> | WomData) => {
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

    // --- Export Handlers --- //
    const getFormattedDate = () => new Date().toISOString().split('T')[0];

    const handleBulkExportPDF = () => {
        const doc = new jspdf.jsPDF({ orientation: 'landscape', unit: 'pt', format: 'a1' });
        doc.text('Laporan WOM', 40, 50);
        
        const headers = Object.keys(data[0] || {}).map(key => {
            // Simple camelCase to Title Case conversion
            const result = key.replace(/([A-Z])/g, " $1");
            return result.charAt(0).toUpperCase() + result.slice(1);
        });
        const body = data.map(d => Object.values(d));

        doc.autoTable({
            head: [headers],
            body: body,
            startY: 60,
            theme: 'grid',
            headStyles: { fillColor: [22, 160, 133], fontSize: 8 },
            styles: { fontSize: 6, cellPadding: 2 },
            columnStyles: { 0: { cellWidth: 30 } },
        });

        doc.save(`laporan_wom_all_${getFormattedDate()}.pdf`);
    };

    const handleBulkExportExcel = () => {
        const ws = XLSX.utils.json_to_sheet(data);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, 'Laporan WOM');
        XLSX.writeFile(wb, `laporan_wom_all_${getFormattedDate()}.xlsx`);
    };

    return (
        <div className="bg-white p-4 h-full flex flex-col rounded-lg">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-gray-800">WOM - Laporan Verifikasi</h2>
                <div className="flex items-center gap-2">
                    <ExportDropdown onPdf={handleBulkExportPDF} onExcel={handleBulkExportExcel} />
                    <button
                        onClick={handleOpenAddModal}
                        className="bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg shadow hover:bg-blue-700 transition-colors"
                    >
                        + Tambah Data WOM
                    </button>
                </div>
            </div>
            <div className="flex-grow overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-100 sticky top-0">
                        <tr>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nama Pelamar</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Posisi Dilamar</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Perusahaan</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tgl Reff Check</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status Kandidat</th>
                            <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Aksi</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {data.map(d => (
                            <tr key={d.id} className="hover:bg-gray-50">
                                <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{d.namaPelamar}</td>
                                <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">{d.posisiDilamar}</td>
                                <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">{d.namaPerusahaan}</td>
                                <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">{d.tanggalReffCheck}</td>
                                <td className="px-4 py-4 whitespace-nowrap text-sm">
                                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${d.statusKandidat === 'Rekomendasi' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                                        {d.statusKandidat}
                                    </span>
                                </td>
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
                <WomFormModal 
                    isOpen={isFormModalOpen}
                    onClose={() => setIsFormModalOpen(false)}
                    onSubmit={handleFormSubmit}
                    initialData={selectedData}
                />
            )}
            {isDetailModalOpen && selectedData && (
                <WomDetailModal 
                    data={selectedData}
                    onClose={() => setIsDetailModalOpen(false)}
                />
            )}
            {isDeleteModalOpen && selectedData && (
                <DeleteConfirmModal 
                    isOpen={isDeleteModalOpen}
                    onClose={() => setIsDeleteModalOpen(false)}
                    onConfirm={handleDeleteConfirm}
                    itemName={selectedData.namaPelamar}
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
                    Apakah Anda yakin ingin menghapus data WOM untuk <span className="font-semibold">{itemName}</span>? Tindakan ini tidak dapat dibatalkan.
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
const FilePdfIcon = () => <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>;
const FileExcelIcon = () => <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3M4 17v2a2 2 0 002 2h12a2 2 0 002-2v-2M4 7l8-4 8 4M4 7v10h16V7L12 3 4 7z" /></svg>;

export default WomTab;