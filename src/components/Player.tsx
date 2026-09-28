import { createSignal, onMount, onCleanup } from "solid-js";
import Hls from "hls.js";
import { type Level } from "hls.js";
import StatsPanel from "./StatsPanel";
import SegmentList from "./SegmentList";
import styles from "./Player.module.css";
import QualitySelect from "./QualitySelect";
type PlayerStatus =
  "Loading" | "Playing" | "Pause" | "Waiting" | "Ended" | "Ready" | "Error";

export type SegmentInfo = {
  sn: number;
  level: number;
  duration: number;
  size: number;
};

export default function Player() {
  const [status, setStatus] = createSignal<PlayerStatus>("Loading");
  const [currentTime, setCurrentTime] = createSignal(0);
  const [duration, setDuration] = createSignal(0);
  const [levels, setLevels] = createSignal<Level[]>([]);
  const [activeLevel, setActiveLevel] = createSignal(-1);
  const [ttff, setTtff] = createSignal(0);
  const [rebuffer, setRebuffer] = createSignal(0);
  const [bufferHealth, setBufferHealth] = createSignal(0);
  const [bandWidth, setBandWidth] = createSignal(0);
  const [supported, setSupported] = createSignal<boolean[]>([]);
  const [videoUrl, setVideoUrl] = createSignal(
    "https://denisaaionescu.github.io/bibble-hls/master.m3u8",
  );
  const [segment, setSegment] = createSignal<SegmentInfo[]>([]);
  let videoRef!: HTMLVideoElement;
  let playClickedAt = 0;
  let hls!: Hls;
  const loadStream = (url: string) => {
    setTtff(0);
    setRebuffer(0);
    setBufferHealth(0);
    setBandWidth(0);
    setStatus("Loading");
    setActiveLevel(-1);
    hls.loadSource(url);
    setSegment([]);
    setSupported([]);
  };
  onMount(() => {
    hls = new Hls();
    loadStream(videoUrl());
    hls.attachMedia(videoRef);
    hls.on(Hls.Events.MANIFEST_PARSED, async (_event, data) => {
      setLevels(data.levels);
      const results: boolean[] = [];
      for (const level of data.levels) {
        const answer = await VideoDecoder.isConfigSupported({
          codec: level.videoCodec ?? "",
        });
        results.push(answer.supported ?? false);
      }
      setSupported(results);
    });
    hls.on(Hls.Events.LEVEL_SWITCHED, (_event, data) => {
      setActiveLevel(data.level);
    });
    hls.on(Hls.Events.FRAG_LOADED, (_event, data) => {
      setBandWidth(hls.bandwidthEstimate);
      const seg: SegmentInfo = {
        sn: Number(data.frag.sn),
        level: data.frag.level,
        duration: data.frag.duration,
        size: data.frag.stats.total,
      };
      setSegment([...segment(), seg].slice(-10));
    });
    onCleanup(() => {
      hls.destroy();
    });
  });

  return (
    <div class={styles.layout}>
      <header class={styles.header}>
        <h1 class={styles.title}>Stream Lab</h1>
        <div class={styles.urlBar}>
          <input
            class={styles.urlInput}
            type="text"
            value={videoUrl()}
            placeholder="Paste an .m3u8 link"
            aria-label="Stream URL"
            onInput={(e) => setVideoUrl(e.currentTarget.value)}
          />
          <button
            class={styles.loadButton}
            type="button"
            onClick={() => loadStream(videoUrl())}
          >
            Load
          </button>
        </div>
      </header>

      <section class={styles.stage}>
      <video
        class={styles.video}
        ref={videoRef}
        controls
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
        onTimeUpdate={(e) => {
          const video = e.currentTarget;
          setCurrentTime(video.currentTime);
          if (video.buffered.length > 0) {
            const bufferedEnd = video.buffered.end(video.buffered.length - 1);
            setBufferHealth(bufferedEnd - video.currentTime);
          }
        }}
        onDurationChange={(e) => setDuration(e.currentTarget.duration)}
      ></video>
      <div class={styles.transport}>
        <p class={styles.status}>
          <span class={styles.statusLabel}>{status()}</span>
          <span class={styles.time}>
            {currentTime().toFixed(1)} / {duration().toFixed(1)} s
          </span>
        </p>
        <QualitySelect
          levels={levels()}
          supported={supported()}
          onSelect={(index) => (hls.currentLevel = index)}
        />
      </div>
      </section>

      <aside class={styles.side}>
        <StatsPanel
          quality={levels()[activeLevel()]?.height}
          ttff={ttff()}
          rebuffer={rebuffer()}
          bufferHealth={bufferHealth()}
          bandWidth={bandWidth()}
        />
        <SegmentList segments={segment()} levels={levels()} />
      </aside>
    </div>
  );
}
