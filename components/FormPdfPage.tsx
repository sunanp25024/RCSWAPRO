import React, { useState, useEffect, useRef } from 'react';
import { WomJatengRefcekData } from '../types';
import { womJatengFormBlankImage } from '../assets/WomJatengFormBlankImage';
import WomJatengPreview from './WomJatengPreview';

declare const jspdf: any;

interface FormPdfPageProps {
    womJatengRefcekData: WomJatengRefcekData[];
    onAddWomJatengRefcek: (data: Omit<WomJatengRefcekData, 'id'>) => void;
    onUpdateWomJatengRefcek: (data: WomJatengRefcekData) => void;
    onDeleteWomJatengRefcek: (id: string) => void;
}

const formOptions = [
  "WOM JATENG", "WOM SULAWESI", "MAF", "MCF", "BAF", "ADIRA", 
  "SMS FINANCE", "SINARMAS", "BEKO", "OLX MOBI", "MTF JATENG-JATIM-KALSUS"
];

// --- MODAL COMPONENTS (Defined inside FormPdfPage to keep changes contained) --- //

// Form Modal for Create/Update
const WomJatengFormModal: React.FC<{
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (data: Omit<WomJatengRefcekData, 'id'> | WomJatengRefcekData) => void;
    initialData: WomJatengRefcekData | null;
}> = ({ isOpen, onClose, onSubmit, initialData }) => {
    
    const initialFormState: Omit<WomJatengRefcekData, 'id' | 'createdAt'> = {
        namaKandidat: '', posisiDilamar: '', cabangKapos: '', statusKandidat: 'New Hire Eksternal',
        pengalaman: [], namaPerusahaan: '', pemberiReferensiNama: '', pemberiReferensiJabatan: '',
        pemberiReferensiTelp: '', masaKerjaTahun: '', masaKerjaBulan: '', masalahKehadiran: 'Tepat Waktu',
        tidakMasukIzin: '0', masalahKesehatan: 'Tidak Pernah Sakit yang Berkepanjangan', masalahKesehatanDetail: '',
        relasiAtasan: 'Baik', relasiAtasanDetail: '', relasiRekan: 'Baik', relasiRekanDetail: '',
        relasiBawahan: 'Baik', relasiBawahanDetail: '', integritas: 'Tidak ada masalah Fraud', integritasDetail: '',
        performance: 'On Target', alasanResignI: 'Mengundurkan Diri Baik-Baik', alasanResignII: [],
        alasanResignIII: '', alasanResignIVPenjelasan: '', akunMedsosAlamat: '', akunMedsosStatus: [],
        akunMedsosLainnya: '', rekomendasi: 'Direkomendasikan', justifikasi: '', email: ''
    };

    const [formData, setFormData] = useState(initialData || initialFormState);

    useEffect(() => {
        setFormData(initialData || initialFormState);
    }, [initialData]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>, field: 'pengalaman' | 'alasanResignII' | 'akunMedsosStatus') => {
        const { value, checked } = e.target;
        setFormData(prev => {
            const currentValues = prev[field] || [];
            if (checked) {
                return { ...prev, [field]: [...currentValues, value] };
            } else {
                return { ...prev, [field]: currentValues.filter(item => item !== value) };
            }
        });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (initialData) {
            onSubmit({ ...formData, id: initialData.id, createdAt: initialData.createdAt });
        } else {
            onSubmit({ ...formData, createdAt: new Date().toISOString() });
        }
    };

    if (!isOpen) return null;

    const sectionTitle = (title: string) => <h4 className="text-lg font-semibold text-gray-700 mt-4 pt-4 border-t col-span-full">{title}</h4>;
    const renderInput = (name: keyof typeof formData, label: string, type: 'text' | 'date' | 'tel' | 'email' | 'number') => (
        <div>
            <label htmlFor={name} className="block text-sm font-medium text-gray-700">{label}</label>
            <input type={type} id={name} name={name} value={(formData as any)[name]} onChange={handleChange} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"/>
        </div>
    );
    const renderTextarea = (name: keyof typeof formData, label: string, span?: string) => (
        <div className={span || ''}>
            <label htmlFor={name} className="block text-sm font-medium text-gray-700">{label}</label>
            <textarea id={name} name={name} value={(formData as any)[name]} onChange={handleChange} rows={2} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"></textarea>
        </div>
    );
     const renderSelect = (name: keyof typeof formData, label: string, options: string[]) => (
        <div>
            <label htmlFor={name} className="block text-sm font-medium text-gray-700">{label}</label>
            <select id={name} name={name} value={(formData as any)[name]} onChange={handleChange} className="mt-1 block w-full px-3 py-2 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm">
               {options.map(opt => <option key={opt} value={opt}>{opt}</option>)}
            </select>
        </div>
    );
    const renderCheckboxGroup = (field: 'pengalaman' | 'alasanResignII' | 'akunMedsosStatus', label: string, options: string[]) => (
        <div className="col-span-full">
            <label className="block text-sm font-medium text-gray-700">{label}</label>
            <div className="mt-2 grid grid-cols-2 md:grid-cols-3 gap-2">
                {options.map(opt => (
                    <label key={opt} className="flex items-center gap-2">
                        <input type="checkbox" value={opt} checked={(formData[field] || []).includes(opt)} onChange={(e) => handleCheckboxChange(e, field)} className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"/>
                        <span className="text-sm text-gray-600">{opt}</span>
                    </label>
                ))}
            </div>
        </div>
    );

    return (
      <div className="fixed inset-0 bg-gray-600 bg-opacity-75 overflow-y-auto h-full w-full z-50 flex items-center justify-center p-4">
        <div className="relative mx-auto w-full max-w-5xl shadow-lg rounded-2xl bg-white">
          <form onSubmit={handleSubmit}>
            <div className="flex justify-between items-center border-b p-5">
                <h3 className="text-xl font-bold text-gray-800">{initialData ? 'Edit Formulir' : 'Buat Formulir Baru'}</h3>
                <button type="button" onClick={onClose} className="text-gray-400 hover:text-gray-600"><CloseIcon/></button>
            </div>
            <div className="p-5 max-h-[80vh] overflow-y-auto">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {sectionTitle('Informasi Kandidat')}
                  {renderInput('namaKandidat', 'Nama Kandidat', 'text')}
                  {renderInput('posisiDilamar', 'Posisi yang dilamar', 'text')}
                  {renderInput('cabangKapos', 'Cabang - Kapos', 'text')}
                  {renderSelect('statusKandidat', 'A. Status Kandidat', ['New Hire Eksternal', 'WOM to Outsourcing'])}
                  {renderCheckboxGroup('pengalaman', 'B. Pengalaman', ['Pengalaman Kerja', 'Fresh graduated, pengalaman freelance', 'Fresh graduated, pengalaman magang', 'Fresh graduated, tanpa pengalaman'])}
                  
                  {sectionTitle('Referensi & Riwayat Kerja')}
                  {renderInput('namaPerusahaan', 'C. Nama Perusahaan', 'text')}
                  {renderInput('pemberiReferensiNama', 'D. Nama Pemberi Referensi', 'text')}
                  {renderInput('pemberiReferensiJabatan', 'D. Jabatan Pereferensi', 'text')}
                  {renderInput('pemberiReferensiTelp', 'D. Nomor Telepon', 'tel')}
                  <div className="flex gap-2">
                    {renderInput('masaKerjaTahun', 'E. Masa Kerja (Tahun)', 'number')}
                    {renderInput('masaKerjaBulan', 'E. (Bulan)', 'number')}
                  </div>

                  {sectionTitle('Hasil Verifikasi')}
                  {renderSelect('masalahKehadiran', 'F. Masalah Kehadiran', ['Tepat Waktu', 'Kadang Terlambat', 'Sering Terlambat'])}
                  {renderInput('tidakMasukIzin', 'F. Tidak masuk tanpa izin (Kali)', 'number')}
                  {renderSelect('masalahKesehatan', 'G. Masalah Kesehatan', ['Pernah Sakit Berkepanjangan', 'Tidak Pernah Sakit yang Berkepanjangan'])}
                  {renderInput('masalahKesehatanDetail', 'G. Detail Sakit', 'text')}
                  <div className="col-span-full grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-2 border p-2 rounded-md">
                    <label className="block text-sm font-medium text-gray-700 col-span-full">H. Relasi dengan</label>
                    {renderSelect('relasiAtasan', 'Atasan', ['Baik', 'Tidak Baik'])}
                    {renderInput('relasiAtasanDetail', 'Detail (jika tidak baik)', 'text')}
                    {renderSelect('relasiRekan', 'Rekan Kerja', ['Baik', 'Tidak Baik'])}
                    {renderInput('relasiRekanDetail', 'Detail (jika tidak baik)', 'text')}
                    {renderSelect('relasiBawahan', 'Bawahan', ['Baik', 'Tidak Baik'])}
                    {renderInput('relasiBawahanDetail', 'Detail (jika tidak baik)', 'text')}
                  </div>
                   {renderSelect('integritas', 'I. Terkait Integritas', ['Tidak ada masalah Fraud', 'Terindikasi Fraud', 'Pelaku Fraud'])}
                  {renderInput('integritasDetail', 'I. Detail Integritas', 'text')}
                  {renderSelect('performance', 'J. Performance', ['Exceed Target', 'On Target', 'Not Achieve Target'])}

                  {sectionTitle('Alasan Resign')}
                  {renderSelect('alasanResignI', 'K. (i) Tipe Pengunduran Diri', ['Mengundurkan Diri Baik-Baik', 'Mengundurkan Diri Tidak Baik-Baik'])}
                  {renderCheckboxGroup('alasanResignII', 'K. (ii) Alasan', ['Tidak Perpanjang Kontrak', 'PHK', 'Reorganisasi', 'Unperform', 'Diputus Kontrak'])}
                  {renderInput('alasanResignIII', 'K. (iii) Lainnya', 'text')}
                  {renderTextarea('alasanResignIVPenjelasan', 'K. (iv) Penjelasan Wajib', 'col-span-full')}
                  
                  {sectionTitle('Media Sosial & Rekomendasi')}
                  {renderInput('akunMedsosAlamat', 'L. Alamat Akun Media Sosial', 'text')}
                  {renderCheckboxGroup('akunMedsosStatus', 'L. Status Akun', ['Baik - Akun tidak mengandung hal negatif', 'Konten Provokatif (Pengujar kebencian, Sara, Pornografi dsb)', 'Tata Bahasa & pengunaan kata kasar'])}
                  {renderInput('akunMedsosLainnya', 'L. Lainnya', 'text')}
                  {renderSelect('rekomendasi', 'M. Rekomendasi', ['Direkomendasikan', 'Tidak Rekomendasi'])}
                  {renderInput('email', 'Email', 'email')}
                  {renderTextarea('justifikasi', 'Justifikasi', 'col-span-full')}
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


// Preview Modal
const WomJatengPreviewModal: React.FC<{
    data: WomJatengRefcekData | null;
    onClose: () => void;
}> = ({ data, onClose }) => {
    const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);
    
    const handleGeneratePdf = async () => {
        if (!data) return;
        setIsGeneratingPdf(true);

        const { jsPDF } = jspdf;
        const doc = new jsPDF('p', 'px', 'a4');
        const width = doc.internal.pageSize.getWidth();
        const height = doc.internal.pageSize.getHeight();
        
        doc.addImage(womJatengFormBlankImage, 'PNG', 0, 0, width, height);
        
        doc.setFontSize(8);
        doc.setFont('helvetica');

        const drawCheck = (x: number, y: number) => {
            doc.setFontSize(12); doc.text('✓', x, y); doc.setFontSize(8);
        };
        const writeText = (text: string, x: number, y: number, options?: any) => {
            if(text) doc.text(text, x, y, options);
        }
        const writeWrappedText = (text: string, x: number, y: number, maxWidth: number) => {
            if (!text) return;
            const lines = doc.splitTextToSize(text, maxWidth);
            doc.text(lines, x, y);
        };

        writeText(data.namaKandidat, 46, 68);
        writeText(data.posisiDilamar, 160, 68);
        writeText(data.cabangKapos, 286, 68);
        
        if (data.statusKandidat === 'New Hire Eksternal') drawCheck(153.5, 91);
        if (data.statusKandidat === 'WOM to Outsourcing') drawCheck(258.5, 91);
        
        if (data.pengalaman.includes('Pengalaman Kerja')) drawCheck(153.5, 102);
        if (data.pengalaman.includes('Fresh graduated, pengalaman freelance')) drawCheck(258.5, 102);
        if (data.pengalaman.includes('Fresh graduated, pengalaman magang')) drawCheck(153.5, 113);
        if (data.pengalaman.includes('Fresh graduated, tanpa pengalaman')) drawCheck(258.5, 113);

        writeWrappedText(`${data.namaPerusahaan}`, 150, 127, 280);
        writeText(data.pemberiReferensiNama, 192, 155);
        writeText(data.pemberiReferensiJabatan, 192, 165);
        writeText(data.pemberiReferensiTelp, 192, 175);
        
        writeText(data.masaKerjaTahun || '0', 165, 184);
        writeText(data.masaKerjaBulan || '0', 200, 184);
        
        if (data.masalahKehadiran === 'Tepat Waktu') drawCheck(153.5, 194);
        if (data.masalahKehadiran.includes('Kadang')) drawCheck(210.5, 194);
        if (data.masalahKehadiran.includes('Sering')) drawCheck(275.5, 194);
        writeText(data.tidakMasukIzin || '0', 213, 203);
        
        if (data.masalahKesehatan.includes('Pernah Sakit')) {
            drawCheck(153.5, 214);
            writeText(data.masalahKesehatanDetail, 258, 215);
        } else {
            drawCheck(153.5, 225);
        }
        
        data.relasiAtasan === 'Baik' ? drawCheck(189.5, 236) : writeText(data.relasiAtasanDetail, 280, 236);
        data.relasiRekan === 'Baik' ? drawCheck(189.5, 247) : writeText(data.relasiRekanDetail, 280, 247);
        data.relasiBawahan === 'Baik' ? drawCheck(189.5, 258) : writeText(data.relasiBawahanDetail, 280, 258);
        
        if (data.integritas.includes('Tidak ada')) drawCheck(153.5, 269);
        if (data.integritas.includes('Terindikasi')) {
            drawCheck(153.5, 280); writeText(data.integritasDetail, 220, 280);
        }
        if (data.integritas.includes('Pelaku')) {
            drawCheck(153.5, 291); writeText(data.integritasDetail, 210, 291);
        }

        if (data.performance.includes('Exceed')) drawCheck(153.5, 302);
        if (data.performance.includes('On Target')) drawCheck(215.5, 302);
        if (data.performance.includes('Not Achieve')) drawCheck(266.5, 302);

        if (data.alasanResignI.includes('Baik-Baik')) drawCheck(158.5, 313);
        if (data.alasanResignI.includes('Tidak Baik-Baik')) drawCheck(291.5, 313);
        if (data.alasanResignII.includes('Tidak Perpanjang Kontrak')) drawCheck(158.5, 324);
        if (data.alasanResignII.includes('PHK')) drawCheck(235.5, 324);
        if (data.alasanResignII.includes('Reorganisasi')) drawCheck(262.5, 324);
        if (data.alasanResignII.includes('Unperform')) drawCheck(304.5, 324);
        if (data.alasanResignII.includes('Diputus Kontrak')) drawCheck(348.5, 324);
        if (data.alasanResignIII) {
           drawCheck(158.5, 335);
           writeText(data.alasanResignIII, 190, 335);
        }
        writeWrappedText(data.alasanResignIVPenjelasan, 170, 347, 260);
        
        writeText(data.akunMedsosAlamat, 215, 368);
        if (data.akunMedsosStatus.includes('Baik')) drawCheck(153.5, 379);
        if (data.akunMedsosStatus.includes('Konten Provokatif')) drawCheck(153.5, 390);
        if (data.akunMedsosStatus.includes('Tata Bahasa')) drawCheck(153.5, 401);
        
        if (data.rekomendasi === 'Direkomendasikan') drawCheck(164.5, 410);
        if (data.rekomendasi === 'Tidak Rekomendasi') drawCheck(236.5, 410);
        
        writeWrappedText(data.justifikasi, 46, 435, 200);
        writeText(`Email : ${data.email || ''}`, 250, 435);
        
        doc.save(`FORM_WOM_JATENG_${data.namaKandidat.replace(/\s+/g, '_')}.pdf`);
        setIsGeneratingPdf(false);
    };

    if (!data) return null;
    return (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-75 overflow-y-auto h-full w-full z-50 flex items-center justify-center p-4">
            <div className="relative mx-auto w-full max-w-4xl shadow-lg rounded-2xl bg-white" onClick={(e) => e.stopPropagation()}>
                <div className="flex justify-between items-center border-b p-5">
                    {/* Header modal dibuat minimalis sesuai permintaan */}
                    <div>
                        <h3 className="text-xl font-bold text-gray-800">{data.namaKandidat}</h3>
                        <p className="text-sm text-gray-500">{data.posisiDilamar} - {data.cabangKapos}</p>
                    </div>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600"><CloseIcon/></button>
                </div>
                <div className="p-2 md:p-6 max-h-[70vh] overflow-y-auto bg-gray-50">
                    <WomJatengPreview data={data} />
                </div>
                <div className="p-5 border-t flex justify-between items-center">
                    <button
                        onClick={handleGeneratePdf}
                        disabled={isGeneratingPdf}
                        className="bg-red-600 text-white font-semibold py-2 px-6 rounded-lg shadow hover:bg-red-700 transition-all duration-200 disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center gap-2"
                    >
                        {isGeneratingPdf ? <><SpinnerIcon /><span>Membuat...</span></> : 'Unduh PDF Sesuai Format Asli'}
                    </button>
                    <button onClick={onClose} className="bg-gray-500 text-white font-bold py-2 px-6 rounded-lg hover:bg-gray-600 transition-colors">Tutup</button>
                </div>
            </div>
        </div>
    );
};

// Delete Confirmation Modal
const DeleteConfirmModal: React.FC<{
    isOpen: boolean,
    onClose: () => void,
    onConfirm: () => void,
    itemName: string
}> = ({ isOpen, onClose, onConfirm, itemName }) => {
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
    );
};

