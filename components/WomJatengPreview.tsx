import React from 'react';
import { WomJatengRefcekData } from '../types';

interface WomJatengPreviewProps {
    data: WomJatengRefcekData | null;
}

const Section: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
    <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
        <h3 className="text-md font-bold text-gray-800 border-b pb-2 mb-3">{title}</h3>
        <div className="space-y-2">{children}</div>
    </div>
);

const DataRow: React.FC<{ label: string; children: React.ReactNode; isBlock?: boolean }> = ({ label, children, isBlock }) => {
    if (!children) return null;
    return (
        <div className={`grid ${isBlock ? 'grid-cols-1' : 'grid-cols-1 md:grid-cols-3'} gap-1 text-sm`}>
            <dt className="text-gray-500">{label}</dt>
            <dd className="md:col-span-2 font-semibold text-gray-900">{children}</dd>
        </div>
    );
};

const WomJatengPreview: React.FC<WomJatengPreviewProps> = ({ data }) => {
    if (!data) {
        return (
            <div className="flex flex-col items-center justify-center h-full text-center text-gray-500 p-4">
                <svg className="w-16 h-16 mb-4 text-gray-300" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <h3 className="text-lg font-semibold">Data Tidak Ditemukan</h3>
                <p className="text-sm">Pilih data dari tabel untuk melihat pratinjau.</p>
            </div>
        );
    }
    
    return (
        <div className="space-y-4 font-sans text-gray-800">
            <Section title="A. Status Kandidat & Pengalaman">
                <DataRow label="Status Kandidat">{data.statusKandidat}</DataRow>
                <DataRow label="Pengalaman">{data.pengalaman.join(', ') || '-'}</DataRow>
            </Section>

            <Section title="B. Informasi Referensi & Riwayat Kerja">
                <DataRow label="Nama Perusahaan">{data.namaPerusahaan}</DataRow>
                <DataRow label="Nama Pereferensi">{data.pemberiReferensiNama}</DataRow>
                <DataRow label="Jabatan Pereferensi">{data.pemberiReferensiJabatan}</DataRow>
                <DataRow label="No. Telp Pereferensi">{data.pemberiReferensiTelp}</DataRow>
                <DataRow label="Masa Kerja">{data.masaKerjaTahun || '0'} Tahun, {data.masaKerjaBulan || '0'} Bulan</DataRow>
            </Section>

            <Section title="C. Hasil Verifikasi">
                <DataRow label="Kehadiran">{data.masalahKehadiran} (Tidak masuk tanpa izin: {data.tidakMasukIzin} kali)</DataRow>
                <DataRow label="Kesehatan">
                    {data.masalahKesehatan}
                    {data.masalahKesehatan === 'Pernah Sakit Berkepanjangan' && `: ${data.masalahKesehatanDetail}`}
                </DataRow>
                 <DataRow label="Relasi Atasan">
                    {data.relasiAtasan}
                    {data.relasiAtasan === 'Tidak Baik' && `: ${data.relasiAtasanDetail}`}
                </DataRow>
                <DataRow label="Relasi Rekan Kerja">
                    {data.relasiRekan}
                    {data.relasiRekan === 'Tidak Baik' && `: ${data.relasiRekanDetail}`}
                </DataRow>
                <DataRow label="Relasi Bawahan">
                    {data.relasiBawahan}
                    {data.relasiBawahan === 'Tidak Baik' && `: ${data.relasiBawahanDetail}`}
                </DataRow>
                <DataRow label="Integritas">
                    {data.integritas}
                    {data.integritas !== 'Tidak ada masalah Fraud' && `: ${data.integritasDetail}`}
                </DataRow>
                <DataRow label="Performance">{data.performance}</DataRow>
            </Section>

            <Section title="D. Alasan Resign">
                <DataRow label="Tipe Pengunduran Diri">{data.alasanResignI}</DataRow>
                <DataRow label="Penyebab">{data.alasanResignII.join(', ') || '-'}</DataRow>
                <DataRow label="Lainnya">{data.alasanResignIII}</DataRow>
                <DataRow label="Penjelasan" isBlock>{data.alasanResignIVPenjelasan}</DataRow>
            </Section>

            <Section title="E. Media Sosial & Rekomendasi">
                <DataRow label="Alamat Akun">{data.akunMedsosAlamat}</DataRow>
                <DataRow label="Status Akun">{data.akunMedsosStatus.join(', ')}</DataRow>
                 <DataRow label="Catatan Lain">{data.akunMedsosLainnya}</DataRow>
                <DataRow label="Rekomendasi">{data.rekomendasi}</DataRow>
                <DataRow label="Justifikasi" isBlock>{data.justifikasi}</DataRow>
                 <DataRow label="Email">{data.email}</DataRow>
            </Section>

             <Section title="F. Verifikasi & Persetujuan">
                <div className="grid grid-cols-3 text-center text-sm pt-4">
                     <div>
                        <p className="font-semibold">Dibuat Oleh</p>
                        <div className="h-16"></div>
                        <p>( Suci Ramanda Putri )</p>
                    </div>
                    <div>
                        <p className="font-semibold">Diperiksa Oleh</p>
                         <div className="h-16"></div>
                        <p>( Yeni Kristanti )</p>
                    </div>
                    <div>
                        <p className="font-semibold">Diketahui Oleh</p>
                        <div className="h-16"></div>
                        <p>( Wisnu Pramusinto )</p>
                    </div>
                </div>
            </Section>

        </div>
    );
};

export default WomJatengPreview;
