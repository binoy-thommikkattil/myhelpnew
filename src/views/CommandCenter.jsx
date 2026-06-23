// src/views/CommandCenter.jsx
import React, { useState, useEffect } from 'react';
import { Clock, CheckCircle, Edit3, Shield, MapPin, Cloud } from 'lucide-react';
import VehiclePanel from '../components/recovery/VehiclePanel';
import PropertyPanel from '../components/recovery/PropertyPanel';
import FraudPanel from '../components/recovery/FraudPanel';
import Footer from '../components/Footer';

export default function CommandCenter({ event, onReset, onChangeEvent, onUpdateEvent, contextData }) {
  const [actionIndex, setActionIndex] = useState(0);
  const [checklist, setChecklist] = useState(event.checklist || []);
  const [isChangingEvent, setIsChangingEvent] = useState(false);

  useEffect(() => {
    if (event.checklist) setChecklist(event.checklist);
  }, [event]);

  const completedSteps = checklist.filter(c => c.done).length;
  const progressPercent = checklist.length > 0 ? Math.round((completedSteps / checklist.length) * 100) : 0;
  const currentAction = event.actionQueue ? event.actionQueue[actionIndex] : null;
  const isFinished = actionIndex >= (event.actionQueue ? event.actionQueue.length : 0);

  const handleNextStep = () => {
    const nextChecklist = [...checklist];
    if (actionIndex + 1 < nextChecklist.length) nextChecklist[actionIndex + 1].done = true;
    setChecklist(nextChecklist);
    setActionIndex(prev => prev + 1);
    if (onUpdateEvent) onUpdateEvent({ ...event, checklist: nextChecklist });
  };

  const renderRecoveryPanel = () => {
    const props = { currentAction, isFinished, handleNextStep, actionIndex, totalSteps: event.actionQueue?.length || 0 };
    if (event.id.includes('accident')) return <VehiclePanel {...props} />;
    if (event.id.includes('fraud')) return <FraudPanel {...props} />;
    return <PropertyPanel {...props} />;
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 animate-fadeIn">
      <div className="bg-[#001C40] text-white pt-6 pb-8 px-5 shadow-md relative">
        <div className="flex justify-between items-center mb-6">
          <button onClick={onReset} className="text-blue-300 hover:text-white font-medium text-sm flex items-center gap-1 transition-colors">
            ← Dashboard
          </button>
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 border-2 border-white rounded-full flex items-center justify-center">
              <div className="w-3 h-3 bg-white rounded-sm transform rotate-45"></div>
            </div>
            <div>
              <h1 className="font-bold text-sm leading-tight tracking-wide">Allstate®</h1>
              <p className="text-[8px] uppercase tracking-widest text-blue-200 font-medium">My Help</p>
            </div>
          </div>
        </div>
        
        <div className="flex items-end justify-between">
          <div className="flex items-center gap-3">
            {event.icon && <event.icon className="w-10 h-10 text-blue-300 drop-shadow-lg" />}
            <h2 className="text-3xl font-black tracking-tight leading-none">Recovery<br/>Center</h2>
          </div>
          <div className="bg-blue-900/60 text-blue-200 text-[10px] px-3 py-1.5 rounded-lg border border-blue-800/50 shadow-inner">
            ID: {event.id.split('_')[0].toLowerCase()}_{event.id.split('_')[1].substring(0,6)}
          </div>
        </div>
      </div>

      <main className="flex-1 p-4 space-y-5 -mt-3 relative z-10">
        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
          <span className="text-[10px] bg-white shadow-sm text-gray-700 px-2.5 py-1.5 rounded-md font-medium border border-gray-200 shrink-0 flex items-center gap-1.5"><Clock className="w-3 h-3 text-blue-500"/> {contextData.timestamp}</span>
          {contextData.location && !contextData.location.includes("Not Supported") && (
            <span className="text-[10px] bg-white shadow-sm text-gray-700 px-2.5 py-1.5 rounded-md font-medium border border-gray-200 shrink-0 flex items-center gap-1.5"><MapPin className="w-3 h-3 text-red-500"/> {contextData.location}</span>
          )}
          {contextData.weather && contextData.weather !== "Analyzing..." && (
            <span className="text-[10px] bg-white shadow-sm text-gray-700 px-2.5 py-1.5 rounded-md font-medium border border-gray-200 shrink-0 flex items-center gap-1.5"><Cloud className="w-3 h-3 text-gray-400"/> {contextData.weather}</span>
          )}
        </div>

        <section className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 relative">
          <div className="flex justify-between items-start mb-2">
            <div>
              <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest flex items-center gap-1.5">
                <Shield className="w-3 h-3 text-blue-500" /> Auto-Assessed Event
              </p>
              <h2 className="text-xl font-black text-[#001C40] mt-0.5">{event.type}</h2>
            </div>
            <button onClick={() => setIsChangingEvent(!isChangingEvent)} className="text-[10px] flex items-center gap-1 bg-gray-50 border border-gray-200 text-gray-600 px-2 py-1.5 rounded-lg hover:bg-gray-100 transition-colors font-medium">
              <Edit3 className="w-3 h-3" /> Change Event
            </button>
          </div>

          {isChangingEvent && (
            <div className="mt-3 mb-4 p-3 bg-gray-50 border border-gray-200 rounded-xl grid grid-cols-3 gap-2">
               <button onClick={() => { onChangeEvent('water'); setIsChangingEvent(false); }} className="text-[10px] font-bold bg-white border border-gray-200 py-2 rounded-lg shadow-sm text-[#001C40] hover:border-blue-300">Water Leak</button>
               <button onClick={() => { onChangeEvent('accident'); setIsChangingEvent(false); }} className="text-[10px] font-bold bg-white border border-gray-200 py-2 rounded-lg shadow-sm text-[#001C40] hover:border-blue-300">Accident</button>
               <button onClick={() => { onChangeEvent('fraud'); setIsChangingEvent(false); }} className="text-[10px] font-bold bg-white border border-gray-200 py-2 rounded-lg shadow-sm text-[#001C40] hover:border-blue-300">Fraud</button>
            </div>
          )}

          <div className="mt-4 pt-4 border-t border-gray-50">
            <div className="flex justify-between text-xs font-bold text-gray-500 mb-2">
              <span>Recovery Progress</span>
              <span className="text-emerald-600">{progressPercent}% Normalized</span>
            </div>
            <div className="w-full bg-gray-100 h-2.5 rounded-full overflow-hidden border border-gray-200">
              <div className="bg-emerald-500 h-full transition-all duration-700 ease-out" style={{ width: `${progressPercent}%` }}></div>
            </div>
          </div>
        </section>

        {renderRecoveryPanel()}

        <section className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
          <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4">Your Progress Tracker</h4>
          <div className="space-y-3.5">
            {checklist.map((item) => (
              <div key={item.id} className="flex items-start gap-2.5 text-sm transition-all">
                {item.done ? (
                  <CheckCircle className="text-emerald-600 w-5 h-5 mt-0.5 shrink-0" />
                ) : (
                  <div className="w-5 h-5 border-2 border-gray-300 rounded-full mt-0.5 shrink-0" />
                )}
                <span className={item.done ? 'text-emerald-800 font-semibold' : 'text-gray-600 font-medium'}>
                  {item.text}
                </span>
              </div>
            ))}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}