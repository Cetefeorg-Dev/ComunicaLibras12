import { useState, useEffect } from 'react';
import { ArrowLeft, Play, RefreshCcw, Type, Rabbit, Snail } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { useAppContext } from '../store.tsx';

import { Avatar3D } from '../components/Avatar3D';


export function TextTranslator() {
  const { profile } = useAppContext();
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [showInstallModal, setShowInstallModal] = useState(false);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  const handleTranslateNativeApp = () => {
    // Fallback URL para capturarmos se o aplicativo não puder ser aberto.
    // Usamos o próprio site com uma query string para detectar o fallback.
    const currentUrl = new URL(window.location.href);
    currentUrl.searchParams.set('show_vlibras_modal', 'true');
    const fallbackStr = encodeURIComponent(currentUrl.toString());

    // Usa a action.MAIN para garantir que o app abre mesmo que não suporte ACTION_SEND de texto.
    // Assim, ao menos ele é iniciado e o usuário pode colar o texto (já copiado para o clipboard).
    const intentUrl = `intent:#Intent;action=android.intent.action.MAIN;category=android.intent.category.LAUNCHER;package=br.gov.vlibras;S.browser_fallback_url=${fallbackStr};end`;
    
    showToast("Abrindo VLibras...");
    
    window.location.href = intentUrl;
  };

  // Verifica se o fallback foi ativado ao carregar a página
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('show_vlibras_modal') === 'true') {
      setShowInstallModal(true);
      
      // Limpa a URL para não exibir o modal novamente em recarregamentos
      const newUrl = new URL(window.location.href);
      newUrl.searchParams.delete('show_vlibras_modal');
      window.history.replaceState({}, '', newUrl.toString());
    }
  }, []);
  
  return (
    <div className="flex flex-col h-full bg-transparent relative">
      <header className="flex items-center px-4 py-4 glass-header shrink-0 z-10 transition-colors">
        <Link to="/" className="p-2 -ml-2 text-white/70 rounded-full hover:bg-white/10">
          <ArrowLeft className="w-6 h-6" />
        </Link>
        <span className="ml-2 font-bold text-white tracking-wide uppercase text-sm">Texto para Libras</span>
        <span className="ml-auto bg-cyan-400/20 text-cyan-300 border border-cyan-400/50 text-[10px] font-bold px-2 py-1 rounded-md uppercase">V-LIBRAS INTEGRADO</span>
      </header>

      {/* 3D Model Render Instruction */}
      <div className="flex-1 relative flex flex-col items-center justify-center p-6 text-center">
        
        <div className="glass-panel w-full max-w-sm rounded-[2rem] p-8 flex flex-col items-center gap-6 border-cyan-400/20">
           <div className="w-24 h-24 bg-white rounded-[1.5rem] flex items-center justify-center shadow-[0_0_30px_rgba(37,99,235,0.4)] overflow-hidden">
             <img src="https://play-lh.googleusercontent.com/9O0Z-eL00JtT-bA0Z01u_61QjGz1kXh0D7Y-MvFhLz_28M_-3_m2XG1t3W5Zq9xMug" alt="VLibras logo" referrerPolicy="no-referrer" crossOrigin="anonymous" className="w-full h-full object-cover scale-110" />
           </div>
           <div>
             <h2 className="text-white font-bold text-2xl mb-2">VLibras no Celular</h2>
             <p className="text-white/70 text-sm leading-relaxed">
               Integração direta com o aplicativo oficial do Governo Federal (VLibras).
               <br /><br />
               Clique no botão abaixo para abrir o aplicativo do VLibras instalado em seu dispositivo e utilizar seu tradutor.
             </p>
           </div>
        </div>
      </div>

      {/* Input area */}
      <div className="shrink-0 bg-[#0f172a] shadow-[0_-10px_40px_rgba(0,0,0,0.5)] border-t border-white/10 px-4 py-8 pb-safe flex flex-col gap-3 relative z-10">
        
        <div className="flex flex-col gap-3 w-full max-w-sm mx-auto">
          <button
            onClick={handleTranslateNativeApp}
            className="w-full bg-cyan-600 border border-cyan-500 text-white font-bold uppercase tracking-wide rounded-xl py-4 flex items-center justify-center gap-2 active:scale-[0.98] transition-transform shadow-[0_0_15px_rgba(34,211,238,0.3)]"
          >
             <div className="w-6 h-6 bg-white rounded-full flex items-center justify-center mr-1 overflow-hidden shrink-0">
               <img src="https://play-lh.googleusercontent.com/9O0Z-eL00JtT-bA0Z01u_61QjGz1kXh0D7Y-MvFhLz_28M_-3_m2XG1t3W5Zq9xMug" alt="VLibras logo" referrerPolicy="no-referrer" crossOrigin="anonymous" className="w-full h-full object-cover scale-110" />
             </div>
             Abrir App do VLibras
          </button>
        </div>
      </div>

      {/* Install Modal */}
      <AnimatePresence>
        {showInstallModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-slate-900 border border-white/10 rounded-3xl p-6 max-w-sm w-full shadow-2xl flex flex-col items-center text-center gap-4"
            >
              <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center mb-2 shadow-[0_0_20px_rgba(37,99,235,0.4)] overflow-hidden shrink-0">
                <img src="https://play-lh.googleusercontent.com/9O0Z-eL00JtT-bA0Z01u_61QjGz1kXh0D7Y-MvFhLz_28M_-3_m2XG1t3W5Zq9xMug" alt="VLibras logo" referrerPolicy="no-referrer" crossOrigin="anonymous" className="w-full h-full object-cover scale-110" />
              </div>
              <h3 className="text-xl font-bold text-white">Aplicativo não encontrado</h3>
              <p className="text-white/70 text-sm">
                Para utilizar esta funcionalidade de forma nativa no seu celular, é necessário instalar o aplicativo VLibras.
              </p>
              
              <div className="flex flex-col gap-3 w-full mt-4">
                 <a
                   href="https://play.google.com/store/search?q=V+LIBRAS&c=apps"
                   target="_blank"
                   rel="noopener noreferrer"
                   onClick={() => setShowInstallModal(false)}
                   className="w-full bg-cyan-600 hover:bg-cyan-500 text-white font-bold py-4 rounded-xl flex items-center justify-center active:scale-95 transition-all uppercase tracking-wide text-sm"
                 >
                   Baixar VLibras
                 </a>
                 <button
                   onClick={() => setShowInstallModal(false)}
                   className="w-full bg-white/5 hover:bg-white/10 text-white font-bold py-3.5 rounded-xl active:scale-95 transition-all text-sm uppercase tracking-wide"
                 >
                   Cancelar
                 </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Toast Notification */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 15 }}
            className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-cyan-400 text-slate-950 font-bold px-4 py-2.5 rounded-full text-xs shadow-2xl tracking-wide uppercase z-50 flex items-center gap-2 border border-cyan-300"
          >
            <Play className="w-3 h-3 fill-current" />
            {toastMessage}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
