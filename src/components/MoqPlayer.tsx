import "@moq/watch/element";
import { createSignal } from "solid-js";
import styles from "./MoqPlayer.module.css";

export default function MoqPlayer() {
  const [paused, setPaused] = createSignal(false);
  const [muted, setMuted] = createSignal(false);
  return (
    <div class={styles.panel}>
      <moq-watch
        url="http://localhost:4443"
        name="bbb.hang"
        paused={paused()}
        muted={muted()}
      >
        <canvas class={styles.canvas}></canvas>
      </moq-watch>
      <div class={styles.controls}>
        <button class={styles.button} onClick={() => setPaused(!paused())}>
          {paused() ? "Start" : "Pause"}
        </button>
        <button class={styles.button} onClick={() => setMuted(!muted())}>
          {muted() ? "Unmute" : "Mute"}
        </button>
      </div>
    </div>
  );
}
