'use client';

import { useRef, useEffect } from 'react';

const ChristmasMusic = () => {
  const audioRef = useRef(null);
  
  useEffect(() => {
    // Configurar áudio
    const audio = new Audio('/natalina.mp3');
    audio.volume = 0.1; // Volume BEM baixo (10%)
    audio.loop = true;
    audio.preload = 'auto';
    
    // Função para tentar tocar após interação
    const tryPlayAudio = () => {
      audio.play()
        .then(() => {
          console.log('🎵 Música natalina iniciada');
        })
        .catch(err => {
          console.log('Aguardando interação do usuário...');
        });
      
      // Remove os event listeners após primeira tentativa
      document.removeEventListener('click', tryPlayAudio);
      document.removeEventListener('touchstart', tryPlayAudio);
      document.removeEventListener('keydown', tryPlayAudio);
    };
    
    // Tenta tocar imediatamente (pode ser bloqueado)
    tryPlayAudio();
    
    // Se foi bloqueado, espera interação do usuário
    document.addEventListener('click', tryPlayAudio);
    document.addEventListener('touchstart', tryPlayAudio);
    document.addEventListener('keydown', tryPlayAudio);
    
    audioRef.current = audio;
    
    // Limpeza
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
      document.removeEventListener('click', tryPlayAudio);
      document.removeEventListener('touchstart', tryPlayAudio);
      document.removeEventListener('keydown', tryPlayAudio);
    };
  }, []);
  
  // Componente não renderiza nada visível
  return null;
};

export default ChristmasMusic;