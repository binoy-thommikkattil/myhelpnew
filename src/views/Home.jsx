import React, { useRef } from 'react';
import { Search, MapPin, Camera, Mic } from 'lucide-react';
import Header from '../components/Header';
import Footer from '../components/Footer';

export default function Home({ onSearch, onSimulate, toggleMenu, contextData }) {
  const [text, setText] = React.useState('');
  const fileInputRef = useRef(null);

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && text.trim()) onSearch(text);
  };

  const handleCameraClick = () => fileInputRef.current.click();

  const handlePhotoCaptured = (e) => {
    if (e.target.files && e.target.files.length > 0) onSimulate('accident', e.target.files[0]);
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 animate-fadeIn">
      <Header toggleMenu={toggleMenu} />

      <div className="px-6 -mt-4 relative z-20">
        <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-5 text-center">
          <h2 className="text-2xl font-bold text-[#001C40] mb-1">Take a deep breath.</h2>
          <p className="text-gray-500 text-sm">We're here to help you sort this out.</p>
          
          <div className="mt-4 inline-flex items-center gap-1.5 bg-blue-50 text-blue-700 text-[10px] font-bold px-3 py-1.5 rounded-full">
            <MapPin className="w-3 h-3" />
            Location: {contextData.location.split(',')[0]}
          </div>
        </div>
      </div>

      <main className="px-5 pt-8 flex-1 flex flex-col gap-5 pb-8">
        <div className="bg-white rounded-xl flex items-center px-4 py-3.5 shadow-sm border border-gray-100 focus-within:ring-2 focus-within:ring-blue-200 transition-all">
          <Search className="w-5 h-5 text-blue-400 mr-3 shrink-0" />
          <input 
            type="text" 
            placeholder="Tell us what happened..." 
            className="w-full bg-transparent outline-none text-gray-700 placeholder-gray-400 text-sm font-medium"
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={handleKeyDown}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <input type="file" accept="image/*" capture="environment" ref={fileInputRef} onChange={handlePhotoCaptured} className="hidden" />
          <button onClick={handleCameraClick} className="bg-white border border-gray-100 p-5 rounded-2xl flex flex-col items-center justify-center gap-3 shadow-sm hover:shadow-md transition-all group">
            <div className="bg-blue-50 p-4 rounded-full group-hover:bg-blue-100 transition-colors"><Camera className="w-7 h-7 text-blue-600" /></div>
            <div className="text-center"><p className="text-sm font-bold text-[#001C40]">Take a Photo</p></div>
          </button>
          <button onClick={() => onSimulate('water')} className="bg-white border border-gray-100 p-5 rounded-2xl flex flex-col items-center justify-center gap-3 shadow-sm hover:shadow-md transition-all group">
            <div className="bg-emerald-50 p-4 rounded-full group-hover:bg-emerald-100 transition-colors"><Mic className="w-7 h-7 text-emerald-600" /></div>
            <div className="text-center"><p className="text-sm font-bold text-[#001C40]">Use Voice</p></div>
          </button>
        </div>

        <button onClick={() => onSimulate('fraud')} className="w-full bg-[#001C40] text-white rounded-2xl p-5 flex items-center justify-between shadow-md mt-2 hover:bg-blue-900 transition-colors">
          <div className="flex items-center gap-4">
            <div className="bg-pink-400 text-white text-[11px] font-black px-2.5 py-1.5 rounded-md tracking-widest shadow-sm">SOS</div>
            <div className="text-left">
              <h3 className="font-bold text-base">I Don't Know What To Do</h3>
              <p className="text-xs text-blue-200 mt-0.5">We'll guide you step by step.</p>
            </div>
          </div>
          <span className="text-blue-300 font-bold text-lg">→</span>
        </button>
      </main>
      <Footer />
    </div>
  );
}