// 병원 정보 기반 맞춤형 필드 및 메시지 생성 유틸리티

export type TemplateType = 'first_visit' | 'after_care' | 'recall' | 'noshow' | 'holiday' | 'sns';

interface ClinicInfo {
  name: string;
  selectedSpecialty: string[];
  selectedKeywords: string[];
  selectedSpecialties: string[];
  selectedTone: string[];
}

// 진료과별 맞춤 추가 정보 태그
export function getAdditionalTagsBySpecialty(specialties: string[]): string[] {
  const baseCommonTags = ['주차 가능', '대중교통 이용 권장', '당일 5분 전 도착 권장', '신분증 지참 요망', '보호자 동반 권장'];
  
  if (specialties.includes('치과')) {
    return [...baseCommonTags, '식사 후 내원 권장', '칫솔 지참', '양치 후 내원'];
  }
  
  if (specialties.includes('한의원')) {
    return [...baseCommonTags, '편한 복장', '공복 상태 권장', '여유 있게 오세요'];
  }
  
  if (specialties.includes('피부과')) {
    return [...baseCommonTags, '화장 지양', '선크림 미착용', '시술 부위 노출 가능 복장'];
  }
  
  if (specialties.includes('성형외과')) {
    return [...baseCommonTags, '화장 지양', '편한 복장', '동반인 권장', '신분증 필수'];
  }
  
  if (specialties.includes('안과')) {
    return [...baseCommonTags, '렌즈 착용 금지', '선글라스 지참', '보호자 동반 권장'];
  }
  
  if (specialties.includes('정형외과')) {
    return [...baseCommonTags, '편한 복장', 'X-ray 자료 지참', '보호자 동반 권장'];
  }
  
  if (specialties.includes('동물병원')) {
    return ['주차 가능', '대중교통 이용 권장', '예약 시간 엄수', '이동장 지참', '목줄 필수', '배변 봉투 지참'];
  }
  
  return baseCommonTags;
}

// 진료과별 치료 유형 옵션
export function getTreatmentTypesBySpecialty(specialties: string[], selectedSpecialties: string[]): string[] {
  if (specialties.includes('치과')) {
    const base = ['스케일링', '충치 치료', '신경 치료', '임플란트', '교정', '미백', '발치'];
    return [...base, ...selectedSpecialties.filter(s => !base.includes(s))];
  }
  
  if (specialties.includes('한의원')) {
    const base = ['침 치료', '추나 요법', '부항', '한약 처방', '뜸 치료', '봉침'];
    return [...base, ...selectedSpecialties.filter(s => !base.includes(s))];
  }
  
  if (specialties.includes('피부과')) {
    return ['레이저 토닝', '보톡스', '필러', '여드름 치료', '제모', '피부 관리'];
  }
  
  if (specialties.includes('성형외과')) {
    return ['쌍꺼풀', '코 성형', '지방 흡입', '리프팅', '보톡스', '필러'];
  }
  
  if (specialties.includes('안과')) {
    return ['라식', '라섹', '백내장 수술', '안압 검사', '시력 검사', '안저 검사'];
  }
  
  if (specialties.includes('정형외과')) {
    return ['물리 치료', '주사 치료', '도수 치료', '충격파 치료', 'X-ray 검사'];
  }
  
  if (specialties.includes('동물병원')) {
    return ['예방 접종', '중성화 수술', '스케일링', '피부 검사', '혈액 검사', '정기 검진'];
  }
  
  return selectedSpecialties.length > 0 ? selectedSpecialties : ['기본 진료', '정기 검진', '상담'];
}

