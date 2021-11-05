import { PlayIcon } from "@heroicons/react/solid";

function PlayAudioButton({ audio }) {
  function playSound(audio) {
    const sound = new Audio(audio);
    sound.volume = 0.5; //maybe add a setting later for changing the volume

    sound.play();
  }

  return (
    <PlayIcon
      // @ts-ignore: Unreachable code error
      as="button"
      onClick={() => {
        playSound(audio);
      }}
      style={{ width: "3em", height: "3em", cursor: "pointer" }}
    />
  );
}

export default PlayAudioButton;
