import React, { useState } from 'react';
import { RefcekData, RefcekProgress, KandidatStatus } from '../types';

interface StatusRefcekTabProps {
    data: RefcekData[];
    onAdd: (newEntry: Omit<RefcekData, 'id'>) => void;
    onUpdate: (updatedEntry: RefcekData) => void;
    onDelete: (id: string) => void;
}

const progressStyles: Record<RefcekProgress, string> = {
    [RefcekProgress.BELUM_DIPROSES]: 'bg-gray-200 text-gray-800',
    [RefcekProgress.PROSES_CHECKER_1]: 'bg-blue-200 text-blue-800',
    [RefcekProgress.PROSES_CHECKER_2]: 'bg-indigo-200 text-indigo-800',
    [RefcekProgress.PROSES_CHECKER_3]: 'bg-purple-200 text-purple-800',
    [RefcekProgress.SELESAI]: 'bg-green-200 text-green-800',
    [RefcekProgress.KENDALA]: 'bg-red-200 text-red-800',
};

const statusStyles: Record<KandidatStatus, string> = {
    [KandidatStatus.REKOMENDASI]: 'bg-green-200 text-green-800',
    [KandidatStatus.TIDAK_REKOMENDASI]: 'bg-red-200 text-red-800',
    [KandidatStatus.PERTIMBANGAN_USER]: 'bg-yellow-200 text-yellow-800',
    [KandidatStatus.BLACKLIST]: 'bg-black text-white',
};

