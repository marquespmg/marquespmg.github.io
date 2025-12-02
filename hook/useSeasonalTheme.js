import { useState, useEffect } from 'react';

const seasonalThemes = {
  christmas: {
    id: 'christmas',
    name: 'Natalino',
    startDate: '12-01',
    endDate: '12-31',
    color: '#c62828',
    cta: '🎁 Presentes de Natal com 20% OFF! 🎄',
    ctaLink: '/categoria/natal',
    backgroundColor: 'rgba(198, 40, 40, 0.03)',
    emoji: '🎄',
  },
  blackfriday: {
    id: 'blackfriday',
    name: 'Black Friday',
    startDate: '11-20',
    endDate: '11-30',
    color: '#000000',
    cta: '🔥 BLACK FRIDAY ATÉ 70% OFF! 🔥',
    ctaLink: '/black-friday',
    backgroundColor: 'rgba(0, 0, 0, 0.02)',
    emoji: '🛒',
  },
  newyear: {
    id: 'newyear',
    name: 'Ano Novo',
    startDate: '12-26',
    endDate: '01-06',
    color: '#ffd700',
    cta: '✨ Promoção de Ano Novo! Até 30% OFF ✨',
    ctaLink: '/promocoes/ano-novo',
    backgroundColor: 'rgba(255, 215, 0, 0.03)',
    emoji: '✨',
  },
  default: {
    id: 'default',
    name: 'Padrão',
    color: '#333',
    cta: null,
    backgroundColor: 'transparent',
    emoji: '🎨',
  }
};

export const useSeasonalTheme = () => {
  const [currentTheme, setCurrentTheme] = useState(seasonalThemes.default);

  useEffect(() => {
    const today = new Date();
    const currentMonth = today.getMonth() + 1;
    const currentDay = today.getDate();
    const currentDateStr = `${String(currentMonth).padStart(2, '0')}-${String(currentDay).padStart(2, '0')}`;

    let activeTheme = seasonalThemes.default;

    Object.values(seasonalThemes).forEach(theme => {
      if (theme.startDate && theme.endDate) {
        const [startMonth, startDay] = theme.startDate.split('-').map(Number);
        const [endMonth, endDay] = theme.endDate.split('-').map(Number);
        
        const startDate = new Date(today.getFullYear(), startMonth - 1, startDay);
        let endDate = new Date(today.getFullYear(), endMonth - 1, endDay);
        
        // Ajuste para períodos que cruzam o ano
        if (endMonth < startMonth && today.getMonth() + 1 < startMonth) {
          endDate.setFullYear(endDate.getFullYear() + 1);
        }
        
        if (today >= startDate && today <= endDate) {
          activeTheme = theme;
        }
      }
    });

    setCurrentTheme(activeTheme);
  }, []);

  return currentTheme;
};