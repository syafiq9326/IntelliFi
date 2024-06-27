import React, { useState, useEffect } from "react";

export const TextToSpeech = ({ text }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [utterance, setUtterance] = useState(null);
  const [imageSrc, setImageSrc] = useState("https://cdn-icons-png.flaticon.com/512/4509/4509653.png");

  useEffect(() => {
    const synth = window.speechSynthesis;
    const u = new SpeechSynthesisUtterance(text);
    setUtterance(u);

    return () => {
      synth.cancel();
    };
  }, [text]);

  useEffect(() => {
    if (isPlaying) {
      setImageSrc("https://lordicon.com/icons/wired/flat/2456-person-talking.gif");
    } else {
      setImageSrc("https://cdn-icons-png.flaticon.com/512/4509/4509653.png");
    }
  }, [isPlaying]);

  const handleClick = () => {
    const synth = window.speechSynthesis;

    if (isPlaying) {
      synth.cancel();
    } else {
      synth.speak(utterance);
    }

    setIsPlaying(!isPlaying);
  };

  return (
    <img 
      src={imageSrc} 
      alt={isPlaying ? "Stop" : "Play"} 
      onClick={handleClick} 
      style={{ width: '85px', height: '85px' }}
    />
  );
};



export const TextToSpeech3 = ({ text }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [utterance, setUtterance] = useState(null);

  useEffect(() => {
    const synth = window.speechSynthesis;
    const u = new SpeechSynthesisUtterance(text);

    setUtterance(u);

    return () => {
      synth.cancel();
    };
  }, [text]);

  const handleClick = () => {
    const synth = window.speechSynthesis;

    if (isPlaying) {
      synth.cancel();
    } else {
      synth.speak(utterance);
    }

    setIsPlaying(!isPlaying);
  };

  return (
    <img 
      src={"https://cdn-icons-png.flaticon.com/512/4509/4509653.png"} 
      alt={isPlaying ? "Stop" : "Play"} 
      onClick={handleClick} 
      style={{ width: '80px', height: '80px' }}

    />
  );
};


export const TextToSpeech2 = ({ text }) => {
  const [isPaused, setIsPaused] = useState(false);
  const [utterance, setUtterance] = useState(null);

  useEffect(() => {
    const synth = window.speechSynthesis;
    const u = new SpeechSynthesisUtterance(text);

    setUtterance(u);

    return () => {
      synth.cancel();
    };
  }, [text]);

  const handlePlay = () => {
    const synth = window.speechSynthesis;

    if (isPaused) {
      synth.resume();
    }

    synth.speak(utterance);

    setIsPaused(false);
  };

  const handlePause = () => {
    const synth = window.speechSynthesis;

    synth.pause();

    setIsPaused(true);
  };

  const handleStop = () => {
    const synth = window.speechSynthesis;

    synth.cancel();

    setIsPaused(false);
  };

  return (
    <div>
      <button onClick={handlePlay}>{isPaused ? "Resume" : "Play"}</button>
      <button onClick={handlePause}>Pause</button>
      <button onClick={handleStop}>Stop</button>
    </div>
  );
};

//text to speech
export const ActualSpeech = ({text}) => {
  // const text ="Text-to-speech feature is now available on relatively any website";
  return (
      <div>
          <TextToSpeech text={text} />
          <p className="text-lg font-bold">Tap me to hear your summary!</p>
          {/* <hr style={{ border: "none", borderTop: "2px solid #333", margin: "10px 0" }} /> */}
          <br/>
      </div>
  );
};