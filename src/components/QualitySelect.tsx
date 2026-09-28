import type { Level } from "hls.js";
import { For } from "solid-js";
import styles from "./QualitySelect.module.css";

type QualitySelectProps = {
  levels: Level[];
  supported: boolean[];
  onSelect: (levelIndex: number) => void;
};

export default function QualitySelect(props: QualitySelectProps) {
  return (
    <label class={styles.field}>
      <span class={styles.label}>Quality</span>
      <select
        class={styles.select}
        onChange={(e) => props.onSelect(Number(e.currentTarget.value))}
      >
        <option value="-1">Auto</option>
        <For each={props.levels}>
          {(level, index) => (
            <option value={index()} disabled={!props.supported[index()]}>
              {level.height}p - {level.bitrate} - {level.videoCodec}{" "}
              {props.supported[index()] ? "✅" : "❌"}
            </option>
          )}
        </For>
      </select>
    </label>
  );
}
