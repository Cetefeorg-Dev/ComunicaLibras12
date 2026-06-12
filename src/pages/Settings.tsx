import { useState } from 'react';
import { ArrowLeft, User, Accessibility, Moon, Phone } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAppContext } from '../store.tsx';

export function Settings() {
  const { profile, setProfile, contacts, setContacts } = useAppContext();

  const handleProfileChange = (key: keyof typeof profile, value: any) => {
    setProfile(prev => ({ ...prev, [key]: value }));
  };

  const addContact = () => {
    const name = prompt("Nome do contato:");
    if (!name) return;
    const phone = prompt("Telefone:");
    if (!phone) return;
    setContacts(prev => [...prev, { id: Date.now().toString(), name, phone }]);
  };

  const removeContact = (id: string) => {
    setContacts(prev => prev.filter(c => c.id !== id));
  };

  return (
    <div className="flex flex-col h-full bg-slate-50">
      <header className="flex items-center px-4 py-4 bg-white shadow-sm shrink-0">
        <Link to="/" className="p-2 -ml-2 text-slate-500 rounded-full hover:bg-slate-100">
          <ArrowLeft className="w-6 h-6" />
        </Link>
        <span className="ml-2 font-semibold text-slate-900 leading-tight">Configurações</span>
      </header>

      <div className="flex-1 overflow-y-auto px-4 py-6 space-y-6">
        
        <section>
          <div className="flex items-center gap-2 mb-3 px-2">
            <User className="w-5 h-5 text-slate-400" />
            <h2 className="font-semibold text-slate-700 text-sm tracking-wide uppercase">Perfil</h2>
          </div>
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-1">
             <div className="p-3 border-b border-slate-100 flex items-center justify-between">
                <span className="text-slate-700 font-medium">Nome</span>
                <input 
                  type="text" 
                  value={profile.name}
                  onChange={(e) => handleProfileChange('name', e.target.value)}
                  className="bg-transparent text-right text-slate-500 font-medium w-32 outline-none" 
                  placeholder="Nome"
                />
             </div>
             <div className="p-3 flex items-center justify-between">
                <span className="text-slate-700 font-medium">Idioma Principal</span>
                <select 
                  value={profile.language}
                  onChange={(e) => handleProfileChange('language', e.target.value)}
                  className="bg-transparent text-slate-500 text-right outline-none appearance-none"
                >
                   <option value="pt-BR">Português (BR)</option>
                   <option value="en-US">English (US)</option>
                </select>
             </div>
             <div className="p-3 border-t border-slate-100 flex items-center justify-between">
                <span className="text-slate-700 font-medium">Avatar 3D</span>
                <select 
                  value={profile.avatarVariant}
                  onChange={(e) => handleProfileChange('avatarVariant', e.target.value)}
                  className="bg-transparent text-slate-500 text-right outline-none appearance-none"
                >
                   <option value="woman">Mulher</option>
                   <option value="man">Homem</option>
                </select>
             </div>
          </div>
        </section>

        <section>
          <div className="flex items-center gap-2 mb-3 px-2">
            <Accessibility className="w-5 h-5 text-slate-400" />
            <h2 className="font-semibold text-slate-700 text-sm tracking-wide uppercase">Acessibilidade</h2>
          </div>
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-1">
             <div className="p-3 border-b border-slate-100 flex items-center justify-between">
                <span className="text-slate-700 font-medium">Alto Contraste</span>
                <input 
                  type="checkbox" 
                  checked={profile.highContrast}
                  onChange={(e) => handleProfileChange('highContrast', e.target.checked)}
                  className="w-5 h-5 accent-primary"
                />
             </div>
             <div className="p-3 border-b border-slate-100 flex items-center justify-between">
                <span className="text-slate-700 font-medium">Fonte Maior</span>
                <input 
                  type="checkbox" 
                  checked={profile.largerText}
                  onChange={(e) => handleProfileChange('largerText', e.target.checked)}
                  className="w-5 h-5 accent-primary"
                />
             </div>
             <div className="p-3 flex items-center justify-between">
                <span className="text-slate-700 font-medium">Vibração</span>
                <input 
                  type="checkbox" 
                  defaultChecked
                  className="w-5 h-5 accent-primary"
                />
             </div>
          </div>
        </section>

        <section>
           <div className="flex justify-between items-end mb-3 px-2">
              <div className="flex items-center gap-2">
                <Phone className="w-5 h-5 text-slate-400" />
                <h2 className="font-semibold text-slate-700 text-sm tracking-wide uppercase">Contatos SOS</h2>
              </div>
              <button onClick={addContact} className="text-primary text-sm font-semibold active:scale-95">Adicionar</button>
           </div>
           
           <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-1 overflow-hidden">
               {contacts.map((c, i) => (
                 <div key={c.id} className={`p-4 flex items-center justify-between ${i !== contacts.length -1 ? 'border-b border-slate-100' : ''}`}>
                    <div>
                       <p className="font-medium text-slate-800">{c.name}</p>
                       <p className="text-sm font-mono text-slate-500">{c.phone}</p>
                    </div>
                    <button onClick={() => removeContact(c.id)} className="p-2 text-red-500 bg-red-50 rounded-lg active:scale-95 transition-transform text-sm font-medium">Remover</button>
                 </div>
               ))}
               {contacts.length === 0 && (
                  <p className="p-4 text-center text-slate-500 text-sm">Nenhum contato cadastrado.</p>
               )}
           </div>
        </section>

      </div>
    </div>
  );
}
