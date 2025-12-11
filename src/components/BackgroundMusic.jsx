import React, { useRef, useState, useEffect } from 'react';
import { MdPlayArrow, MdPause, MdVolumeUp, MdVolumeOff } from 'react-icons/md';

const BackgroundMusic = ({ src = "/audio/desi_bgm.mp3" }) => {
  const audioRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [showButton, setShowButton] = useState(false); // Only show button after a moment

  // Attempt to autoplay on load (will likely be blocked or forced to mute)
  useEffect(() => {
    // Show controls shortly after page loads
    const timer = setTimeout(() => setShowButton(true), 1500);

    const audio = audioRef.current;
    if (audio) {
      audio.loop = true;
      audio.muted = true; // Start muted to avoid browser block
      audio.play().then(() => {
        setIsPlaying(true);
      }).catch(error => {
        // Autoplay failed (expected behavior for unmuted audio)
        setIsPlaying(false);
        console.log("Autoplay was prevented. User interaction required.");
      });
    }

    return () => clearTimeout(timer);
  }, []);

  const togglePlay = () => {
    const audio = audioRef.current;
    if (audio) {
      if (isPlaying) {
        audio.pause();
        setIsPlaying(false);
      } else {
        // When unmuting/playing manually, we assume the user intends to hear it
        audio.play().then(() => {
            setIsPlaying(true);
            setIsMuted(false);
            audio.muted = false;
        }).catch(error => {
            console.error("Manual play failed:", error);
        });
      }
    }
  };

  const toggleMute = () => {
    const audio = audioRef.current;
    if (audio) {
      const newMutedState = !isMuted;
      audio.muted = newMutedState;
      setIsMuted(newMutedState);
      
      // If unmuting, ensure it's playing
      if (!newMutedState && !isPlaying) {
         audio.play();
         setIsPlaying(true);
      }
    }
  };

  if (!showButton) return (
     // Invisible audio tag for early loading
     <audio ref={audioRef} src={src} /> 
  );

  return (
    <>
      <audio ref={audioRef} src={src} />
      <div 
        className="fixed bottom-4 right-4 z-[4000] flex items-center gap-2 p-2 bg-white rounded-full shadow-xl border-2 border-desi-saffron"
        // Ensure the button style aligns with your 'desi' theme
      >
        <button 
          onClick={togglePlay} 
          className="p-2 rounded-full bg-desi-saffron text-white hover:bg-amber-700 transition-colors"
          title={isPlaying ? "Pause Music" : "Play Music"}
        >
          {isPlaying ? <MdPause size={20} /> : <MdPlayArrow size={20} />}
        </button>
        <button 
          onClick={toggleMute} 
          className="p-2 rounded-full bg-stone-100 text-stone-600 hover:text-desi-teal transition-colors"
          title={isMuted ? "Unmute" : "Mute"}
        >
          {isMuted ? <MdVolumeOff size={20} /> : <MdVolumeUp size={20} />}
        </button>
      </div>
    </>
  );
};

export default BackgroundMusic;