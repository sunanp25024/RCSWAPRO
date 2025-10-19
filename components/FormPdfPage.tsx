import React, { useState, useEffect, useRef } from 'react';
import { WomJatengRefcekData, WomSulawesiRefcekData, MafRefcekData, McfRefcekData, AdiraRefcekData } from '../types';
import { SIGNATORIES, WOM_JATENG_REKOMENDASI_BY, WOM_JATENG_DIPERIKSA_OLEH, WOM_JATENG_DIKETAHUI_OLEH, WOM_SULAWESI_REKOMENDASI_BY, WOM_SULAWESI_DIPERIKSA_OLEH, WOM_SULAWESI_DIKETAHUI_OLEH, MAF_REKOMENDASI_BY, MAF_DIPERIKSA_OLEH, MAF_DIKETAHUI_OLEH, MCF_REKOMENDASI_BY, MCF_DIPERIKSA_OLEH, MCF_DIKETAHUI_OLEH, ADIRA_REKOMENDASI_BY, ADIRA_DIPERIKSA_OLEH, ADIRA_DIKETAHUI_OLEH } from '../constants';
import WomJatengPreview from './WomJatengPreview';
import WomSulawesiPreview from './WomSulawesiPreview';
import MafPreview from './MafPreview';
import McfPreview from './McfPreview';
import AdiraPreview from './AdiraPreview';

declare const jspdf: any;

interface FormPdfPageProps {
    womJatengRefcekData: WomJatengRefcekData[];
    onAddWomJatengRefcek: (data: Omit<WomJatengRefcekData, 'id'>) => void;
    onUpdateWomJatengRefcek: (data: WomJatengRefcekData) => void;
    onDeleteWomJatengRefcek: (id: string) => void;
    womSulawesiRefcekData: WomSulawesiRefcekData[];
    onAddWomSulawesiRefcek: (data: Omit<WomSulawesiRefcekData, 'id'>) => void;
    onUpdateWomSulawesiRefcek: (data: WomSulawesiRefcekData) => void;
    onDeleteWomSulawesiRefcek: (id: string) => void;
    mafRefcekData: MafRefcekData[];
    onAddMafRefcek: (data: Omit<MafRefcekData, 'id'>) => void;
    onUpdateMafRefcek: (data: MafRefcekData) => void;
    onDeleteMafRefcek: (id: string) => void;
    mcfRefcekData: McfRefcekData[];
    onAddMcfRefcek: (data: Omit<McfRefcekData, 'id'>) => void;
    onUpdateMcfRefcek: (data: McfRefcekData) => void;
    onDeleteMcfRefcek: (id: string) => void;
    adiraRefcekData: AdiraRefcekData[];
    onAddAdiraRefcek: (data: Omit<AdiraRefcekData, 'id'>) => void;
    onUpdateAdiraRefcek: (data: AdiraRefcekData) => void;
    onDeleteAdiraRefcek: (id: string) => void;
}

const formOptions = [
  "WOM JATENG", "WOM SULAWESI", "MAF", "MCF", "ADIRA", "BAF", 
  "SMS FINANCE", "SINARMAS", "BEKO", "OLX MOBI", "MTF JATENG-JATIM-KALSUS"
];

// --- MODAL COMPONENTS (Defined inside FormPdfPage to keep changes contained) --- //

