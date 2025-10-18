import React, { useState, useEffect, useRef } from 'react';
import { Page, Submission, Status, RefcekData, LaporanData, WomData, WomJatengRefcekData } from '../types';
import SubmissionDetailModal from './SubmissionDetailModal';
import ReportPage from './ReportPage';
import FormPdfPage from './FormPdfPage'; // Import komponen baru

declare const html2canvas: any;
declare const jspdf: any;
declare const XLSX: any;


interface ResultPageProps {
  onNavigate: (page: Page) => void;
  submissions: Submission[];
  onStatusChange: (id: string, newStatus: Status) => void;
  refcekData: RefcekData[];
  onAddRefcek: (data: Omit<RefcekData, 'id'>) => void;
  onUpdateRefcek: (data: RefcekData) => void;
  onDeleteRefcek: (id: string) => void;
  laporanData: LaporanData[];
  onAddLaporan: (data: Omit<LaporanData, 'id'>) => void;
  onUpdateLaporan: (data: LaporanData) => void;
  onDeleteLaporan: (id: string) => void;
  womData: WomData[];
  onAddWom: (data: Omit<WomData, 'id'>) => void;
  onUpdateWom: (data: WomData) => void;
  onDeleteWom: (id: string) => void;
  womJatengRefcekData: WomJatengRefcekData[];
  onAddWomJatengRefcek: (data: Omit<WomJatengRefcekData, 'id'>) => void;
  onUpdateWomJatengRefcek: (data: WomJatengRefcekData) => void;
  onDeleteWomJatengRefcek: (id: string) => void;
}

const statusStyles: Record<Status, string> = {
    [Status.PENDING]: 'bg-yellow-100 text-yellow-800',
    [Status.ON_PROSES]: 'bg-blue-100 text-blue-800',
    [Status.CANCLE]: 'bg-red-100 text-red-800',
};

