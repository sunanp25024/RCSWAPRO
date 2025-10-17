
import React, { useState } from 'react';
import { Page, FormData } from '../types';

interface FormPageProps {
  onNavigate: (page: Page) => void;
  onSubmit: (data: FormData) => void;
}

const initialFormData: FormData = {
  namaLengkap: '', jenisKelamin: '', ttl: '', nomorKTP: '', alamatKTP: '', alamatDomisili: '',
  nomorHP: '', agama: '', namaIbu: '', ttlIbu: '', pengalamanKerja: '', masaKerja: '',
  namaAtasan: '', nomorAtasan: '', alasanResign: '', facebook: '', instagram: '', linkedin: '',
  email: '', golonganDarah: ''
};

const FormPage: React.FC<FormPageProps> = ({ onNavigate, onSubmit }) => {
    const [formData, setFormData] = useState<FormData>(initialFormData);
    const [errors, setErrors] = useState<Partial<Record<keyof FormData, string>>>({});
    const [submitted, setSubmitted] = useState(false);

    const validate = (): boolean => {
        const newErrors: Partial<Record<keyof FormData, string>> = {};
        let isValid = true;

        (Object.keys(formData) as Array<keyof FormData>).forEach(key => {
            if (key !== 'facebook' && key !== 'instagram' && key !== 'linkedin' && !formData[key]) {
                newErrors[key] = 'Kolom ini wajib diisi';
                isValid = false;
            }
        });
        
        if (formData.nomorKTP && formData.nomorKTP.length !== 16) {
            newErrors.nomorKTP = 'Nomor KTP harus 16 digit';
            isValid = false;
        }

        if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            newErrors.email = 'Format email tidak valid';
            isValid = false;
        }

        setErrors(newErrors);
        return isValid;
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (validate()) {
            onSubmit(formData);
            setSubmitted(true);
            setTimeout(() => {
                setSubmitted(false);
            }, 3000);
        }
    };
    
    return (
    <div className="min-h-screen bg-gray-100 p-4 sm:p-6 lg:p-8">
        <div className="max-w-4xl mx-auto">
            <button onClick={() => onNavigate(Page.LANDING)} className="mb-4 text-blue-600 hover:underline">
                &larr; Kembali ke Halaman Utama
            </button>
            <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-sm">
                <h1 className="text-2xl font-bold text-[#1E3A8A] mb-6 text-center">FORM BACKGROUND CHECKING SWAPRO</h1>
                
                {submitted && (
                    <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mb-4" role="alert">
                        <strong className="font-bold">Sukses!</strong>
                        <span className="block sm:inline"> Data berhasil dikirim.</span>
                    </div>
                )}
                
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {renderInput('namaLengkap', 'Nama Lengkap', 'text', 'Budi Santoso')}
                        {renderSelect('jenisKelamin', 'Jenis Kelamin', ['Laki-laki', 'Perempuan'])}
                        {renderInput('ttl', 'Tempat dan Tanggal Lahir', 'text', 'Jakarta, 15 September 2025')}
                        {renderInput('nomorKTP', 'Nomor KTP', 'number', '3171010101900001')}
                        {renderTextarea('alamatKTP', 'Alamat KTP (Lengkap)')}
                        {renderTextarea('alamatDomisili', 'Alamat Domisili (Lengkap)')}
                        {renderInput('nomorHP', 'Nomor HP / WhatsApp', 'tel', '081234567890')}
                        {renderInput('agama', 'Agama', 'text', 'Islam')}
                        {renderInput('namaIbu', 'Nama Ibu Kandung', 'text', 'Siti Aminah')}
                        {renderInput('ttlIbu', 'Tempat dan Tanggal Lahir Ibu Kandung', 'text', 'Bandung, 10 Oktober 1975')}
                        {renderTextarea('pengalamanKerja', 'Pengalaman Pekerjaan', 'PT. Swapro – Collection')}
                        {renderInput('masaKerja', 'Mulai dan Selesai Masa Kerja', 'text', '2 Januari 2023 – 1 Februari 2024')}
                        {renderInput('namaAtasan', 'Nama Atasan Terakhir dan Jabatan', 'text', 'Andika – Supervisor')}
                        {renderInput('nomorAtasan', 'Nomor Telepon Atasan', 'tel', '089876543210')}
                        {renderTextarea('alasanResign', 'Alasan Resign')}
                    </div>

                    <div className="pt-4 border-t">
                        <h2 className="text-lg font-semibold text-gray-700 mb-4">Informasi Tambahan – Akun Sosial Media</h2>
                        <div className="space-y-4">
                            {renderSocialInput('facebook', 'Facebook', 'Swaproint')}
                            {renderSocialInput('instagram', 'Instagram', 'Swaprokarir')}
                            {renderSocialInput('linkedin', 'LinkedIn', 'Swaproint')}
                        </div>
                    </div>

                    <div className="pt-4 border-t grid grid-cols-1 md:grid-cols-2 gap-4">
                        {renderInput('email', 'Email', 'email', 'contoh@email.com')}
                        {renderInput('golonganDarah', 'Golongan Darah', 'text', 'A')}
                    </div>

                    <div className="flex justify-end pt-4">
                        <button type="submit" className="bg-blue-600 text-white font-bold py-3 px-8 rounded-lg shadow-md hover:bg-blue-700 transition-colors duration-200">
                            Kirim Data
                        </button>
                    </div>
                </form>
            </div>
        </div>
    </div>
    );
    
    function renderInput(name: keyof FormData, label: string, type: string, placeholder?: string) {
        return (
            <div>
                <label htmlFor={name} className="block text-sm font-medium text-gray-700">{label}</label>
                <input
                    type={type}
                    id={name}
                    name={name}
                    value={formData[name] as string}
                    onChange={handleChange}
                    placeholder={placeholder}
                    className={`mt-1 block w-full px-3 py-2 border ${errors[name] ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm`}
                />
                {errors[name] && <p className="text-red-500 text-xs mt-1">{errors[name]}</p>}
            </div>
        );
    }
    
    function renderSelect(name: keyof FormData, label: string, options: string[]) {
        return (
            <div>
                <label htmlFor={name} className="block text-sm font-medium text-gray-700">{label}</label>
                <select
                    id={name}
                    name={name}
                    value={formData[name] as string}
                    onChange={handleChange}
                    className={`mt-1 block w-full px-3 py-2 border ${errors[name] ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm`}
                >
                    <option value="">Pilih...</option>
                    {options.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                </select>
                {errors[name] && <p className="text-red-500 text-xs mt-1">{errors[name]}</p>}
            </div>
        )
    }

    function renderTextarea(name: keyof FormData, label: string, placeholder?: string) {
        return (
            <div className="md:col-span-2">
                <label htmlFor={name} className="block text-sm font-medium text-gray-700">{label}</label>
                <textarea
                    id={name}
                    name={name}
                    value={formData[name] as string}
                    onChange={handleChange}
                    rows={3}
                    placeholder={placeholder}
                    className={`mt-1 block w-full px-3 py-2 border ${errors[name] ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm`}
                />
                {errors[name] && <p className="text-red-500 text-xs mt-1">{errors[name]}</p>}
            </div>
        );
    }
    
    function renderSocialInput(name: keyof FormData, label: string, placeholder: string) {
        // FIX: Replaced JSX.Element with React.ReactElement to resolve "Cannot find namespace 'JSX'" error.
        const icons: Record<string, React.ReactElement> = {
            facebook: <svg className="h-6 w-6 text-blue-600" fill="currentColor" viewBox="0 0 24 24"><path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v2.385z" /></svg>,
            instagram: <svg className="h-6 w-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37zm1.5-4.87h.01"></path></svg>,
            linkedin: <svg className="h-6 w-6 text-blue-700" fill="currentColor" viewBox="0 0 24 24"><path d="M4.98 3.5c0 1.381-1.11 2.5-2.48 2.5s-2.48-1.119-2.48-2.5c0-1.38 1.11-2.5 2.48-2.5s2.48 1.12 2.48 2.5zm.02 4.5h-5v16h5v-16zm7.982 0h-4.968v16h4.969v-8.399c0-4.67 6.029-5.052 6.029 0v8.399h4.988v-10.131c0-7.88-8.922-7.593-11.018-3.714v-2.155z" /></svg>,
        };
        return (
            <div className="flex items-center gap-3">
                <div className="w-8 flex-shrink-0">{icons[name]}</div>
                <input
                    type="text"
                    id={name}
                    name={name}
                    value={formData[name] as string}
                    onChange={handleChange}
                    placeholder={placeholder}
                    className="flex-grow block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
            </div>
        );
    }
};

export default FormPage;