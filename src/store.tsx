import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserProfile, EmergencyContact } from './types.ts';

interface AppContextType {
  profile: UserProfile;
  setProfile: React.Dispatch<React.SetStateAction<UserProfile>>;
  contacts: EmergencyContact[];
  setContacts: React.Dispatch<React.SetStateAction<EmergencyContact[]>>;
}

const defaultProfile: UserProfile = {
  name: "Usuário",
  language: "pt-BR",
  preferLibras: true,
  highContrast: false,
  largerText: false,
  avatarVariant: "woman",
};

const defaultContacts: EmergencyContact[] = [
  { id: '1', name: 'Mãe', phone: '(11) 99999-9999' }
];

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [profile, setProfile] = useState<UserProfile>(defaultProfile);
  const [contacts, setContacts] = useState<EmergencyContact[]>(defaultContacts);

  // Apply accessibility classes to document body
  useEffect(() => {
    if (profile.highContrast) {
      document.body.classList.add('high-contrast');
    } else {
      document.body.classList.remove('high-contrast');
    }

    if (profile.largerText) {
      document.body.classList.add('larger-text');
    } else {
      document.body.classList.remove('larger-text');
    }
  }, [profile.highContrast, profile.largerText]);

  return (
    <AppContext.Provider value={{ profile, setProfile, contacts, setContacts }}>
      {children}
    </AppContext.Provider>
  );
}

export function useAppContext() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
}
