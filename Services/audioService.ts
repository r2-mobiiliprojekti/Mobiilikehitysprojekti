import { useAudioPlayer } from 'expo-audio';

export const usePlayAudioDing = () => {
  const audioSource = require('../Res/Audio/Ding.mp3');
  const player = useAudioPlayer(audioSource);

  const playDing = async () => {
    try {
      await player.seekTo(0);
      player.play();
      console.log("Audio DING played");
    } catch (error) {
      console.error('Error playing audio:', error);
    }
  };

  return playDing;
};
    
  