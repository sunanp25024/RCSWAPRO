import React, { useState, useEffect, useRef } from 'react';

const formOptions = [
  "WOM JATENG", "WOM SULAWESI", "MAF", "MCF", "BAF", "ADIRA", 
  "SMS FINANCE", "SINARMAS", "BEKO", "OLX MOBI", "MTF JATENG-JATIM-KALSUS"
];

const FormPdfPage: React.FC = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [selectedForm, setSelectedForm] = useState<string | null>(null);
    const dropdownRef = useRef<HTMLDivElement>(null);

    const handleSelectForm = (form: string) => {
        setSelectedForm(form);
        setIsOpen(false);
    };

    // Menutup dropdown ketika klik di luar area dropdown
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [dropdownRef]);

    return (
        <div className="bg-white rounded-lg shadow-md min-h-[calc(100vh-220px)] flex flex-col">
            {/* Topbar Navigation */}
            <header className="bg-gray-800 text-white p-4 rounded-t-lg shadow-lg flex justify-between items-center">
                <h2 className="text-xl font-bold">Formulir PDF</h2>
                <div className="relative" ref={dropdownRef}>
                    <button
                        onClick={() => setIsOpen(!isOpen)}
                        className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg flex items-center gap-2 transition-colors duration-200"
                    >
                        <span>{selectedForm || "Pilih Formulir PDF"}</span>
                        <svg className={`h-5 w-5 transform transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                    </button>
                    {isOpen && (
                        <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-xl z-20 py-1 border border-gray-200">
                            <ul className="max-h-60 overflow-y-auto">
                                {formOptions.map(option => (
                                    <li key={option}>
                                        <button
                                            onClick={() => handleSelectForm(option)}
                                            className="w-full text-left px-4 py-2 text-gray-800 hover:bg-blue-500 hover:text-white transition-colors duration-150"
                                        >
                                            {option}
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}
                </div>
            </header>

            {/* Main Content Area */}
            <main className="flex-1 p-6 flex items-center justify-center bg-gray-50 rounded-b-lg">
                <div className="text-center">
                    {selectedForm ? (
                        <>
                            <h3 className="text-2xl font-bold text-gray-800 mb-2">
                                Anda memilih: <span className="text-blue-600">{selectedForm}</span>
                            </h3>
                            <p className="text-gray-500">Konten untuk formulir ini sedang dalam pengembangan.</p>
                        </>
                    ) : (
                        <>
                            <div className="text-5xl mb-4">📄</div>
                            <h3 className="text-2xl font-semibold text-gray-600">
                                Silakan Pilih Formulir
                            </h3>
                            <p className="text-gray-400 mt-1">Pilih salah satu formulir dari menu dropdown di atas untuk memulai.</p>
                        </>
                    )}
                </div>
            </main>
        </div>
    );
};

export default FormPdfPage;
