// src/App.jsx
import React, { useState, useEffect } from 'react';
import { Loader2, Home as HomeIcon, FolderHeart, Users } from 'lucide-react';
import Home from './views/Home';
import CommandCenter from './views/CommandCenter';
import History from './views/History';
import { incidentService } from './services/incidentService';
import { analyzeIncident } from './services/aiService';
import { getEventTemplate } from './data/events';

export default function App() {
  const [appState, setAppState] = useState('HOME');
  const [detectedEvent, setDetectedEvent] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [contextData, setContextData] = useState({
    timestamp: '', location: 'Locating...', weather: 'Analyzing...', deviceMetadata: 'Detecting...'
  });
  const [incidents, setIncidents] = useState([]);

  useEffect(() => {
    const gatherRealContext = () => {
      const timestamp = new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
      setContextData(prev => ({ ...prev, timestamp, deviceMetadata: navigator.userAgent }));

      if ("geolocation" in navigator) {
        navigator.geolocation.getCurrentPosition(
          (pos) => {
            setContextData(prev => ({
              ...prev,
              location: `Lat ${pos.coords.latitude.toFixed(2)}, Lng ${pos.coords.longitude.toFixed(2)}`,
              weather: "28°C, Clear"
            }));
          },
          (err) => {
            setContextData(prev => ({ ...prev, location: "GPS Unavailable", weather: null }));
          },
          { enableHighAccuracy: true, timeout: 5000 }
        );
      } else {
        setContextData(prev => ({ ...prev, location: "GPS Not Supported", weather: null }));
      }
    };

    gatherRealContext();
    incidentService.getIncidents().then(data => setIncidents(data));
  }, []);

  const triggerAI = async (text, file = null) => {
    setAppState('ANALYZING');
    
    const aiAssessment = await analyzeIncident(text, file);
    
    const dateStr = new Date().toISOString().replace(/T/, '_').replace(/\..+/, '').replace(/[-:]/g, ''); 
    const typeStr = aiAssessment.type.replace(/\s+/g, '');
    
    const newIncident = {
      ...aiAssessment,
      id: `${typeStr}_${dateStr}`,
      createdAt: new Date().toISOString(),
      metadata: contextData 
    };
    
    setDetectedEvent(newIncident);
    
    try {
      await incidentService.saveIncident(newIncident);
    } catch (error) {
      console.warn('Backend not reachable. Running local in-memory recovery mode.');
    }
    
    setIncidents(prev => [...prev.filter(i => i.id !== newIncident.id), newIncident]);
    setAppState('COMMAND_CENTER');
  };

  const updateEventAndSave = async (updatedEvent) => {
    setDetectedEvent(updatedEvent);
    try {
      await incidentService.saveIncident(updatedEvent);
    } catch (error) {
      console.warn('Backend not reachable. Updating local cache only.');
    }
    setIncidents(prev => prev.map(i => i.id === updatedEvent.id ? updatedEvent : i));
  };

  const handleDeleteIncident = async (id) => {
    setIncidents(prev => prev.filter(i => i.id !== id));
    try {
      await incidentService.deleteIncident(id);
    } catch (error) {
      console.warn('Backend not reachable for delete operation.');
    }
  };

  return (
    <div className="max-w-md mx-auto bg-gray-50 min-h-screen flex flex-col relative font-sans shadow-2xl border-x border-gray-200">
      
      {menuOpen && (
        <div className="absolute inset-0 bg-black/50 z-50 flex">
          <div className="w-72 bg-white h-full shadow-xl p-5 flex flex-col">
            <div className="flex justify-between items-center pb-4 border-b border-gray-100">
              <h3 className="font-bold text-[#001C40] text-lg">Menu</h3>
              <button onClick={() => setMenuOpen(false)} className="text-gray-400 text-sm font-semibold hover:text-gray-800">Close</button>
            </div>
            
            <nav className="mt-6 space-y-4 flex-1">
              <button onClick={() => { setAppState('HOME'); setMenuOpen(false); }} className="w-full flex items-start gap-3 text-left p-3 hover:bg-gray-50 rounded-xl transition-colors group">
                <div className="bg-blue-50 p-2 rounded-lg group-hover:bg-blue-100 mt-0.5"><HomeIcon className="w-5 h-5 text-blue-600" /></div>
                <div>
                  <p className="font-bold text-[#001C40] text-sm mb-1">Home</p>
                  <ul className="text-[10px] text-gray-500 font-medium space-y-0.5 list-disc list-inside">
                    <li>Start a new recovery</li>
                  </ul>
                </div>
              </button>

              <button onClick={() => { setAppState('HISTORY'); setMenuOpen(false); }} className="w-full flex items-start gap-3 text-left p-3 hover:bg-gray-50 rounded-xl transition-colors group">
                <div className="bg-emerald-50 p-2 rounded-lg group-hover:bg-emerald-100 mt-0.5"><FolderHeart className="w-5 h-5 text-emerald-600" /></div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <p className="font-bold text-[#001C40] text-sm">My Recoveries</p>
                    <span className="bg-emerald-100 text-emerald-700 text-[9px] font-black px-1.5 py-0.5 rounded-full">{incidents.length}</span>
                  </div>
                  <ul className="text-[10px] text-gray-500 font-medium space-y-0.5 list-disc list-inside">
                    <li>View saved incidents</li>
                  </ul>
                </div>
              </button>
            </nav>
          </div>
          <div className="flex-1" onClick={() => setMenuOpen(false)}></div>
        </div>
      )}

      {appState === 'HOME' && (
        <Home 
          onSearch={(text) => triggerAI(text)} 
          onSimulate={(type, file) => triggerAI(type, file)} 
          toggleMenu={() => setMenuOpen(!menuOpen)}
          contextData={contextData}
        />
      )}

      {appState === 'HISTORY' && (
        <History 
          incidents={incidents}
          onBack={() => setAppState('HOME')}
          onResume={(incident) => {
            setDetectedEvent(incident);
            setAppState('COMMAND_CENTER');
          }}
          onDelete={handleDeleteIncident}
        />
      )}

      {appState === 'ANALYZING' && (
        <div className="flex-1 flex flex-col items-center justify-center bg-white space-y-4">
          <Loader2 className="w-12 h-12 text-[#001C40] animate-spin" />
          <div className="text-center">
            <h3 className="font-bold text-gray-900 text-lg">Assessing the situation...</h3>
            <p className="text-xs text-gray-400 mt-1">Generating your Recovery Plan.</p>
          </div>
        </div>
      )}

      {appState === 'COMMAND_CENTER' && detectedEvent && (
        <CommandCenter 
          key={detectedEvent.id} 
          event={detectedEvent} 
          contextData={contextData}
          onReset={() => setAppState('HOME')} 
          onChangeEvent={(type) => {
            const newTemplate = getEventTemplate(type);
            const correctedEvent = { ...newTemplate, id: detectedEvent.id, createdAt: detectedEvent.createdAt };
            updateEventAndSave(correctedEvent);
          }}
          onUpdateEvent={(updatedEvent) => updateEventAndSave(updatedEvent)}
        />
      )}

    </div>
  );
}