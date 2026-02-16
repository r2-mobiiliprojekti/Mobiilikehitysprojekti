import { useAudioPlayer } from 'expo-audio';

export const usePlayAudioDing = () => {
  const audioSource = require('../Res/Audio/Ding.mp3');
  const playerRight = useAudioPlayer(audioSource);

  const playDing = async () => {
    try {
      await playerRight.seekTo(0);
      playerRight.play();
      console.log("Audio DING played");
    } catch (error) {
      console.error('Error playing audio:', error);
    }
  };
  return playDing
}

export const usePlayAudioWrongBeep = () => {
  const audioSource = require('../Res/Audio/WrongBeep.mp3');
  const playerWrong = useAudioPlayer(audioSource);

  const playWrongBeep = async () => {
    try {
      if (!playerWrong) {
        console.error('Audio player not initialized');
        return;
      }
      await playerWrong.seekTo(0);
      playerWrong.play();
      console.log('beep wrong played');
    } catch (error) {
      console.error('Error playing wrong beep:', error);
    }
  };

  return playWrongBeep;
};
  