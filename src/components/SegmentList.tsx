import type { Level } from "hls.js";
import { For } from "solid-js";
import type { SegmentInfo } from "./Player";

type SegmentListProps = {
  segments: SegmentInfo[];
  levels: Level[];
};

export default function SegmentList(props: SegmentListProps) {
  return (
    <ul>
      <For each={props.segments}>
        {(seg) => (
          <li>
            #{seg.sn} {props.levels[seg.level]?.height}p{" "}
            {seg.duration.toFixed(1)}s {(seg.size / 1_000_000).toFixed(2)} MB
          </li>
        )}
      </For>
    </ul>
  );
}
