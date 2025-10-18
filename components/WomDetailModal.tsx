import React from 'react';
import { WomData } from '../types';

declare const jspdf: any;
declare const XLSX: any;

interface WomDetailModalProps {
    data: WomData;
    onClose: () => void;
}

const WomDetailModal: React.FC<WomDetailModalProps> = ({ data, onClose }) => {
    
    const fieldsConfig = [
        { section: 'DATA DIRI PELAMAR', fields: [
            { label: 'Tanggal Reff Check', key: 'tanggalReffCheck' },
            { label: 'Nama Pelamar', key: 'namaPelamar' },
            { label: 'Cabang', key: 'cabang' },
            { label: 'Lokasi Kerja', key: 'lokasiKerja' },
            { label: 'BU', key: 'bu' },
            { label: 'Source', key: 'source' },
            { label: 'Jenis Kelamin', value: data.jenisKelamin === 'L' ? 'Laki-laki' : 'Perempuan' },
            { label: 'Tempat & Tanggal Lahir', value: `${data.tempatLahir}, ${data.tanggalLahir}` },
            { label: 'Nomor e-KTP', key: 'nomorKtp' },
            { label: 'Agama', key: 'agama' },
            { label: 'Alamat Lengkap (KTP)', key: 'alamatKtp' },
            { label: 'No. Telp/HP', key: 'noTelp' },
            { label: 'Nama Ibu Kandung', key: 'namaIbuKandung' },
            { label: 'Tempat & Tanggal Lahir Ibu', value: `${data.tempatLahirIbu}, ${data.tanggalLahirIbu}` },
            { label: 'Email', key: 'email' },
            { label: 'Golongan Darah', key: 'golonganDarah' },
        ]},
        { section: 'DATA REFERENCE CHECK', fields: [
            { label: 'Status Kandidat', key: 'statusKandidat' },
            { label: 'Posisi Yang Dilamar', key: 'posisiDilamar' },
            { label: 'Pengalaman', key: 'pengalaman' },
            { label: 'Nama Perusahaan', key: 'namaPerusahaan' },
            { label: 'Bidang Usaha', key: 'bidangUsaha' },
            { label: 'Pemberi Referensi', key: 'pemberiReferensi' },
            { label: 'Nomor Telepon Referensi', key: 'nomorTeleponReferensi' },
            { label: 'Jabatan Referensi', key: 'jabatanReferensi' },
            { label: 'Jabatan Terakhir Kandidat', key: 'jabatanTerakhirKandidat' },
            { label: 'Masa Kerja Kandidat', key: 'masaKerjaKandidat' },
            { label: 'Masalah Kehadiran', key: 'masalahKehadiran' },
            { label: 'Tidak Masuk Tanpa Izin', key: 'tidakMasukTanpaIzin' },
            { label: 'Masalah Kesehatan', key: 'masalahKesehatan' },
            { label: 'Relasi Dengan Rekan/Atasan', key: 'relasiDengan' },
            { label: 'Terkait Integritas', key: 'terkaitIntegritas' },
            { label: 'Performance', key: 'performance' },
            { label: 'Alasan Resign', key: 'alasanResign' },
            { label: 'Penjelasan Resign', key: 'penjelasanResign' },
        ]},
        { section: 'AKUN SOSIAL MEDIA', fields: [
            { label: 'Facebook', key: 'facebook' },
            { label: 'Instagram', key: 'instagram' },
            { label: 'Twitter', key: 'twitter' },
            { label: 'Akun Media Sosial Lainnya', key: 'akunMediaSosialLainnya' },
        ]},
        { section: 'EVALUASI & REKOMENDASI', fields: [
            { label: 'Kelebihan Kandidat', key: 'kelebihanKandidat' },
            { label: 'Kekurangan Kandidat', key: 'kekuranganKandidat' },
            { label: 'Rekomendasi', key: 'rekomendasi' },
            { label: 'Justifikasi', key: 'justifikasi' },
        ]}
    ];

    const handleDownloadPDF = () => {
        const doc = new jspdf.jsPDF();
        doc.setFontSize(16);
        doc.text(`Detail Laporan WOM: ${data.namaPelamar}`, 14, 22);
        
        let y = 35;
        fieldsConfig.forEach(section => {
            if (y > 260) { doc.addPage(); y = 20; }
            y += 6;
            doc.setFontSize(12);
            doc.setFont(undefined, 'bold');
            doc.text(section.section, 14, y);
            y += 7;
            doc.setFontSize(10);
            doc.setFont(undefined, 'normal');

            section.fields.forEach(field => {
                if (y > 280) { doc.addPage(); y = 20; }
                const value = 'key' in field ? (data as any)[field.key] || '-' : field.value;
                const valueLines = doc.splitTextToSize(value.toString(), 120);

                doc.setFont(undefined, 'bold');
                doc.text(field.label, 14, y);
                doc.setFont(undefined, 'normal');
                doc.text(valueLines, 70, y);
                y += (valueLines.length * 5) + 3;
            });
        });
        
        doc.save(`detail_wom_${data.namaPelamar.replace(/\s/g, '_')}.pdf`);
    };

    const handleDownloadExcel = () => {
        const dataToExport = fieldsConfig.flatMap(section => 
            section.fields.map(field => ({
                Properti: field.label,
                Nilai: 'key' in field ? (data as any)[field.key] || '-' : field.value,
                Kategori: section.section
            }))
        );
            
        const ws = XLSX.utils.json_to_sheet(dataToExport);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "Detail");
        XLSX.writeFile(wb, `detail_wom_${data.namaPelamar.replace(/\s/g, '_')}.xlsx`);
    };


    const detailItem = (label: string, value: string | undefined | null) => (
        <div className="py-2 grid grid-cols-1 md:grid-cols-3 gap-1 md:gap-4 border-b last:border-b-0">
            <dt className="text-sm font-medium text-gray-500">{label}</dt>
            <dd className="mt-1 text-sm text-gray-900 md:mt-0 md:col-span-2">{value || '-'}</dd>
        </div>
    );

    const sectionTitle = (title: string) => (
        <h4 className="text-md font-semibold text-[#1E3A8A] mt-4 mb-2 pt-2 border-t first:mt-0 first:border-t-0">{title}</h4>
    );

    return (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-75 overflow-y-auto h-full w-full z-50 flex items-center justify-center p-4">
            <div className="relative mx-auto w-full max-w-4xl shadow-lg rounded-2xl bg-white" onClick={(e) => e.stopPropagation()}>
                <div className="flex justify-between items-center border-b p-5">
                    <h3 className="text-xl font-bold text-gray-800">Detail WOM: {data.namaPelamar}</h3>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600"><CloseIcon/></button>
                </div>
                <div className="p-5 max-h-[70vh] overflow-y-auto">
                    <dl>
                        {fieldsConfig.map(section => (
                            <React.Fragment key={section.section}>
                                {sectionTitle(section.section)}
                                {section.fields.map(field => detailItem(field.label, 'key' in field ? (data as any)[field.key] : field.value))}
                            </React.Fragment>
                        ))}
                    </dl>
                </div>
                <div className="p-5 border-t flex justify-between items-center">
                    <div className="flex items-center gap-2">
                        <button onClick={handleDownloadPDF} className="flex items-center gap-2 bg-red-600 text-white font-semibold py-2 px-4 rounded-lg shadow hover:bg-red-700 transition-colors text-sm">
                            <FilePdfIcon /> Unduh PDF
                        </button>
                        <button onClick={handleDownloadExcel} className="flex items-center gap-2 bg-green-600 text-white font-semibold py-2 px-4 rounded-lg shadow hover:bg-green-700 transition-colors text-sm">
                            <FileExcelIcon /> Unduh Excel
                        </button>
                    </div>
                    <button onClick={onClose} className="bg-gray-500 text-white font-bold py-2 px-6 rounded-lg hover:bg-gray-600 transition-colors">Tutup</button>
                </div>
            </div>
        </div>
    );
};

const CloseIcon = () => <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>;
const FilePdfIcon = () => <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>;
const FileExcelIcon = () => <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3M4 17v2a2 2 0 002 2h12a2 2 0 002-2v-2M4 7l8-4 8 4M4 7v10h16V7L12 3 4 7z" /></svg>;

export default WomDetailModal;