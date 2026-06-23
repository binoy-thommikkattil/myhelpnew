import React from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { ArrowRight, Clock, AlertCircle } from 'lucide-react';

export default function History({ incidents, onResume, onBack }) {
  // Sort incidents newest first
  const sortedIncidents = [...incidents].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 animate-fadeIn">
      <div className="bg-[#001C40] text-white pt-6 pb-6 px-5 shadow-md">
        <button onClick={onBack} className="text-blue-300 hover:text-white font-medium text-sm flex items-center gap-1 mb-4">
          ← Dashboard
        </button>
        <h1 className="text-2xl font-bold">My Recoveries</h1>
        <p className="text-xs text-blue-200 mt-1">Review or resume your active incidents.</p>
      </div>

      <main className="flex-1 p-5 space-y-4">
        {sortedIncidents.length === 0 ? (
          <div className="bg-white p-8 rounded-2xl border border-gray-100 text-center shadow-sm">
            <AlertCircle className="w-10 h-10 text-gray-300 mx-auto mb-3" />
            <h3 className="font-bold text-gray-700">No active recoveries</h3>
            <p className="text-xs text-gray-400 mt-1">You're all caught up. Stay safe!</p>
          </div>
        ) : (
          sortedIncidents.map(incident => {
            const dateObj = new Date(incident.createdAt);
            const formattedDate = dateObj.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
            const formattedTime = dateObj.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
            const completed = incident.checklist?.filter(c => c.done).length || 0;
            const total = incident.checklist?.length || 1;
            const pct = Math.round((completed / total) * 100);

            return (
              <div key={incident.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 relative overflow-hidden group">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h3 className="font-bold text-[#001C40] text-lg">{incident.type}</h3>
                    <div className="flex items-center gap-2 text-xs text-gray-500 mt-0.5">
                      <Clock className="w-3 h-3" /> {formattedDate} at {formattedTime}
                    </div>
                  </div>
                  <div className="bg-gray-50 text-gray-500 text-[10px] px-2 py-1 rounded font-mono border border-gray-200">
                    {incident.id.split('_')[0]}
                  </div>
                </div>
                
                <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-50">
                  <div className="w-1/2">
                     <p className="text-[10px] font-bold text-gray-400 mb-1">STATUS: {pct}%</p>
                     <div className="w-full bg-gray-100 h-1.5 rounded-full overflow-hidden">
                       <div className="bg-emerald-500 h-full" style={{ width: `${pct}%` }}></div>
                     </div>
                  </div>
                  <button onClick={() => onResume(incident)} className="text-[#001C40] font-bold text-xs flex items-center gap-1 hover:text-blue-600 transition-colors">
                    Resume <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
              </div>
            );
          })
        )}
      </main>
      <Footer />
    </div>
  );
}