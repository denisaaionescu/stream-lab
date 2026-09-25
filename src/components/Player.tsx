import { createSignal, onMount, onCleanup, For } from "solid-js";
import Hls from "hls.js";
import { type Level } from "hls.js";
type PlayerStatus =
  "Loading" | "Playing" | "Pause" | "Waiting" | "Ended" | "Ready" | "Error";

export default function Player() {
  const [status, setStatus] = createSignal<PlayerStatus>("Loading");
  const [currentTime, setCurrentTime] = createSignal(0);
  const [duration, setDuration] = createSignal(0);
  const [levels, setLevels] = createSignal<Level[]>([]);
  const [activeLevel, setActiveLevel] = createSignal(-1);
  const [ttff, setTtff] = createSignal(0);
  const [rebuffer, setRebuffer] = createSignal(0);

  let videoRef!: HTMLVideoElement;
  let playClickedAt = 0;
  let hls!: Hls;
  const streamUrl = "https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8";
  onMount(() => {
    hls = new Hls();
    hls.loadSource(streamUrl);
    hls.attachMedia(videoRef);
    hls.on(Hls.Events.MANIFEST_PARSED, (event, data) => {
      setLevels(data.levels);
    });
    hls.on(Hls.Events.LEVEL_SWITCHED, (event, data) => {
      setActiveLevel(data.level);
    });
    onCleanup(() => {
      hls.destroy();
    });
  });
  return (
    <>
      <video
        ref={videoRef}
        controls
        width="1070"
        onPlay={() => (playClickedAt = performance.now())}
        onPlaying={() => {
          setStatus("Playing");
          if (ttff() === 0) {
            setTtff(performance.now() - playClickedAt);
          }
        }}
        onPause={() => setStatus("Pause")}
        onWaiting={(e) => {
          setStatus("Waiting");
          if (!e.currentTarget.seeking && ttff() !== 0)
            setRebuffer(rebuffer() + 1);
        }}
        onEnded={() => setStatus("Ended")}
        onLoadedMetadata={(e) => {
          setStatus("Ready");
          setDuration(e.currentTarget.duration);
        }}
        onError={() => setStatus("Error")}
        onTimeUpdate={(e) => setCurrentTime(e.currentTarget.currentTime)}
        onDurationChange={(e) => setDuration(e.currentTarget.duration)}
      ></video>
      <p>{status()}</p>
      <p>
        {currentTime().toFixed(1)}s - {duration().toFixed(1)}s
      </p>
      <select
        onChange={(e) => (hls.currentLevel = Number(e.currentTarget.value))}
      >
        <option value="-1">Auto</option>
        <For each={levels()}>
          {(level, index) => (
            <option value={index()}>
              {level.height}p - {level.bitrate}
            </option>
          )}
        </For>
      </select>
      <p>Current quality: {levels()[activeLevel()]?.height}p</p>
      <p>TTFF {Math.round(ttff())}ms</p>
      <p>Rebuffers: {rebuffer()}</p>
    </>
  );
}
