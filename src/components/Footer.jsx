import React from 'react';

export default function Footer() {
  return (
    <footer className="bg-[#001C40] text-blue-200 p-6 mt-auto text-xs w-full">
      <div className="flex flex-wrap gap-x-4 gap-y-2 mb-4 font-medium">
        <a href="#contact" className="hover:text-white transition-colors">Contact Us</a>
        <a href="#terms" className="hover:text-white transition-colors">Terms of Use</a>
        <a href="#privacy" className="hover:text-white transition-colors">Privacy Statement</a>
        <a href="#accessibility" className="hover:text-white transition-colors">Accessibility</a>
      </div>
      <p className="text-blue-400/60">© 2026 Allstate Insurance Company</p>
    </footer>
  );
}