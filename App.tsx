import React, { useState, useEffect } from 'react';
import { Page, FormData, Submission, Status, RefcekData, LaporanData, WomData, WomJatengRefcekData, WomSulawesiRefcekData, MafRefcekData, McfRefcekData, AdiraRefcekData } from './types';
import LandingPage from './components/LandingPage';
import FormPage from './components/FormPage';
import ResultPage from './components/ResultPage';
import { DUMMY_SUBMISSIONS, DUMMY_REFCEK_DATA, DUMMY_LAPORAN_DATA, DUMMY_WOM_DATA, DUMMY_WOM_JATENG_REFCEK_DATA, DUMMY_WOM_SULAWESI_REFCEK_DATA, DUMMY_MAF_REFCEK_DATA, DUMMY_MCF_REFCEK_DATA, DUMMY_ADIRA_REFCEK_DATA } from './constants';

const App: React.FC = () => {
    const [currentPage, setCurrentPage] = useState<Page>(Page.LANDING);
    const [submissions, setSubmissions] = useState<Submission[]>([]);
    const [refcekData, setRefcekData] = useState<RefcekData[]>([]);
    const [laporanData, setLaporanData] = useState<LaporanData[]>([]);
    const [womData, setWomData] = useState<WomData[]>([]);
    const [womJatengRefcekData, setWomJatengRefcekData] = useState<WomJatengRefcekData[]>([]);
    const [womSulawesiRefcekData, setWomSulawesiRefcekData] = useState<WomSulawesiRefcekData[]>([]);
    const [mafRefcekData, setMafRefcekData] = useState<MafRefcekData[]>([]);
    const [mcfRefcekData, setMcfRefcekData] = useState<McfRefcekData[]>([]);
    const [adiraRefcekData, setAdiraRefcekData] = useState<AdiraRefcekData[]>([]);
    const [pageKey, setPageKey] = useState(0);

    useEffect(() => {
        // Load Submissions
        try {
            const storedSubmissions = localStorage.getItem('submissions');
            if (storedSubmissions) {
                const parsedSubmissions = JSON.parse(storedSubmissions).map((s: any) => ({
                    ...s,
                    status: s.status || Status.PENDING
                }));
                setSubmissions(parsedSubmissions);
            } else {
                setSubmissions(DUMMY_SUBMISSIONS);
                localStorage.setItem('submissions', JSON.stringify(DUMMY_SUBMISSIONS));
            }
        } catch (error) {
            console.error("Failed to load submissions from localStorage", error);
            setSubmissions(DUMMY_SUBMISSIONS);
        }

        // Load Refcek Data
        try {
            const storedRefcekData = localStorage.getItem('refcekData');
            if (storedRefcekData) {
                setRefcekData(JSON.parse(storedRefcekData));
            } else {
                setRefcekData(DUMMY_REFCEK_DATA);
                localStorage.setItem('refcekData', JSON.stringify(DUMMY_REFCEK_DATA));
            }
        } catch (error) {
            console.error("Failed to load refcekData from localStorage", error);
            setRefcekData(DUMMY_REFCEK_DATA);
        }

        // Load Laporan Data
        try {
            const storedLaporanData = localStorage.getItem('laporanData');
            if (storedLaporanData) {
                setLaporanData(JSON.parse(storedLaporanData));
            } else {
                setLaporanData(DUMMY_LAPORAN_DATA);
                localStorage.setItem('laporanData', JSON.stringify(DUMMY_LAPORAN_DATA));
            }
        } catch (error) {
            console.error("Failed to load laporanData from localStorage", error);
            setLaporanData(DUMMY_LAPORAN_DATA);
        }

        // Load WOM Data
        try {
            const storedWomData = localStorage.getItem('womData');
            if (storedWomData) {
                setWomData(JSON.parse(storedWomData));
            } else {
                setWomData(DUMMY_WOM_DATA);
                localStorage.setItem('womData', JSON.stringify(DUMMY_WOM_DATA));
            }
        } catch (error) {
            console.error("Failed to load womData from localStorage", error);
            setWomData(DUMMY_WOM_DATA);
        }

        // Load WOM JATENG Refcek Data
        try {
            const storedWomJatengData = localStorage.getItem('womJatengRefcekData');
            if (storedWomJatengData) {
                setWomJatengRefcekData(JSON.parse(storedWomJatengData));
            } else {
                setWomJatengRefcekData(DUMMY_WOM_JATENG_REFCEK_DATA);
                localStorage.setItem('womJatengRefcekData', JSON.stringify(DUMMY_WOM_JATENG_REFCEK_DATA));
            }
        } catch (error) {
            console.error("Failed to load womJatengRefcekData from localStorage", error);
            setWomJatengRefcekData(DUMMY_WOM_JATENG_REFCEK_DATA);
        }

        // Load WOM SULAWESI Refcek Data
        try {
            const storedWomSulawesiData = localStorage.getItem('womSulawesiRefcekData');
            if (storedWomSulawesiData) {
                setWomSulawesiRefcekData(JSON.parse(storedWomSulawesiData));
            } else {
                setWomSulawesiRefcekData(DUMMY_WOM_SULAWESI_REFCEK_DATA);
                localStorage.setItem('womSulawesiRefcekData', JSON.stringify(DUMMY_WOM_SULAWESI_REFCEK_DATA));
            }
        } catch (error) {
            console.error("Failed to load womSulawesiRefcekData from localStorage", error);
            setWomSulawesiRefcekData(DUMMY_WOM_SULAWESI_REFCEK_DATA);
        }
        
        // Load MAF Refcek Data
        try {
            const storedMafData = localStorage.getItem('mafRefcekData');
            if (storedMafData) {
                setMafRefcekData(JSON.parse(storedMafData));
            } else {
                setMafRefcekData(DUMMY_MAF_REFCEK_DATA);
                localStorage.setItem('mafRefcekData', JSON.stringify(DUMMY_MAF_REFCEK_DATA));
            }
        } catch (error) {
            console.error("Failed to load mafRefcekData from localStorage", error);
            setMafRefcekData(DUMMY_MAF_REFCEK_DATA);
        }

        // Load MCF Refcek Data
        try {
            const storedMcfData = localStorage.getItem('mcfRefcekData');
            if (storedMcfData) {
                setMcfRefcekData(JSON.parse(storedMcfData));
            } else {
                setMcfRefcekData(DUMMY_MCF_REFCEK_DATA);
                localStorage.setItem('mcfRefcekData', JSON.stringify(DUMMY_MCF_REFCEK_DATA));
            }
        } catch (error) {
            console.error("Failed to load mcfRefcekData from localStorage", error);
            setMcfRefcekData(DUMMY_MCF_REFCEK_DATA);
        }
        
        // Load ADIRA Refcek Data
        try {
            const storedAdiraData = localStorage.getItem('adiraRefcekData');
            if (storedAdiraData) {
                setAdiraRefcekData(JSON.parse(storedAdiraData));
            } else {
                setAdiraRefcekData(DUMMY_ADIRA_REFCEK_DATA);
                localStorage.setItem('adiraRefcekData', JSON.stringify(DUMMY_ADIRA_REFCEK_DATA));
            }
        } catch (error) {
            console.error("Failed to load adiraRefcekData from localStorage", error);
            setAdiraRefcekData(DUMMY_ADIRA_REFCEK_DATA);
        }


    }, []);

    const handleNavigate = (page: Page) => {
        setCurrentPage(page);
    };

    const handleFormSubmit = (data: FormData) => {
        const newSubmission: Submission = {
            ...data,
            id: new Date().getTime().toString(),
            submissionDate: new Date().toISOString(),
            status: Status.PENDING,
        };
        const updatedSubmissions = [newSubmission, ...submissions];
        setSubmissions(updatedSubmissions);
        localStorage.setItem('submissions', JSON.stringify(updatedSubmissions));
        handleNavigate(Page.RESULT);
    };

    const handleStatusChange = (id: string, newStatus: Status) => {
        const updatedSubmissions = submissions.map(s =>
            s.id === id ? { ...s, status: newStatus } : s
        );
        setSubmissions(updatedSubmissions);
        localStorage.setItem('submissions', JSON.stringify(updatedSubmissions));
    };

    // CRUD Handlers for Refcek Data
    const handleAddRefcek = (data: Omit<RefcekData, 'id'>) => {
        const newData: RefcekData = {
            ...data,
            id: new Date().getTime().toString(),
        };
        const updatedData = [newData, ...refcekData];
        setRefcekData(updatedData);
        localStorage.setItem('refcekData', JSON.stringify(updatedData));
    };

    const handleUpdateRefcek = (updatedEntry: RefcekData) => {
        const updatedData = refcekData.map(d =>
            d.id === updatedEntry.id ? updatedEntry : d
        );
        setRefcekData(updatedData);
        localStorage.setItem('refcekData', JSON.stringify(updatedData));
    };

    const handleDeleteRefcek = (id: string) => {
        const updatedData = refcekData.filter(d => d.id !== id);
        setRefcekData(updatedData);
        localStorage.setItem('refcekData', JSON.stringify(updatedData));
    };

    // CRUD Handlers for Laporan Data
    const handleAddLaporan = (data: Omit<LaporanData, 'id'>) => {
        const newData: LaporanData = {
            ...data,
            id: new Date().getTime().toString(),
        };
        const updatedData = [newData, ...laporanData];
        setLaporanData(updatedData);
        localStorage.setItem('laporanData', JSON.stringify(updatedData));
    };

    const handleUpdateLaporan = (updatedEntry: LaporanData) => {
        const updatedData = laporanData.map(d =>
            d.id === updatedEntry.id ? updatedEntry : d
        );
        setLaporanData(updatedData);
        localStorage.setItem('laporanData', JSON.stringify(updatedData));
    };

    const handleDeleteLaporan = (id: string) => {
        const updatedData = laporanData.filter(d => d.id !== id);
        setLaporanData(updatedData);
        localStorage.setItem('laporanData', JSON.stringify(updatedData));
    };

    // CRUD Handlers for WOM Data
    const handleAddWom = (data: Omit<WomData, 'id'>) => {
        const newData: WomData = {
            ...data,
            id: new Date().getTime().toString(),
        };
        const updatedData = [newData, ...womData];
        setWomData(updatedData);
        localStorage.setItem('womData', JSON.stringify(updatedData));
    };

    const handleUpdateWom = (updatedEntry: WomData) => {
        const updatedData = womData.map(d =>
            d.id === updatedEntry.id ? updatedEntry : d
        );
        setWomData(updatedData);
        localStorage.setItem('womData', JSON.stringify(updatedData));
    };

    const handleDeleteWom = (id: string) => {
        const updatedData = womData.filter(d => d.id !== id);
        setWomData(updatedData);
        localStorage.setItem('womData', JSON.stringify(updatedData));
    };
    
    // CRUD Handlers for WOM JATENG Refcek Data
    const handleAddWomJatengRefcek = (data: Omit<WomJatengRefcekData, 'id'>) => {
        const newData: WomJatengRefcekData = {
            ...data,
            id: new Date().getTime().toString(),
        };
        const updatedData = [newData, ...womJatengRefcekData].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        setWomJatengRefcekData(updatedData);
        localStorage.setItem('womJatengRefcekData', JSON.stringify(updatedData));
    };

    const handleUpdateWomJatengRefcek = (updatedEntry: WomJatengRefcekData) => {
        const updatedData = womJatengRefcekData.map(d =>
            d.id === updatedEntry.id ? updatedEntry : d
        );
        setWomJatengRefcekData(updatedData);
        localStorage.setItem('womJatengRefcekData', JSON.stringify(updatedData));
    };

    const handleDeleteWomJatengRefcek = (id: string) => {
        const updatedData = womJatengRefcekData.filter(d => d.id !== id);
        setWomJatengRefcekData(updatedData);
        localStorage.setItem('womJatengRefcekData', JSON.stringify(updatedData));
    };

    // CRUD Handlers for WOM SULAWESI Refcek Data
    const handleAddWomSulawesiRefcek = (data: Omit<WomSulawesiRefcekData, 'id'>) => {
        const newData: WomSulawesiRefcekData = {
            ...data,
            id: new Date().getTime().toString(),
        };
        const updatedData = [newData, ...womSulawesiRefcekData].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        setWomSulawesiRefcekData(updatedData);
        localStorage.setItem('womSulawesiRefcekData', JSON.stringify(updatedData));
    };

    const handleUpdateWomSulawesiRefcek = (updatedEntry: WomSulawesiRefcekData) => {
        const updatedData = womSulawesiRefcekData.map(d =>
            d.id === updatedEntry.id ? updatedEntry : d
        );
        setWomSulawesiRefcekData(updatedData);
        localStorage.setItem('womSulawesiRefcekData', JSON.stringify(updatedData));
    };

    const handleDeleteWomSulawesiRefcek = (id: string) => {
        const updatedData = womSulawesiRefcekData.filter(d => d.id !== id);
        setWomSulawesiRefcekData(updatedData);
        localStorage.setItem('womSulawesiRefcekData', JSON.stringify(updatedData));
    };
    
    // CRUD Handlers for MAF Refcek Data
    const handleAddMafRefcek = (data: Omit<MafRefcekData, 'id'>) => {
        const newData: MafRefcekData = {
            ...data,
            id: new Date().getTime().toString(),
        };
        const updatedData = [newData, ...mafRefcekData].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        setMafRefcekData(updatedData);
        localStorage.setItem('mafRefcekData', JSON.stringify(updatedData));
    };

    const handleUpdateMafRefcek = (updatedEntry: MafRefcekData) => {
        const updatedData = mafRefcekData.map(d =>
            d.id === updatedEntry.id ? updatedEntry : d
        );
        setMafRefcekData(updatedData);
        localStorage.setItem('mafRefcekData', JSON.stringify(updatedData));
    };

    const handleDeleteMafRefcek = (id: string) => {
        const updatedData = mafRefcekData.filter(d => d.id !== id);
        setMafRefcekData(updatedData);
        localStorage.setItem('mafRefcekData', JSON.stringify(updatedData));
    };

    // CRUD Handlers for MCF Refcek Data
    const handleAddMcfRefcek = (data: Omit<McfRefcekData, 'id'>) => {
        const newData: McfRefcekData = {
            ...data,
            id: new Date().getTime().toString(),
        };
        const updatedData = [newData, ...mcfRefcekData].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        setMcfRefcekData(updatedData);
        localStorage.setItem('mcfRefcekData', JSON.stringify(updatedData));
    };

    const handleUpdateMcfRefcek = (updatedEntry: McfRefcekData) => {
        const updatedData = mcfRefcekData.map(d =>
            d.id === updatedEntry.id ? updatedEntry : d
        );
        setMcfRefcekData(updatedData);
        localStorage.setItem('mcfRefcekData', JSON.stringify(updatedData));
    };

    const handleDeleteMcfRefcek = (id: string) => {
        const updatedData = mcfRefcekData.filter(d => d.id !== id);
        setMcfRefcekData(updatedData);
        localStorage.setItem('mcfRefcekData', JSON.stringify(updatedData));
    };
    
    // CRUD Handlers for ADIRA Refcek Data
    const handleAddAdiraRefcek = (data: Omit<AdiraRefcekData, 'id'>) => {
        const newData: AdiraRefcekData = {
            ...data,
            id: new Date().getTime().toString(),
        };
        const updatedData = [newData, ...adiraRefcekData].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        setAdiraRefcekData(updatedData);
        localStorage.setItem('adiraRefcekData', JSON.stringify(updatedData));
    };

    const handleUpdateAdiraRefcek = (updatedEntry: AdiraRefcekData) => {
        const updatedData = adiraRefcekData.map(d =>
            d.id === updatedEntry.id ? updatedEntry : d
        );
        setAdiraRefcekData(updatedData);
        localStorage.setItem('adiraRefcekData', JSON.stringify(updatedData));
    };

    const handleDeleteAdiraRefcek = (id: string) => {
        const updatedData = adiraRefcekData.filter(d => d.id !== id);
        setAdiraRefcekData(updatedData);
        localStorage.setItem('adiraRefcekData', JSON.stringify(updatedData));
    };


    const renderPage = () => {
        switch (currentPage) {
            case Page.FORM:
                return <FormPage key={pageKey} onNavigate={handleNavigate} onSubmit={handleFormSubmit} />;
            case Page.RESULT:
                return <ResultPage
                    onNavigate={handleNavigate}
                    submissions={submissions}
                    onStatusChange={handleStatusChange}
                    refcekData={refcekData}
                    onAddRefcek={handleAddRefcek}
                    onUpdateRefcek={handleUpdateRefcek}
                    onDeleteRefcek={handleDeleteRefcek}
                    laporanData={laporanData}
                    onAddLaporan={handleAddLaporan}
                    onUpdateLaporan={handleUpdateLaporan}
                    onDeleteLaporan={handleDeleteLaporan}
                    womData={womData}
                    onAddWom={handleAddWom}
                    onUpdateWom={handleUpdateWom}
                    onDeleteWom={handleDeleteWom}
                    womJatengRefcekData={womJatengRefcekData}
                    onAddWomJatengRefcek={handleAddWomJatengRefcek}
                    onUpdateWomJatengRefcek={handleUpdateWomJatengRefcek}
                    onDeleteWomJatengRefcek={handleDeleteWomJatengRefcek}
                    womSulawesiRefcekData={womSulawesiRefcekData}
                    onAddWomSulawesiRefcek={handleAddWomSulawesiRefcek}
                    onUpdateWomSulawesiRefcek={handleUpdateWomSulawesiRefcek}
                    onDeleteWomSulawesiRefcek={handleDeleteWomSulawesiRefcek}
                    mafRefcekData={mafRefcekData}
                    onAddMafRefcek={handleAddMafRefcek}
                    onUpdateMafRefcek={handleUpdateMafRefcek}
                    onDeleteMafRefcek={handleDeleteMafRefcek}
                    mcfRefcekData={mcfRefcekData}
                    onAddMcfRefcek={handleAddMcfRefcek}
                    onUpdateMcfRefcek={handleUpdateMcfRefcek}
                    onDeleteMcfRefcek={handleDeleteMcfRefcek}
                    adiraRefcekData={adiraRefcekData}
                    onAddAdiraRefcek={handleAddAdiraRefcek}
                    onUpdateAdiraRefcek={handleUpdateAdiraRefcek}
                    onDeleteAdiraRefcek={handleDeleteAdiraRefcek}
                />;
            case Page.LANDING:
            default:
                return <LandingPage onNavigate={handleNavigate} />;
        }
    };

    return (
        <main className="bg-gray-100 min-h-screen">
           <div className="transition-opacity duration-500 ease-in-out">
             {renderPage()}
           </div>
        </main>
    );
};

export default App;
