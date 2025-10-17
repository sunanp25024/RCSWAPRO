import React from 'react';
import { LaporanData } from '../types';

interface LaporanDetailModalProps {
    data: LaporanData;
    onClose: () => void;
}

const LaporanDetailModal: React.FC<LaporanDetailModalProps> = ({ data, onClose }) => {
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
            <div className="relative mx-auto w-full max-w-3xl shadow-lg rounded-2xl bg-white" onClick={(e) => e.stopPropagation()}>
                <div className="flex justify-between items-center border-b p-5">
                    <h3 className="text-xl font-bold text-gray-800">Detail Laporan: {data.namaLengkap}</h3>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600"><CloseIcon/></button>
                </div>
                <div className="p-5 max-h-[70vh] overflow-y-auto">
                    <dl>
                        {sectionTitle('Informasi Pekerjaan')}
                        {detailItem('Tanggal Request', data.tanggalRequest)}
                        {detailItem('Tanggal Terbit', data.tanggaTerbit)}
                        {detailItem('Perusahaan', data.perusahaan)}
                        {detailItem('Cabang', data.cabang)}
                        {detailItem('Posisi Pekerjaan', data.posisiPekerjaan)}
                        {detailItem('Status Kandidat', data.statusKandidat)}
                        {detailItem('Sumber Kandidat', data.sumberKandidat)}

                        {sectionTitle('Data Diri Kandidat')}
                        {detailItem('Nama Lengkap', data.namaLengkap)}
                        {detailItem('Jenis Kelamin', data.jenisKelamin)}
                        {detailItem('Tempat & Tgl Lahir', data.tempatTglLahir)}
                        {detailItem('Nomor KTP', data.nomorKTP)}
                        {detailItem('Alamat Domisili', data.alamatDomisili)}
                        {detailItem('Alamat KTP', data.alamatKTP)}
                        {detailItem('No Hp / Wa', data.noHpWa)}
                        {detailItem('Agama', data.agama)}
                        {detailItem('Email', data.email)}
                        {detailItem('Akun Sosial Media', data.akunSosialMedia)}
                        {detailItem('Gol. Darah', data.golDarah)}

                        {sectionTitle('Data Keluarga')}
                        {detailItem('Nama Ibu Kandung', data.namaIbuKandung)}
                        {detailItem('Tempat & Tgl Lahir Ibu', data.tempatTglLahirIbuKandung)}
                        
                        {sectionTitle('Riwayat & Referensi Pekerjaan')}
                        {detailItem('Bidang Usaha', data.bidangUsaha)}
                        {detailItem('Pengalaman Pekerjaan', data.pengalamanPekerjaan)}
                        {detailItem('Masa Kerja Kandidat', data.masaKerjaKandidat)}
                        {detailItem('Referensi (Pemberi & Jabatan)', data.referensi)}
                        {detailItem('Nomor Telepon Referensi', data.nomorTeleponReferensi)}
                        {detailItem('Alasan Resign', data.alasanResign)}
                        {detailItem('Penjelasan Resign', data.penjelasanResign)}

                        {sectionTitle('Hasil Verifikasi')}
                        {detailItem('Masalah Kehadiran', data.masalahKehadiran)}
                        {detailItem('Relasi Dengan Atasan', data.relasiDenganAtasan)}
                        {detailItem('Terkait Integritas', data.terkaitIntegritas)}
                        {detailItem('Performance', data.performance)}
                        {detailItem('Hasil Rekomendasi', data.hasilRekomendasi)}
                        {detailItem('Justifikasi', data.justifikasi)}
                        {detailItem('Keterangan', data.keterangan)}

                    </dl>
                </div>
                <div className="p-5 border-t flex justify-end">
                    <button onClick={onClose} className="bg-gray-500 text-white font-bold py-2 px-6 rounded-lg hover:bg-gray-600 transition-colors">Tutup</button>
                </div>
            </div>
        </div>
    );
};

const CloseIcon = () => <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>;

export default LaporanDetailModal;
