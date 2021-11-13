import { PlayIcon } from "@heroicons/react/solid";

function PlayAudioButton({ audio, width, height }) {
  function playSound(audio) {
    const sound = new Audio(audio);
    sound.volume = 0.5; //maybe add a setting later for changing the volume

    sound.play().catch((err) => {
      console.log(err);
    });
  }

  return (
    <PlayIcon
      // @ts-ignore: Unreachable code error
      as="button"
      onClick={() => {
        playSound(audio);
      }}
      style={{ width: width, height: height, cursor: "pointer" }}
    />
  );
}

export default PlayAudioButton;
