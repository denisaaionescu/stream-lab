import type { Level } from "hls.js";
import { For } from "solid-js";
import type { SegmentInfo } from "./Player";
import styles from "./SegmentList.module.css";

type SegmentListProps = {
  segments: SegmentInfo[];
  levels: Level[];
};

const qualityColor = (level: number) => `var(--q${level % 6})`;

export default function SegmentList(props: SegmentListProps) {
  const maxSize = () => Math.max(1, ...props.segments.map((seg) => seg.size));

  return (
    <section class={styles.panel}>
      <h2 class={styles.heading}>Segments</h2>
      <p class={styles.hint}>
        Last 10 downloaded. Length is file size, color is quality.
      </p>

      <ul class={styles.legend}>
        <For each={props.levels}>
          {(level, index) => (
            <li>
              <span
                class={styles.swatch}
                style={{ background: qualityColor(index()) }}
              />
              {level.height}p
            </li>
          )}
        </For>
      </ul>

      <ul class={styles.list}>
        <For each={props.segments}>
          {(seg) => (
            <li class={styles.row}>
              <span class={styles.number}>#{seg.sn}</span>
              <span class={styles.track}>
                <span
                  class={styles.bar}
                  style={{
                    width: `${(seg.size / maxSize()) * 100}%`,
                    background: qualityColor(seg.level),
                  }}
                />
              </span>
              <span class={styles.meta}>
                {props.levels[seg.level]?.height}p{" "}
                {(seg.size / 1_000_000).toFixed(2)} MB
              </span>
            </li>
          )}
        </For>
      </ul>
    </section>
  );
}
