import React from 'react';
import { Menu } from 'lucide-react';

export default function Header({ toggleMenu }) {
  return (
    <div className="bg-[#001C40] text-white pt-6 pb-6 px-6 relative rounded-b-3xl shadow-md z-10">
      <div className="flex justify-between items-center relative">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 border-2 border-white rounded-full flex items-center justify-center">
            <div className="w-4 h-4 bg-white rounded-sm transform rotate-45"></div>
          </div>
          <div>
            <h1 className="font-bold text-lg leading-tight tracking-wide">Allstate®</h1>
            <p className="text-[10px] uppercase tracking-widest text-blue-200 font-medium">My Help</p>
          </div>
        </div>

        {/* Subtle Tagline in Center */}
        <div className="absolute left-1/2 -translate-x-1/2 text-[11px] font-medium text-blue-300/80 tracking-wider hidden sm:block">
          RECOVERY ACCELERATOR
        </div>

        <button onClick={toggleMenu} className="p-1">
          <Menu className="w-6 h-6 text-white" />
        </button>
      </div>
      {/* Mobile Subtle Tagline */}
      <div className="text-center mt-4 sm:hidden text-[10px] font-medium text-blue-300/80 tracking-widest">
        RECOVERY ACCELERATOR
      </div>
    </div>
  );
}