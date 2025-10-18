import React, { useState } from 'react';
import { RefcekData, LaporanData, WomData } from '../types';
import StatusRefcekTab from './StatusRefcekTab';
import LaporanTab from './LaporanTab';
import WomTab from './WomTab';

type Menu = 'STATUS REFCEK' | 'LAPORAN' | 'WOM' | 'KENDALA';

interface ReportPageProps {
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
}


const ReportPage: React.FC<ReportPageProps> = ({ 
    refcekData, onAddRefcek, onUpdateRefcek, onDeleteRefcek,
    laporanData, onAddLaporan, onUpdateLaporan, onDeleteLaporan,
    womData, onAddWom, onUpdateWom, onDeleteWom
 }) => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const [activeMenu, setActiveMenu] = useState<Menu>('STATUS REFCEK');

    const menuItems: { name: Menu; icon: React.ReactElement }[] = [
        { name: 'STATUS REFCEK', icon: <StatusIcon /> },
        { name: 'LAPORAN', icon: <LaporanIcon /> },
        { name: 'WOM', icon: <WomIcon /> },
        { name: 'KENDALA', icon: <KendalaIcon /> },
    ];

    const renderContent = () => {
        if (activeMenu === 'STATUS REFCEK') {
            return <StatusRefcekTab 
                data={refcekData}
                onAdd={onAddRefcek}
                onUpdate={onUpdateRefcek}
                onDelete={onDeleteRefcek}
            />;
        }

        if (activeMenu === 'LAPORAN') {
            return <LaporanTab
                data={laporanData}
                onAdd={onAddLaporan}
                onUpdate={onUpdateLaporan}
                onDelete={onDeleteLaporan}
            />;
        }

        if (activeMenu === 'WOM') {
            return <WomTab
                data={womData}
                onAdd={onAddWom}
                onUpdate={onUpdateWom}
                onDelete={onDeleteWom}
            />;
        }

        const title = activeMenu.charAt(0) + activeMenu.slice(1).toLowerCase();
        return (
            <div className="flex flex-col items-center justify-center h-full bg-white rounded-lg shadow-inner">
                <h2 className="text-2xl font-bold text-gray-700">{title}</h2>
                <p className="text-gray-500 mt-2">Konten untuk {title} sedang dalam pengembangan.</p>
            </div>
        );
    };

    return (
        <div className="relative flex h-[calc(100vh-220px)] bg-gray-50 rounded-lg shadow-md overflow-hidden">
            {/* Sidebar */}
            <aside className={`absolute top-0 left-0 bg-gray-800 text-white w-64 h-full transition-transform duration-300 ease-in-out z-20 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
                <div className="flex flex-col h-full p-4">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-xl font-bold">Menu Laporan</h2>
                    </div>
                    <nav className="flex-1 space-y-2">
                        {menuItems.map(item => (
                            <button
                                key={item.name}
                                onClick={() => setActiveMenu(item.name)}
                                className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-left transition-colors duration-200 ${activeMenu === item.name ? 'bg-blue-600' : 'hover:bg-gray-700'}`}
                            >
                                {item.icon}
                                <span>{item.name}</span>
                            </button>
                        ))}
                    </nav>
                </div>
            </aside>

            {/* Toggle Button */}
            <button
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                className="absolute top-6 z-30 p-2 bg-gray-800 text-white rounded-full hover:bg-blue-700 transition-all duration-300 ease-in-out transform hover:scale-110"
                style={{ left: isSidebarOpen ? '15rem' : '1rem' }} /* 16rem (sidebar width) - 1rem */
                aria-label="Toggle sidebar"
            >
                {isSidebarOpen ? <ChevronLeftIcon /> : <ChevronRightIcon />}
            </button>

            {/* Main Content */}
            <main className={`flex-1 transition-all duration-300 ease-in-out ${isSidebarOpen ? 'md:ml-64' : 'ml-0'} p-6`}>
                 <div className="h-full">
                    {renderContent()}
                </div>
            </main>
        </div>
    );
};

// SVG Icons
const StatusIcon = () => <svg className="h-5 w-5 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" /></svg>;
const LaporanIcon = () => <svg className="h-5 w-5 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor"><path d="M2 6a2 2 0 012-2h5l2 2h5a2 2 0 012 2v6a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" /></svg>;
const WomIcon = () => <svg className="h-5 w-5 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor"><path d="M2 11h16v2H2v-2zM2 6h16v2H2V6zM2 16h16v2H2v-2z" /></svg>;
const KendalaIcon = () => <svg className="h-5 w-5 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.21 3.03-1.742 3.03H4.42c-1.532 0-2.492-1.696-1.742-3.03l5.58-9.92zM10 13a1 1 0 110-2 1 1 0 010 2zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" /></svg>;
const ChevronLeftIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>;
const ChevronRightIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>;

export default ReportPage;