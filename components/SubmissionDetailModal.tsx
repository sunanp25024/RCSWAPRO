import React from 'react';
import { Submission, Status } from '../types';

interface SubmissionDetailModalProps {
  submission: Submission;
  onClose: () => void;
  onStatusChange: (newStatus: Status) => void;
}

const SubmissionDetailModal: React.FC<SubmissionDetailModalProps> = ({ submission, onClose, onStatusChange }) => {
    if (!submission) return null;

    const detailItem = (label: string, value: string | undefined) => (
        <div className="py-3 sm:grid sm:grid-cols-3 sm:gap-4 border-b border-gray-200 last:border-b-0">
            <dt className="text-sm font-medium text-gray-500">{label}</dt>
            <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{value || '-'}</dd>
        </div>
    );

    const sectionTitle = (title: string) => (
        <h4 className="text-md font-semibold text-[#1E3A8A] mt-6 mb-2 pt-4 border-t">{title}</h4>
    );

    return (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-75 overflow-y-auto h-full w-full z-50 flex items-center justify-center p-4" onClick={onClose}>
            <div className="relative mx-auto w-full max-w-3xl shadow-lg rounded-2xl bg-white" onClick={(e) => e.stopPropagation()}>
                <div className="flex justify-between items-center border-b p-5">
                    <h3 className="text-xl font-bold text-[#1E3A8A]">Detail Kandidat: {submission.namaLengkap}</h3>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
                        <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                    </button>
                </div>
                <div className="p-5 max-h-[70vh] overflow-y-auto">
                    <dl>
                        {detailItem('ID Pengajuan', submission.id)}
                        {detailItem('Tanggal Pengajuan', new Date(submission.submissionDate).toLocaleString('id-ID', { dateStyle: 'long', timeStyle: 'short' }))}
                        {detailItem('Status Saat Ini', submission.status)}
                        
                        {sectionTitle('Data Diri Kandidat')}
                        {detailItem('Nama Lengkap', submission.namaLengkap)}
                        {detailItem('Jenis Kelamin', submission.jenisKelamin)}
                        {detailItem('Tempat & Tanggal Lahir', submission.ttl)}
                        {detailItem('Nomor KTP', submission.nomorKTP)}
                        {detailItem('Alamat KTP', submission.alamatKTP)}
                        {detailItem('Alamat Domisili', submission.alamatDomisili)}
                        {detailItem('Nomor HP / WA', submission.nomorHP)}
                        {detailItem('Agama', submission.agama)}
                        {detailItem('Golongan Darah', submission.golonganDarah)}
                        {detailItem('Email', submission.email)}
                        
                        {sectionTitle('Data Keluarga')}
                        {detailItem('Nama Ibu Kandung', submission.namaIbu)}
                        {detailItem('Tempat & Tanggal Lahir Ibu', submission.ttlIbu)}

                        {sectionTitle('Pengalaman Kerja')}
                        {detailItem('Pengalaman Pekerjaan', submission.pengalamanKerja)}
                        {detailItem('Masa Kerja', submission.masaKerja)}
                        {detailItem('Nama Atasan Terakhir', submission.namaAtasan)}
                        {detailItem('Nomor Telepon Atasan', submission.nomorAtasan)}
                        {detailItem('Alasan Resign', submission.alasanResign)}

                        {sectionTitle('Akun Sosial Media')}
                        {detailItem('Facebook', submission.facebook)}
                        {detailItem('Instagram', submission.instagram)}
                        {detailItem('LinkedIn', submission.linkedin)}
                    </dl>
                </div>
                <div className="p-5 border-t flex justify-between items-center">
                    <div className="flex items-center gap-2">
                        <label htmlFor="status" className="text-sm font-medium text-gray-700">Ubah Status:</label>
                        <select
                            id="status"
                            value={submission.status}
                            onChange={(e) => onStatusChange(e.target.value as Status)}
                            className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                        >
                            {Object.values(Status).map(s => (
                                <option key={s} value={s}>{s}</option>
                            ))}
                        </select>
                    </div>
                     <button onClick={onClose} className="bg-blue-600 text-white font-bold py-2 px-6 rounded-lg shadow-md hover:bg-blue-700 transition-colors duration-200">
                        Tutup
                    </button>
                </div>
            </div>
        </div>
    );
};

export default SubmissionDetailModal;