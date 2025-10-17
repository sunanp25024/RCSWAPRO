import React, { useState } from 'react';
import { LaporanData } from '../types';

interface LaporanFormModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (data: Omit<LaporanData, 'id'> | LaporanData) => void;
    initialData: LaporanData | null;
}

const LaporanFormModal: React.FC<LaporanFormModalProps> = ({ isOpen, onClose, onSubmit, initialData }) => {
    const [formData, setFormData] = useState<Omit<LaporanData, 'id' | 'jenisKelamin'> & { jenisKelamin: 'Laki-laki' | 'Perempuan' | '' }>(() => {
        return initialData || {
            tanggalRequest: '', perusahaan: '', cabang: '', posisiPekerjaan: '', statusKandidat: '', tanggaTerbit: '',
            sumberKandidat: '', namaLengkap: '', jenisKelamin: '', tempatTglLahir: '', nomorKTP: '', alamatDomisili: '',
            alamatKTP: '', noHpWa: '', agama: '', namaIbuKandung: '', tempatTglLahirIbuKandung: '', bidangUsaha: '',
            pengalamanPekerjaan: '', masaKerjaKandidat: '', referensi: '', nomorTeleponReferensi: '', alasanResign: '',
            akunSosialMedia: '', email: '', golDarah: '', masalahKehadiran: '', relasiDenganAtasan: '', terkaitIntegritas: '',
            performance: '', penjelasanResign: '', hasilRekomendasi: '', justifikasi: '', keterangan: ''
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

    const renderInput = (name: keyof typeof formData, label: string, type: 'text' | 'date' | 'tel' | 'email' | 'number') => (
        <div>
            <label htmlFor={name} className="block text-sm font-medium text-gray-700">{label}</label>
            <input type={type} id={name} name={name} value={(formData as any)[name]} onChange={handleChange} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm text-gray-900"/>
        </div>
    );
    
    const renderTextarea = (name: keyof typeof formData, label: string) => (
        <div className="md:col-span-2">
            <label htmlFor={name} className="block text-sm font-medium text-gray-700">{label}</label>
            <textarea id={name} name={name} value={(formData as any)[name]} onChange={handleChange} rows={2} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm text-gray-900"></textarea>
        </div>
    );

    return (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-75 overflow-y-auto h-full w-full z-50 flex items-center justify-center p-4">
            <div className="relative mx-auto w-full max-w-4xl shadow-lg rounded-2xl bg-white">
                <form onSubmit={handleSubmit}>
                    <div className="flex justify-between items-center border-b p-5">
                        <h3 className="text-xl font-bold text-gray-800">{initialData ? 'Edit Laporan' : 'Tambah Laporan Baru'}</h3>
                        <button type="button" onClick={onClose} className="text-gray-400 hover:text-gray-600"><CloseIcon/></button>
                    </div>
                    <div className="p-5 max-h-[75vh] overflow-y-auto space-y-4">
                        <h4 className="font-semibold text-gray-600">Informasi Request</h4>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            {renderInput('tanggalRequest', 'Tanggal Request', 'date')}
                            {renderInput('perusahaan', 'Perusahaan', 'text')}
                            {renderInput('cabang', 'Cabang', 'text')}
                            {renderInput('posisiPekerjaan', 'Posisi Pekerjaan', 'text')}
                            {renderInput('statusKandidat', 'Status Kandidat', 'text')}
                            {renderInput('tanggaTerbit', 'Tanggal Terbit', 'date')}
                            {renderInput('sumberKandidat', 'Sumber Kandidat', 'text')}
                        </div>
                        <hr className="my-4"/>
                        <h4 className="font-semibold text-gray-600">Data Diri & Keluarga</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {renderInput('namaLengkap', 'Nama Lengkap', 'text')}
                            <div>
                               <label htmlFor="jenisKelamin" className="block text-sm font-medium text-gray-700">Jenis Kelamin</label>
                                <select id="jenisKelamin" name="jenisKelamin" value={formData.jenisKelamin} onChange={handleChange} className="mt-1 block w-full px-3 py-2 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm text-gray-900">
                                    <option value="">Pilih...</option>
                                    <option value="Laki-laki">Laki-laki</option>
                                    <option value="Perempuan">Perempuan</option>
                                </select>
                            </div>
                            {renderInput('tempatTglLahir', 'Tempat & Tgl Lahir', 'text')}
                            {renderInput('nomorKTP', 'Nomor KTP', 'number')}
                            {renderInput('noHpWa', 'No Hp / Wa', 'tel')}
                            {renderInput('agama', 'Agama', 'text')}
                            {renderInput('email', 'Email', 'email')}
                            {renderInput('golDarah', 'Gol. Darah', 'text')}
                            {renderTextarea('alamatDomisili', 'Alamat Domisili')}
                            {renderTextarea('alamatKTP', 'Alamat KTP')}
                            {renderInput('namaIbuKandung', 'Nama Ibu Kandung', 'text')}
                            {renderInput('tempatTglLahirIbuKandung', 'Tempat & Tgl Lahir Ibu Kandung', 'text')}
                            {renderInput('akunSosialMedia', 'Akun Sosial Media', 'text')}
                        </div>
                        <hr className="my-4"/>
                        <h4 className="font-semibold text-gray-600">Riwayat Pekerjaan & Referensi</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                             {renderInput('bidangUsaha', 'Bidang Usaha', 'text')}
                             {renderInput('pengalamanPekerjaan', 'Pengalaman Pekerjaan', 'text')}
                             {renderInput('masaKerjaKandidat', 'Masa Kerja Kandidat', 'text')}
                             {renderInput('referensi', 'Referensi (Pemberi & Jabatan)', 'text')}
                             {renderInput('nomorTeleponReferensi', 'Nomor Telepon Referensi', 'tel')}
                             {renderTextarea('alasanResign', 'Alasan Resign')}
                        </div>
                        <hr className="my-4"/>
                        <h4 className="font-semibold text-gray-600">Hasil Verifikasi & Rekomendasi</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                           {renderInput('masalahKehadiran', 'Masalah Kehadiran', 'text')}
                           {renderInput('relasiDenganAtasan', 'Relasi Dengan Atasan', 'text')}
                           {renderInput('terkaitIntegritas', 'Terkait Integritas', 'text')}
                           {renderInput('performance', 'Performance', 'text')}
                           {renderTextarea('penjelasanResign', 'Penjelasan Resign')}
                           {renderTextarea('hasilRekomendasi', 'Hasil Rekomendasi')}
                           {renderTextarea('justifikasi', 'Justifikasi')}
                           {renderTextarea('keterangan', 'Keterangan')}
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

export default LaporanFormModal;
