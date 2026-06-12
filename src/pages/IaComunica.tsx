import { useState } from 'react';
import { ArrowLeft, Sparkles, Copy, Share2, Send, Wand2, Type } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';

export function IaComunica() {
  const [inputText, setInputText] = useState("");
  const [translatedText, setTranslatedText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (message: string) => {
    setToastMessage(message);
    setTimeout(() => {
      setToastMessage(null);
    }, 3000);
  };

  const handleTranslate = async () => {
    if (!inputText.trim()) return;
    
    setIsLoading(true);
    try {
      const response = await fetch('/api/ai/comunica', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: inputText }),
      });
      const data = await response.json();
      if (data.result) {
        setTranslatedText(data.result);
      } else {
        showToast("Não foi possível adaptar o texto.");
      }
    } catch (error) {
      console.error("Translation error:", error);
      showToast("Erro ao tentar adaptar o texto.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(translatedText);
    showToast('Texto copiado!');
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: 'IA Comunica+',
        text: translatedText
      }).catch(console.error);
    } else {
      handleCopy();
    }
  };

  return (
    <div className="flex flex-col h-full bg-transparent overflow-y-auto">
      <header className="flex items-center px-4 py-4 shrink-0 pointer-events-auto">
        <Link to="/" className="p-2 glass-panel rounded-full hover:bg-white/10 active:scale-95 transition-all text-white">
          <ArrowLeft className="w-6 h-6" />
        </Link>
        <span className="ml-2 font-bold text-white tracking-wide uppercase text-sm flex items-center gap-2">
           <Sparkles className="w-4 h-4 text-emerald-400" />
           IA Comunica+
        </span>
      </header>

      <div className="flex-1 px-4 py-4 flex flex-col gap-6">
        {/* Intro */}
        <div className="glass-panel p-4 rounded-2xl bg-emerald-900/40 border-emerald-400/30">
          <p className="text-emerald-100 text-sm font-medium leading-relaxed mb-4">
            A IA converte "Português de Libras" para "Português Escrito Natural" preservando a sua intenção original.
          </p>
          <div className="bg-black/20 p-3 rounded-xl border border-white/10 flex flex-col gap-2">
             <div className="flex items-start gap-2">
               <Type className="w-4 h-4 text-emerald-400 mt-0.5 shrink-0" />
               <span className="text-xs text-white/70 italic">"Eu médico querer agora dor barriga forte."</span>
             </div>
             <div className="flex items-start gap-2">
               <Sparkles className="w-4 h-4 text-emerald-400 mt-0.5 shrink-0" />
               <span className="text-xs text-white font-medium">"Preciso consultar um médico pois estou com forte dor na barriga."</span>
             </div>
          </div>
        </div>

        {/* Input area */}
        <div className="flex flex-col gap-2">
          <label className="text-white/80 font-bold uppercase tracking-widest text-[11px] ml-1">Escreva do seu jeito</label>
          <div className="glass-panel text-white rounded-2xl p-4 flex flex-col gap-3 border-emerald-500/20 focus-within:border-emerald-400 focus-within:bg-white/10 transition-colors">
            <textarea
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Ex: Eu casa minha mãe ir depois trabalho..."
              className="w-full bg-transparent border-none outline-none resize-none h-24 text-[15px] placeholder:text-white/30"
            />
            <div className="flex justify-end gap-2 mt-2">
              {inputText && (
                 <button 
                    onClick={() => setInputText('')}
                    className="px-3 py-1.5 rounded-lg text-white/50 text-xs font-bold uppercase transition-colors hover:bg-white/10"
                 >
                    Limpar
                 </button>
              )}
              <button
                onClick={handleTranslate}
                disabled={!inputText.trim() || isLoading}
                className="bg-emerald-500 text-[#0f172a] px-5 py-2 rounded-xl font-bold text-sm tracking-wide flex items-center justify-center gap-2 active:scale-95 transition-all shadow-[0_0_15px_rgba(16,185,129,0.3)] disabled:opacity-50 disabled:active:scale-100 disabled:shadow-none"
              >
                {isLoading ? (
                   <span className="h-5 flex items-center">Processando...</span>
                ) : (
                   <>
                      <Wand2 className="w-4 h-4" />
                      Adaptar
                   </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Result Area */}
        <AnimatePresence>
          {translatedText && !isLoading && (
             <motion.div 
               initial={{ opacity: 0, y: 10, scale: 0.98 }}
               animate={{ opacity: 1, y: 0, scale: 1 }}
               exit={{ opacity: 0, y: -10, scale: 0.98 }}
               className="flex flex-col gap-2 mt-2"
             >
               <label className="text-emerald-400 font-bold uppercase tracking-widest text-[11px] ml-1 flex items-center gap-1">
                 <Sparkles className="w-3 h-3" />
                 Sugestão do IA Comunica+
               </label>
               <div className="bg-emerald-950/80 border border-emerald-400/30 rounded-2xl p-5 shadow-[0_0_30px_rgba(16,185,129,0.15)] flex flex-col gap-4 relative overflow-hidden">
                 <div className="absolute top-0 left-0 w-2 h-full bg-emerald-500"></div>
                 <p className="text-white text-[15px] leading-relaxed">
                   {translatedText}
                 </p>
                 
                 <div className="flex gap-2 mt-2">
                   <button 
                     onClick={handleCopy}
                     className="flex-1 bg-white/10 hover:bg-white/20 active:bg-white/30 text-white py-2.5 rounded-xl font-bold uppercase text-[11px] tracking-wide flex justify-center items-center gap-2 transition-colors border border-white/10"
                   >
                     <Copy className="w-4 h-4" /> Copiar
                   </button>
                   <button 
                     onClick={handleShare}
                     className="flex-1 bg-white/10 hover:bg-white/20 active:bg-white/30 text-white py-2.5 rounded-xl font-bold uppercase text-[11px] tracking-wide flex justify-center items-center gap-2 transition-colors border border-white/10"
                   >
                     <Share2 className="w-4 h-4" /> Compartilhar
                   </button>
                 </div>
               </div>
             </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Toast Notification */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 15 }}
            className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-emerald-500 text-slate-950 font-bold px-4 py-2.5 rounded-full text-xs shadow-2xl tracking-wide uppercase z-50 flex items-center gap-2 border border-emerald-400"
          >
            <Sparkles className="w-4 h-4" />
            {toastMessage}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
