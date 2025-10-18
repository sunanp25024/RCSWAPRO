import React, { useState } from 'react';
import { WomData } from '../types';

interface WomFormModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (data: Omit<WomData, 'id'> | WomData) => void;
    initialData: WomData | null;
}

const WomFormModal: React.FC<WomFormModalProps> = ({ isOpen, onClose, onSubmit, initialData }) => {
    const [formData, setFormData] = useState<Omit<WomData, 'id' | 'jenisKelamin'> & { jenisKelamin: 'L' | 'P' | '' }>(() => {
        return initialData || {
            tanggalReffCheck: '', namaPelamar: '', cabang: '', lokasiKerja: '', bu: '', source: '', jenisKelamin: '',
            tempatLahir: '', tanggalLahir: '', nomorKtp: '', agama: '', alamatKtp: '', noTelp: '', namaIbuKandung: '',
            tempatLahirIbu: '', tanggalLahirIbu: '', statusKandidat: '', posisiDilamar: '', pengalaman: '',
            namaPerusahaan: '', bidangUsaha: '', pemberiReferensi: '', nomorTeleponReferensi: '', jabatanReferensi: '',
            jabatanTerakhirKandidat: '', masaKerjaKandidat: '', masalahKehadiran: '', tidakMasukTanpaIzin: '',
            masalahKesehatan: '', relasiDengan: '', terkaitIntegritas: '', performance: '', alasanResign: '',
            penjelasanResign: '', facebook: '', instagram: '', twitter: '', akunMediaSosialLainnya: '',
            kelebihanKandidat: '', kekuranganKandidat: '', email: '', golonganDarah: '', rekomendasi: '', justifikasi: ''
        }
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit(initialData ? { ...formData, id: initialData.id } : formData);
    };

    if (!isOpen) return null;
    
    const sectionTitle = (title: string) => <h4 className="text-lg font-semibold text-gray-700 mt-4 pt-4 border-t col-span-full">{title}</h4>;

    const renderInput = (name: keyof typeof formData, label: string, type: 'text' | 'date' | 'tel' | 'email' | 'number') => (
        <div>
            <label htmlFor={name} className="block text-sm font-medium text-gray-700">{label}</label>
            <input type={type} id={name} name={name} value={(formData as any)[name]} onChange={handleChange} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm text-gray-900"/>
        </div>
    );
    
    // FIX: Changed type of span from a restrictive union to string to allow more flexible Tailwind classes.
    const renderTextarea = (name: keyof typeof formData, label: string, span?: string) => (
        <div className={span || ''}>
            <label htmlFor={name} className="block text-sm font-medium text-gray-700">{label}</label>
            <textarea id={name} name={name} value={(formData as any)[name]} onChange={handleChange} rows={2} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm text-gray-900"></textarea>
        </div>
    );

    return (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-75 overflow-y-auto h-full w-full z-50 flex items-center justify-center p-4">
            <div className="relative mx-auto w-full max-w-5xl shadow-lg rounded-2xl bg-white">
                <form onSubmit={handleSubmit}>
                    <div className="flex justify-between items-center border-b p-5">
                        <h3 className="text-xl font-bold text-gray-800">{initialData ? 'Edit Data WOM' : 'Tambah Data WOM Baru'}</h3>
                        <button type="button" onClick={onClose} className="text-gray-400 hover:text-gray-600"><CloseIcon/></button>
                    </div>
                    <div className="p-5 max-h-[80vh] overflow-y-auto">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                            {sectionTitle('Data Diri Pelamar')}
                            {renderInput('tanggalReffCheck', 'Tanggal Reff Check', 'date')}
                            {renderInput('namaPelamar', 'Nama Pelamar', 'text')}
                            {renderInput('cabang', 'Cabang', 'text')}
                            {renderInput('lokasiKerja', 'Lokasi Kerja', 'text')}
                            {renderInput('bu', 'BU', 'text')}
                            {renderInput('source', 'Source', 'text')}
                            <div>
                               <label htmlFor="jenisKelamin" className="block text-sm font-medium text-gray-700">Jenis Kelamin</label>
                                <select id="jenisKelamin" name="jenisKelamin" value={formData.jenisKelamin} onChange={handleChange} className="mt-1 block w-full px-3 py-2 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm text-gray-900">
                                    <option value="">Pilih...</option>
                                    <option value="L">Laki-laki</option>
                                    <option value="P">Perempuan</option>
                                </select>
                            </div>
                            {renderInput('tempatLahir', 'Tempat Lahir', 'text')}
                            {renderInput('tanggalLahir', 'Tanggal Lahir', 'date')}
                            {renderInput('nomorKtp', 'Nomor e-KTP', 'number')}
                            {renderInput('agama', 'Agama', 'text')}
                            {renderInput('noTelp', 'No. Telp/HP', 'tel')}
                            {renderInput('namaIbuKandung', 'Nama Ibu Kandung', 'text')}
                            {renderInput('tempatLahirIbu', 'Tempat Lahir Ibu', 'text')}
                            {renderInput('tanggalLahirIbu', 'Tanggal Lahir Ibu', 'date')}
                            {renderInput('email', 'Email', 'email')}
                            {renderInput('golonganDarah', 'Golongan Darah', 'text')}
                            {renderTextarea('alamatKtp', 'Alamat Lengkap (KTP)', 'md:col-span-2 lg:col-span-4')}

                            {sectionTitle('Data Reference Check')}
                            {renderInput('statusKandidat', 'Status Kandidat', 'text')}
                            {renderInput('posisiDilamar', 'Posisi Yang Dilamar', 'text')}
                            {renderInput('namaPerusahaan', 'Nama Perusahaan', 'text')}
                            {renderInput('bidangUsaha', 'Bidang Usaha', 'text')}
                            {renderInput('pemberiReferensi', 'Pemberi Referensi', 'text')}
                            {renderInput('nomorTeleponReferensi', 'Nomor Telepon Referensi', 'tel')}
                            {renderInput('jabatanReferensi', 'Jabatan Referensi', 'text')}
                            {renderInput('jabatanTerakhirKandidat', 'Jabatan Terakhir Kandidat', 'text')}
                            {renderTextarea('pengalaman', 'Pengalaman', 'md:col-span-2 lg:col-span-4')}
                            {renderInput('masaKerjaKandidat', 'Masa Kerja Kandidat', 'text')}
                            {renderInput('masalahKehadiran', 'Masalah Kehadiran', 'text')}
                            {renderInput('tidakMasukTanpaIzin', 'Tidak Masuk Tanpa Izin', 'text')}
                            {renderInput('masalahKesehatan', 'Masalah Kesehatan', 'text')}
                            {renderTextarea('relasiDengan', 'Relasi Dengan Rekan/Atasan', 'md:col-span-2 lg:col-span-4')}
                            {renderTextarea('terkaitIntegritas', 'Terkait Integritas', 'md:col-span-2 lg:col-span-4')}
                            {renderTextarea('performance', 'Performance', 'md:col-span-2 lg:col-span-4')}
                            {renderTextarea('alasanResign', 'Alasan Resign', 'md:col-span-2 lg:col-span-4')}
                            {renderTextarea('penjelasanResign', 'Penjelasan Resign', 'md:col-span-2 lg:col-span-4')}

                            {sectionTitle('Akun Sosial Media')}
                            {renderInput('facebook', 'Facebook', 'text')}
                            {renderInput('instagram', 'Instagram', 'text')}
                            {renderInput('twitter', 'Twitter', 'text')}
                            {renderInput('akunMediaSosialLainnya', 'Akun Media Sosial Lainnya', 'text')}

                            {sectionTitle('Evaluasi & Rekomendasi')}
                            {renderTextarea('kelebihanKandidat', 'Kelebihan Kandidat', 'md:col-span-2')}
                            {renderTextarea('kekuranganKandidat', 'Kekurangan Kandidat', 'md:col-span-2')}
                            {renderTextarea('rekomendasi', 'Rekomendasi', 'md:col-span-2')}
                            {renderTextarea('justifikasi', 'Justifikasi', 'md:col-span-2')}
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

const CloseIcon = () => <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>;

export default WomFormModal;