// 진료과별 주의사항 템플릿
export function getCareInstructionsByTreatment(specialties: string[], treatmentType: string): string[] {
  if (specialties.includes('치과')) {
    if (treatmentType.includes('임플란트') || treatmentType.includes('발치') || treatmentType.includes('신경')) {
      return [
        '시술 후 2시간 동안 음식 섭취 금지',
        '딱딱하거나 질긴 음식 피하기',
        '양치 시 부드럽게',
        '흡연 및 음주 금지',
        '처방약 복용'
      ];
    }
    if (treatmentType.includes('스케일링')) {
      return [
        '시술 후 찬 음식 피하기',
        '부드러운 칫솔 사용',
        '치실 사용 권장'
      ];
    }
  }
  
  if (specialties.includes('한의원')) {
    return [
      '시술 부위 무리하지 않기',
      '충분한 휴식',
      '처방약 복용',
      '과도한 운동 자제'
    ];
  }
  
  if (specialties.includes('피부과')) {
    return [
      '시술 부위 만지지 않기',
      '자외선 차단',
      '화장 24시간 금지',
      '보습제 사용'
    ];
  }
  
  return [
    '처방약 복용',
    '충분한 휴식',
    '이상 증상 시 연락'
  ];
}

// 진료과별 재방문 권장 기간
export function getRecallPeriodBySpecialty(specialties: string[], selectedSpecialties: string[]): string[] {
  if (specialties.includes('치과')) {
    return ['3개월 후', '6개월 후', '1년 후'];
  }
  
  if (specialties.includes('한의원')) {
    return ['1주일 후', '2주일 후', '1개월 후'];
  }
  
  if (specialties.includes('피부과')) {
    return ['1개월 후', '3개월 후', '6개월 후'];
  }
  
  if (specialties.includes('안과')) {
    return ['1개월 후', '3개월 후', '6개월 후', '1년 후'];
  }
  
  if (specialties.includes('동물병원')) {
    return ['1개월 후 (예방접종)', '3개월 후', '6개월 후', '1년 후'];
  }
  
  return ['1개월 후', '3개월 후', '6개월 후'];
}

