import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface ClinicData {
  name: string;
  specialty: string;
  description: string;
  phone: string;
  website: string;
  naverUrl: string;
  kakaoUrl: string;
}

interface ClinicContextType {
  clinicData: ClinicData;
  selectedSpecialty: string[];
  selectedTone: string[];
  selectedKeywords: string[];
  selectedSpecialties: string[];
  updateClinicData: (data: ClinicData) => void;
  updateSelectedSpecialty: (specialty: string[]) => void;
  updateSelectedTone: (tone: string[]) => void;
  updateSelectedKeywords: (keywords: string[]) => void;
  updateSelectedSpecialties: (specialties: string[]) => void;
}

const ClinicContext = createContext<ClinicContextType | undefined>(undefined);

export function ClinicProvider({ children }: { children: ReactNode }) {
  const [clinicData, setClinicData] = useState<ClinicData>({
    name: '병원명',
    specialty: '치과',
    description: '',
    phone: '01053848836',
    website: '',
    naverUrl: '',
    kakaoUrl: '',
  });

  const [selectedSpecialty, setSelectedSpecialty] = useState<string[]>(['치과']);
  const [selectedTone, setSelectedTone] = useState<string[]>([
    '존칭 사용', '프로페셔널', '친절한 문체', '상세 설명'
  ]);
  const [selectedKeywords, setSelectedKeywords] = useState<string[]>([
    '24시간 운영', '야간 진료', '당일 예약 가능'
  ]);
  const [selectedSpecialties, setSelectedSpecialties] = useState<string[]>([
    '충치', '1종', '근관 치료'
  ]);

  // Load from localStorage on mount
  useEffect(() => {
    const savedClinicData = localStorage.getItem('clinicData');
    const savedSpecialty = localStorage.getItem('selectedSpecialty');
    const savedTone = localStorage.getItem('selectedTone');
    const savedKeywords = localStorage.getItem('selectedKeywords');
    const savedSpecialties = localStorage.getItem('selectedSpecialties');

    if (savedClinicData) setClinicData(JSON.parse(savedClinicData));
    if (savedSpecialty) setSelectedSpecialty(JSON.parse(savedSpecialty));
    if (savedTone) setSelectedTone(JSON.parse(savedTone));
    if (savedKeywords) setSelectedKeywords(JSON.parse(savedKeywords));
    if (savedSpecialties) setSelectedSpecialties(JSON.parse(savedSpecialties));
  }, []);

  const updateClinicData = (data: ClinicData) => {
    setClinicData(data);
    localStorage.setItem('clinicData', JSON.stringify(data));
  };

  const updateSelectedSpecialty = (specialty: string[]) => {
    setSelectedSpecialty(specialty);
    localStorage.setItem('selectedSpecialty', JSON.stringify(specialty));
  };

  const updateSelectedTone = (tone: string[]) => {
    setSelectedTone(tone);
    localStorage.setItem('selectedTone', JSON.stringify(tone));
  };

  const updateSelectedKeywords = (keywords: string[]) => {
    setSelectedKeywords(keywords);
    localStorage.setItem('selectedKeywords', JSON.stringify(keywords));
  };

  const updateSelectedSpecialties = (specialties: string[]) => {
    setSelectedSpecialties(specialties);
    localStorage.setItem('selectedSpecialties', JSON.stringify(specialties));
  };

  return (
    <ClinicContext.Provider
      value={{
        clinicData,
        selectedSpecialty,
        selectedTone,
        selectedKeywords,
        selectedSpecialties,
        updateClinicData,
        updateSelectedSpecialty,
        updateSelectedTone,
        updateSelectedKeywords,
        updateSelectedSpecialties,
      }}
    >
      {children}
    </ClinicContext.Provider>
  );
}

export function useClinic() {
  const context = useContext(ClinicContext);
  if (context === undefined) {
    throw new Error('useClinic must be used within a ClinicProvider');
  }
  return context;
}
