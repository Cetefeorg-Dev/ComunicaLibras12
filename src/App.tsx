import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { VLibrasWidget } from './components/VLibrasWidget.tsx';
import { AppProvider } from './store.tsx';
import { Home } from './pages/Home.tsx';
import { LibrasTranslator } from './pages/LibrasTranslator.tsx';
import { TextTranslator } from './pages/TextTranslator.tsx';
import { IaComunica } from './pages/IaComunica.tsx';
import { Emergency } from './pages/Emergency.tsx';
import { Settings } from './pages/Settings.tsx';

function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-center justify-center min-h-screen relative p-4 overflow-hidden">
      <div className="mesh-bg"></div>
      <div className="w-full max-w-sm h-[800px] max-h-[90vh] glass-panel rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col relative">
        <div className="flex-1 overflow-hidden relative">
          {children}
        </div>
        {/* Fake home indicator */}
        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-32 h-1 bg-white/20 rounded-full pointer-events-none" />
      </div>
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <>
          <AppLayout>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/libras-to-text" element={<LibrasTranslator />} />
              <Route path="/text-to-libras" element={<TextTranslator />} />
              <Route path="/ia-comunica" element={<IaComunica />} />
              <Route path="/emergency" element={<Emergency />} />
              <Route path="/settings" element={<Settings />} />
            </Routes>
          </AppLayout>
          <VLibrasWidget />
        </>
      </BrowserRouter>
    </AppProvider>
  );
}