// 병원 정보 기반 메시지 생성
export function generateMessage(
  clinicInfo: ClinicInfo,
  templateType: TemplateType,
  fields: Record<string, any>
): string {
  const { name, selectedSpecialty, selectedTone, selectedKeywords } = clinicInfo;
  
  // 톤 결정
  const isPolite = selectedTone.includes('존칭 사용');
  const isDetailed = selectedTone.includes('상세 설명');
  const isFormal = selectedTone.includes('포멀') || selectedTone.includes('전문적');
  const isProfessional = selectedTone.includes('프로페셔널');
  
  let greeting = `안녕하세요`;
  if (isPolite) {
    greeting = selectedSpecialty.includes('동물병원') 
      ? `안녕하세요, 보호자님` 
      : `안녕하세요`;
  }
  
  let hospitalName = name;
  if (!name.includes('병원') && !name.includes('의원') && !name.includes('과')) {
    if (selectedSpecialty.includes('치과')) hospitalName += ' 치과';
    else if (selectedSpecialty.includes('한의원')) hospitalName += ' 한의원';
    else if (selectedSpecialty.includes('동물병원')) hospitalName += ' 동물병원';
    else if (selectedSpecialty.length > 0) hospitalName += ` ${selectedSpecialty[0]}`;
  }
  
  let closing = '감사합니다.';
  if (selectedTone.includes('감사 인사')) {
    closing = `방문해 주셔서 감사합니다.`;
  }
  
  let message = '';
  
  switch (templateType) {
    case 'first_visit':
      message = `${greeting}, ${hospitalName}입니다.\\n\\n`;
      
      if (fields.appointmentDateTime) {
        const dateObj = new Date(fields.appointmentDateTime);
        const formattedDate = `${dateObj.getMonth() + 1}월 ${dateObj.getDate()}일 ${dateObj.getHours()}시 ${dateObj.getMinutes() > 0 ? dateObj.getMinutes() + '분' : ''}`;
        message += `${formattedDate} 예약이 확정되었습니다.\\n\\n`;
      }
      
      if (fields.selectedTags && fields.selectedTags.length > 0) {
        message += `안내사항:\\n`;
        fields.selectedTags.forEach((tag: string) => {
          message += `• ${tag}\\n`;
        });
        message += `\\n`;
      }
      
      if (selectedKeywords.includes('주차 가능')) {
        message += `주차 가능합니다.\\n`;
      }
      
      message += `궁금한 점이 있으시면 언제든 연락 주세요.\\n\\n${closing}`;
      break;
      
    case 'after_care':
      message = `${greeting}, ${hospitalName}입니다.\\n\\n`;
      
      if (fields.treatmentType) {
        message += `${fields.treatmentType} 시술 후 주의사항입니다.\\n\\n`;
      }
      
      if (fields.careInstructions && fields.careInstructions.length > 0) {
        fields.careInstructions.forEach((instruction: string, index: number) => {
          message += `${index + 1}. ${instruction}\\n`;
        });
        message += `\\n`;
      }
      
      message += `이상 증상이 있으시면 즉시 연락 주세요.\\n\\n${closing}`;
      break;
      
    case 'recall':
      message = `${greeting}, ${hospitalName}입니다.\\n\\n`;
      
      if (fields.lastVisitDate) {
        message += `마지막 방문일로부터 `;
      }
      
      if (fields.recallPeriod) {
        message += `${fields.recallPeriod}이 지났습니다.\\n\\n`;
      }
      
      if (selectedSpecialty.includes('치과')) {
        message += `정기 검진 및 스케일링을 권장드립니다.\\n\\n`;
      } else if (selectedSpecialty.includes('동물병원')) {
        message += `정기 검진 및 예방접종 시기입니다.\\n\\n`;
      } else {
        message += `정기 검진 시기입니다.\\n\\n`;
      }
      
      message += `예약 문의는 언제든 연락 주세요.\\n\\n${closing}`;
      break;
      
    case 'noshow':
      message = `${greeting}, ${hospitalName}입니다.\\n\\n`;
      
      if (fields.reminderDateTime) {
        const dateObj = new Date(fields.reminderDateTime);
        const formattedDate = `${dateObj.getMonth() + 1}월 ${dateObj.getDate()}일 ${dateObj.getHours()}시 ${dateObj.getMinutes() > 0 ? dateObj.getMinutes() + '분' : ''}`;
        message += `${formattedDate} 예약 리마인더입니다.\\n\\n`;
      }
      
      if (fields.reminderMessage) {
        message += `${fields.reminderMessage}\\n\\n`;
      }
      
      message += `예약 시간에 맞춰 방문해 주세요.\\n변경이나 취소가 필요하시면 미리 연락 부탁드립니다.\\n\\n${closing}`;
      break;
      
    case 'holiday':
      message = `${greeting}, ${hospitalName}입니다.\\n\\n`;
      
      if (fields.holidayStartDate && fields.holidayEndDate) {
        const startDate = new Date(fields.holidayStartDate);
        const endDate = new Date(fields.holidayEndDate);
        message += `휴진 안내:\\n${startDate.getMonth() + 1}월 ${startDate.getDate()}일 ~ ${endDate.getMonth() + 1}월 ${endDate.getDate()}일\\n\\n`;
      }
      
      if (fields.reopenDate) {
        const reopenDate = new Date(fields.reopenDate);
        message += `${reopenDate.getMonth() + 1}월 ${reopenDate.getDate()}일부터 정상 진료합니다.\\n\\n`;
      }
      
      message += `양해 부탁드립니다.\\n\\n${closing}`;
      break;
      
    case 'sns':
      const isClinicFocused = selectedTone.includes('병원 중심');
      
      if (fields.snsTheme) {
        message += `✨ ${fields.snsTheme}\\n\\n`;
      }
      
      if (selectedKeywords.length > 0) {
        message += `${hospitalName}의 강점:\\n`;
        selectedKeywords.slice(0, 3).forEach((keyword: string) => {
          message += `✓ ${keyword}\\n`;
        });
        message += `\\n`;
      }
      
      if (fields.snsKeywords && fields.snsKeywords.length > 0) {
        message += `${fields.snsKeywords.map((k: string) => `#${k}`).join(' ')}`;
      }
      
      if (!fields.snsKeywords || fields.snsKeywords.length === 0) {
        message += `#${selectedSpecialty[0] || '병원'} #${name.replace(/\s/g, '')}`;
      }
      break;
  }
  
  return message;
}