// Form Modal for WOM JATENG
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
        akunMedsosLainnya: '', rekomendasi: 'Direkomendasikan', justifikasi: '', email: '', 
        direkomendasikanOleh: WOM_JATENG_REKOMENDASI_BY[0],
        diperiksaOleh: WOM_JATENG_DIPERIKSA_OLEH,
        diketahuiOleh: WOM_JATENG_DIKETAHUI_OLEH,
    };

    const [formData, setFormData] = useState(initialData || initialFormState);

    useEffect(() => {
        setFormData(initialData ? 
            { ...initialFormState, ...initialData } : 
            initialFormState
        );
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
        const dataToSubmit = {
            ...formData,
            diperiksaOleh: WOM_JATENG_DIPERIKSA_OLEH,
            diketahuiOleh: WOM_JATENG_DIKETAHUI_OLEH,
        };

        if (initialData) {
            onSubmit({ ...dataToSubmit, id: initialData.id, createdAt: initialData.createdAt });
        } else {
            onSubmit({ ...dataToSubmit, createdAt: new Date().toISOString() });
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
    const renderStaticField = (label: string, value: string) => (
        <div>
            <label className="block text-sm font-medium text-gray-700">{label}</label>
            <p className="mt-1 block w-full px-3 py-2 border border-gray-200 bg-gray-50 rounded-md shadow-sm sm:text-sm text-gray-500">{value}</p>
        </div>
    );

    return (
      <div className="fixed inset-0 bg-gray-600 bg-opacity-75 overflow-y-auto h-full w-full z-50 flex items-center justify-center p-4">
        <div className="relative mx-auto w-full max-w-5xl shadow-lg rounded-2xl bg-white">
          <form onSubmit={handleSubmit}>
            <div className="flex justify-between items-center border-b p-5">
                <h3 className="text-xl font-bold text-gray-800">{initialData ? 'Edit Formulir WOM JATENG' : 'Buat Formulir Baru WOM JATENG'}</h3>
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
                  
                  {sectionTitle('Media Sosial, Rekomendasi & Tanda Tangan')}
                  {renderInput('akunMedsosAlamat', 'L. Alamat Akun Media Sosial', 'text')}
                  {renderCheckboxGroup('akunMedsosStatus', 'L. Status Akun', ['Baik - Akun tidak mengandung hal negatif', 'Konten Provokatif (Pengujar kebencian, Sara, Pornografi dsb)', 'Tata Bahasa & pengunaan kata kasar'])}
                  {renderInput('akunMedsosLainnya', 'L. Lainnya', 'text')}
                  {renderSelect('rekomendasi', 'M. Rekomendasi', ['Direkomendasikan', 'Tidak Rekomendasi'])}
                  {renderInput('email', 'Email', 'email')}
                  {renderSelect('direkomendasikanOleh', 'Di Rekomendasikan Oleh', WOM_JATENG_REKOMENDASI_BY)}
                  {renderStaticField('Diperiksa Oleh', WOM_JATENG_DIPERIKSA_OLEH)}
                  {renderStaticField('Diketahui Oleh', WOM_JATENG_DIKETAHUI_OLEH)}
                  
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

// Preview Modal for WOM JATENG
const WomJatengPreviewModal: React.FC<{
    data: WomJatengRefcekData | null;
    onClose: () => void;
}> = ({ data, onClose }) => {
    const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);
    
    const handleGeneratePdf = async () => {
        if (!data) return;
        setIsGeneratingPdf(true);
    
        try {
            const { jsPDF } = jspdf;
            const doc = new jsPDF('p', 'pt', 'a4'); 
            const pageWidth = doc.internal.pageSize.getWidth();
            const pageHeight = doc.internal.pageSize.getHeight();
            const margin = 40;
            const contentWidth = pageWidth - margin * 2;
            let y = 0;
    
            // --- Standard Design System ---
            const PRIMARY_COLOR = '#1E3A8A';
            const TEXT_COLOR = '#1f2937';
            const LIGHT_TEXT_COLOR = '#6b7280';
            const BORDER_COLOR = '#d1d5db';
            const FOOTER_BG_COLOR = '#1E3A8A';
            const FOOTER_TEXT_COLOR = '#e0e7ff';
            const LINE_HEIGHT_SM = 10;
            const LINE_HEIGHT_MD = 12;
    
            doc.setFont('helvetica');
    
            const drawSectionTitle = (title: string) => {
                if (y > pageHeight - 150) { doc.addPage(); y = margin; }
                y += 8;
                doc.setFontSize(8); doc.setFont('helvetica', 'bold'); doc.setTextColor(PRIMARY_COLOR);
                doc.text(title.toUpperCase(), margin, y);
                y += 2;
                doc.setDrawColor(BORDER_COLOR); doc.line(margin, y, pageWidth - margin, y);
                y += LINE_HEIGHT_MD;
            };
            
            const drawPair = (label: string, value: string | undefined | null, options: { fullWidth?: boolean } = {}) => {
                if (!value || !value.trim()) return;
                if (y > pageHeight - 150) { doc.addPage(); y = margin; }
                doc.setFontSize(8); doc.setFont('helvetica', 'bold'); doc.setTextColor(LIGHT_TEXT_COLOR);
                doc.text(label, margin, y);
    
                doc.setFontSize(9); doc.setFont('helvetica', 'normal'); doc.setTextColor(TEXT_COLOR);
    
                const valueXPos = options.fullWidth ? margin : 150;
                const maxWidth = options.fullWidth ? contentWidth : contentWidth - (valueXPos - margin);
                const lines = doc.splitTextToSize(value, maxWidth);
                
                if (options.fullWidth) y += LINE_HEIGHT_SM;
                doc.text(lines, valueXPos, y);
                y += (lines.length * LINE_HEIGHT_SM) + 2;
            };
    
            const drawCheckbox = (label: string, checked: boolean, x: number, currentY: number) => {
                doc.setFontSize(10); doc.setFont('helvetica', 'bold'); doc.setTextColor(PRIMARY_COLOR);
                doc.text(checked ? '☑' : '☐', x, currentY, { baseline: 'middle' });
                doc.setFontSize(8); doc.setFont('helvetica', 'normal'); doc.setTextColor(checked ? TEXT_COLOR : LIGHT_TEXT_COLOR);
                doc.text(label, x + 15, currentY, { baseline: 'middle' });
                return currentY + LINE_HEIGHT_MD;
            };
            
            // --- PDF Content ---
            doc.setFillColor(PRIMARY_COLOR); doc.rect(0, 0, pageWidth, 45, 'F');
            doc.setFont('helvetica', 'bold'); doc.setFontSize(18); doc.setTextColor('#FFFFFF');
            doc.text('REFERENCE CHECK FORM', pageWidth / 2, 30, { align: 'center' });
            
            y = 70;
            doc.setFontSize(14); doc.setFont('helvetica', 'bold'); doc.setTextColor(TEXT_COLOR);
            doc.text(data.namaKandidat.toUpperCase(), pageWidth / 2, y, { align: 'center' });
            y += LINE_HEIGHT_MD * 1.2;
            doc.setFontSize(10); doc.setFont('helvetica', 'normal'); doc.setTextColor(LIGHT_TEXT_COLOR);
            doc.text(`${data.posisiDilamar} - ${data.cabangKapos}`, pageWidth / 2, y, { align: 'center' });
            y += LINE_HEIGHT_MD;
            
            drawSectionTitle('A. Status Kandidat & B. Pengalaman');
            let checkY = y;
            let col1Y = checkY, col2Y = checkY;
            const col2X = margin + contentWidth / 2;
    
            doc.setFontSize(8); doc.setFont('helvetica', 'bold'); doc.setTextColor(LIGHT_TEXT_COLOR);
            doc.text("Status Kandidat", margin, col1Y); col1Y += LINE_HEIGHT_SM;
            col1Y = drawCheckbox('New Hire Eksternal', data.statusKandidat === 'New Hire Eksternal', margin, col1Y);
            col1Y = drawCheckbox('WOM to Outsourcing', data.statusKandidat === 'WOM to Outsourcing', margin, col1Y);
    
            doc.setFontSize(8); doc.setFont('helvetica', 'bold'); doc.setTextColor(LIGHT_TEXT_COLOR);
            doc.text("Pengalaman", col2X, col2Y); col2Y += LINE_HEIGHT_SM;
            col2Y = drawCheckbox('Pengalaman Kerja', data.pengalaman.includes('Pengalaman Kerja'), col2X, col2Y);
            col2Y = drawCheckbox('Fresh graduated, freelance', data.pengalaman.includes('Fresh graduated, pengalaman freelance'), col2X, col2Y);
            col2Y = drawCheckbox('Fresh graduated, magang', data.pengalaman.includes('Fresh graduated, pengalaman magang'), col2X, col2Y);
            col2Y = drawCheckbox('Fresh graduated, tanpa pengalaman', data.pengalaman.includes('Fresh graduated, tanpa pengalaman'), col2X, col2Y);
            y = Math.max(col1Y, col2Y);
    
            drawSectionTitle('C, D, E. Riwayat & Referensi');
            drawPair('Nama Perusahaan (C)', data.namaPerusahaan);
            drawPair('Nama Pereferensi (D)', data.pemberiReferensiNama);
            drawPair('Jabatan Pereferensi (D)', data.pemberiReferensiJabatan);
            drawPair('Nomor Telp. (D)', data.pemberiReferensiTelp);
            drawPair('Masa Kerja (E)', `${data.masaKerjaTahun || '0'} Tahun, ${data.masaKerjaBulan || '0'} Bulan`);
            
            drawSectionTitle('F, G, H, I, J. Hasil Verifikasi');
            drawPair('Kehadiran (F)', `${data.masalahKehadiran} (Tak masuk: ${data.tidakMasukIzin} kali)`);
            drawPair('Kesehatan (G)', `${data.masalahKesehatan}${data.masalahKesehatanDetail ? `: ${data.masalahKesehatanDetail}` : ''}`);
            drawPair('Relasi Atasan (H)', `${data.relasiAtasan}${data.relasiAtasanDetail ? `: ${data.relasiAtasanDetail}` : ''}`);
            drawPair('Relasi Rekan (H)', `${data.relasiRekan}${data.relasiRekanDetail ? `: ${data.relasiRekanDetail}` : ''}`);
            drawPair('Relasi Bawahan (H)', `${data.relasiBawahan}${data.relasiBawahanDetail ? `: ${data.relasiBawahanDetail}` : ''}`);
            drawPair('Integritas (I)', `${data.integritas}${data.integritasDetail ? `: ${data.integritasDetail}` : ''}`);
            drawPair('Performance (J)', data.performance);
            
            drawSectionTitle('K. Alasan Resign');
            drawPair('(i) Tipe', data.alasanResignI);
            drawPair('(ii) Kategori', data.alasanResignII.join(', ') || '-');
            drawPair('(iii) Lainnya', data.alasanResignIII);
            drawPair('(iv) Penjelasan Wajib', data.alasanResignIVPenjelasan, { fullWidth: true });
            
            drawSectionTitle('L, M. Media Sosial & Rekomendasi');
            drawPair('Alamat Akun (L)', data.akunMedsosAlamat);
            drawPair('Status Akun (L)', `${data.akunMedsosStatus.join(', ')}${data.akunMedsosLainnya ? ` | Lainnya: ${data.akunMedsosLainnya}` : ''}`, { fullWidth: true });
            drawPair('Rekomendasi (M)', data.rekomendasi);
            drawPair('Email', data.email);
            drawPair('Justifikasi', data.justifikasi, { fullWidth: true });
            
            // --- Signature Block ---
            const footerHeight = 70, signatureHeight = 70;
            let sigY = pageHeight - footerHeight - signatureHeight;
            if (y > sigY - 20) { doc.addPage(); y = margin; }
            sigY = pageHeight - footerHeight - signatureHeight;

            const direkomendasikanOleh = SIGNATORIES.find(s => s.name === data.direkomendasikanOleh);
            const diperiksaOleh = SIGNATORIES.find(s => s.name === data.diperiksaOleh);
            const diketahuiOleh = SIGNATORIES.find(s => s.name === data.diketahuiOleh);
            
            doc.setDrawColor(BORDER_COLOR); doc.line(margin, sigY - 10, pageWidth - margin, sigY - 10);
            
            const sigWidth = contentWidth / 3;
            doc.setFontSize(8); doc.setTextColor(TEXT_COLOR);
            doc.text('Di Rekomendasikan Oleh,', margin + (sigWidth * 0.5), sigY, { align: 'center' });
            doc.text('Diperiksa Oleh,', margin + (sigWidth * 1.5), sigY, { align: 'center' });
            doc.text('Diketahui Oleh,', margin + (sigWidth * 2.5), sigY, { align: 'center' });
            
            const imageHeight = 30;
            const imageBaseY = sigY + 5;

            const addSignatureImage = (sigData: {name: string, image: string} | undefined, colIndex: number) => {
                if (sigData && sigData.image) {
                    try {
                        const imgProps = doc.getImageProperties(sigData.image);
                        const imgWidth = (imageHeight * imgProps.width) / imgProps.height;
                        const xPos = margin + (sigWidth * (colIndex + 0.5)) - (imgWidth / 2);
                        doc.addImage(sigData.image, 'PNG', xPos, imageBaseY, imgWidth, imageHeight);
                    } catch (e) { console.error("Could not add signature image for " + sigData.name, e); }
                }
            };
            
            addSignatureImage(direkomendasikanOleh, 0); addSignatureImage(diperiksaOleh, 1); addSignatureImage(diketahuiOleh, 2);

            const textY = imageBaseY + imageHeight + 10;
            doc.setFont('helvetica', 'bold');
            doc.text(`( ${direkomendasikanOleh?.name || '...'} )`, margin + (sigWidth * 0.5), textY, { align: 'center' });
            doc.text(`( ${diperiksaOleh?.name || '...'} )`, margin + (sigWidth * 1.5), textY, { align: 'center' });
            doc.text(`( ${diketahuiOleh?.name || '...'} )`, margin + (sigWidth * 2.5), textY, { align: 'center' });
    
            // --- Footer ---
            doc.setFillColor(FOOTER_BG_COLOR); doc.rect(0, pageHeight - footerHeight, pageWidth, footerHeight, 'F');
    
            let footerY = pageHeight - footerHeight + 12;
            doc.setFontSize(7); doc.setTextColor(FOOTER_TEXT_COLOR);
            const footerNotes = [
                'Pada Point (D): Pemberi referensi WAJIB hrd & atau atasan langsung. Data diri pemberi referensi harus lengkap.',
                'Pada point (F): Kadang terlambat = 1 bulan maksimal 3x. Sering Terlambat = 1 bulan > 3x.',
                'Pada point (K): Ceklist salah satu pada kategori (i), boleh ceklist lebih dari satu pada kategori (ii), dan WAJIB mengisi detail resign pada kategori (iv).',
                'Justifikasi: Penjelasan kenapa kandidat ini tetap ingin dilanjutkan prosesnya, padahal point (L) Tidak direkomendasikan.'
            ];
            
            footerNotes.forEach(note => {
                const splitNote = doc.splitTextToSize(note, contentWidth);
                doc.text(splitNote, margin, footerY);
                footerY += (splitNote.length * 8) + 1;
            });
    
            doc.save(`FORM_WOM_JATENG_${data.namaKandidat.replace(/\s+/g, '_')}.pdf`);
        } catch (error) {
            console.error("Failed to generate PDF:", error);
            alert("Gagal membuat PDF. Silakan coba lagi.");
        } finally {
            setIsGeneratingPdf(false);
        }
    };

    if (!data) return null;
    return (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-75 overflow-y-auto h-full w-full z-50 flex items-center justify-center p-4">
            <div className="relative mx-auto w-full max-w-4xl shadow-lg rounded-2xl bg-white" onClick={(e) => e.stopPropagation()}>
                <div className="flex justify-between items-center border-b p-5">
                     <div>
                        <h3 className="text-xl font-bold text-gray-800">Pratinjau: {data.namaKandidat}</h3>
                        <p className="text-sm text-gray-500">{data.posisiDilamar} - {data.cabangKapos}</p>
                    </div>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600"><CloseIcon/></button>
                </div>
                <div className="p-2 md:p-4 max-h-[70vh] overflow-y-auto bg-gray-100">
                    <div className="w-full">
                      <WomJatengPreview data={data} />
                    </div>
                </div>
                <div className="p-5 border-t flex justify-between items-center">
                    <button
                        onClick={handleGeneratePdf}
                        disabled={isGeneratingPdf}
                        className="bg-indigo-700 text-white font-semibold py-2 px-6 rounded-lg shadow hover:bg-indigo-800 transition-all duration-200 disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center gap-2"
                    >
                        {isGeneratingPdf ? <><SpinnerIcon /><span>Membuat PDF...</span></> : 'Unduh PDF'}
                    </button>
                    <button onClick={onClose} className="bg-gray-500 text-white font-bold py-2 px-6 rounded-lg hover:bg-gray-600 transition-colors">Tutup</button>
                </div>
            </div>
        </div>
    );
};

// --- START: MODALS FOR WOM SULAWESI --- //

const WomSulawesiFormModal: React.FC<{
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (data: Omit<WomSulawesiRefcekData, 'id'> | WomSulawesiRefcekData) => void;
    initialData: WomSulawesiRefcekData | null;
}> = ({ isOpen, onClose, onSubmit, initialData }) => {
    
    const initialFormState: Omit<WomSulawesiRefcekData, 'id' | 'createdAt'> = {
        namaKandidat: '', posisiDilamar: '', cabangKapos: '', statusKandidat: 'New Hire Eksternal',
        pengalaman: 'Pengalaman Kerja', namaPerusahaan: '', pemberiReferensiNama: '', pemberiReferensiJabatan: '',
        pemberiReferensiTelp: '', masaKerjaTahun: '', masaKerjaBulan: '', masalahKehadiran: 'Tepat Waktu',
        tidakMasukIzin: '0', masalahKesehatan: 'Tidak Pernah Sakit yang Berkepanjangan', masalahKesehatanDetail: '',
        relasiAtasan: 'Baik', relasiAtasanDetail: '', relasiRekan: 'Baik', relasiRekanDetail: '',
        relasiBawahan: 'Baik', relasiBawahanDetail: '', integritas: 'Tidak ada masalah Fraud', integritasDetail: '',
        performance: 'On Target', alasanResignI: 'Mengundurkan Diri Baik-Baik', alasanResignII: [],
        alasanResignIII: '', alasanResignIVPenjelasan: '', akunMedsosAlamat: '', akunMedsosStatus: [],
        akunMedsosLainnya: '', kelebihanKandidat: '', kekuranganKandidat: '', rekomendasi: 'Direkomendasikan', 
        justifikasi: '', email: '', 
        direkomendasikanOleh: WOM_SULAWESI_REKOMENDASI_BY[0],
        diperiksaOleh: WOM_SULAWESI_DIPERIKSA_OLEH,
        diketahuiOleh: WOM_SULAWESI_DIKETAHUI_OLEH,
    };

    const [formData, setFormData] = useState(initialData || initialFormState);

    useEffect(() => {
        setFormData(initialData ? { ...initialFormState, ...initialData } : initialFormState);
    }, [initialData]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };
    
    const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>, field: 'alasanResignII' | 'akunMedsosStatus') => {
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
        const dataToSubmit = {
            ...formData,
            diperiksaOleh: WOM_SULAWESI_DIPERIKSA_OLEH,
            diketahuiOleh: WOM_SULAWESI_DIKETAHUI_OLEH,
        };
        if (initialData) {
            onSubmit({ ...dataToSubmit, id: initialData.id, createdAt: initialData.createdAt });
        } else {
            onSubmit({ ...dataToSubmit, createdAt: new Date().toISOString() });
        }
    };

    if (!isOpen) return null;

    const sectionTitle = (title: string) => <h4 className="text-lg font-semibold text-gray-700 mt-4 pt-4 border-t col-span-full">{title}</h4>;
    const renderInput = (name: keyof typeof formData, label: string, type: 'text' | 'tel' | 'email' | 'number') => (
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
    const renderRadioGroup = (field: keyof typeof formData, label: string, options: string[]) => (
        <div className="col-span-full">
            <label className="block text-sm font-medium text-gray-700">{label}</label>
            <div className="mt-2 flex flex-wrap gap-x-4 gap-y-2">
                {options.map(opt => (
                    <label key={opt} className="flex items-center gap-2">
                        <input type="radio" name={field} value={opt} checked={(formData as any)[field] === opt} onChange={handleChange} className="h-4 w-4 border-gray-300 text-blue-600 focus:ring-blue-500"/>
                        <span className="text-sm text-gray-600">{opt}</span>
                    </label>
                ))}
            </div>
        </div>
    );
     const renderCheckboxGroup = (field: 'alasanResignII' | 'akunMedsosStatus', label: string, options: string[]) => (
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
    const renderStaticField = (label: string, value: string) => (
        <div>
            <label className="block text-sm font-medium text-gray-700">{label}</label>
            <p className="mt-1 block w-full px-3 py-2 border border-gray-200 bg-gray-50 rounded-md shadow-sm sm:text-sm text-gray-500">{value}</p>
        </div>
    );

    return (
      <div className="fixed inset-0 bg-gray-600 bg-opacity-75 overflow-y-auto h-full w-full z-50 flex items-center justify-center p-4">
        <div className="relative mx-auto w-full max-w-5xl shadow-lg rounded-2xl bg-white">
          <form onSubmit={handleSubmit}>
            <div className="flex justify-between items-center border-b p-5">
                <h3 className="text-xl font-bold text-gray-800">{initialData ? 'Edit Formulir WOM SULAWESI' : 'Buat Formulir Baru WOM SULAWESI'}</h3>
                <button type="button" onClick={onClose} className="text-gray-400 hover:text-gray-600"><CloseIcon/></button>
            </div>
            <div className="p-5 max-h-[80vh] overflow-y-auto">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {sectionTitle('Informasi Kandidat')}
                  {renderInput('namaKandidat', 'Nama Kandidat', 'text')}
                  {renderInput('posisiDilamar', 'Posisi yang dilamar', 'text')}
                  {renderInput('cabangKapos', 'Cabang - Kapos', 'text')}
                  {renderRadioGroup('statusKandidat', 'A. Status Kandidat', ['New Hire Eksternal', 'WOM to Outsourcing'])}
                  {renderRadioGroup('pengalaman', 'B. Pengalaman', ['Pengalaman Kerja', 'Fresh graduated, pengalaman freelance', 'Fresh graduated, pengalaman magang', 'Fresh graduated, tanpa pengalaman'])}

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
                  {renderRadioGroup('masalahKehadiran', 'F. Masalah Kehadiran', ['Tepat Waktu', 'Kadang Terlambat', 'Sering Terlambat'])}
                  {renderInput('tidakMasukIzin', 'F. Tidak masuk tanpa izin (Kali)', 'number')}
                  {renderRadioGroup('masalahKesehatan', 'G. Masalah Kesehatan', ['Pernah Sakit Berkepanjangan', 'Tidak Pernah Sakit yang Berkepanjangan'])}
                  {renderInput('masalahKesehatanDetail', 'G. Detail Sakit', 'text')}
                  <div className="col-span-full grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-2 border p-2 rounded-md">
                    <label className="block text-sm font-medium text-gray-700 col-span-full">H. Relasi dengan</label>
                    {renderRadioGroup('relasiAtasan', 'Atasan', ['Baik', 'Tidak Baik'])}
                    {renderInput('relasiAtasanDetail', 'Detail (jika tidak baik)', 'text')}
                    {renderRadioGroup('relasiRekan', 'Rekan Kerja', ['Baik', 'Tidak Baik'])}
                    {renderInput('relasiRekanDetail', 'Detail (jika tidak baik)', 'text')}
                    {renderRadioGroup('relasiBawahan', 'Bawahan', ['Baik', 'Tidak Baik'])}
                    {renderInput('relasiBawahanDetail', 'Detail (jika tidak baik)', 'text')}
                  </div>
                  {renderRadioGroup('integritas', 'I. Terkait Integritas', ['Tidak ada masalah Fraud', 'Terindikasi Fraud', 'Pelaku Fraud'])}
                  {renderInput('integritasDetail', 'I. Detail Integritas', 'text')}
                  {renderRadioGroup('performance', 'J. Performance', ['Exceed Target', 'On Target', 'Not Achieve Target'])}

                  {sectionTitle('Alasan Resign')}
                  {renderRadioGroup('alasanResignI', 'K. (i) Tipe Pengunduran Diri', ['Mengundurkan Diri Baik-Baik', 'Mengundurkan Diri Tidak Baik-Baik'])}
                  {renderCheckboxGroup('alasanResignII', 'K. (ii) Alasan', ['Tidak Perpanjang Kontrak', 'PHK', 'Reorganisasi', 'Unperform', 'Diputus Kontrak'])}
                  {renderInput('alasanResignIII', 'K. (iii) Lainnya', 'text')}
                  {renderTextarea('alasanResignIVPenjelasan', 'K. (iv) Penjelasan Wajib', 'col-span-full')}
                  
                  {sectionTitle('Media Sosial & Evaluasi')}
                  {renderInput('akunMedsosAlamat', 'L. Alamat Akun Media Sosial', 'text')}
                  {renderCheckboxGroup('akunMedsosStatus', 'L. Status Akun', ['Baik - Akun tidak mengandung hal negatif', 'Konten Provokatif (Pengujar kebencian, Sara, Pornografi dsb)', 'Tata Bahasa & pengunaan kata kasar'])}
                  {renderInput('akunMedsosLainnya', 'L. Lainnya', 'text')}
                  {renderTextarea('kelebihanKandidat', 'M. Kelebihan Kandidat', 'col-span-full')}
                  {renderTextarea('kekuranganKandidat', 'N. Kekurangan Kandidat', 'col-span-full')}
                  {renderRadioGroup('rekomendasi', 'O. Rekomendasi', ['Direkomendasikan', 'Tidak Rekomendasi'])}

                  {sectionTitle('Tanda Tangan & Justifikasi')}
                  {renderSelect('direkomendasikanOleh', 'Di Rekomendasikan Oleh', WOM_SULAWESI_REKOMENDASI_BY)}
                  {renderStaticField('Diperiksa Oleh', WOM_SULAWESI_DIPERIKSA_OLEH)}
                  {renderStaticField('Diketahui Oleh', WOM_SULAWESI_DIKETAHUI_OLEH)}
                  {renderInput('email', 'EMAIL', 'email')}
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

const WomSulawesiPreviewModal: React.FC<{
    data: WomSulawesiRefcekData | null;
    onClose: () => void;
}> = ({ data, onClose }) => {
    const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);
    
    const handleGeneratePdf = async () => {
        if (!data) return;
        setIsGeneratingPdf(true);
    
        try {
            const { jsPDF } = jspdf;
            const doc = new jsPDF('p', 'pt', 'a4'); 
            const pageWidth = doc.internal.pageSize.getWidth();
            const pageHeight = doc.internal.pageSize.getHeight();
            const margin = 40;
            const contentWidth = pageWidth - margin * 2;
            let y = 0;
    
            // --- Standard Design System ---
            const PRIMARY_COLOR = '#1E3A8A';
            const TEXT_COLOR = '#1f2937';
            const LIGHT_TEXT_COLOR = '#6b7280';
            const BORDER_COLOR = '#d1d5db';
            const FOOTER_BG_COLOR = '#1E3A8A';
            const FOOTER_TEXT_COLOR = '#e0e7ff';
            const LINE_HEIGHT_SM = 10;
            const LINE_HEIGHT_MD = 12;
    
            doc.setFont('helvetica');
    
            const drawSectionTitle = (title: string) => {
                if (y > pageHeight - 150) { doc.addPage(); y = margin; }
                y += 8;
                doc.setFontSize(8); doc.setFont('helvetica', 'bold'); doc.setTextColor(PRIMARY_COLOR);
                doc.text(title.toUpperCase(), margin, y);
                y += 2;
                doc.setDrawColor(BORDER_COLOR); doc.line(margin, y, pageWidth - margin, y);
                y += LINE_HEIGHT_MD;
            };
            
            const drawPair = (label: string, value: string | undefined | null, options: { fullWidth?: boolean } = {}) => {
                if (!value || !value.trim()) return;
                if (y > pageHeight - 150) { doc.addPage(); y = margin; }
                doc.setFontSize(8); doc.setFont('helvetica', 'bold'); doc.setTextColor(LIGHT_TEXT_COLOR);
                doc.text(label, margin, y);
    
                doc.setFontSize(9); doc.setFont('helvetica', 'normal'); doc.setTextColor(TEXT_COLOR);
    
                const valueXPos = options.fullWidth ? margin : 150;
                const maxWidth = options.fullWidth ? contentWidth : contentWidth - (valueXPos - margin);
                const lines = doc.splitTextToSize(value, maxWidth);
                
                if (options.fullWidth) y += LINE_HEIGHT_SM;
                doc.text(lines, valueXPos, y);
                y += (lines.length * LINE_HEIGHT_SM) + 2;
            };
    
            const drawRadio = (label: string, checked: boolean, currentY: number) => {
                doc.setFontSize(10); doc.setFont('helvetica', 'bold'); doc.setTextColor(PRIMARY_COLOR);
                doc.text(checked ? '◉' : '○', margin, currentY, { baseline: 'middle' });
                doc.setFontSize(8); doc.setFont('helvetica', 'normal'); doc.setTextColor(checked ? TEXT_COLOR : LIGHT_TEXT_COLOR);
                doc.text(label, margin + 15, currentY, { baseline: 'middle' });
                return currentY + LINE_HEIGHT_MD;
            };
            
            // --- PDF Content ---
            doc.setFillColor(PRIMARY_COLOR); doc.rect(0, 0, pageWidth, 45, 'F');
            doc.setFont('helvetica', 'bold'); doc.setFontSize(18); doc.setTextColor('#FFFFFF');
            doc.text('REFERENCE CHECK FORM', pageWidth / 2, 30, { align: 'center' });
            
            y = 70;
            doc.setFontSize(14); doc.setFont('helvetica', 'bold'); doc.setTextColor(TEXT_COLOR);
            doc.text(data.namaKandidat.toUpperCase(), pageWidth / 2, y, { align: 'center' });
            y += LINE_HEIGHT_MD * 1.2;
            doc.setFontSize(10); doc.setFont('helvetica', 'normal'); doc.setTextColor(LIGHT_TEXT_COLOR);
            doc.text(`${data.posisiDilamar} - ${data.cabangKapos}`, pageWidth / 2, y, { align: 'center' });
            y += LINE_HEIGHT_MD;
            
            drawSectionTitle('A. Status Kandidat');
            y = drawRadio('New Hire Eksternal', data.statusKandidat === 'New Hire Eksternal', y);
            y = drawRadio('WOM to Outsourcing', data.statusKandidat === 'WOM to Outsourcing', y);

            drawSectionTitle('B. Pengalaman');
            y = drawRadio('Pengalaman Kerja', data.pengalaman === 'Pengalaman Kerja', y);
            y = drawRadio('Fresh graduated, pengalaman freelance', data.pengalaman === 'Fresh graduated, pengalaman freelance', y);
            y = drawRadio('Fresh graduated, pengalaman magang', data.pengalaman === 'Fresh graduated, pengalaman magang', y);
            y = drawRadio('Fresh graduated, tanpa pengalaman', data.pengalaman === 'Fresh graduated, tanpa pengalaman', y);
    
            drawSectionTitle('C, D, E. Riwayat & Referensi');
            drawPair('Nama Perusahaan (C)', data.namaPerusahaan);
            drawPair('Nama Pemberi Referensi (D)', data.pemberiReferensiNama);
            drawPair('Jabatan Pereferensi (D)', data.pemberiReferensiJabatan);
            drawPair('Nomor Telp. (D)', data.pemberiReferensiTelp);
            drawPair('Masa Kerja (E)', `${data.masaKerjaTahun || '0'} Tahun, ${data.masaKerjaBulan || '0'} Bulan`);
            
            drawSectionTitle('F, G, H, I, J. Hasil Verifikasi');
            drawPair('Kehadiran (F)', `${data.masalahKehadiran} (Tak masuk: ${data.tidakMasukIzin} kali)`);
            drawPair('Kesehatan (G)', `${data.masalahKesehatan}${data.masalahKesehatanDetail ? `: ${data.masalahKesehatanDetail}` : ''}`);
            drawPair('Relasi Atasan (H)', `${data.relasiAtasan}${data.relasiAtasanDetail ? `: ${data.relasiAtasanDetail}` : ''}`);
            drawPair('Relasi Rekan (H)', `${data.relasiRekan}${data.relasiRekanDetail ? `: ${data.relasiRekanDetail}` : ''}`);
            drawPair('Relasi Bawahan (H)', `${data.relasiBawahan}${data.relasiBawahanDetail ? `: ${data.relasiBawahanDetail}` : ''}`);
            drawPair('Integritas (I)', `${data.integritas}${data.integritasDetail ? `: ${data.integritasDetail}` : ''}`);
            drawPair('Performance (J)', data.performance);
            
            if (y > pageHeight - 250) { doc.addPage(); y = margin; }

            drawSectionTitle('K. Alasan Resign');
            drawPair('(i) Tipe', data.alasanResignI);
            drawPair('(ii) Kategori', data.alasanResignII.join(', ') || '-');
            drawPair('(iii) Lainnya', data.alasanResignIII);
            drawPair('(iv) Penjelasan Wajib', data.alasanResignIVPenjelasan, { fullWidth: true });
            
            drawSectionTitle('L. Akun Media Sosial');
            drawPair('Alamat Akun', data.akunMedsosAlamat);
            drawPair('Status Akun', `${data.akunMedsosStatus.join(', ')}${data.akunMedsosLainnya ? ` | Lainnya: ${data.akunMedsosLainnya}` : ''}`, { fullWidth: true });
            
            drawSectionTitle('M, N, O. Evaluasi & Rekomendasi');
            drawPair('Kelebihan Kandidat (M)', data.kelebihanKandidat, {fullWidth: true});
            drawPair('Kekurangan Kandidat (N)', data.kekuranganKandidat, {fullWidth: true});
            drawPair('Rekomendasi (O)', data.rekomendasi);
            drawPair('EMAIL', data.email);
            drawPair('Justifikasi', data.justifikasi, { fullWidth: true });
            
            // --- Signature Block ---
            const footerHeight = 85, signatureHeight = 70;
            let sigY = pageHeight - footerHeight - signatureHeight;
            if (y > sigY - 20) { doc.addPage(); sigY = margin; } else { y = sigY; }


            const direkomendasikanOleh = SIGNATORIES.find(s => s.name === data.direkomendasikanOleh);
            const diperiksaOleh = SIGNATORIES.find(s => s.name === data.diperiksaOleh);
            const diketahuiOleh = SIGNATORIES.find(s => s.name === data.diketahuiOleh);
            
            doc.setDrawColor(BORDER_COLOR); doc.line(margin, y - 10, pageWidth - margin, y - 10);
            
            const sigWidth = contentWidth / 3;
            doc.setFontSize(8); doc.setTextColor(TEXT_COLOR);
            doc.text('Di Rekomendasikan Oleh,', margin + (sigWidth * 0.5), y, { align: 'center' });
            doc.text('Diperiksa Oleh,', margin + (sigWidth * 1.5), y, { align: 'center' });
            doc.text('Diketahui Oleh,', margin + (sigWidth * 2.5), y, { align: 'center' });
            
            const imageHeight = 30; const imageBaseY = y + 5;
            const addSignatureImage = (sigData: {name: string, image: string} | undefined, colIndex: number) => {
                if (sigData && sigData.image) {
                    try {
                        const imgProps = doc.getImageProperties(sigData.image);
                        const imgWidth = (imageHeight * imgProps.width) / imgProps.height;
                        const xPos = margin + (sigWidth * (colIndex + 0.5)) - (imgWidth / 2);
                        doc.addImage(sigData.image, 'PNG', xPos, imageBaseY, imgWidth, imageHeight);
                    } catch (e) { console.error("Could not add signature image for " + sigData.name, e); }
                }
            };
            addSignatureImage(direkomendasikanOleh, 0); addSignatureImage(diperiksaOleh, 1); addSignatureImage(diketahuiOleh, 2);

            const textY = imageBaseY + imageHeight + 10;
            doc.setFont('helvetica', 'bold');
            doc.text(`( ${direkomendasikanOleh?.name || '...'} )`, margin + (sigWidth * 0.5), textY, { align: 'center' });
            doc.text(`( ${diperiksaOleh?.name || '...'} )`, margin + (sigWidth * 1.5), textY, { align: 'center' });
            doc.text(`( ${diketahuiOleh?.name || '...'} )`, margin + (sigWidth * 2.5), textY, { align: 'center' });
    
            // --- Footer ---
            doc.setFillColor(FOOTER_BG_COLOR); doc.rect(0, pageHeight - footerHeight, pageWidth, footerHeight, 'F');
    
            let footerY = pageHeight - footerHeight + 12;
            doc.setFontSize(7); doc.setTextColor(FOOTER_TEXT_COLOR);
            doc.setFont('helvetica', 'bold'); doc.text('Notes:', margin, footerY); footerY += 9;
            doc.setFont('helvetica', 'normal');
            const footerNotes = [
                'Pada Point (D) : Pemberi referensi WAJIB hrd & atau atasan langsung. Data diri pemberi referensi harus lengkap',
                'Pada point (F) : Kadang terlambat = 1 bulan maksimal 3x. Sering Terlambat = 1 bulan > 3x. Dan pernah tidak masuk tanpa izin berapa kali ?',
                'Pada point (K) : Ceklist salah satu pada kategori (i), dan boleh ceklist lebih dari satu pada kategori (ii), yang selanjutnya WAJIB mengisi detail resign pada kategori (iv)',
                'Justifikasi = penjelasan kenapa kandidat ini tetap ingin dilanjutkan prosesnya, padahal point (L) Tidak direkomendasikan'
            ];
            
            footerNotes.forEach(note => {
                const splitNote = doc.splitTextToSize(note, contentWidth);
                doc.text(splitNote, margin, footerY);
                footerY += (splitNote.length * 8) + 1;
            });
    
            doc.save(`FORM_WOM_SULAWESI_${data.namaKandidat.replace(/\s+/g, '_')}.pdf`);
        } catch (error) {
            console.error("Failed to generate PDF:", error);
            alert("Gagal membuat PDF. Silakan coba lagi.");
        } finally {
            setIsGeneratingPdf(false);
        }
    };

    if (!data) return null;
    return (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-75 overflow-y-auto h-full w-full z-50 flex items-center justify-center p-4">
            <div className="relative mx-auto w-full max-w-4xl shadow-lg rounded-2xl bg-white" onClick={(e) => e.stopPropagation()}>
                <div className="flex justify-between items-center border-b p-5">
                    <div>
                        <h3 className="text-xl font-bold text-gray-800">Pratinjau: {data.namaKandidat}</h3>
                        <p className="text-sm text-gray-500">{data.posisiDilamar} - {data.cabangKapos}</p>
                    </div>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600"><CloseIcon/></button>
                </div>
                <div className="p-2 md:p-4 max-h-[70vh] overflow-y-auto bg-gray-100">
                    <WomSulawesiPreview data={data} />
                </div>
                <div className="p-5 border-t flex justify-between items-center">
                    <button onClick={handleGeneratePdf} disabled={isGeneratingPdf} className="bg-indigo-700 text-white font-semibold py-2 px-6 rounded-lg shadow hover:bg-indigo-800 transition-all duration-200 disabled:bg-gray-400 flex items-center gap-2">
                        {isGeneratingPdf ? <><SpinnerIcon /><span>Membuat PDF...</span></> : 'Unduh PDF'}
                    </button>
                    <button onClick={onClose} className="bg-gray-500 text-white font-bold py-2 px-6 rounded-lg hover:bg-gray-600 transition-colors">Tutup</button>
                </div>
            </div>
        </div>
    );
};

// --- END: MODALS FOR WOM SULAWESI --- //

// --- START: MODALS FOR MAF --- //

const MafFormModal: React.FC<{
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (data: Omit<MafRefcekData, 'id'> | MafRefcekData) => void;
    initialData: MafRefcekData | null;
}> = ({ isOpen, onClose, onSubmit, initialData }) => {
    
    const initialFormState: Omit<MafRefcekData, 'id' | 'createdAt'> = {
        namaKandidat: '', posisiDilamar: '', cabangKapos: '', statusKandidat: 'New Hire Eksternal',
        pengalaman: 'Pengalaman Kerja', namaPerusahaan: '', pemberiReferensiDivisi: '',
        pemberiReferensiNama: '', pemberiReferensiJabatan: '', pemberiReferensiTelp: '',
        masaKerjaTahun: '', masaKerjaBulan: '', masalahKehadiran: 'Tepat Waktu', tidakMasukIzin: '0',
        masalahKesehatan: 'Tidak Pernah Sakit yang Berkepanjangan', masalahKesehatanDetail: '',
        relasiAtasan: 'Baik', relasiAtasanDetail: '', relasiRekan: 'Baik', relasiRekanDetail: '',
        relasiBawahan: 'Baik', relasiBawahanDetail: '', integritas: 'Tidak ada masalah Fraud',
        integritasDetail: '', performance: 'On Target', alasanResignI: 'Mengundurkan Diri Baik-Baik',
        alasanResignII: [], alasanResignIII: '', alasanResignIVPenjelasan: '', akunMedsosAlamat1: '',
        akunMedsosAlamat2: '', akunMedsosStatus: 'Baik - Akun tidak mengandung hal negatif', akunMedsosLainnya: '',
        jenisAngsuran: [], tenorCicilan: '', tunggakan: 'Tidak', kartuKredit: 'Tidak',
        rekomendasi: 'Direkomendasikan', justifikasi: '', email: '',
        direkomendasikanOleh: MAF_REKOMENDASI_BY[0],
        diperiksaOleh: MAF_DIPERIKSA_OLEH,
        diketahuiOleh: MAF_DIKETAHUI_OLEH,
    };

    const [formData, setFormData] = useState(initialData || initialFormState);

    useEffect(() => {
        setFormData(initialData ? { ...initialFormState, ...initialData } : initialFormState);
    }, [initialData]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>, field: 'alasanResignII' | 'jenisAngsuran') => {
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
        const dataToSubmit = {
            ...formData,
            diperiksaOleh: MAF_DIPERIKSA_OLEH,
            diketahuiOleh: MAF_DIKETAHUI_OLEH,
        };
        if (initialData) {
            onSubmit({ ...dataToSubmit, id: initialData.id, createdAt: initialData.createdAt });
        } else {
            onSubmit({ ...dataToSubmit, createdAt: new Date().toISOString() });
        }
    };

    if (!isOpen) return null;

    const sectionTitle = (title: string) => <h4 className="text-lg font-semibold text-gray-700 mt-4 pt-4 border-t col-span-full">{title}</h4>;
    const renderInput = (name: keyof Omit<MafRefcekData, 'id' | 'createdAt'>, label: string, type: 'text' | 'tel' | 'email' | 'number', span?: string) => (
        <div className={span}>
            <label htmlFor={name} className="block text-sm font-medium text-gray-700">{label}</label>
            <input type={type} id={name} name={name} value={(formData as any)[name]} onChange={handleChange} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"/>
        </div>
    );
    const renderRadioGroup = (field: keyof Omit<MafRefcekData, 'id' | 'createdAt'>, label: string, options: string[], span: string = 'col-span-full') => (
        <div className={span}>
            <label className="block text-sm font-medium text-gray-700">{label}</label>
            <div className="mt-2 flex flex-wrap gap-x-4 gap-y-2">
                {options.map(opt => (
                    <label key={opt} className="flex items-center gap-2">
                        <input type="radio" name={field} value={opt} checked={(formData as any)[field] === opt} onChange={handleChange} className="h-4 w-4 border-gray-300 text-blue-600 focus:ring-blue-500"/>
                        <span className="text-sm text-gray-600">{opt}</span>
                    </label>
                ))}
            </div>
        </div>
    );
    const renderCheckboxGroup = (field: 'alasanResignII' | 'jenisAngsuran', label: string, options: string[], span: string = 'col-span-full') => (
        <div className={span}>
            <label className="block text-sm font-medium text-gray-700">{label}</label>
            <div className="mt-2 grid grid-cols-2 md:grid-cols-4 gap-2">
                {options.map(opt => (
                    <label key={opt} className="flex items-center gap-2">
                        <input type="checkbox" value={opt} checked={(formData[field] || []).includes(opt)} onChange={(e) => handleCheckboxChange(e, field)} className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"/>
                        <span className="text-sm text-gray-600">{opt}</span>
                    </label>
                ))}
            </div>
        </div>
    );
     const renderSelect = (name: keyof Omit<MafRefcekData, 'id' | 'createdAt'>, label: string, options: string[], span?: string) => (
        <div className={span}>
            <label htmlFor={name} className="block text-sm font-medium text-gray-700">{label}</label>
            <select id={name} name={name} value={(formData as any)[name]} onChange={handleChange} className="mt-1 block w-full px-3 py-2 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm">
               {options.map(opt => <option key={opt} value={opt}>{opt}</option>)}
            </select>
        </div>
    );
     const renderStaticField = (label: string, value: string) => (
        <div>
            <label className="block text-sm font-medium text-gray-700">{label}</label>
            <p className="mt-1 block w-full px-3 py-2 border border-gray-200 bg-gray-50 rounded-md shadow-sm sm:text-sm text-gray-500">{value}</p>
        </div>
    );

    return (
      <div className="fixed inset-0 bg-gray-600 bg-opacity-75 overflow-y-auto h-full w-full z-50 flex items-center justify-center p-4">
        <div className="relative mx-auto w-full max-w-5xl shadow-lg rounded-2xl bg-white">
          <form onSubmit={handleSubmit}>
            <div className="flex justify-between items-center border-b p-5">
                <h3 className="text-xl font-bold text-gray-800">{initialData ? 'Edit Formulir MAF' : 'Buat Formulir Baru MAF'}</h3>
                <button type="button" onClick={onClose} className="text-gray-400 hover:text-gray-600"><CloseIcon/></button>
            </div>
            <div className="p-5 max-h-[80vh] overflow-y-auto">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {sectionTitle('Informasi Kandidat')}
                  {renderInput('namaKandidat', 'Nama Kandidat', 'text')}
                  {renderInput('posisiDilamar', 'Posisi yang dilamar', 'text')}
                  {renderInput('cabangKapos', 'Cabang - Kapos', 'text')}

                  {renderRadioGroup('statusKandidat', 'A. Status Kandidat', ['New Hire Eksternal', 'Mega Auto Finance to Outsourcing'])}
                  {renderRadioGroup('pengalaman', 'B. Pengalaman', ['Pengalaman Kerja', 'Fresh graduated, pengalaman freelance', 'Fresh graduated, pengalaman magang', 'Fresh graduated, tanpa pengalaman'])}

                  {sectionTitle('Referensi & Riwayat Kerja')}
                  {renderInput('namaPerusahaan', 'C. Nama Perusahaan', 'text', 'lg:col-span-3')}
                  {renderInput('pemberiReferensiDivisi', 'D. Pemberi Referensi (Divisi)', 'text')}
                  {renderInput('pemberiReferensiNama', 'D. Nama Pemberi Referensi', 'text')}
                  {renderInput('pemberiReferensiJabatan', 'D. Jabatan Pereferensi', 'text')}
                  {renderInput('pemberiReferensiTelp', 'D. Nomor Telepon', 'tel')}
                  <div className="flex gap-2 lg:col-span-2">
                    {renderInput('masaKerjaTahun', 'E. Masa Kerja (Tahun)', 'number')}
                    {renderInput('masaKerjaBulan', 'E. (Bulan)', 'number')}
                  </div>
                  
                  {sectionTitle('Hasil Verifikasi')}
                  {renderRadioGroup('masalahKehadiran', 'F. Masalah Kehadiran', ['Tepat Waktu', 'Kadang Terlambat', 'Sering Terlambat'])}
                  {renderInput('tidakMasukIzin', 'F. Tidak masuk tanpa izin (Kali)', 'number')}
                  {renderRadioGroup('masalahKesehatan', 'G. Masalah Kesehatan', ['Pernah Sakit Berkepanjangan', 'Tidak Pernah Sakit yang Berkepanjangan'])}
                  {renderInput('masalahKesehatanDetail', 'G. Detail Sakit', 'text', 'lg:col-span-2')}
                  <div className="col-span-full grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-2 border p-2 rounded-md">
                    <label className="block text-sm font-medium text-gray-700 col-span-full">H. Relasi dengan</label>
                    {renderRadioGroup('relasiAtasan', 'Atasan', ['Baik', 'Tidak Baik'], 'md:col-span-1')}
                    {renderInput('relasiAtasanDetail', 'Detail (jika tidak baik)', 'text')}
                    {renderRadioGroup('relasiRekan', 'Rekan Kerja', ['Baik', 'Tidak Baik'], 'md:col-span-1')}
                    {renderInput('relasiRekanDetail', 'Detail (jika tidak baik)', 'text')}
                    {renderRadioGroup('relasiBawahan', 'Bawahan', ['Baik', 'Tidak Baik'], 'md:col-span-1')}
                    {renderInput('relasiBawahanDetail', 'Detail (jika tidak baik)', 'text')}
                  </div>
                  {renderRadioGroup('integritas', 'I. Terkait Integritas', ['Tidak ada masalah Fraud', 'Terindikasi Fraud', 'Pelaku Fraud'])}
                  {renderInput('integritasDetail', 'I. Detail Integritas', 'text', 'lg:col-span-2')}
                  {renderRadioGroup('performance', 'J. Performance', ['Exceed Target', 'On Target', 'Not Achieve Target'])}

                  {sectionTitle('Alasan Resign')}
                  {renderRadioGroup('alasanResignI', 'K. (i) Tipe Pengunduran Diri', ['Mengundurkan Diri Baik-Baik', 'Mengundurkan Diri Tidak Baik-Baik'])}
                  {renderCheckboxGroup('alasanResignII', 'K. (ii) Alasan', ['Tidak Perpanjang Kontrak', 'PHK', 'Reorganisasi', 'Unperform', 'Diputus Kontrak'])}
                  {renderInput('alasanResignIII', 'K. (iii) Lainnya', 'text')}
                  {renderInput('alasanResignIVPenjelasan', 'K. (iv) Penjelasan Wajib', 'text', 'lg:col-span-2')}

                  {sectionTitle('Media Sosial & Angsuran')}
                  {renderInput('akunMedsosAlamat1', 'L. Alamat Akun Medsos 1', 'text')}
                  {renderInput('akunMedsosAlamat2', 'L. Alamat Akun Medsos 2', 'text')}
                  {renderRadioGroup('akunMedsosStatus', 'L. Status Akun', ['Baik - Akun tidak mengandung hal negatif', 'Konten Provokatif (Pengujar kebencian, Sara, Pornografi dsb)', 'Tata Bahasa & pengunaan kata kasar'])}
                  {renderInput('akunMedsosLainnya', 'L. Lainnya', 'text')}
                  
                  {renderCheckboxGroup('jenisAngsuran', 'M. Jenis Angsuran', ['Motor', 'Mobil', 'Apartemen', 'KPR', 'Elektronik', 'KTA'])}
                  {renderInput('tenorCicilan', 'M. Tenor Cicilan', 'text')}
                  {renderRadioGroup('tunggakan', 'M. Tunggakan', ['Iya', 'Tidak'], 'md:col-span-1')}
                  {renderRadioGroup('kartuKredit', 'M. Kartu Kredit', ['Iya', 'Tidak'], 'md:col-span-1')}
                  
                  {sectionTitle('Rekomendasi & Tanda Tangan')}
                  {renderRadioGroup('rekomendasi', 'N. Rekomendasi', ['Direkomendasikan', 'Tidak Rekomendasi'])}
                  {renderInput('email', 'Email', 'email')}
                  {renderInput('justifikasi', 'Justifikasi', 'text')}

                  {renderSelect('direkomendasikanOleh', 'Di Rekomendasikan Oleh', MAF_REKOMENDASI_BY)}
                  {renderStaticField('Diperiksa Oleh', MAF_DIPERIKSA_OLEH)}
                  {renderStaticField('Diketahui Oleh', MAF_DIKETAHUI_OLEH)}
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

const MafPreviewModal: React.FC<{
    data: MafRefcekData | null;
    onClose: () => void;
}> = ({ data, onClose }) => {
    const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);
    
    const handleGeneratePdf = async () => {
        if (!data) return;
        setIsGeneratingPdf(true);
        try {
            const { jsPDF } = jspdf;
            const doc = new jsPDF('p', 'pt', 'a4');
            const pageWidth = doc.internal.pageSize.getWidth();
            const pageHeight = doc.internal.pageSize.getHeight();
            const margin = 40;
            const contentWidth = pageWidth - margin * 2;
            let y = 0;

            // --- Standard Design System ---
            const PRIMARY_COLOR = '#1E3A8A';
            const TEXT_COLOR = '#1f2937';
            const LIGHT_TEXT_COLOR = '#6b7280';
            const BORDER_COLOR = '#d1d5db';
            const FOOTER_BG_COLOR = '#1E3A8A';
            const FOOTER_TEXT_COLOR = '#e0e7ff';
            const LINE_HEIGHT_SM = 10;
            const LINE_HEIGHT_MD = 12;

            doc.setFont('helvetica');

            const drawSectionTitle = (title: string) => {
                if (y > pageHeight - 150) { doc.addPage(); y = margin; }
                y += 8;
                doc.setFontSize(8); doc.setFont('helvetica', 'bold'); doc.setTextColor(PRIMARY_COLOR);
                doc.text(title.toUpperCase(), margin, y);
                y += 2;
                doc.setDrawColor(BORDER_COLOR); doc.line(margin, y, pageWidth - margin, y);
                y += LINE_HEIGHT_MD;
            };

            const drawPair = (label: string, value: string | undefined | null, options: { fullWidth?: boolean } = {}) => {
                if (!value || !value.trim()) return;
                if (y > pageHeight - 150) { doc.addPage(); y = margin; }
                doc.setFontSize(8); doc.setFont('helvetica', 'bold'); doc.setTextColor(LIGHT_TEXT_COLOR);
                doc.text(label, margin, y);

                doc.setFontSize(9); doc.setFont('helvetica', 'normal'); doc.setTextColor(TEXT_COLOR);
                const valueXPos = options.fullWidth ? margin : 150;
                const maxWidth = options.fullWidth ? contentWidth : contentWidth - (valueXPos - margin);
                const lines = doc.splitTextToSize(value, maxWidth);

                if (options.fullWidth) y += LINE_HEIGHT_SM;
                doc.text(lines, valueXPos, y);
                y += (lines.length * LINE_HEIGHT_SM) + 2;
            };
            
            const drawRadioOrCheckbox = (label: string, checked: boolean, type: 'radio' | 'check', currentY: number) => {
                doc.setFontSize(10); doc.setFont('helvetica', 'bold'); doc.setTextColor(PRIMARY_COLOR);
                doc.text(type === 'radio' ? (checked ? '◉' : '○') : (checked ? '☑' : '☐'), margin, currentY, { baseline: 'middle' });
                doc.setFontSize(8); doc.setFont('helvetica', 'normal'); doc.setTextColor(checked ? TEXT_COLOR : LIGHT_TEXT_COLOR);
                doc.text(label, margin + 15, currentY, { baseline: 'middle' });
                return currentY + LINE_HEIGHT_MD;
            };

            // --- PDF Content ---
            doc.setFillColor(PRIMARY_COLOR); doc.rect(0, 0, pageWidth, 45, 'F');
            doc.setFont('helvetica', 'bold'); doc.setFontSize(18); doc.setTextColor('#FFFFFF');
            doc.text('REFERENCE CHECK FORM', pageWidth / 2, 30, { align: 'center' });
            
            y = 70;
            const headerTable = [[data.namaKandidat, data.posisiDilamar, data.cabangKapos]];
            (doc as any).autoTable({
                head: [['Nama Kandidat', 'Posisi yang dilamar', 'Cabang - Kapos']],
                body: headerTable,
                startY: y,
                theme: 'grid',
                headStyles: { fillColor: [30, 58, 138], fontSize: 9, halign: 'center' },
                bodyStyles: { fontSize: 8, halign: 'center' },
            });
            y = (doc as any).autoTable.previous.finalY + LINE_HEIGHT_MD;

            drawSectionTitle('A. Status Kandidat');
            y = drawRadioOrCheckbox('New Hire Eksternal', data.statusKandidat === 'New Hire Eksternal', 'radio', y);
            y = drawRadioOrCheckbox('Mega Auto Finance to Outsourcing', data.statusKandidat === 'Mega Auto Finance to Outsourcing', 'radio', y);
            
            drawSectionTitle('B. Pengalaman');
            y = drawRadioOrCheckbox('Pengalaman Kerja', data.pengalaman === 'Pengalaman Kerja', 'radio', y);
            y = drawRadioOrCheckbox('Fresh graduated, freelance', data.pengalaman === 'Fresh graduated, pengalaman freelance', 'radio', y);
            y = drawRadioOrCheckbox('Fresh graduated, magang', data.pengalaman === 'Fresh graduated, pengalaman magang', 'radio', y);
            y = drawRadioOrCheckbox('Fresh graduated, tanpa pengalaman', data.pengalaman === 'Fresh graduated, tanpa pengalaman', 'radio', y);

            drawSectionTitle('C, D, E. Riwayat & Referensi');
            drawPair('Nama Perusahaan (C)', data.namaPerusahaan, { fullWidth: true });
            drawPair('Pemberi Referensi (D)', data.pemberiReferensiDivisi);
            drawPair('Nama Pereferensi (D)', data.pemberiReferensiNama);
            drawPair('Jabatan Pereferensi (D)', data.pemberiReferensiJabatan);
            drawPair('Nomor Telp. (D)', data.pemberiReferensiTelp);
            drawPair('Masa Kerja (E)', `${data.masaKerjaTahun || '0'} Tahun, ${data.masaKerjaBulan || '0'} Bulan`);

            drawSectionTitle('F, G, H, I, J. Hasil Verifikasi');
            drawPair('Kehadiran (F)', `${data.masalahKehadiran} (Tak masuk: ${data.tidakMasukIzin} kali)`);
            drawPair('Kesehatan (G)', `${data.masalahKesehatan}${data.masalahKesehatanDetail ? `: ${data.masalahKesehatanDetail}` : ''}`);
            drawPair('Relasi Atasan (H)', `${data.relasiAtasan}${data.relasiAtasanDetail ? `: ${data.relasiAtasanDetail}` : ''}`);
            drawPair('Relasi Rekan (H)', `${data.relasiRekan}${data.relasiRekanDetail ? `: ${data.relasiRekanDetail}` : ''}`);
            drawPair('Relasi Bawahan (H)', `${data.relasiBawahan}${data.relasiBawahanDetail ? `: ${data.relasiBawahanDetail}` : ''}`);
            drawPair('Integritas (I)', `${data.integritas}${data.integritasDetail ? `: ${data.integritasDetail}` : ''}`);
            drawPair('Performance (J)', data.performance);

            drawSectionTitle('K. Alasan Resign');
            drawPair('(i) Tipe', data.alasanResignI);
            drawPair('(ii) Kategori', data.alasanResignII.join(', ') || '-');
            drawPair('(iii) Lainnya', data.alasanResignIII);
            drawPair('(iv) Penjelasan Wajib', data.alasanResignIVPenjelasan, { fullWidth: true });

            drawSectionTitle('L, M. Media Sosial & Angsuran');
            drawPair('Alamat Akun Medsos (L)', `${data.akunMedsosAlamat1} / ${data.akunMedsosAlamat2}`);
            drawPair('Status Akun (L)', `${data.akunMedsosStatus}${data.akunMedsosLainnya ? ` (Lainnya: ${data.akunMedsosLainnya})` : ''}`, { fullWidth: true });
            drawPair('Jenis Angsuran (M)', data.jenisAngsuran.join(', '));
            drawPair('Tenor Cicilan (M)', data.tenorCicilan);
            drawPair('Tunggakan (M)', data.tunggakan);
            drawPair('Kartu Kredit (M)', data.kartuKredit);

            drawSectionTitle('N. Rekomendasi');
            drawPair('Rekomendasi', data.rekomendasi);
            drawPair('EMAIL', data.email);
            drawPair('Justifikasi', data.justifikasi, { fullWidth: true });

            const footerHeight = 75, signatureHeight = 70;
            let sigY = pageHeight - footerHeight - signatureHeight;
            if (y > sigY - 20) { doc.addPage(); y = margin; }
            sigY = pageHeight - footerHeight - signatureHeight;

            const direkomendasikanOleh = SIGNATORIES.find(s => s.name === data.direkomendasikanOleh);
            const diperiksaOleh = SIGNATORIES.find(s => s.name === data.diperiksaOleh);
            const diketahuiOleh = SIGNATORIES.find(s => s.name === data.diketahuiOleh);

            doc.setDrawColor(BORDER_COLOR); doc.line(margin, sigY - 10, pageWidth - margin, sigY - 10);
            
            const sigWidth = contentWidth / 3;
            doc.setFontSize(8); doc.setTextColor(TEXT_COLOR);
            doc.text('Di Rekomendasikan Oleh,', margin + (sigWidth * 0.5), sigY, { align: 'center' });
            doc.text('Diperiksa Oleh,', margin + (sigWidth * 1.5), sigY, { align: 'center' });
            doc.text('Diketahui Oleh,', margin + (sigWidth * 2.5), sigY, { align: 'center' });

            const imageHeight = 30; const imageBaseY = sigY + 5;
            const addSignatureImage = (sigData: {name: string, image: string} | undefined, colIndex: number) => {
                if (sigData && sigData.image) {
                    try {
                        const imgProps = doc.getImageProperties(sigData.image);
                        const imgWidth = (imageHeight * imgProps.width) / imgProps.height;
                        const xPos = margin + (sigWidth * (colIndex + 0.5)) - (imgWidth / 2);
                        doc.addImage(sigData.image, 'PNG', xPos, imageBaseY, imgWidth, imageHeight);
                    } catch (e) { console.error("Could not add signature image for " + sigData.name, e); }
                }
            };
            addSignatureImage(direkomendasikanOleh, 0); addSignatureImage(diperiksaOleh, 1); addSignatureImage(diketahuiOleh, 2);

            const textY = imageBaseY + imageHeight + 10;
            doc.setFont('helvetica', 'bold');
            doc.text(`( ${direkomendasikanOleh?.name || '...'} )`, margin + (sigWidth * 0.5), textY, { align: 'center' });
            doc.text(`( ${diperiksaOleh?.name || '...'} )`, margin + (sigWidth * 1.5), textY, { align: 'center' });
            doc.text(`( ${diketahuiOleh?.name || '...'} )`, margin + (sigWidth * 2.5), textY, { align: 'center' });

            doc.setFillColor(FOOTER_BG_COLOR); doc.rect(0, pageHeight - footerHeight, pageWidth, footerHeight, 'F');
            let footerY = pageHeight - footerHeight + 12;
            doc.setFontSize(7); doc.setTextColor(FOOTER_TEXT_COLOR);
            const footerNotes = [
                'Pada Point (D): Pemberi referensi WAJIB hrd & atau atasan langsung. Data diri pemberi referensi harus lengkap.',
                'Pada point (F): Kadang terlambat = 1 bulan maksimal 3x. Sering Terlambat = 1 bulan > 3x. Dan pernah tidak masuk tanpa izin berapa kali ?',
                'Pada point (K): Ceklist salah satu pada kategori (i), dan boleh ceklist lebih dari satu pada kategori (ii), yang selanjutnya WAJIB mengisi detail resign pada kategori (iv).',
                'Justifikasi = penjelasan kenapa kandidat ini tetap ingin dilanjutkan prosesnya, padahal point (L) Tidak direkomendasikan.'
            ];
            footerNotes.forEach(note => {
                const splitNote = doc.splitTextToSize(note, contentWidth);
                doc.text(splitNote, margin, footerY);
                footerY += (splitNote.length * 8) + 1;
            });

            doc.save(`FORM_MAF_${data.namaKandidat.replace(/\s+/g, '_')}.pdf`);
        } catch (error) {
            console.error("Gagal membuat PDF:", error);
            alert("Gagal membuat PDF. Silakan periksa konsol untuk detailnya.");
        } finally {
            setIsGeneratingPdf(false);
        }
    };

    if (!data) return null;
    return (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-75 overflow-y-auto h-full w-full z-50 flex items-center justify-center p-4">
            <div className="relative mx-auto w-full max-w-4xl shadow-lg rounded-2xl bg-white" onClick={(e) => e.stopPropagation()}>
                <div className="flex justify-between items-center border-b p-5">
                    <div>
                        <h3 className="text-xl font-bold text-gray-800">Pratinjau: {data.namaKandidat}</h3>
                        <p className="text-sm text-gray-500">{data.posisiDilamar} - {data.cabangKapos}</p>
                    </div>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600"><CloseIcon/></button>
                </div>
                <div className="p-2 md:p-4 max-h-[70vh] overflow-y-auto bg-gray-100">
                    <MafPreview data={data} />
                </div>
                <div className="p-5 border-t flex justify-between items-center">
                    <button onClick={handleGeneratePdf} disabled={isGeneratingPdf} className="bg-indigo-700 text-white font-semibold py-2 px-6 rounded-lg shadow hover:bg-indigo-800 transition-all duration-200 disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center gap-2">
                        {isGeneratingPdf ? <><SpinnerIcon /><span>Membuat PDF...</span></> : 'Unduh PDF'}
                    </button>
                    <button onClick={onClose} className="bg-gray-500 text-white font-bold py-2 px-6 rounded-lg hover:bg-gray-600 transition-colors">Tutup</button>
                </div>
            </div>
        </div>
    );
};

// --- END: MODALS FOR MAF --- //

// --- START: MODALS FOR MCF --- //

const McfFormModal: React.FC<{
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (data: Omit<McfRefcekData, 'id'> | McfRefcekData) => void;
    initialData: McfRefcekData | null;
}> = ({ isOpen, onClose, onSubmit, initialData }) => {
    
    const initialFormState: Omit<McfRefcekData, 'id' | 'createdAt'> = {
        namaKandidat: '', posisiDilamar: '', cabangKapos: '', statusKandidat: 'New Hire Eksternal',
        pengalaman: [], namaPerusahaan: '', pemberiReferensiNama: '', pemberiReferensiJabatan: '',
        pemberiReferensiTelp: '', masaKerjaTahun: '', masaKerjaBulan: '', masalahKehadiran: 'Tepat Waktu',
        tidakMasukIzin: '0', masalahKesehatan: 'Tidak Pernah Sakit yang Berkepanjangan', masalahKesehatanDetail: '',
        relasiAtasan: 'Baik', relasiAtasanDetail: '', relasiRekan: 'Baik', relasiRekanDetail: '',
        relasiBawahan: 'Baik', relasiBawahanDetail: '', integritas: 'Tidak ada masalah Fraud', integritasDetail: '',
        performance: 'On Target', alasanResignI: 'Mengundurkan Diri Baik-Baik', alasanResignII: [],
        alasanResignIII: '', alasanResignIVPenjelasan: '', akunMedsosAlamat: '', akunMedsosStatus: [],
        akunMedsosLainnya: '', jenisAngsuran: [], tenorCicilan: '', tunggakan: 'Tidak', kartuKredit: 'Tidak',
        rekomendasi: 'Direkomendasikan', justifikasi: '', email: '',
        dibuatOleh: MCF_REKOMENDASI_BY[0],
        diperiksaOleh: MCF_DIPERIKSA_OLEH,
        diketahuiOleh: MCF_DIKETAHUI_OLEH,
    };

    const [formData, setFormData] = useState(initialData || initialFormState);

    useEffect(() => {
        setFormData(initialData ? { ...initialFormState, ...initialData } : initialFormState);
    }, [initialData]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>, field: 'pengalaman' | 'alasanResignII' | 'akunMedsosStatus' | 'jenisAngsuran') => {
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
        const dataToSubmit = {
            ...formData,
            diperiksaOleh: MCF_DIPERIKSA_OLEH,
            diketahuiOleh: MCF_DIKETAHUI_OLEH,
        };
        if (initialData) {
            onSubmit({ ...dataToSubmit, id: initialData.id, createdAt: initialData.createdAt });
        } else {
            onSubmit({ ...dataToSubmit, createdAt: new Date().toISOString() });
        }
    };

    if (!isOpen) return null;

    const sectionTitle = (title: string) => <h4 className="text-lg font-semibold text-gray-700 mt-4 pt-4 border-t col-span-full">{title}</h4>;
    const renderInput = (name: keyof Omit<McfRefcekData, 'id' | 'createdAt'>, label: string, type: 'text' | 'tel' | 'email' | 'number', span?: string) => (
        <div className={span}>
            <label htmlFor={name} className="block text-sm font-medium text-gray-700">{label}</label>
            <input type={type} id={name} name={name} value={(formData as any)[name]} onChange={handleChange} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"/>
        </div>
    );
    const renderTextarea = (name: keyof Omit<McfRefcekData, 'id' | 'createdAt'>, label: string, span?: string) => (
        <div className={span || ''}>
            <label htmlFor={name} className="block text-sm font-medium text-gray-700">{label}</label>
            <textarea id={name} name={name} value={(formData as any)[name]} onChange={handleChange} rows={2} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"></textarea>
        </div>
    );
    const renderRadioGroup = (field: keyof Omit<McfRefcekData, 'id' | 'createdAt'>, label: string, options: string[], span: string = 'col-span-full') => (
        <div className={span}>
            <label className="block text-sm font-medium text-gray-700">{label}</label>
            <div className="mt-2 flex flex-wrap gap-x-4 gap-y-2">
                {options.map(opt => (
                    <label key={opt} className="flex items-center gap-2">
                        <input type="radio" name={field} value={opt} checked={(formData as any)[field] === opt} onChange={handleChange} className="h-4 w-4 border-gray-300 text-blue-600 focus:ring-blue-500"/>
                        <span className="text-sm text-gray-600">{opt}</span>
                    </label>
                ))}
            </div>
        </div>
    );
    const renderCheckboxGroup = (field: 'pengalaman' | 'alasanResignII' | 'akunMedsosStatus' | 'jenisAngsuran', label: string, options: string[], span: string = 'col-span-full') => (
        <div className={span}>
            <label className="block text-sm font-medium text-gray-700">{label}</label>
            <div className="mt-2 grid grid-cols-2 md:grid-cols-4 gap-2">
                {options.map(opt => (
                    <label key={opt} className="flex items-center gap-2">
                        <input type="checkbox" value={opt} checked={(formData[field] || []).includes(opt)} onChange={(e) => handleCheckboxChange(e, field)} className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"/>
                        <span className="text-sm text-gray-600">{opt}</span>
                    </label>
                ))}
            </div>
        </div>
    );
     const renderSelect = (name: keyof Omit<McfRefcekData, 'id' | 'createdAt'>, label: string, options: string[], span?: string) => (
        <div className={span}>
            <label htmlFor={name} className="block text-sm font-medium text-gray-700">{label}</label>
            <select id={name} name={name} value={(formData as any)[name]} onChange={handleChange} className="mt-1 block w-full px-3 py-2 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm">
               {options.map(opt => <option key={opt} value={opt}>{opt}</option>)}
            </select>
        </div>
    );
     const renderStaticField = (label: string, value: string) => (
        <div>
            <label className="block text-sm font-medium text-gray-700">{label}</label>
            <p className="mt-1 block w-full px-3 py-2 border border-gray-200 bg-gray-50 rounded-md shadow-sm sm:text-sm text-gray-500">{value}</p>
        </div>
    );

    return (
      <div className="fixed inset-0 bg-gray-600 bg-opacity-75 overflow-y-auto h-full w-full z-50 flex items-center justify-center p-4">
        <div className="relative mx-auto w-full max-w-5xl shadow-lg rounded-2xl bg-white">
          <form onSubmit={handleSubmit}>
            <div className="flex justify-between items-center border-b p-5">
                <h3 className="text-xl font-bold text-gray-800">{initialData ? 'Edit Formulir MCF' : 'Buat Formulir Baru MCF'}</h3>
                <button type="button" onClick={onClose} className="text-gray-400 hover:text-gray-600"><CloseIcon/></button>
            </div>
            <div className="p-5 max-h-[80vh] overflow-y-auto">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {sectionTitle('Informasi Kandidat')}
                  {renderInput('namaKandidat', 'Nama Kandidat', 'text')}
                  {renderInput('posisiDilamar', 'Posisi yang dilamar', 'text')}
                  {renderInput('cabangKapos', 'Cabang - Kapos', 'text')}

                  {renderRadioGroup('statusKandidat', 'A. Status Kandidat', ['New Hire Eksternal', 'Mega Central Finance to Outsourcing'])}
                  {renderCheckboxGroup('pengalaman', 'B. Pengalaman', ['Pengalaman Kerja', 'Fresh graduated, pengalaman freelance', 'Fresh graduated, pengalaman magang', 'Fresh graduated, tanpa pengalaman'])}

                  {sectionTitle('Referensi & Riwayat Kerja')}
                  {renderInput('namaPerusahaan', 'C. Nama Perusahaan', 'text', 'lg:col-span-3')}
                  {renderInput('pemberiReferensiNama', 'D. Nama Pemberi Referensi', 'text')}
                  {renderInput('pemberiReferensiJabatan', 'D. Jabatan Pereferensi', 'text')}
                  {renderInput('pemberiReferensiTelp', 'D. Nomor Telepon', 'tel')}
                  <div className="flex gap-2 lg:col-span-3">
                    {renderInput('masaKerjaTahun', 'E. Masa Kerja (Tahun)', 'number')}
                    {renderInput('masaKerjaBulan', 'E. (Bulan)', 'number')}
                  </div>
                  
                  {sectionTitle('Hasil Verifikasi')}
                  {renderRadioGroup('masalahKehadiran', 'F. Masalah Kehadiran', ['Tepat Waktu', 'Kadang Terlambat', 'Sering Terlambat'])}
                  {renderInput('tidakMasukIzin', 'F. Tidak masuk tanpa izin (Kali)', 'number', 'lg:col-span-2')}
                  {renderRadioGroup('masalahKesehatan', 'G. Masalah Kesehatan', ['Pernah Sakit Berkepanjangan', 'Tidak Pernah Sakit yang Berkepanjangan'])}
                  {renderInput('masalahKesehatanDetail', 'G. Detail Sakit', 'text', 'lg:col-span-2')}
                  <div className="col-span-full grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-2 border p-2 rounded-md">
                    <label className="block text-sm font-medium text-gray-700 col-span-full">H. Relasi dengan</label>
                    {renderRadioGroup('relasiAtasan', 'Atasan', ['Baik', 'Tidak Baik'], 'md:col-span-1')}
                    {renderInput('relasiAtasanDetail', 'Detail (jika tidak baik)', 'text')}
                    {renderRadioGroup('relasiRekan', 'Rekan Kerja', ['Baik', 'Tidak Baik'], 'md:col-span-1')}
                    {renderInput('relasiRekanDetail', 'Detail (jika tidak baik)', 'text')}
                    {renderRadioGroup('relasiBawahan', 'Bawahan', ['Baik', 'Tidak Baik'], 'md:col-span-1')}
                    {renderInput('relasiBawahanDetail', 'Detail (jika tidak baik)', 'text')}
                  </div>
                  {renderRadioGroup('integritas', 'I. Terkait Integritas', ['Tidak ada masalah Fraud', 'Terindikasi Fraud', 'Pelaku Fraud'])}
                  {renderInput('integritasDetail', 'I. Detail Integritas', 'text', 'lg:col-span-2')}
                  {renderRadioGroup('performance', 'J. Performance', ['Exceed Target', 'On Target', 'Not Achieve Target'])}

                  {sectionTitle('Alasan Resign')}
                  {renderRadioGroup('alasanResignI', 'K. (i) Tipe Pengunduran Diri', ['Mengundurkan Diri Baik-Baik', 'Mengundurkan Diri Tidak Baik-Baik'])}
                  {renderCheckboxGroup('alasanResignII', 'K. (ii) Alasan', ['Tidak Perpanjang Kontrak', 'PHK', 'Reorganisasi', 'Unperform', 'Diputus Kontrak'])}
                  {renderInput('alasanResignIII', 'K. (iii) Lainnya', 'text')}
                  {renderTextarea('alasanResignIVPenjelasan', 'K. (iv) Penjelasan Wajib', 'lg:col-span-2')}

                  {sectionTitle('Media Sosial & Angsuran')}
                  {renderInput('akunMedsosAlamat', 'L. Alamat Akun Medsos', 'text')}
                  {renderCheckboxGroup('akunMedsosStatus', 'L. Status Akun', ['Baik - Akun tidak mengandung hal negatif', 'Konten Provokatif (Pengujar kebencian, Sara, Pornografi dsb)', 'Tata Bahasa & pengunaan kata kasar'], 'col-span-full')}
                  {renderInput('akunMedsosLainnya', 'L. Lainnya', 'text')}

                  {renderCheckboxGroup('jenisAngsuran', 'M. Jenis Angsuran', ['Motor', 'Mobil', 'Apartemen', 'KPR', 'Elektronik', 'KTA'])}
                  {renderInput('tenorCicilan', 'M. Tenor Cicilan', 'text')}
                  {renderRadioGroup('tunggakan', 'M. Tunggakan', ['Iya', 'Tidak'], 'md:col-span-1')}
                  {renderRadioGroup('kartuKredit', 'M. Kartu Kredit', ['Iya', 'Tidak'], 'md:col-span-1')}
                  
                  {sectionTitle('Rekomendasi & Tanda Tangan')}
                  {renderRadioGroup('rekomendasi', 'N. Rekomendasi', ['Direkomendasikan', 'Tidak Rekomendasi'], 'md:col-span-1')}
                  {renderInput('email', 'Email', 'email', 'md:col-span-2')}
                  {renderTextarea('justifikasi', 'Justifikasi', 'col-span-full')}
                  
                  {renderSelect('dibuatOleh', 'Dibuat Oleh', MCF_REKOMENDASI_BY)}
                  {renderStaticField('Diperiksa Oleh', MCF_DIPERIKSA_OLEH)}
                  {renderStaticField('Diketahui Oleh', MCF_DIKETAHUI_OLEH)}
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

const McfPreviewModal: React.FC<{
    data: McfRefcekData | null;
    onClose: () => void;
}> = ({ data, onClose }) => {
    const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);
    
    const handleGeneratePdf = async () => {
        if (!data) return;
        setIsGeneratingPdf(true);
        try {
            const { jsPDF } = jspdf;
            const doc = new jsPDF('p', 'pt', 'a4');
            const pageWidth = doc.internal.pageSize.getWidth();
            const pageHeight = doc.internal.pageSize.getHeight();
            const margin = 40;
            const contentWidth = pageWidth - margin * 2;
            let y = 0;

            // --- Standard Design System ---
            const PRIMARY_COLOR = '#1E3A8A';
            const TEXT_COLOR = '#1f2937';
            const LIGHT_TEXT_COLOR = '#6b7280';
            const BORDER_COLOR = '#d1d5db';
            const FOOTER_BG_COLOR = '#1E3A8A';
            const FOOTER_TEXT_COLOR = '#e0e7ff';
            const LINE_HEIGHT_SM = 10;
            const LINE_HEIGHT_MD = 12;

            doc.setFont('helvetica');

            const drawSectionTitle = (title: string) => {
                if (y > pageHeight - 150) { doc.addPage(); y = margin; }
                y += 8;
                doc.setFontSize(8); doc.setFont('helvetica', 'bold'); doc.setTextColor(PRIMARY_COLOR);
                doc.text(title.toUpperCase(), margin, y);
                y += 2;
                doc.setDrawColor(BORDER_COLOR); doc.line(margin, y, pageWidth - margin, y);
                y += LINE_HEIGHT_MD;
            };

            const drawPair = (label: string, value: string | undefined | null, options: { fullWidth?: boolean } = {}) => {
                if (!value || !value.trim()) return;
                if (y > pageHeight - 150) { doc.addPage(); y = margin; }
                doc.setFontSize(8); doc.setFont('helvetica', 'bold'); doc.setTextColor(LIGHT_TEXT_COLOR);
                doc.text(label, margin, y);

                doc.setFontSize(9); doc.setFont('helvetica', 'normal'); doc.setTextColor(TEXT_COLOR);
                const valueXPos = options.fullWidth ? margin : 160;
                const maxWidth = options.fullWidth ? contentWidth : contentWidth - (valueXPos - margin);
                const lines = doc.splitTextToSize(value, maxWidth);

                if (options.fullWidth) y += LINE_HEIGHT_SM;
                doc.text(lines, valueXPos, y);
                y += (lines.length * LINE_HEIGHT_SM) + 2;
            };
            
            const drawRadioOrCheckbox = (label: string, checked: boolean, type: 'radio' | 'check', x: number, currentY: number) => {
                doc.setFontSize(10); doc.setFont('helvetica', 'bold'); doc.setTextColor(PRIMARY_COLOR);
                doc.text(type === 'radio' ? (checked ? '◉' : '○') : (checked ? '☑' : '☐'), x, currentY, { baseline: 'middle' });
                doc.setFontSize(8); doc.setFont('helvetica', 'normal'); doc.setTextColor(checked ? TEXT_COLOR : LIGHT_TEXT_COLOR);
                doc.text(label, x + 15, currentY, { baseline: 'middle' });
                return currentY + LINE_HEIGHT_MD;
            };

            // --- PDF Content ---
            doc.setFillColor(PRIMARY_COLOR); doc.rect(0, 0, pageWidth, 45, 'F');
            doc.setFont('helvetica', 'bold'); doc.setFontSize(18); doc.setTextColor('#FFFFFF');
            doc.text('REFERENCE CHECK FORM', pageWidth / 2, 30, { align: 'center' });
            
            y = 70;
            drawPair('Nama Kandidat', data.namaKandidat);
            drawPair('Posisi yang dilamar', data.posisiDilamar);
            drawPair('Cabang - Kapos', data.cabangKapos);

            drawSectionTitle('A. Status Kandidat & B. Pengalaman');
            let checkY = y; let col1Y = checkY, col2Y = checkY;
            const col2X = margin + contentWidth / 2;
            
            doc.setFontSize(8); doc.setFont('helvetica', 'bold'); doc.setTextColor(LIGHT_TEXT_COLOR);
            doc.text("Status Kandidat (A)", margin, col1Y); col1Y += LINE_HEIGHT_SM;
            col1Y = drawRadioOrCheckbox('New Hire Eksternal', data.statusKandidat === 'New Hire Eksternal', 'radio', margin, col1Y);
            col1Y = drawRadioOrCheckbox('MCF to Outsourcing', data.statusKandidat === 'Mega Central Finance to Outsourcing', 'radio', margin, col1Y);

            doc.setFontSize(8); doc.setFont('helvetica', 'bold'); doc.setTextColor(LIGHT_TEXT_COLOR);
            doc.text("Pengalaman (B)", col2X, col2Y); col2Y += LINE_HEIGHT_SM;
            col2Y = drawRadioOrCheckbox('Pengalaman Kerja', data.pengalaman.includes('Pengalaman Kerja'), 'check', col2X, col2Y);
            col2Y = drawRadioOrCheckbox('Fresh graduated, freelance', data.pengalaman.includes('Fresh graduated, pengalaman freelance'), 'check', col2X, col2Y);
            col2Y = drawRadioOrCheckbox('Fresh graduated, magang', data.pengalaman.includes('Fresh graduated, pengalaman magang'), 'check', col2X, col2Y);
            col2Y = drawRadioOrCheckbox('Fresh graduated, tanpa pengalaman', data.pengalaman.includes('Fresh graduated, tanpa pengalaman'), 'check', col2X, col2Y);
            y = Math.max(col1Y, col2Y);
            
            drawSectionTitle('C, D, E. Riwayat & Referensi');
            drawPair('Nama Perusahaan (C)', data.namaPerusahaan, { fullWidth: true });
            drawPair('Nama Pereferensi (D)', data.pemberiReferensiNama);
            drawPair('Jabatan Pereferensi (D)', data.pemberiReferensiJabatan);
            drawPair('Nomor Telp. (D)', data.pemberiReferensiTelp);
            drawPair('Masa Kerja (E)', `${data.masaKerjaTahun || '0'} Tahun, ${data.masaKerjaBulan || '0'} Bulan`);

            drawSectionTitle('F, G, H, I, J. Hasil Verifikasi');
            drawPair('Kehadiran (F)', `${data.masalahKehadiran} (Tak masuk: ${data.tidakMasukIzin} kali)`);
            drawPair('Kesehatan (G)', `${data.masalahKesehatan}${data.masalahKesehatanDetail ? `: ${data.masalahKesehatanDetail}` : ''}`);
            drawPair('Relasi Atasan (H)', `${data.relasiAtasan}${data.relasiAtasanDetail ? `: ${data.relasiAtasanDetail}` : ''}`);
            drawPair('Relasi Rekan (H)', `${data.relasiRekan}${data.relasiRekanDetail ? `: ${data.relasiRekanDetail}` : ''}`);
            drawPair('Relasi Bawahan (H)', `${data.relasiBawahan}${data.relasiBawahanDetail ? `: ${data.relasiBawahanDetail}` : ''}`);
            drawPair('Integritas (I)', `${data.integritas}${data.integritasDetail ? `: ${data.integritasDetail}` : ''}`);
            drawPair('Performance (J)', data.performance);
            
            drawSectionTitle('K. Alasan Resign');
            drawPair('(i) Tipe', data.alasanResignI);
            drawPair('(ii) Kategori', data.alasanResignII.join(', ') || '-');
            drawPair('(iii) Lainnya', data.alasanResignIII);
            drawPair('(iv) Penjelasan Wajib', data.alasanResignIVPenjelasan, { fullWidth: true });

            drawSectionTitle('L, M. Media Sosial & Angsuran');
            drawPair('Alamat Akun Medsos (L)', data.akunMedsosAlamat);
            drawPair('Status Akun (L)', `${data.akunMedsosStatus.join(', ')}${data.akunMedsosLainnya ? ` (Lainnya: ${data.akunMedsosLainnya})` : ''}`, { fullWidth: true });
            drawPair('Jenis Angsuran (M)', data.jenisAngsuran.join(', '));
            drawPair('Tenor Cicilan (M)', data.tenorCicilan);
            drawPair('Tunggakan (M)', data.tunggakan);
            drawPair('Kartu Kredit (M)', data.kartuKredit);

            drawSectionTitle('N. Rekomendasi');
            drawPair('Rekomendasi', data.rekomendasi);
            drawPair('EMAIL', data.email);
            drawPair('Justifikasi', data.justifikasi, { fullWidth: true });

            const footerHeight = 80, signatureHeight = 70;
            let sigY = pageHeight - footerHeight - signatureHeight;
            if (y > sigY - 20) { doc.addPage(); y = margin; }
            sigY = pageHeight - footerHeight - signatureHeight;

            const dibuatOleh = SIGNATORIES.find(s => s.name === data.dibuatOleh);
            const diperiksaOleh = SIGNATORIES.find(s => s.name === data.diperiksaOleh);
            const diketahuiOleh = SIGNATORIES.find(s => s.name === data.diketahuiOleh);

            doc.setDrawColor(BORDER_COLOR); doc.line(margin, sigY - 10, pageWidth - margin, sigY - 10);
            
            const sigWidth = contentWidth / 3;
            doc.setFontSize(8); doc.setTextColor(TEXT_COLOR);
            doc.text('Dibuat Oleh,', margin + (sigWidth * 0.5), sigY, { align: 'center' });
            doc.text('Diperiksa Oleh,', margin + (sigWidth * 1.5), sigY, { align: 'center' });
            doc.text('Diketahui Oleh,', margin + (sigWidth * 2.5), sigY, { align: 'center' });

            const imageHeight = 30; const imageBaseY = sigY + 5;
            const addSignatureImage = (sigData: {name: string, image: string} | undefined, colIndex: number) => {
                if (sigData && sigData.image) {
                    try {
                        const imgProps = doc.getImageProperties(sigData.image);
                        const imgWidth = (imageHeight * imgProps.width) / imgProps.height;
                        const xPos = margin + (sigWidth * (colIndex + 0.5)) - (imgWidth / 2);
                        doc.addImage(sigData.image, 'PNG', xPos, imageBaseY, imgWidth, imageHeight);
                    } catch (e) { console.error("Could not add signature image for " + sigData.name, e); }
                }
            };
            addSignatureImage(dibuatOleh, 0); addSignatureImage(diperiksaOleh, 1); addSignatureImage(diketahuiOleh, 2);

            const textY = imageBaseY + imageHeight + 10;
            doc.setFont('helvetica', 'bold');
            doc.text(`( ${dibuatOleh?.name || '...'} )`, margin + (sigWidth * 0.5), textY, { align: 'center' });
            doc.text(`( ${diperiksaOleh?.name || '...'} )`, margin + (sigWidth * 1.5), textY, { align: 'center' });
            doc.text(`( ${diketahuiOleh?.name || '...'} )`, margin + (sigWidth * 2.5), textY, { align: 'center' });

            doc.setFillColor(FOOTER_BG_COLOR); doc.rect(0, pageHeight - footerHeight, pageWidth, footerHeight, 'F');
            let footerY = pageHeight - footerHeight + 12;
            doc.setFontSize(7); doc.setTextColor(FOOTER_TEXT_COLOR);
            const footerNotes = [
                'Pada Point (D): Pemberi referensi WAJIB hrd & atau atasan langsung. Data diri pemberi referensi harus lengkap.',
                'Pada point (F): Kadang terlambat = 1 bulan maksimal 3x. Sering Terlambat = 1 bulan > 3x. Dan pernah tidak masuk tanpa izin berapa kali ?',
                'Pada point (K): Ceklist salah satu pada kategori (i), dan boleh ceklist lebih dari satu pada kategori (ii), yang selanjutnya WAJIB mengisi detail resign pada kategori (iv).',
                'Justifikasi = penjelasan kenapa kandidat ini tetap ingin dilanjutkan prosesnya, padahal point (N) Tidak direkomendasikan.'
            ];
            footerNotes.forEach(note => {
                const splitNote = doc.splitTextToSize(note, contentWidth);
                doc.text(splitNote, margin, footerY);
                footerY += (splitNote.length * 8) + 1;
            });

            doc.save(`FORM_MCF_${data.namaKandidat.replace(/\s+/g, '_')}.pdf`);
        } catch (error) {
            console.error("Gagal membuat PDF:", error);
            alert("Gagal membuat PDF. Silakan periksa konsol untuk detailnya.");
        } finally {
            setIsGeneratingPdf(false);
        }
    };

    if (!data) return null;
    return (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-75 overflow-y-auto h-full w-full z-50 flex items-center justify-center p-4">
            <div className="relative mx-auto w-full max-w-4xl shadow-lg rounded-2xl bg-white" onClick={(e) => e.stopPropagation()}>
                <div className="flex justify-between items-center border-b p-5">
                    <div>
                        <h3 className="text-xl font-bold text-gray-800">Pratinjau: {data.namaKandidat}</h3>
                        <p className="text-sm text-gray-500">{data.posisiDilamar} - {data.cabangKapos}</p>
                    </div>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600"><CloseIcon/></button>
                </div>
                <div className="p-2 md:p-4 max-h-[70vh] overflow-y-auto bg-gray-100">
                    <McfPreview data={data} />
                </div>
                <div className="p-5 border-t flex justify-between items-center">
                    <button onClick={handleGeneratePdf} disabled={isGeneratingPdf} className="bg-indigo-700 text-white font-semibold py-2 px-6 rounded-lg shadow hover:bg-indigo-800 transition-all duration-200 disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center gap-2">
                        {isGeneratingPdf ? <><SpinnerIcon /><span>Membuat PDF...</span></> : 'Unduh PDF'}
                    </button>
                    <button onClick={onClose} className="bg-gray-500 text-white font-bold py-2 px-6 rounded-lg hover:bg-gray-600 transition-colors">Tutup</button>
                </div>
            </div>
        </div>
    );
};

// --- END: MODALS FOR MCF --- //


// --- START: MODALS FOR ADIRA --- //

const AdiraFormModal: React.FC<{
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (data: Omit<AdiraRefcekData, 'id'> | AdiraRefcekData) => void;
    initialData: AdiraRefcekData | null;
}> = ({ isOpen, onClose, onSubmit, initialData }) => {
    
    const initialFormState: Omit<AdiraRefcekData, 'id' | 'createdAt'> = {
        namaKandidat: '', posisiDilamar: '', cabangKapos: '', statusKandidat: 'New Hire Eksternal',
        pengalaman: [], namaPerusahaan: '', pemberiReferensiNama: '', pemberiReferensiJabatan: '',
        pemberiReferensiTelp: '', masaKerjaTahun: '', masaKerjaBulan: '', masalahKehadiran: 'Tepat Waktu',
        tidakMasukIzin: '0', masalahKesehatan: 'Tidak Pernah Sakit yang Berkepanjangan', masalahKesehatanDetail: '',
        relasiAtasan: 'Baik', relasiAtasanDetail: '', relasiRekan: 'Baik', relasiRekanDetail: '',
        relasiBawahan: 'Baik', relasiBawahanDetail: '', integritas: 'Tidak ada masalah Fraud', integritasDetail: '',
        performance: 'On Target', alasanResignI: 'Mengundurkan Diri Baik-Baik', alasanResignII: [],
        alasanResignIII: 'YBS MASIH AKTIF BEKERJA', alasanResignIVPenjelasan: '', akunMedsosAlamat: '', akunMedsosStatus: [],
        akunMedsosLainnya: '', jenisAngsuran: [], tenorCicilan: '', tunggakan: 'Tidak', kartuKredit: 'Tidak',
        rekomendasi: 'Direkomendasikan', justifikasi: '', email: '',
        dibuatOleh: ADIRA_REKOMENDASI_BY[0],
        diperiksaOleh: ADIRA_DIPERIKSA_OLEH,
        diketahuiOleh: ADIRA_DIKETAHUI_OLEH,
    };

    const [formData, setFormData] = useState(initialData || initialFormState);

    useEffect(() => {
        setFormData(initialData ? { ...initialFormState, ...initialData } : initialFormState);
    }, [initialData]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>, field: 'pengalaman' | 'alasanResignII' | 'akunMedsosStatus' | 'jenisAngsuran') => {
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
        const dataToSubmit = {
            ...formData,
            diperiksaOleh: ADIRA_DIPERIKSA_OLEH,
            diketahuiOleh: ADIRA_DIKETAHUI_OLEH,
        };
        if (initialData) {
            onSubmit({ ...dataToSubmit, id: initialData.id, createdAt: initialData.createdAt });
        } else {
            onSubmit({ ...dataToSubmit, createdAt: new Date().toISOString() });
        }
    };

    if (!isOpen) return null;

    const sectionTitle = (title: string) => <h4 className="text-lg font-semibold text-gray-700 mt-4 pt-4 border-t col-span-full">{title}</h4>;
    const renderInput = (name: keyof Omit<AdiraRefcekData, 'id' | 'createdAt'>, label: string, type: 'text' | 'tel' | 'email' | 'number', span?: string) => (
        <div className={span}>
            <label htmlFor={name} className="block text-sm font-medium text-gray-700">{label}</label>
            <input type={type} id={name} name={name} value={(formData as any)[name]} onChange={handleChange} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"/>
        </div>
    );
    const renderTextarea = (name: keyof Omit<AdiraRefcekData, 'id' | 'createdAt'>, label: string, span?: string) => (
        <div className={span || ''}>
            <label htmlFor={name} className="block text-sm font-medium text-gray-700">{label}</label>
            <textarea id={name} name={name} value={(formData as any)[name]} onChange={handleChange} rows={2} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"></textarea>
        </div>
    );
    const renderRadioGroup = (field: keyof Omit<AdiraRefcekData, 'id' | 'createdAt'>, label: string, options: string[], span: string = 'col-span-full') => (
        <div className={span}>
            <label className="block text-sm font-medium text-gray-700">{label}</label>
            <div className="mt-2 flex flex-wrap gap-x-4 gap-y-2">
                {options.map(opt => (
                    <label key={opt} className="flex items-center gap-2">
                        <input type="radio" name={field} value={opt} checked={(formData as any)[field] === opt} onChange={handleChange} className="h-4 w-4 border-gray-300 text-blue-600 focus:ring-blue-500"/>
                        <span className="text-sm text-gray-600">{opt}</span>
                    </label>
                ))}
            </div>
        </div>
    );
    const renderCheckboxGroup = (field: 'pengalaman' | 'alasanResignII' | 'akunMedsosStatus' | 'jenisAngsuran', label: string, options: string[], span: string = 'col-span-full') => (
        <div className={span}>
            <label className="block text-sm font-medium text-gray-700">{label}</label>
            <div className="mt-2 grid grid-cols-2 md:grid-cols-4 gap-2">
                {options.map(opt => (
                    <label key={opt} className="flex items-center gap-2">
                        <input type="checkbox" value={opt} checked={(formData[field] || []).includes(opt)} onChange={(e) => handleCheckboxChange(e, field)} className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"/>
                        <span className="text-sm text-gray-600">{opt}</span>
                    </label>
                ))}
            </div>
        </div>
    );
     const renderSelect = (name: keyof Omit<AdiraRefcekData, 'id' | 'createdAt'>, label: string, options: string[], span?: string) => (
        <div className={span}>
            <label htmlFor={name} className="block text-sm font-medium text-gray-700">{label}</label>
            <select id={name} name={name} value={(formData as any)[name]} onChange={handleChange} className="mt-1 block w-full px-3 py-2 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm">
               {options.map(opt => <option key={opt} value={opt}>{opt}</option>)}
            </select>
        </div>
    );
     const renderStaticField = (label: string, value: string) => (
        <div>
            <label className="block text-sm font-medium text-gray-700">{label}</label>
            <p className="mt-1 block w-full px-3 py-2 border border-gray-200 bg-gray-50 rounded-md shadow-sm sm:text-sm text-gray-500">{value}</p>
        </div>
    );

    return (
      <div className="fixed inset-0 bg-gray-600 bg-opacity-75 overflow-y-auto h-full w-full z-50 flex items-center justify-center p-4">
        <div className="relative mx-auto w-full max-w-5xl shadow-lg rounded-2xl bg-white">
          <form onSubmit={handleSubmit}>
            <div className="flex justify-between items-center border-b p-5">
                <h3 className="text-xl font-bold text-gray-800">{initialData ? 'Edit Formulir ADIRA' : 'Buat Formulir Baru ADIRA'}</h3>
                <button type="button" onClick={onClose} className="text-gray-400 hover:text-gray-600"><CloseIcon/></button>
            </div>
            <div className="p-5 max-h-[80vh] overflow-y-auto">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {sectionTitle('Informasi Kandidat')}
                  {renderInput('namaKandidat', 'Nama Kandidat', 'text')}
                  {renderInput('posisiDilamar', 'Posisi yang dilamar', 'text')}
                  {renderInput('cabangKapos', 'Cabang - Kapos', 'text')}

                  {renderRadioGroup('statusKandidat', 'A. Status Kandidat', ['New Hire Eksternal', 'Adira Finance to Outsourcing'])}
                  {renderCheckboxGroup('pengalaman', 'B. Pengalaman', ['Pengalaman Kerja', 'Fresh graduated, pengalaman freelance', 'Fresh graduated, pengalaman magang', 'Fresh graduated, tanpa pengalaman'])}

                  {sectionTitle('Referensi & Riwayat Kerja')}
                  {renderInput('namaPerusahaan', 'C. Nama Perusahaan', 'text', 'lg:col-span-3')}
                  {renderInput('pemberiReferensiNama', 'D. Nama Pemberi Referensi', 'text')}
                  {renderInput('pemberiReferensiJabatan', 'D. Jabatan Pereferensi', 'text')}
                  {renderInput('pemberiReferensiTelp', 'D. Nomor Telepon', 'tel')}
                  <div className="flex gap-2 lg:col-span-3">
                    {renderInput('masaKerjaTahun', 'E. Masa Kerja (Tahun)', 'number')}
                    {renderInput('masaKerjaBulan', 'E. (Bulan)', 'number')}
                  </div>
                  
                  {sectionTitle('Hasil Verifikasi')}
                  {renderRadioGroup('masalahKehadiran', 'F. Masalah Kehadiran', ['Tepat Waktu', 'Kadang Terlambat', 'Sering Terlambat'])}
                  {renderInput('tidakMasukIzin', 'F. Tidak masuk tanpa izin (Kali)', 'number', 'lg:col-span-2')}
                  {renderRadioGroup('masalahKesehatan', 'G. Masalah Kesehatan', ['Pernah Sakit Berkepanjangan', 'Tidak Pernah Sakit yang Berkepanjangan'])}
                  {renderInput('masalahKesehatanDetail', 'G. Detail Sakit', 'text', 'lg:col-span-2')}
                  <div className="col-span-full grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-2 border p-2 rounded-md">
                    <label className="block text-sm font-medium text-gray-700 col-span-full">H. Relasi dengan</label>
                    {renderRadioGroup('relasiAtasan', 'Atasan', ['Baik', 'Tidak Baik'], 'md:col-span-1')}
                    {renderInput('relasiAtasanDetail', 'Detail (jika tidak baik)', 'text')}
                    {renderRadioGroup('relasiRekan', 'Rekan Kerja', ['Baik', 'Tidak Baik'], 'md:col-span-1')}
                    {renderInput('relasiRekanDetail', 'Detail (jika tidak baik)', 'text')}
                    {renderRadioGroup('relasiBawahan', 'Bawahan', ['Baik', 'Tidak Baik'], 'md:col-span-1')}
                    {renderInput('relasiBawahanDetail', 'Detail (jika tidak baik)', 'text')}
                  </div>
                  {renderRadioGroup('integritas', 'I. Terkait Integritas', ['Tidak ada masalah Fraud', 'Terindikasi Fraud', 'Pelaku Fraud'])}
                  {renderInput('integritasDetail', 'I. Detail Integritas', 'text', 'lg:col-span-2')}
                  {renderRadioGroup('performance', 'J. Performance', ['Exceed Target', 'On Target', 'Not Achieve Target'])}

                  {sectionTitle('Alasan Resign')}
                  {renderRadioGroup('alasanResignI', 'K. (i) Tipe Pengunduran Diri', ['Mengundurkan Diri Baik-Baik', 'Mengundurkan Diri Tidak Baik-Baik'])}
                  {renderCheckboxGroup('alasanResignII', 'K. (ii) Alasan', ['Tidak Perpanjang Kontrak', 'PHK', 'Reorganisasi', 'Unperform', 'Diputus Kontrak'])}
                  {renderInput('alasanResignIII', 'K. (iii) Lainnya', 'text')}
                  {renderTextarea('alasanResignIVPenjelasan', 'K. (iv) Penjelasan Wajib', 'lg:col-span-2')}

                  {sectionTitle('Media Sosial & Angsuran')}
                  {renderInput('akunMedsosAlamat', 'L. Alamat Akun Medsos', 'text')}
                  {renderCheckboxGroup('akunMedsosStatus', 'L. Status Akun', ['Baik - Akun tidak mengandung hal negatif', 'Konten Provokatif (Pengujar kebencian, Sara, Pornografi dsb)', 'Tata Bahasa & pengunaan kata kasar'], 'col-span-full')}
                  {renderInput('akunMedsosLainnya', 'L. Lainnya', 'text')}

                  {renderCheckboxGroup('jenisAngsuran', 'M. Jenis Angsuran', ['Motor', 'Mobil', 'Apartemen', 'KPR', 'Elektronik', 'KTA'])}
                  {renderInput('tenorCicilan', 'M. Tenor Cicilan', 'text')}
                  {renderRadioGroup('tunggakan', 'M. Tunggakan', ['Iya', 'Tidak'], 'md:col-span-1')}
                  {renderRadioGroup('kartuKredit', 'M. Kartu Kredit', ['Iya', 'Tidak'], 'md:col-span-1')}
                  
                  {sectionTitle('Rekomendasi & Tanda Tangan')}
                  {renderRadioGroup('rekomendasi', 'N. Rekomendasi', ['Direkomendasikan', 'Tidak Rekomendasi'], 'md:col-span-1')}
                  {renderInput('email', 'Email', 'email', 'md:col-span-2')}
                  {renderTextarea('justifikasi', 'Justifikasi', 'col-span-full')}
                  
                  {renderSelect('dibuatOleh', 'Dibuat Oleh', ADIRA_REKOMENDASI_BY)}
                  {renderStaticField('Diperiksa Oleh', ADIRA_DIPERIKSA_OLEH)}
                  {renderStaticField('Diketahui Oleh', ADIRA_DIKETAHUI_OLEH)}
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

const AdiraPreviewModal: React.FC<{
    data: AdiraRefcekData | null;
    onClose: () => void;
}> = ({ data, onClose }) => {
    const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);
    
    const handleGeneratePdf = async () => {
        if (!data) return;
        setIsGeneratingPdf(true);
        try {
            const { jsPDF } = jspdf;
            const doc = new jsPDF('p', 'pt', 'a4');
            const pageWidth = doc.internal.pageSize.getWidth();
            const pageHeight = doc.internal.pageSize.getHeight();
            const margin = 40;
            const contentWidth = pageWidth - margin * 2;
            let y = 0;

            const PRIMARY_COLOR = '#1E3A8A'; const TEXT_COLOR = '#1f2937'; const LIGHT_TEXT_COLOR = '#6b7280';
            const BORDER_COLOR = '#d1d5db'; const FOOTER_BG_COLOR = '#1E3A8A'; const FOOTER_TEXT_COLOR = '#e0e7ff';
            const LINE_HEIGHT_SM = 10; const LINE_HEIGHT_MD = 12;
            doc.setFont('helvetica');

            const drawSectionTitle = (title: string) => {
                if (y > pageHeight - 150) { doc.addPage(); y = margin; }
                y += 8;
                doc.setFontSize(8); doc.setFont('helvetica', 'bold'); doc.setTextColor(PRIMARY_COLOR);
                doc.text(title.toUpperCase(), margin, y);
                y += 2;
                doc.setDrawColor(BORDER_COLOR); doc.line(margin, y, pageWidth - margin, y);
                y += LINE_HEIGHT_MD;
            };

            const drawPair = (label: string, value: string | undefined | null, options: { fullWidth?: boolean } = {}) => {
                if (!value || !value.trim()) return;
                if (y > pageHeight - 150) { doc.addPage(); y = margin; }
                doc.setFontSize(8); doc.setFont('helvetica', 'bold'); doc.setTextColor(LIGHT_TEXT_COLOR);
                doc.text(label, margin, y);

                doc.setFontSize(9); doc.setFont('helvetica', 'normal'); doc.setTextColor(TEXT_COLOR);
                const valueXPos = options.fullWidth ? margin : 160;
                const maxWidth = options.fullWidth ? contentWidth : contentWidth - (valueXPos - margin);
                const lines = doc.splitTextToSize(value, maxWidth);

                if (options.fullWidth) y += LINE_HEIGHT_SM;
                doc.text(lines, valueXPos, y);
                y += (lines.length * LINE_HEIGHT_SM) + 2;
            };
            
            const drawRadioOrCheckbox = (label: string, checked: boolean, type: 'radio' | 'check', x: number, currentY: number) => {
                doc.setFontSize(10); doc.setFont('helvetica', 'bold'); doc.setTextColor(PRIMARY_COLOR);
                doc.text(type === 'radio' ? (checked ? '◉' : '○') : (checked ? '☑' : '☐'), x, currentY, { baseline: 'middle' });
                doc.setFontSize(8); doc.setFont('helvetica', 'normal'); doc.setTextColor(checked ? TEXT_COLOR : LIGHT_TEXT_COLOR);
                doc.text(label, x + 15, currentY, { baseline: 'middle' });
                return currentY + LINE_HEIGHT_MD;
            };

            // --- PDF Content ---
            doc.setFillColor(PRIMARY_COLOR); doc.rect(0, 0, pageWidth, 45, 'F');
            doc.setFont('helvetica', 'bold'); doc.setFontSize(18); doc.setTextColor('#FFFFFF');
            doc.text('REFERENCE CHECK FORM', pageWidth / 2, 30, { align: 'center' });
            
            y = 70;
            const headerTable = [[data.namaKandidat, data.posisiDilamar, data.cabangKapos]];
            (doc as any).autoTable({
                head: [['Nama Kandidat', 'Posisi yang dilamar', 'Cabang - Kapos']],
                body: headerTable, startY: y, theme: 'grid',
                headStyles: { fillColor: [30, 58, 138], fontSize: 9, halign: 'center' },
                bodyStyles: { fontSize: 8, halign: 'center' },
            });
            y = (doc as any).autoTable.previous.finalY + LINE_HEIGHT_MD;
            
            drawSectionTitle('A. Status Kandidat & B. Pengalaman');
            let checkY = y; let col1Y = checkY, col2Y = checkY;
            const col2X = margin + contentWidth / 2;
            
            doc.setFontSize(8); doc.setFont('helvetica', 'bold'); doc.setTextColor(LIGHT_TEXT_COLOR);
            doc.text("Status Kandidat (A)", margin, col1Y); col1Y += LINE_HEIGHT_SM;
            col1Y = drawRadioOrCheckbox('New Hire Eksternal', data.statusKandidat === 'New Hire Eksternal', 'radio', margin, col1Y);
            col1Y = drawRadioOrCheckbox('Adira Finance to Outsourcing', data.statusKandidat === 'Adira Finance to Outsourcing', 'radio', margin, col1Y);

            doc.setFontSize(8); doc.setFont('helvetica', 'bold'); doc.setTextColor(LIGHT_TEXT_COLOR);
            doc.text("Pengalaman (B)", col2X, col2Y); col2Y += LINE_HEIGHT_SM;
            col2Y = drawRadioOrCheckbox('Pengalaman Kerja', data.pengalaman.includes('Pengalaman Kerja'), 'check', col2X, col2Y);
            col2Y = drawRadioOrCheckbox('Fresh graduated, freelance', data.pengalaman.includes('Fresh graduated, pengalaman freelance'), 'check', col2X, col2Y);
            col2Y = drawRadioOrCheckbox('Fresh graduated, magang', data.pengalaman.includes('Fresh graduated, pengalaman magang'), 'check', col2X, col2Y);
            col2Y = drawRadioOrCheckbox('Fresh graduated, tanpa pengalaman', data.pengalaman.includes('Fresh graduated, tanpa pengalaman'), 'check', col2X, col2Y);
            y = Math.max(col1Y, col2Y);
            
            drawSectionTitle('C, D, E. Riwayat & Referensi');
            drawPair('Nama Perusahaan (C)', data.namaPerusahaan, { fullWidth: true });
            drawPair('Nama Pereferensi (D)', data.pemberiReferensiNama);
            drawPair('Jabatan Pereferensi (D)', data.pemberiReferensiJabatan);
            drawPair('Nomor Telp. (D)', data.pemberiReferensiTelp);
            drawPair('Masa Kerja (E)', `${data.masaKerjaTahun || '0'} Tahun, ${data.masaKerjaBulan || '0'} Bulan`);

            drawSectionTitle('F, G, H, I, J. Hasil Verifikasi');
            drawPair('Kehadiran (F)', `${data.masalahKehadiran} (Tak masuk: ${data.tidakMasukIzin} kali)`);
            drawPair('Kesehatan (G)', `${data.masalahKesehatan}${data.masalahKesehatanDetail ? `: ${data.masalahKesehatanDetail}` : ''}`);
            drawPair('Relasi Atasan (H)', `${data.relasiAtasan}${data.relasiAtasanDetail ? `: ${data.relasiAtasanDetail}` : ''}`);
            drawPair('Relasi Rekan (H)', `${data.relasiRekan}${data.relasiRekanDetail ? `: ${data.relasiRekanDetail}` : ''}`);
            drawPair('Relasi Bawahan (H)', `${data.relasiBawahan}${data.relasiBawahanDetail ? `: ${data.relasiBawahanDetail}` : ''}`);
            drawPair('Integritas (I)', `${data.integritas}${data.integritasDetail ? `: ${data.integritasDetail}` : ''}`);
            drawPair('Performance (J)', data.performance);
            
            drawSectionTitle('K. Alasan Resign');
            drawPair('(i) Tipe', data.alasanResignI);
            drawPair('(ii) Kategori', data.alasanResignII.join(', ') || '-');
            drawPair('(iii) Lainnya', data.alasanResignIII);
            drawPair('(iv) Penjelasan Wajib', data.alasanResignIVPenjelasan, { fullWidth: true });

            drawSectionTitle('L, M. Media Sosial & Angsuran');
            drawPair('Alamat Akun Medsos (L)', data.akunMedsosAlamat);
            drawPair('Status Akun (L)', `${data.akunMedsosStatus.join(', ')}${data.akunMedsosLainnya ? ` (Lainnya: ${data.akunMedsosLainnya})` : ''}`, { fullWidth: true });
            drawPair('Jenis Angsuran (M)', data.jenisAngsuran.join(', '));
            drawPair('Tenor Cicilan (M)', data.tenorCicilan);
            drawPair('Tunggakan (M)', data.tunggakan);
            drawPair('Kartu Kredit (M)', data.kartuKredit);

            drawSectionTitle('N. Rekomendasi');
            drawPair('Rekomendasi', data.rekomendasi);
            drawPair('EMAIL', data.email);
            drawPair('Justifikasi', data.justifikasi, { fullWidth: true });

            const footerHeight = 80, signatureHeight = 70;
            let sigY = pageHeight - footerHeight - signatureHeight;
            if (y > sigY - 20) { doc.addPage(); y = margin; }
            sigY = pageHeight - footerHeight - signatureHeight;

            const dibuatOleh = SIGNATORIES.find(s => s.name === data.dibuatOleh);
            const diperiksaOleh = SIGNATORIES.find(s => s.name === data.diperiksaOleh);
            const diketahuiOleh = SIGNATORIES.find(s => s.name === data.diketahuiOleh);

            doc.setDrawColor(BORDER_COLOR); doc.line(margin, sigY - 10, pageWidth - margin, sigY - 10);
            
            const sigWidth = contentWidth / 3;
            doc.setFontSize(8); doc.setTextColor(TEXT_COLOR);
            doc.text('Dibuat Oleh,', margin + (sigWidth * 0.5), sigY, { align: 'center' });
            doc.text('Diperiksa Oleh,', margin + (sigWidth * 1.5), sigY, { align: 'center' });
            doc.text('Diketahui Oleh,', margin + (sigWidth * 2.5), sigY, { align: 'center' });

            const imageHeight = 30; const imageBaseY = sigY + 5;
            const addSignatureImage = (sigData: {name: string, image: string} | undefined, colIndex: number) => {
                if (sigData && sigData.image) {
                    try {
                        const imgProps = doc.getImageProperties(sigData.image);
                        const imgWidth = (imageHeight * imgProps.width) / imgProps.height;
                        const xPos = margin + (sigWidth * (colIndex + 0.5)) - (imgWidth / 2);
                        doc.addImage(sigData.image, 'PNG', xPos, imageBaseY, imgWidth, imageHeight);
                    } catch (e) { console.error("Could not add signature image for " + sigData.name, e); }
                }
            };
            addSignatureImage(dibuatOleh, 0); addSignatureImage(diperiksaOleh, 1); addSignatureImage(diketahuiOleh, 2);

            const textY = imageBaseY + imageHeight + 10;
            doc.setFont('helvetica', 'bold');
            doc.text(`( ${dibuatOleh?.name || '...'} )`, margin + (sigWidth * 0.5), textY, { align: 'center' });
            doc.text(`( ${diperiksaOleh?.name || '...'} )`, margin + (sigWidth * 1.5), textY, { align: 'center' });
            doc.text(`( ${diketahuiOleh?.name || '...'} )`, margin + (sigWidth * 2.5), textY, { align: 'center' });

            doc.setFillColor(FOOTER_BG_COLOR); doc.rect(0, pageHeight - footerHeight, pageWidth, footerHeight, 'F');
            let footerY = pageHeight - footerHeight + 12;
            doc.setFontSize(7); doc.setTextColor(FOOTER_TEXT_COLOR);
            const footerNotes = [
                'Pada Point (D): Pemberi referensi WAJIB hrd & atau atasan langsung. Data diri pemberi referensi harus lengkap.',
                'Pada point (F): Kadang terlambat = 1 bulan maksimal 3x. Sering Terlambat = 1 bulan > 3x. Dan pernah tidak masuk tanpa izin berapa kali ?',
                'Pada point (K): Ceklist salah satu pada kategori (i), dan boleh ceklist lebih dari satu pada kategori (ii), yang selanjutnya WAJIB mengisi detail resign pada kategori (iv).',
                'Justifikasi = penjelasan kenapa kandidat ini tetap ingin dilanjutkan prosesnya, padahal point (L) Tidak direkomendasikan.'
            ];
            footerNotes.forEach(note => {
                const splitNote = doc.splitTextToSize(note, contentWidth);
                doc.text(splitNote, margin, footerY);
                footerY += (splitNote.length * 8) + 1;
            });

            doc.save(`FORM_ADIRA_${data.namaKandidat.replace(/\s+/g, '_')}.pdf`);
        } catch (error) {
            console.error("Gagal membuat PDF:", error);
            alert("Gagal membuat PDF. Silakan periksa konsol untuk detailnya.");
        } finally {
            setIsGeneratingPdf(false);
        }
    };

    if (!data) return null;
    return (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-75 overflow-y-auto h-full w-full z-50 flex items-center justify-center p-4">
            <div className="relative mx-auto w-full max-w-4xl shadow-lg rounded-2xl bg-white" onClick={(e) => e.stopPropagation()}>
                <div className="flex justify-between items-center border-b p-5">
                    <div>
                        <h3 className="text-xl font-bold text-gray-800">Pratinjau: {data.namaKandidat}</h3>
                        <p className="text-sm text-gray-500">{data.posisiDilamar} - {data.cabangKapos}</p>
                    </div>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600"><CloseIcon/></button>
                </div>
                <div className="p-2 md:p-4 max-h-[70vh] overflow-y-auto bg-gray-100">
                    <AdiraPreview data={data} />
                </div>
                <div className="p-5 border-t flex justify-between items-center">
                    <button onClick={handleGeneratePdf} disabled={isGeneratingPdf} className="bg-indigo-700 text-white font-semibold py-2 px-6 rounded-lg shadow hover:bg-indigo-800 transition-all duration-200 disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center gap-2">
                        {isGeneratingPdf ? <><SpinnerIcon /><span>Membuat PDF...</span></> : 'Unduh PDF'}
                    </button>
                    <button onClick={onClose} className="bg-gray-500 text-white font-bold py-2 px-6 rounded-lg hover:bg-gray-600 transition-colors">Tutup</button>
                </div>
            </div>
        </div>
    );
};

// --- END: MODALS FOR ADIRA --- //


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
    const [isJatengFormModalOpen, setIsJatengFormModalOpen] = useState(false);
    const [isJatengDeleteModalOpen, setIsJatengDeleteModalOpen] = useState(false);
    const [isJatengPreviewModalOpen, setIsJatengPreviewModalOpen] = useState(false);
    const [selectedJatengData, setSelectedJatengData] = useState<WomJatengRefcekData | null>(null);

    // State for WOM SULAWESI CRUD
    const [isSulawesiFormModalOpen, setIsSulawesiFormModalOpen] = useState(false);
    const [isSulawesiDeleteModalOpen, setIsSulawesiDeleteModalOpen] = useState(false);
    const [isSulawesiPreviewModalOpen, setIsSulawesiPreviewModalOpen] = useState(false);
    const [selectedSulawesiData, setSelectedSulawesiData] = useState<WomSulawesiRefcekData | null>(null);

    // State for MAF CRUD
    const [isMafFormModalOpen, setIsMafFormModalOpen] = useState(false);
    const [isMafDeleteModalOpen, setIsMafDeleteModalOpen] = useState(false);
    const [isMafPreviewModalOpen, setIsMafPreviewModalOpen] = useState(false);
    const [selectedMafData, setSelectedMafData] = useState<MafRefcekData | null>(null);

    // State for MCF CRUD
    const [isMcfFormModalOpen, setIsMcfFormModalOpen] = useState(false);
    const [isMcfDeleteModalOpen, setIsMcfDeleteModalOpen] = useState(false);
    const [isMcfPreviewModalOpen, setIsMcfPreviewModalOpen] = useState(false);
    const [selectedMcfData, setSelectedMcfData] = useState<McfRefcekData | null>(null);
    
    // State for ADIRA CRUD
    const [isAdiraFormModalOpen, setIsAdiraFormModalOpen] = useState(false);
    const [isAdiraDeleteModalOpen, setIsAdiraDeleteModalOpen] = useState(false);
    const [isAdiraPreviewModalOpen, setIsAdiraPreviewModalOpen] = useState(false);
    const [selectedAdiraData, setSelectedAdiraData] = useState<AdiraRefcekData | null>(null);


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
    
    // --- CRUD Handlers for WOM JATENG --- //
    const handleOpenJatengAdd = () => { setSelectedJatengData(null); setIsJatengFormModalOpen(true); };
    const handleOpenJatengEdit = (data: WomJatengRefcekData) => { setSelectedJatengData(data); setIsJatengFormModalOpen(true); };
    const handleOpenJatengPreview = (data: WomJatengRefcekData) => { setSelectedJatengData(data); setIsJatengPreviewModalOpen(true); };
    const handleOpenJatengDelete = (data: WomJatengRefcekData) => { setSelectedJatengData(data); setIsJatengDeleteModalOpen(true); };
    const handleConfirmJatengDelete = () => {
        if (selectedJatengData) {
            props.onDeleteWomJatengRefcek(selectedJatengData.id);
            setIsJatengDeleteModalOpen(false);
            setSelectedJatengData(null);
        }
    };
    const handleJatengFormSubmit = (data: Omit<WomJatengRefcekData, 'id'> | WomJatengRefcekData) => {
        if ('id' in data) {
            props.onUpdateWomJatengRefcek(data);
        } else {
            props.onAddWomJatengRefcek(data);
        }
        setIsJatengFormModalOpen(false);
    };

    // --- CRUD Handlers for WOM SULAWESI --- //
    const handleOpenSulawesiAdd = () => { setSelectedSulawesiData(null); setIsSulawesiFormModalOpen(true); };
    const handleOpenSulawesiEdit = (data: WomSulawesiRefcekData) => { setSelectedSulawesiData(data); setIsSulawesiFormModalOpen(true); };
    const handleOpenSulawesiPreview = (data: WomSulawesiRefcekData) => { setSelectedSulawesiData(data); setIsSulawesiPreviewModalOpen(true); };
    const handleOpenSulawesiDelete = (data: WomSulawesiRefcekData) => { setSelectedSulawesiData(data); setIsSulawesiDeleteModalOpen(true); };
    const handleConfirmSulawesiDelete = () => {
        if (selectedSulawesiData) {
            props.onDeleteWomSulawesiRefcek(selectedSulawesiData.id);
            setIsSulawesiDeleteModalOpen(false);
            setSelectedSulawesiData(null);
        }
    };
    const handleSulawesiFormSubmit = (data: Omit<WomSulawesiRefcekData, 'id'> | WomSulawesiRefcekData) => {
        if ('id' in data) {
            props.onUpdateWomSulawesiRefcek(data);
        } else {
            props.onAddWomSulawesiRefcek(data);
        }
        setIsSulawesiFormModalOpen(false);
    };

    // --- CRUD Handlers for MAF --- //
    const handleOpenMafAdd = () => { setSelectedMafData(null); setIsMafFormModalOpen(true); };
    const handleOpenMafEdit = (data: MafRefcekData) => { setSelectedMafData(data); setIsMafFormModalOpen(true); };
    const handleOpenMafPreview = (data: MafRefcekData) => { setSelectedMafData(data); setIsMafPreviewModalOpen(true); };
    const handleOpenMafDelete = (data: MafRefcekData) => { setSelectedMafData(data); setIsMafDeleteModalOpen(true); };
    const handleConfirmMafDelete = () => {
        if (selectedMafData) {
            props.onDeleteMafRefcek(selectedMafData.id);
            setIsMafDeleteModalOpen(false);
            setSelectedMafData(null);
        }
    };
    const handleMafFormSubmit = (data: Omit<MafRefcekData, 'id'> | MafRefcekData) => {
        if ('id' in data) {
            props.onUpdateMafRefcek(data);
        } else {
            props.onAddMafRefcek(data);
        }
        setIsMafFormModalOpen(false);
    };

    // --- CRUD Handlers for MCF --- //
    const handleOpenMcfAdd = () => { setSelectedMcfData(null); setIsMcfFormModalOpen(true); };
    const handleOpenMcfEdit = (data: McfRefcekData) => { setSelectedMcfData(data); setIsMcfFormModalOpen(true); };
    const handleOpenMcfPreview = (data: McfRefcekData) => { setSelectedMcfData(data); setIsMcfPreviewModalOpen(true); };
    const handleOpenMcfDelete = (data: McfRefcekData) => { setSelectedMcfData(data); setIsMcfDeleteModalOpen(true); };
    const handleConfirmMcfDelete = () => {
        if (selectedMcfData) {
            props.onDeleteMcfRefcek(selectedMcfData.id);
            setIsMcfDeleteModalOpen(false);
            setSelectedMcfData(null);
        }
    };
    const handleMcfFormSubmit = (data: Omit<McfRefcekData, 'id'> | McfRefcekData) => {
        if ('id' in data) {
            props.onUpdateMcfRefcek(data);
        } else {
            props.onAddMcfRefcek(data);
        }
        setIsMcfFormModalOpen(false);
    };

    // --- CRUD Handlers for ADIRA --- //
    const handleOpenAdiraAdd = () => { setSelectedAdiraData(null); setIsAdiraFormModalOpen(true); };
    const handleOpenAdiraEdit = (data: AdiraRefcekData) => { setSelectedAdiraData(data); setIsAdiraFormModalOpen(true); };
    const handleOpenAdiraPreview = (data: AdiraRefcekData) => { setSelectedAdiraData(data); setIsAdiraPreviewModalOpen(true); };
    const handleOpenAdiraDelete = (data: AdiraRefcekData) => { setSelectedAdiraData(data); setIsAdiraDeleteModalOpen(true); };
    const handleConfirmAdiraDelete = () => {
        if (selectedAdiraData) {
            props.onDeleteAdiraRefcek(selectedAdiraData.id);
            setIsAdiraDeleteModalOpen(false);
            setSelectedAdiraData(null);
        }
    };
    const handleAdiraFormSubmit = (data: Omit<AdiraRefcekData, 'id'> | AdiraRefcekData) => {
        if ('id' in data) {
            props.onUpdateAdiraRefcek(data);
        } else {
            props.onAddAdiraRefcek(data);
        }
        setIsAdiraFormModalOpen(false);
    };

    const renderWomJatengGenerator = () => (
        <div className="w-full h-full flex flex-col p-4 bg-gray-100">
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold text-gray-800">Manajemen Form - WOM JATENG</h3>
                <button
                    onClick={handleOpenJatengAdd}
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
                                        <button onClick={() => handleOpenJatengPreview(d)} className="text-blue-600 hover:text-blue-900" title="Lihat Pratinjau"><EyeIcon/></button>
                                        <button onClick={() => handleOpenJatengEdit(d)} className="text-yellow-600 hover:text-yellow-900" title="Edit"><PencilIcon/></button>
                                        <button onClick={() => handleOpenJatengDelete(d)} className="text-red-600 hover:text-red-900" title="Hapus"><TrashIcon/></button>
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
            <WomJatengFormModal 
                isOpen={isJatengFormModalOpen}
                onClose={() => setIsJatengFormModalOpen(false)}
                onSubmit={handleJatengFormSubmit}
                initialData={selectedJatengData}
            />
            {isJatengPreviewModalOpen && <WomJatengPreviewModal 
                data={selectedJatengData}
                onClose={() => { setIsJatengPreviewModalOpen(false); setSelectedJatengData(null); }}
            />}
            {selectedJatengData && <DeleteConfirmModal 
                isOpen={isJatengDeleteModalOpen}
                onClose={() => setIsJatengDeleteModalOpen(false)}
                onConfirm={handleConfirmJatengDelete}
                itemName={selectedJatengData.namaKandidat}
            />}
        </div>
    );
    
    const renderWomSulawesiGenerator = () => (
        <div className="w-full h-full flex flex-col p-4 bg-gray-100">
             <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold text-gray-800">Manajemen Form - WOM SULAWESI</h3>
                <button
                    onClick={handleOpenSulawesiAdd}
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
                        {props.womSulawesiRefcekData.map(d => (
                            <tr key={d.id} className="hover:bg-gray-50">
                                <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{d.namaKandidat}</td>
                                <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">{d.posisiDilamar}</td>
                                <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">{d.cabangKapos}</td>
                                <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">{new Date(d.createdAt).toLocaleDateString('id-ID')}</td>
                                <td className="px-4 py-4 whitespace-nowrap text-sm text-center">
                                    <div className="flex items-center justify-center gap-3">
                                        <button onClick={() => handleOpenSulawesiPreview(d)} className="text-blue-600 hover:text-blue-900" title="Lihat Pratinjau"><EyeIcon/></button>
                                        <button onClick={() => handleOpenSulawesiEdit(d)} className="text-yellow-600 hover:text-yellow-900" title="Edit"><PencilIcon/></button>
                                        <button onClick={() => handleOpenSulawesiDelete(d)} className="text-red-600 hover:text-red-900" title="Hapus"><TrashIcon/></button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                 {props.womSulawesiRefcekData.length === 0 && (
                    <p className="text-center text-gray-500 py-10">Belum ada data. Silakan "Buat Form Baru".</p>
                )}
            </div>
            <WomSulawesiFormModal
                isOpen={isSulawesiFormModalOpen}
                onClose={() => setIsSulawesiFormModalOpen(false)}
                onSubmit={handleSulawesiFormSubmit}
                initialData={selectedSulawesiData}
            />
            {isSulawesiPreviewModalOpen && <WomSulawesiPreviewModal
                data={selectedSulawesiData}
                onClose={() => { setIsSulawesiPreviewModalOpen(false); setSelectedSulawesiData(null); }}
            />}
            {selectedSulawesiData && <DeleteConfirmModal 
                isOpen={isSulawesiDeleteModalOpen}
                onClose={() => setIsSulawesiDeleteModalOpen(false)}
                onConfirm={handleConfirmSulawesiDelete}
                itemName={selectedSulawesiData.namaKandidat}
            />}
        </div>
    );
    
    const renderMafGenerator = () => (
        <div className="w-full h-full flex flex-col p-4 bg-gray-100">
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold text-gray-800">Manajemen Form - MAF</h3>
                <button
                    onClick={handleOpenMafAdd}
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
                        {props.mafRefcekData.map(d => (
                            <tr key={d.id} className="hover:bg-gray-50">
                                <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{d.namaKandidat}</td>
                                <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">{d.posisiDilamar}</td>
                                <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">{d.cabangKapos}</td>
                                <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">{new Date(d.createdAt).toLocaleDateString('id-ID')}</td>
                                <td className="px-4 py-4 whitespace-nowrap text-sm text-center">
                                    <div className="flex items-center justify-center gap-3">
                                        <button onClick={() => handleOpenMafPreview(d)} className="text-blue-600 hover:text-blue-900" title="Lihat Pratinjau"><EyeIcon/></button>
                                        <button onClick={() => handleOpenMafEdit(d)} className="text-yellow-600 hover:text-yellow-900" title="Edit"><PencilIcon/></button>
                                        <button onClick={() => handleOpenMafDelete(d)} className="text-red-600 hover:text-red-900" title="Hapus"><TrashIcon/></button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                 {props.mafRefcekData.length === 0 && (
                    <p className="text-center text-gray-500 py-10">Belum ada data. Silakan "Buat Form Baru".</p>
                )}
            </div>
             <MafFormModal 
                isOpen={isMafFormModalOpen}
                onClose={() => setIsMafFormModalOpen(false)}
                onSubmit={handleMafFormSubmit}
                initialData={selectedMafData}
            />
            {isMafPreviewModalOpen && <MafPreviewModal 
                data={selectedMafData}
                onClose={() => { setIsMafPreviewModalOpen(false); setSelectedMafData(null); }}
            />}
            {selectedMafData && <DeleteConfirmModal 
                isOpen={isMafDeleteModalOpen}
                onClose={() => setIsMafDeleteModalOpen(false)}
                onConfirm={handleConfirmMafDelete}
                itemName={selectedMafData.namaKandidat}
            />}
        </div>
    );
    
    const renderMcfGenerator = () => (
        <div className="w-full h-full flex flex-col p-4 bg-gray-100">
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold text-gray-800">Manajemen Form - MCF</h3>
                <button
                    onClick={handleOpenMcfAdd}
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
                        {props.mcfRefcekData.map(d => (
                            <tr key={d.id} className="hover:bg-gray-50">
                                <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{d.namaKandidat}</td>
                                <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">{d.posisiDilamar}</td>
                                <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">{d.cabangKapos}</td>
                                <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">{new Date(d.createdAt).toLocaleDateString('id-ID')}</td>
                                <td className="px-4 py-4 whitespace-nowrap text-sm text-center">
                                    <div className="flex items-center justify-center gap-3">
                                        <button onClick={() => handleOpenMcfPreview(d)} className="text-blue-600 hover:text-blue-900" title="Lihat Pratinjau"><EyeIcon/></button>
                                        <button onClick={() => handleOpenMcfEdit(d)} className="text-yellow-600 hover:text-yellow-900" title="Edit"><PencilIcon/></button>
                                        <button onClick={() => handleOpenMcfDelete(d)} className="text-red-600 hover:text-red-900" title="Hapus"><TrashIcon/></button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                 {props.mcfRefcekData.length === 0 && (
                    <p className="text-center text-gray-500 py-10">Belum ada data. Silakan "Buat Form Baru".</p>
                )}
            </div>
            <McfFormModal 
                isOpen={isMcfFormModalOpen}
                onClose={() => setIsMcfFormModalOpen(false)}
                onSubmit={handleMcfFormSubmit}
                initialData={selectedMcfData}
            />
            {isMcfPreviewModalOpen && <McfPreviewModal 
                data={selectedMcfData}
                onClose={() => { setIsMcfPreviewModalOpen(false); setSelectedMcfData(null); }}
            />}
            {selectedMcfData && <DeleteConfirmModal 
                isOpen={isMcfDeleteModalOpen}
                onClose={() => setIsMcfDeleteModalOpen(false)}
                onConfirm={handleConfirmMcfDelete}
                itemName={selectedMcfData.namaKandidat}
            />}
        </div>
    );

    const renderAdiraGenerator = () => (
        <div className="w-full h-full flex flex-col p-4 bg-gray-100">
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold text-gray-800">Manajemen Form - ADIRA</h3>
                <button
                    onClick={handleOpenAdiraAdd}
                    className="bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg shadow hover:bg-blue-700 transition-colors"
                >
                    + Buat Form Baru
                </button>
            </div>
            <div className="flex-grow overflow-auto bg-white rounded-lg shadow">
                 <table className="min-w-full divide-y divide-gray-200