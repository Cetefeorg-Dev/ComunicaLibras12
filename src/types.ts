export type Message = {
  id: string;
  text: string;
  sender: "user" | "other";
  timestamp: Date;
  isSimulatedAudio?: boolean;
};

export type EmergencyContact = {
  id: string;
  name: string;
  phone: string;
};

export type UserProfile = {
  name: string;
  language: string;
  preferLibras: boolean;
  highContrast: boolean;
  largerText: boolean;
  avatarVariant: "woman" | "man";
};

export type QuickMessageCategory = {
  name: string;
  messages: string[];
};
