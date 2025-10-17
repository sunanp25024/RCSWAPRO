import React, { useState, useEffect } from 'react';
import { Page, FormData, Submission, Status, RefcekData } from './types';
import LandingPage from './components/LandingPage';
import FormPage from './components/FormPage';
import ResultPage from './components/ResultPage';
import { DUMMY_SUBMISSIONS, DUMMY_REFCEK_DATA } from './constants';

const App: React.FC = () => {
    const [currentPage, setCurrentPage] = useState<Page>(Page.LANDING);
    const [submissions, setSubmissions] = useState<Submission[]>([]);
    const [refcekData, setRefcekData] = useState<RefcekData[]>([]);
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