import styles from "./StatsPanel.module.css";

type StatsPanelProps = {
  ttff: number;
  rebuffer: number;
  bufferHealth: number;
  bandWidth: number;
  quality: number | undefined;
};

export default function StatsPanel(props: StatsPanelProps) {
  return (
    <section class={styles.panel}>
      <h2 class={styles.heading}>Playback</h2>
      <dl>
        <div class={styles.row}>
          <dt>Quality</dt>
          <dd>{props.quality ? `${props.quality}p` : "–"}</dd>
        </div>
        <div class={styles.row}>
          <dt>Time to first frame</dt>
          <dd>{Math.round(props.ttff)} ms</dd>
        </div>
        <div class={styles.row}>
          <dt>Rebuffers</dt>
          <dd>{props.rebuffer}</dd>
        </div>
        <div class={styles.row}>
          <dt>Buffer ahead</dt>
          <dd>{props.bufferHealth.toFixed(1)} s</dd>
        </div>
        <div class={styles.row}>
          <dt>Speed</dt>
          <dd>{(props.bandWidth / 1_000_000).toFixed(1)} Mbps</dd>
        </div>
      </dl>
    </section>
  );
}
