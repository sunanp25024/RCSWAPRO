
import React from 'react';
import { Page } from '../types';

interface LandingPageProps {
  onNavigate: (page: Page) => void;
}

const SwaproLogo: React.FC = () => (
    <svg width="80" height="80" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M2 17L12 22L22 17" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M2 12L12 17L22 12" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
);


const LandingPage: React.FC<LandingPageProps> = ({ onNavigate }) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#1E3A8A] text-white p-4">
      <div className="flex flex-col items-center gap-4 mb-12 text-center">
        <SwaproLogo />
        <h1 className="text-3xl md:text-4xl font-bold">Background Checking System</h1>
        <p className="text-xl md:text-2xl font-semibold text-gray-200">SWAPRO</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-md">
        <button
          onClick={() => onNavigate(Page.FORM)}
          className="bg-white text-[#1E3A8A] font-bold py-4 px-8 rounded-lg shadow-lg transform transition-transform duration-200 hover:scale-105 active:scale-95 text-xl"
        >
          FORM
        </button>
        <button
          onClick={() => onNavigate(Page.RESULT)}
          className="bg-blue-500 text-white font-bold py-4 px-8 rounded-lg shadow-lg transform transition-transform duration-200 hover:scale-105 active:scale-95 text-xl"
        >
          RESULT
        </button>
      </div>
    </div>
  );
};

export default LandingPage;