const StatusRefcekTab: React.FC<StatusRefcekTabProps> = ({ data, onAdd, onUpdate, onDelete }) => {
    const [isFormModalOpen, setIsFormModalOpen] = useState(false);
    const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [selectedData, setSelectedData] = useState<RefcekData | null>(null);

    const handleOpenAddModal = () => {
        setSelectedData(null);
        setIsFormModalOpen(true);
    };

    const handleOpenEditModal = (entry: RefcekData) => {
        setSelectedData(entry);
        setIsFormModalOpen(true);
    };

    const handleOpenDetailModal = (entry: RefcekData) => {
        setSelectedData(entry);
        setIsDetailModalOpen(true);
    };
    
    const handleOpenDeleteModal = (entry: RefcekData) => {
        setSelectedData(entry);
        setIsDeleteModalOpen(true);
    };

    const handleFormSubmit = (entry: Omit<RefcekData, 'id'> | RefcekData) => {
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
                <h2 className="text-xl font-bold text-gray-800">Status Refcek</h2>
                <button
                    onClick={handleOpenAddModal}
                    className="bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg shadow hover:bg-blue-700 transition-colors"
                >
                    + Tambah Data
                </button>
            </div>
            <div className="flex-grow overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-100 sticky top-0">
                        <tr>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nama Lengkap</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Perusahaan</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Posisi</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Progress</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status Kandidat</th>
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
                                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${progressStyles[d.progressReffcheck]}`}>
                                        {d.progressReffcheck}
                                    </span>
                                </td>
                                <td className="px-4 py-4 whitespace-nowrap text-sm">
                                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${statusStyles[d.statusKandidat]}`}>
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
                <RefcekFormModal 
                    isOpen={isFormModalOpen}
                    onClose={() => setIsFormModalOpen(false)}
                    onSubmit={handleFormSubmit}
                    initialData={selectedData}
                />
            )}
            {isDetailModalOpen && selectedData && (
                <RefcekDetailModal 
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


// --- Modals --- //

const RefcekDetailModal: React.FC<{data: RefcekData, onClose: () => void}> = ({ data, onClose }) => {
    const detailItem = (label: string, value: string | undefined) => (
        <div className="py-2 grid grid-cols-3 gap-4 border-b">
            <dt className="text-sm font-medium text-gray-500 col-span-1">{label}</dt>
            <dd className="mt-1 text-sm text-gray-900 sm:mt-0 col-span-2">{value || '-'}</dd>
        </div>
    );
    return (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-75 overflow-y-auto h-full w-full z-50 flex items-center justify-center p-4">
            <div className="relative mx-auto w-full max-w-2xl shadow-lg rounded-2xl bg-white" onClick={(e) => e.stopPropagation()}>
                <div className="flex justify-between items-center border-b p-5">
                    <h3 className="text-xl font-bold text-gray-800">Detail: {data.namaLengkap}</h3>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600"><CloseIcon/></button>
                </div>
                <div className="p-5 max-h-[70vh] overflow-y-auto">
                    <dl>
                        {detailItem('Nama Lengkap', data.namaLengkap)}
                        {detailItem('Perusahaan', data.perusahaan)}
                        {detailItem('Cabang', data.cabang)}
                        {detailItem('Posisi', data.posisiPekerjaan)}
                        {detailItem('No. Tlp/WA', data.nomorTlpAtauWA)}
                        {detailItem('BU Area', data.buArea)}
                        <h4 className="font-semibold text-gray-700 mt-4 mb-2">Progress</h4>
                        {detailItem('Tgl Email Request', data.tanggalEmailRequest)}
                        {detailItem('Jam Email Request', data.jamEmailRequestMasuk)}
                        {detailItem('Checker Ke-1', data.checker1)}
                        {detailItem('Checker Ke-2', data.checker2)}
                        {detailItem('Checker Ke-3', data.checker3)}
                        {detailItem('Tgl Hasil Dikirim', data.tanggalDikirim)}
                        {detailItem('Jam Hasil Dikirim', data.jamHasilDikirim)}
                        {detailItem('Progress Reffcheck', data.progressReffcheck)}
                        {detailItem('Status Kandidat', data.statusKandidat)}
                        <h4 className="font-semibold text-gray-700 mt-4 mb-2">Catatan</h4>
                        {detailItem('Keterangan', data.keterangan)}
                        {detailItem('Kendala (Update)', data.kendalaUpdate)}
                        {detailItem('Kendala (Report)', data.kendalaReport)}
                    </dl>
                </div>
                <div className="p-5 border-t flex justify-end">
                    <button onClick={onClose} className="bg-gray-500 text-white font-bold py-2 px-6 rounded-lg hover:bg-gray-600 transition-colors">Tutup</button>
                </div>
            </div>
        </div>
    );
};

const RefcekFormModal: React.FC<{ isOpen: boolean, onClose: () => void, onSubmit: (data: any) => void, initialData: RefcekData | null }> = ({ isOpen, onClose, onSubmit, initialData }) => {
    const [formData, setFormData] = useState<Omit<RefcekData, 'id'>>(() => {
        return initialData || {
            tanggalEmailRequest: '', jamEmailRequestMasuk: '', checker1: '', tanggalDikirim: '', jamHasilDikirim: '',
            progressReffcheck: RefcekProgress.BELUM_DIPROSES, checker2: '', checker3: '', statusKandidat: KandidatStatus.PERTIMBANGAN_USER,
            perusahaan: '', cabang: '', posisiPekerjaan: '', namaLengkap: '', nomorTlpAtauWA: '', kendalaUpdate: '',
            kendalaReport: '', keterangan: '', buArea: ''
        }
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({...prev, [name]: value}));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit(initialData ? { ...formData, id: initialData.id } : formData);
    };

    if (!isOpen) return null;

    const renderInput = (name: keyof Omit<RefcekData, 'id'>, label: string, type: 'text' | 'date' | 'time') => (
        <div>
            <label htmlFor={name} className="block text-sm font-medium text-gray-700">{label}</label>
            <input type={type} id={name} name={name} value={(formData as any)[name]} onChange={handleChange} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm text-gray-900"/>
        </div>
    );

    const renderSelect = (name: keyof Omit<RefcekData, 'id'>, label: string, options: object) => (
        <div>
            <label htmlFor={name} className="block text-sm font-medium text-gray-700">{label}</label>
            <select id={name} name={name} value={(formData as any)[name]} onChange={handleChange} className="mt-1 block w-full px-3 py-2 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm text-gray-900">
                {Object.values(options).map(opt => <option key={opt} value={opt}>{opt}</option>)}
            </select>
        </div>
    );

    return (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-75 overflow-y-auto h-full w-full z-50 flex items-center justify-center p-4">
            <div className="relative mx-auto w-full max-w-3xl shadow-lg rounded-2xl bg-white">
                <form onSubmit={handleSubmit}>
                    <div className="flex justify-between items-center border-b p-5">
                        <h3 className="text-xl font-bold text-gray-800">{initialData ? 'Edit Data' : 'Tambah Data Baru'}</h3>
                        <button type="button" onClick={onClose} className="text-gray-400 hover:text-gray-600"><CloseIcon/></button>
                    </div>
                    <div className="p-5 max-h-[70vh] overflow-y-auto space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {renderInput('namaLengkap', 'Nama Lengkap', 'text')}
                            {renderInput('perusahaan', 'Perusahaan', 'text')}
                            {renderInput('cabang', 'Cabang', 'text')}
                            {renderInput('posisiPekerjaan', 'Posisi Pekerjaan', 'text')}
                            {renderInput('nomorTlpAtauWA', 'No. Tlp/WA', 'text')}
                            {renderInput('buArea', 'BU Area', 'text')}
                        </div>
                        <hr/>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {renderInput('tanggalEmailRequest', 'Tgl Email Request', 'date')}
                            {renderInput('jamEmailRequestMasuk', 'Jam Email Request', 'time')}
                            {renderInput('checker1', 'Checker Ke-1', 'text')}
                            {renderInput('checker2', 'Checker Ke-2', 'text')}
                            {renderInput('checker3', 'Checker Ke-3', 'text')}
                            {renderSelect('progressReffcheck', 'Progress Reffcheck', RefcekProgress)}
                            {renderInput('tanggalDikirim', 'Tgl Hasil Dikirim', 'date')}
                            {renderInput('jamHasilDikirim', 'Jam Hasil Dikirim', 'time')}
                            {renderSelect('statusKandidat', 'Status Kandidat', KandidatStatus)}
                        </div>
                        <hr/>
                         <div>
                            <label htmlFor="keterangan" className="block text-sm font-medium text-gray-700">Keterangan</label>
                            <textarea id="keterangan" name="keterangan" value={formData.keterangan} onChange={handleChange} rows={2} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm text-gray-900"></textarea>
                        </div>
                        <div>
                            <label htmlFor="kendalaUpdate" className="block text-sm font-medium text-gray-700">Kendala (Update)</label>
                            <textarea id="kendalaUpdate" name="kendalaUpdate" value={formData.kendalaUpdate} onChange={handleChange} rows={2} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm text-gray-900"></textarea>
                        </div>
                        <div>
                            <label htmlFor="kendalaReport" className="block text-sm font-medium text-gray-700">Kendala (Report Bulanan)</label>
                            <textarea id="kendalaReport" name="kendalaReport" value={formData.kendalaReport} onChange={handleChange} rows={2} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm text-gray-900"></textarea>
                        </div>
                    </div>
                    <div className="p-5 border-t flex justify-end gap-2">
                        <button type="button" onClick={onClose} className="bg-gray-500 text-white font-bold py-2 px-6 rounded-lg hover:bg-gray-600 transition-colors">Batal</button>
                        <button type="submit" className="bg-blue-600 text-white font-bold py-2 px-6 rounded-lg hover:bg-blue-700 transition-colors">Simpan</button>
                    </div>
                </form>
            </div>
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
                    Apakah Anda yakin ingin menghapus data untuk <span className="font-semibold">{itemName}</span>? Tindakan ini tidak dapat dibatalkan.
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
const CloseIcon = () => <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>;

export default StatusRefcekTab;