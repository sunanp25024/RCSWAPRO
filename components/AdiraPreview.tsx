import React from 'react';
import { AdiraRefcekData } from '../types';
import { SIGNATORIES } from '../constants';

const CheckboxDisplay: React.FC<{ label: string; checked: boolean }> = ({ label, checked }) => (
    <div className="flex items-start text-xs py-0.5">
        <span className="mr-2 text-indigo-700 text-sm leading-4">{checked ? '☑' : '☐'}</span>
        <span className={checked ? 'text-gray-800 font-medium' : 'text-gray-500'}>{label}</span>
    </div>
);

const RadioDisplay: React.FC<{ label: string; checked: boolean }> = ({ label, checked }) => (
    <div className="flex items-start text-xs py-0.5">
        <span className="mr-2 text-indigo-700 text-sm leading-4">{checked ? '◉' : '○'}</span>
        <span className={checked ? 'text-gray-800 font-medium' : 'text-gray-500'}>{label}</span>
    </div>
);

const DataPair: React.FC<{ label: string; children: React.ReactNode; fullWidth?: boolean }> = ({ label, children, fullWidth = false }) => {
    if (!children || (typeof children === 'string' && !children.trim())) return null;
    return (
        <div className={`py-1 ${fullWidth ? 'col-span-2' : ''}`}>
            <p className="text-xs font-semibold text-gray-500">{label}</p>
            <p className="text-sm text-gray-800">{children}</p>
        </div>
    );
};

const Section: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
    <div className="mt-2">
        <h3 className="text-xs font-bold text-indigo-800 border-b border-indigo-200 pb-1 mb-2 uppercase">{title}</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6">
            {children}
        </div>
    </div>
);

