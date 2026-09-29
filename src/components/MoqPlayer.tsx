import "@moq/watch/element";
import { createSignal, onMount, onCleanup, For } from "solid-js";
import styles from "./MoqPlayer.module.css";
import type MoqWatch from "@moq/watch/element";

export default function MoqPlayer() {
  const [paused, setPaused] = createSignal(false);
  const [muted, setMuted] = createSignal(false);
  let moqRef!: MoqWatch;
  type Rendition = { name: string; height: number | undefined };
  const [renditions, setRenditions] = createSignal<Rendition[]>([]);
  onMount(() => {
    const stop = moqRef.video.source.out.available.subscribe((available) => {
      setRenditions(
        Object.entries(available).map(([name, config]) => ({
          name,
          height: config.codedHeight,
        })),
      );
    });
    onCleanup(stop);
  });

  return (
    <div class={styles.panel}>
      <moq-watch
        url="http://localhost:4443"
        name="bbb.hang"
        paused={paused()}
        muted={muted()}
        ref={moqRef}
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
        <div class={styles.controls}>
          <select
            onChange={(e) => {
              const value = e.currentTarget.value;
              moqRef.controls.target.set(
                value === "auto" ? undefined : { name: value },
              );
            }}
          >
            <option value="auto">Auto</option>
            <For each={renditions()}>
              {(r) => <option value={r.name}>{r.height}p</option>}
            </For>
          </select>
        </div>
      </div>
    </div>
  );
}
