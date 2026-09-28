type StatsPanelProps = {
  ttff: number;
  rebuffer: number;
  bufferHealth: number;
  bandWidth: number;
  quality: number | undefined
};
export default function StatsPanel(props: StatsPanelProps) {
  return (
    <>
    <p>Current quality: {props.quality}p</p>
    <p>TTFF {Math.round(props.ttff)}ms</p>
    <p>Rebuffers: {props.rebuffer}</p>
    <p>Buffer: {props.bufferHealth.toFixed(1)}s</p>
    <p>Speed: {(props.bandWidth / 1_000_000).toFixed(1)} Mbps</p>
    </>
  )
}