const ResultPage: React.FC<ResultPageProps> = ({ 
    onNavigate, 
    submissions, 
    onStatusChange,
    refcekData,
    onAddRefcek,
    onUpdateRefcek,
    onDeleteRefcek,
    laporanData,
    onAddLaporan,
    onUpdateLaporan,
    onDeleteLaporan,
    womData,
    onAddWom,
    onUpdateWom,
    onDeleteWom,
    womJatengRefcekData,
    onAddWomJatengRefcek,
    onUpdateWomJatengRefcek,
    onDeleteWomJatengRefcek
}) => {
    const [activeTab, setActiveTab] = useState('Dashboard');
    const [filteredSubmissions, setFilteredSubmissions] = useState<Submission[]>(submissions);
    const [searchTerm, setSearchTerm] = useState('');
    const [dateFrom, setDateFrom] = useState('');
    const [dateTo, setDateTo] = useState('');
    const [loading, setLoading] = useState(true);
    const [selectedSubmission, setSelectedSubmission] = useState<Submission | null>(null);

    const tableRef = useRef<HTMLTableElement>(null);

    useEffect(() => {
        setLoading(true);
        const timer = setTimeout(() => {
            let data = submissions;
            if (searchTerm) {
                data = data.filter(s => s.namaLengkap.toLowerCase().includes(searchTerm.toLowerCase()));
            }
            if (dateFrom) {
                data = data.filter(s => new Date(s.submissionDate) >= new Date(dateFrom));
            }
            if (dateTo) {
                const toDate = new Date(dateTo);
                toDate.setHours(23, 59, 59, 999);
                data = data.filter(s => new Date(s.submissionDate) <= toDate);
            }
            setFilteredSubmissions(data);
            setLoading(false);
        }, 500);
        return () => clearTimeout(timer);
    }, [searchTerm, dateFrom, dateTo, submissions]);

    const resetFilters = () => {
        setSearchTerm('');
        setDateFrom('');
        setDateTo('');
    };

    const handleDownloadJPEG = () => {
        if (tableRef.current) {
            html2canvas(tableRef.current).then((canvas: any) => {
                const imgData = canvas.toDataURL('image/jpeg');
                const link = document.createElement('a');
                link.href = imgData;
                link.download = 'data-background-check.jpg';
                link.click();
            });
        }
    };
    
    const handleDownloadPDF = () => {
        const doc = new jspdf.jsPDF();
        doc.autoTable({ html: '#submissionsTable' });
        doc.save('data-background-check.pdf');
    };

    const handleDownloadExcel = () => {
        const wb = XLSX.utils.table_to_book(tableRef.current, { sheet: "Sheet JS" });
        XLSX.writeFile(wb, 'data-background-check.xlsx');
    };

    const totalSubmissions = submissions.length;
    const dailySubmissions = submissions.filter(s => {
        const today = new Date();
        const subDate = new Date(s.submissionDate);
        return subDate.getDate() === today.getDate() &&
               subDate.getMonth() === today.getMonth() &&
               subDate.getFullYear() === today.getFullYear();
    }).length;
    const onProsesSubmissions = submissions.filter(s => s.status === Status.ON_PROSES).length;


    const renderDashboard = () => (
        <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-white p-4 rounded-lg shadow">
                    <h3 className="text-sm font-medium text-gray-500">Total Pengisi Form</h3>
                    <p className="mt-1 text-3xl font-semibold text-gray-900">{totalSubmissions}</p>
                </div>
                <div className="bg-white p-4 rounded-lg shadow">
                    <h3 className="text-sm font-medium text-gray-500">Total Pengisi Harian</h3>
                    <p className="mt-1 text-3xl font-semibold text-gray-900">{dailySubmissions}</p>
                </div>
                <div className="bg-white p-4 rounded-lg shadow">
                    <h3 className="text-sm font-medium text-gray-500">Total Data Diproses</h3>
                    <p className="mt-1 text-3xl font-semibold text-gray-900">{onProsesSubmissions}</p>
                </div>
            </div>

            <div className="bg-white p-4 rounded-lg shadow space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 items-end">
                    <input type="text" placeholder="Cari nama..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-md" />
                    <input type="date" value={dateFrom} onChange={e => setDateFrom(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-md" />
                    <input type="date" value={dateTo} onChange={e => setDateTo(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-md" />
                    <div className="flex gap-2">
                        <button onClick={resetFilters} className="w-full bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-700">Reset</button>
                    </div>
                </div>
            </div>

            <div className="bg-white p-4 rounded-lg shadow">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-semibold">Data Pengisian Form</h3>
                    <div className="flex items-center gap-2">
                        <DownloadButton icon="JPEG" onClick={handleDownloadJPEG} />
                        <DownloadButton icon="PDF" onClick={handleDownloadPDF} />
                        <DownloadButton icon="Excel" onClick={handleDownloadExcel} />
                    </div>
                </div>
                <div className="overflow-x-auto">
                    {loading ? (
                        <p className="text-center py-8">Sedang memuat...</p>
                    ) : (
                    <table id="submissionsTable" ref={tableRef} className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-blue-100">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nama Lengkap</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">No HP</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tanggal & Jam Isi</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Aksi</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {filteredSubmissions.map(s => (
                                <tr key={s.id}>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{s.namaLengkap}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{s.email}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{s.nomorHP}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{new Date(s.submissionDate).toLocaleString('id-ID', { dateStyle: 'medium', timeStyle: 'short' })}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${statusStyles[s.status] || 'bg-gray-100 text-gray-800'}`}>
                                            {s.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-center">
                                        <button 
                                            onClick={() => setSelectedSubmission(s)} 
                                            className="text-blue-600 hover:text-blue-900 transition-colors duration-200"
                                            title="Lihat Detail"
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.522 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.022 7-9.542 7-4.478 0-8.268-2.943-9.542-7z" />
                                            </svg>
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    )}
                </div>
            </div>
        </div>
    );
    

    return (
        <div className="min-h-screen bg-[#F3F4F6] p-4 sm:p-6 lg:p-8">
            <div className="max-w-7xl mx-auto">
                <button onClick={() => onNavigate(Page.LANDING)} className="mb-4 text-blue-600 hover:underline">
                    &larr; Kembali ke Halaman Utama
                </button>
                <h1 className="text-3xl font-bold text-[#1E3A8A] mb-6">DASHBOARD & REPORT</h1>
                <div className="flex border-b border-gray-200 mb-6">
                    {['Dashboard', 'Report', 'Form PDF'].map(tab => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`py-2 px-4 font-medium text-sm sm:text-base ${activeTab === tab ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
                        >
                            {tab}
                        </button>
                    ))}
                </div>
                <div>
                    {activeTab === 'Dashboard' && renderDashboard()}
                    {activeTab === 'Report' && <ReportPage 
                        refcekData={refcekData}
                        onAddRefcek={onAddRefcek}
                        onUpdateRefcek={onUpdateRefcek}
                        onDeleteRefcek={onDeleteRefcek}
                        laporanData={laporanData}
                        onAddLaporan={onAddLaporan}
                        onUpdateLaporan={onUpdateLaporan}
                        onDeleteLaporan={onDeleteLaporan}
                        womData={womData}
                        onAddWom={onAddWom}
                        onUpdateWom={onUpdateWom}
                        onDeleteWom={onDeleteWom}
                    />}
                    {activeTab === 'Form PDF' && <FormPdfPage 
                        womJatengRefcekData={womJatengRefcekData}
                        onAddWomJatengRefcek={onAddWomJatengRefcek}
                        onUpdateWomJatengRefcek={onUpdateWomJatengRefcek}
                        onDeleteWomJatengRefcek={onDeleteWomJatengRefcek}
                    />}
                </div>
            </div>
            {selectedSubmission && (
                <SubmissionDetailModal 
                    submission={selectedSubmission}
                    onClose={() => setSelectedSubmission(null)}
                    onStatusChange={(newStatus) => {
                        onStatusChange(selectedSubmission.id, newStatus);
                    }}
                />
            )}
        </div>
    );
};

const DownloadButton: React.FC<{icon: string, onClick: () => void}> = ({icon, onClick}) => (
    <button onClick={onClick} className="p-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 text-xs font-bold">
      {icon}
    </button>
);

export default ResultPage;