// --- MAIN COMPONENT --- //
const FormPdfPage: React.FC<FormPdfPageProps> = (props) => {
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [selectedForm, setSelectedForm] = useState<string | null>(null);
    const dropdownRef = useRef<HTMLDivElement>(null);
    
    // State for WOM JATENG CRUD
    const [isFormModalOpen, setIsFormModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [isPreviewModalOpen, setIsPreviewModalOpen] = useState(false);
    const [selectedData, setSelectedData] = useState<WomJatengRefcekData | null>(null);

    const handleSelectForm = (form: string) => {
        setSelectedForm(form);
        setIsDropdownOpen(false);
    };

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsDropdownOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [dropdownRef]);
    
    // --- CRUD Handlers --- //
    const handleOpenAdd = () => {
        setSelectedData(null);
        setIsFormModalOpen(true);
    };
    
    const handleOpenEdit = (data: WomJatengRefcekData) => {
        setSelectedData(data);
        setIsFormModalOpen(true);
    };

    const handleOpenPreview = (data: WomJatengRefcekData) => {
        setSelectedData(data);
        setIsPreviewModalOpen(true);
    };

    const handleOpenDelete = (data: WomJatengRefcekData) => {
        setSelectedData(data);
        setIsDeleteModalOpen(true);
    };

    const handleConfirmDelete = () => {
        if (selectedData) {
            props.onDeleteWomJatengRefcek(selectedData.id);
            setIsDeleteModalOpen(false);
            setSelectedData(null);
        }
    };
    
    const handleFormSubmit = (data: Omit<WomJatengRefcekData, 'id'> | WomJatengRefcekData) => {
        if ('id' in data) {
            props.onUpdateWomJatengRefcek(data);
        } else {
            props.onAddWomJatengRefcek(data);
        }
        setIsFormModalOpen(false);
    };


    const renderWomJatengGenerator = () => (
        <div className="w-full h-full flex flex-col p-4 bg-gray-100">
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold text-gray-800">Manajemen Form - WOM JATENG</h3>
                <button
                    onClick={handleOpenAdd}
                    className="bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg shadow hover:bg-blue-700 transition-colors"
                >
                    + Buat Form Baru
                </button>
            </div>
            <div className="flex-grow overflow-auto bg-white rounded-lg shadow">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50 sticky top-0">
                        <tr>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nama Kandidat</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Posisi</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Cabang</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tanggal Dibuat</th>
                            <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Aksi</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {props.womJatengRefcekData.map(d => (
                            <tr key={d.id} className="hover:bg-gray-50">
                                <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{d.namaKandidat}</td>
                                <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">{d.posisiDilamar}</td>
                                <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">{d.cabangKapos}</td>
                                <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">{new Date(d.createdAt).toLocaleDateString('id-ID')}</td>
                                <td className="px-4 py-4 whitespace-nowrap text-sm text-center">
                                    <div className="flex items-center justify-center gap-3">
                                        <button onClick={() => handleOpenPreview(d)} className="text-blue-600 hover:text-blue-900" title="Lihat Pratinjau"><EyeIcon/></button>
                                        <button onClick={() => handleOpenEdit(d)} className="text-yellow-600 hover:text-yellow-900" title="Edit"><PencilIcon/></button>
                                        <button onClick={() => handleOpenDelete(d)} className="text-red-600 hover:text-red-900" title="Hapus"><TrashIcon/></button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                 {props.womJatengRefcekData.length === 0 && (
                    <p className="text-center text-gray-500 py-10">Belum ada data. Silakan "Buat Form Baru".</p>
                )}
            </div>
            {/* Render Modals */}
            <WomJatengFormModal 
                isOpen={isFormModalOpen}
                onClose={() => setIsFormModalOpen(false)}
                onSubmit={handleFormSubmit}
                initialData={selectedData}
            />
            <WomJatengPreviewModal 
                data={selectedData}
                onClose={() => { setIsPreviewModalOpen(false); setSelectedData(null); }}
            />
            {selectedData && <DeleteConfirmModal 
                isOpen={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                onConfirm={handleConfirmDelete}
                itemName={selectedData.namaKandidat}
            />}
        </div>
    );
    
    const renderPlaceholder = () => (
         <div className="text-center">
            {selectedForm ? (
                <>
                    <h3 className="text-2xl font-bold text-gray-800 mb-2">
                        Anda memilih: <span className="text-blue-600">{selectedForm}</span>
                    </h3>
                    <p className="text-gray-500">Generator untuk formulir ini sedang dalam pengembangan.</p>
                </>
            ) : (
                <>
                    <div className="text-5xl mb-4">📄</div>
                    <h3 className="text-2xl font-semibold text-gray-600">
                        Silakan Pilih Formulir
                    </h3>
                    <p className="text-gray-400 mt-1">Pilih salah satu formulir dari menu dropdown di atas untuk memulai.</p>
                </>
            )}
        </div>
    );

    return (
        <div className="bg-white rounded-lg shadow-md min-h-[calc(100vh-220px)] flex flex-col">
            <header className="bg-gray-800 text-white p-4 rounded-t-lg shadow-lg flex justify-between items-center z-10">
                <h2 className="text-xl font-bold">Formulir PDF</h2>
                <div className="relative" ref={dropdownRef}>
                    <button
                        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                        className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg flex items-center gap-2 transition-colors duration-200"
                    >
                        <span>{selectedForm || "Pilih Formulir PDF"}</span>
                        <svg className={`h-5 w-5 transform transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                    </button>
                    {isDropdownOpen && (
                        <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-xl z-20 py-1 border border-gray-200">
                            <ul className="max-h-60 overflow-y-auto">
                                {formOptions.map(option => (
                                    <li key={option}>
                                        <button
                                            onClick={() => handleSelectForm(option)}
                                            className="w-full text-left px-4 py-2 text-gray-800 hover:bg-blue-500 hover:text-white transition-colors duration-150"
                                        >
                                            {option}
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}
                </div>
            </header>
            <main className="flex-1 flex items-center justify-center bg-gray-50 rounded-b-lg overflow-hidden">
                {selectedForm === "WOM JATENG" ? renderWomJatengGenerator() : renderPlaceholder()}
            </main>
        </div>
    );
};

// --- SVG ICONS --- //
const SpinnerIcon = () => <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>;
const CloseIcon = () => <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>;
const EyeIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.522 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.022 7-9.542 7-4.478 0-8.268-2.943-9.542-7z" /></svg>;
const PencilIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.5L15.232 5.232z" /></svg>;
const TrashIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>;

export default FormPdfPage;