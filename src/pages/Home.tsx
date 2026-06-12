import { HandMetal, Type, AlertTriangle, Settings as SettingsIcon, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { useAppContext } from '../store.tsx';

const menuItems = [
  { path: '/libras-to-text', label: 'Câmera Libras', icon: HandMetal, color: 'text-cyan-400' },
  { path: '/text-to-libras', label: 'Tradutor Texto', icon: Type, color: 'text-white' },
  { path: '/ia-comunica', label: 'IA Comunica+', icon: Sparkles, color: 'text-emerald-400', isDouble: true },
  { path: '/emergency', label: 'Emergência', icon: AlertTriangle, color: 'text-white', isSos: true },
];

export function Home() {
  const { profile } = useAppContext();

  return (
    <div className="flex flex-col h-full bg-transparent overflow-y-auto pb-6">
      <header className="px-6 pt-8 pb-4 flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white mb-1 drop-shadow-md">
            Olá, <span className="text-cyan-400">{profile.name.split(' ')[0]}</span>
          </h1>
          <p className="text-white/60 font-medium">O que você deseja traduzir?</p>
        </div>
        <Link 
          to="/settings" 
          className="p-3 glass-panel rounded-2xl hover:bg-white/10 active:scale-95 transition-all text-white/80"
          title="Configurações"
        >
          <SettingsIcon className="w-5 h-5" />
        </Link>
      </header>

      <div className="flex-1 px-4 grid grid-cols-2 gap-4 auto-rows-max mt-2">
        {menuItems.map((item, index) => (
          <motion.div
            key={item.path}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className={item.isSos || item.isDouble ? "col-span-2" : ""}
          >
            <Link
              to={item.path}
              className={`flex flex-col items-center justify-center p-6 rounded-3xl shadow-sm active:scale-95 transition-all hover:bg-white/10 ${item.isSos ? 'h-24 bg-red-600/80 border border-white/30 shadow-[0_0_20px_rgba(220,38,38,0.4)] flex-row gap-4' : item.isDouble ? 'h-24 bg-emerald-700/60 border border-emerald-400/30 flex-row gap-4' : 'h-40 glass-panel'}`}
            >
              <div className={`w-12 h-12 flex items-center justify-center rounded-xl bg-white/10 ${item.isSos || item.isDouble ? 'mb-0' : 'mb-4'}`}>
                 <item.icon className={`w-6 h-6 ${item.color}`} strokeWidth={2.5} />
              </div>
              <span className="font-bold tracking-wide uppercase text-center text-[13px] text-white">
                {item.label}
              </span>
            </Link>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