const AdiraPreview: React.FC<{ data: AdiraRefcekData | null }> = ({ data }) => {
    if (!data) {
        return (
            <div className="p-10 text-center bg-gray-50 rounded-lg">
                <p className="text-gray-500">Data tidak tersedia untuk pratinjau.</p>
            </div>
        );
    }

    const defaultSignatory = { name: 'N/A', image: '' };
    const dibuatOleh = SIGNATORIES.find(s => s.name === data.dibuatOleh) || { name: data.dibuatOleh, image: ''};
    const diperiksaOleh = SIGNATORIES.find(s => s.name === data.diperiksaOleh) || defaultSignatory;
    const diketahuiOleh = SIGNATORIES.find(s => s.name === data.diketahuiOleh) || defaultSignatory;
    
    return (
        <div className="bg-white p-6 shadow-lg font-sans">
            <header className="bg-indigo-800 text-white p-4 rounded-t-lg -m-6 mb-4">
                <h1 className="text-xl font-bold text-center">REFERENCE CHECK FORM</h1>
            </header>

            <div className="text-center mb-4">
                <h2 className="text-lg font-bold text-gray-900">{data.namaKandidat}</h2>
                <p className="text-sm text-gray-600">{`${data.posisiDilamar} - ${data.cabangKapos}`}</p>
            </div>

            <main>
                <Section title="A. Status Kandidat & B. Pengalaman">
                   <div className="col-span-1">
                     <p className="text-xs font-bold text-gray-500 mb-1">Status Kandidat</p>
                     <RadioDisplay label="New Hire Eksternal" checked={data.statusKandidat === 'New Hire Eksternal'} />
                     <RadioDisplay label="Adira Finance to Outsourcing" checked={data.statusKandidat === 'Adira Finance to Outsourcing'} />
                   </div>
                   <div className="col-span-1">
                     <p className="text-xs font-bold text-gray-500 mb-1">Pengalaman</p>
                     <CheckboxDisplay label="Pengalaman Kerja" checked={data.pengalaman.includes('Pengalaman Kerja')} />
                     <CheckboxDisplay label="Fresh graduated, freelance" checked={data.pengalaman.includes('Fresh graduated, pengalaman freelance')} />
                     <CheckboxDisplay label="Fresh graduated, magang" checked={data.pengalaman.includes('Fresh graduated, pengalaman magang')} />
                     <CheckboxDisplay label="Fresh graduated, tanpa pengalaman" checked={data.pengalaman.includes('Fresh graduated, tanpa pengalaman')} />
                   </div>
                </Section>
                
                <Section title="C, D, E. Riwayat & Referensi">
                    <DataPair label="Nama Perusahaan (C)" fullWidth>{data.namaPerusahaan}</DataPair>
                    <DataPair label="Nama Pemberi Referensi (D)">{data.pemberiReferensiNama}</DataPair>
                    <DataPair label="Jabatan Pereferensi (D)">{data.pemberiReferensiJabatan}</DataPair>
                    <DataPair label="Nomor Telepon (D)">{data.pemberiReferensiTelp}</DataPair>
                    <DataPair label="Masa Kerja (E)">{`${data.masaKerjaTahun || '0'} Tahun, ${data.masaKerjaBulan || '0'} Bulan`}</DataPair>
                </Section>

                 <Section title="F, G, H, I, J. Hasil Verifikasi">
                    <DataPair label="Kehadiran (F)">{`${data.masalahKehadiran} (Tak masuk: ${data.tidakMasukIzin} kali)`}</DataPair>
                    <DataPair label="Kesehatan (G)">{`${data.masalahKesehatan}${data.masalahKesehatanDetail ? `: ${data.masalahKesehatanDetail}` : ''}`}</DataPair>
                    <DataPair label="Relasi Atasan (H)">{`${data.relasiAtasan}${data.relasiAtasanDetail ? `: ${data.relasiAtasanDetail}` : ''}`}</DataPair>
                    <DataPair label="Relasi Rekan (H)">{`${data.relasiRekan}${data.relasiRekanDetail ? `: ${data.relasiRekanDetail}` : ''}`}</DataPair>
                    <DataPair label="Relasi Bawahan (H)">{`${data.relasiBawahan}${data.relasiBawahanDetail ? `: ${data.relasiBawahanDetail}` : ''}`}</DataPair>
                    <DataPair label="Integritas (I)">{`${data.integritas}${data.integritasDetail ? `: ${data.integritasDetail}` : ''}`}</DataPair>
                    <DataPair label="Performance (J)">{data.performance}</DataPair>
                </Section>

                 <Section title="K. Alasan Resign">
                    <DataPair label="(i) Tipe">{data.alasanResignI}</DataPair>
                    <DataPair label="(ii) Kategori">{data.alasanResignII.join(', ') || '-'}</DataPair>
                    <DataPair label="(iii) Lainnya">{data.alasanResignIII}</DataPair>
                    <DataPair label="(iv) Penjelasan Wajib" fullWidth>{data.alasanResignIVPenjelasan}</DataPair>
                </Section>

                 <Section title="L, M. Media Sosial & Angsuran">
                    <DataPair label="Alamat Akun Medsos (L)">{data.akunMedsosAlamat}</DataPair>
                    <DataPair label="Status Akun (L)" fullWidth>{`${data.akunMedsosStatus.join(', ')}${data.akunMedsosLainnya ? ` (Lainnya: ${data.akunMedsosLainnya})` : ''}`}</DataPair>
                    <DataPair label="Jenis Angsuran (M)">{data.jenisAngsuran.join(', ')}</DataPair>
                    <DataPair label="Tenor Cicilan (M)">{data.tenorCicilan}</DataPair>
                    <DataPair label="Tunggakan (M)">{data.tunggakan}</DataPair>
                    <DataPair label="Kartu Kredit (M)">{data.kartuKredit}</DataPair>
                </Section>

                <Section title="N. Rekomendasi">
                    <DataPair label="Rekomendasi">{data.rekomendasi}</DataPair>
                    <DataPair label="Email">{data.email}</DataPair>
                    <DataPair label="Justifikasi" fullWidth>{data.justifikasi}</DataPair>
                </Section>
            </main>

            <div className="mt-4 pt-4 border-t border-gray-200">
                <div className="grid grid-cols-3 text-center text-xs text-gray-600">
                     <div>
                        <p>Dibuat Oleh,</p>
                        <div className="h-12 flex items-center justify-center">
                            {dibuatOleh.image && <img src={dibuatOleh.image} alt="Tanda Tangan" className="h-10 object-contain" />}
                        </div>
                        <p className="font-bold">( {dibuatOleh.name} )</p>
                    </div>
                    <div>
                        <p>Diperiksa Oleh,</p>
                         <div className="h-12 flex items-center justify-center">
                            {diperiksaOleh.image && <img src={diperiksaOleh.image} alt="Tanda Tangan" className="h-10 object-contain" />}
                         </div>
                        <p className="font-bold">( {diperiksaOleh.name} )</p>
                    </div>
                    <div>
                        <p>Diketahui Oleh,</p>
                        <div className="h-12 flex items-center justify-center">
                            {diketahuiOleh.image && <img src={diketahuiOleh.image} alt="Tanda Tangan" className="h-10 object-contain" />}
                        </div>
                        <p className="font-bold">( {diketahuiOleh.name} )</p>
                    </div>
                </div>
            </div>

            <footer className="bg-indigo-800 text-indigo-200 text-xs p-4 rounded-b-lg -m-6 mt-4 space-y-1">
                <p><span className="font-bold text-white">Pada Point (D):</span> Pemberi referensi WAJIB hrd & atau atasan langsung. Data diri pemberi referensi harus lengkap.</p>
                <p><span className="font-bold text-white">Pada point (F):</span> Kadang terlambat = 1 bulan maksimal 3x. Sering Terlambat = 1 bulan &gt; 3x. Dan pernah tidak masuk tanpa izin berapa kali ?</p>
                <p><span className="font-bold text-white">Pada point (K):</span> Ceklist salah satu pada kategori (i), dan boleh ceklist lebih dari satu pada kategori (ii), yang selanjutnya WAJIB mengisi detail resign pada kategori (iv).</p>
                <p><span className="font-bold text-white">Justifikasi:</span> Penjelasan kenapa kandidat ini tetap ingin dilanjutkan prosesnya, padahal point (N) Tidak direkomendasikan.</p>
            </footer>
        </div>
    );
};

export default AdiraPreview;
