import { useState } from 'react';
import { ArrowLeft, AlertTriangle, MapPin, Phone, ShieldAlert, CheckCircle2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { useAppContext } from '../store.tsx';

export function Emergency() {
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent'>('idle');
  const { contacts } = useAppContext();

  const handleSOS = () => {
    if (status !== 'idle') return;
    setStatus('sending');
    
    // Simulate API calls: Getting GPS, Sending SMS
    setTimeout(() => {
      setStatus('sent');
      setTimeout(() => setStatus('idle'), 5000);
    }, 2000);
  };

  return (
    <div className="flex flex-col h-full bg-red-50 relative">
      <header className="flex items-center px-4 py-4 shrink-0">
        <Link to="/" className="p-2 -ml-2 text-red-900 rounded-full hover:bg-red-100">
          <ArrowLeft className="w-6 h-6" />
        </Link>
        <span className="ml-2 font-semibold text-red-900 leading-tight">Emergência</span>
      </header>

      <div className="flex-1 flex flex-col items-center justify-center px-6 py-8">
         
         <div className="relative mb-12">
            {status === 'sending' && (
              <motion.div 
                 initial={{ scale: 0.8, opacity: 0.5 }}
                 animate={{ scale: 1.5, opacity: 0 }}
                 transition={{ duration: 1.5, repeat: Infinity }}
                 className="absolute inset-0 bg-red-500 rounded-full"
              />
            )}
            <button
               onClick={handleSOS}
               className={`relative z-10 w-64 h-64 rounded-full flex flex-col items-center justify-center text-white shadow-2xl transition-transform active:scale-95 ${
                 status === 'sent' ? 'bg-emerald-500' : 'bg-red-600 hover:bg-red-500 shadow-red-600/40 border-8 border-red-200'
               }`}
            >
               {status === 'sent' ? (
                 <>
                   <CheckCircle2 className="w-24 h-24 mb-2" />
                   <span className="font-bold text-2xl uppercase tracking-wider">Enviado!</span>
                 </>
               ) : (
                 <>
                   <ShieldAlert className="w-24 h-24 mb-2" />
                   <span className="font-bold text-4xl uppercase tracking-wider">SOS</span>
                 </>
               )}
            </button>
         </div>

         <div className="text-center space-y-2 mb-10 max-w-[280px]">
            {status === 'sending' ? (
              <p className="text-red-800 font-medium text-lg leading-tight">
                 Obtendo localização GPS...<br/>Enviando alerta para contatos...
              </p>
            ) : status === 'sent' ? (
              <p className="text-emerald-800 font-medium text-lg leading-tight">
                 Seus contatos de emergência e a polícia foram acionados. Sua localização foi enviada.
              </p>
            ) : (
              <p className="text-red-800 font-medium text-lg leading-tight">
                 Toque no botão acima para pedir ajuda imediata.
              </p>
            )}
         </div>

         <div className="w-full max-w-sm mt-auto space-y-3">
             <div className="bg-white rounded-2xl p-4 shadow-sm border border-red-100 flex items-center gap-4">
                <div className="p-3 bg-red-50 rounded-full shrink-0">
                   <Phone className="w-5 h-5 text-red-600 fill-red-600" />
                </div>
                <div className="flex-1">
                   <h3 className="font-semibold text-slate-900">Ligar para Polícia (190)</h3>
                   <p className="text-sm text-slate-500 line-clamp-1">Toque para iniciar ligação real</p>
                </div>
             </div>

             <div className="bg-white rounded-2xl p-4 shadow-sm border border-red-100">
                 <h3 className="font-semibold text-slate-900 flex items-center gap-2 mb-3">
                    <MapPin className="w-4 h-4 text-slate-400" /> 
                    Contatos que serão avisados:
                 </h3>
                 <div className="space-y-2">
                    {contacts.map(c => (
                      <div key={c.id} className="flex justify-between items-center text-sm p-2 bg-slate-50 rounded-lg">
                         <span className="font-medium text-slate-700">{c.name}</span>
                         <span className="text-slate-500 font-mono">{c.phone}</span>
                      </div>
                    ))}
                    {contacts.length === 0 && (
                      <p className="text-sm text-slate-500 italic">Nenhum contato cadastrado.</p>
                    )}
                 </div>
             </div>
         </div>
         
      </div>
    </div>
  );
}
