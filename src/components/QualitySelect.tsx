import type { Level } from "hls.js";
import { For } from "solid-js";

type QualitySelectProps = {
  levels: Level[];
  supported: boolean[];
  onSelect: (levelIndex: number) => void;
};

export default function QualitySelect(props: QualitySelectProps) {
  return (
    <>
      <select onChange={(e) => props.onSelect(Number(e.currentTarget.value))}>
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
    </>
  );
}
