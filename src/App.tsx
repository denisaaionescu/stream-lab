import Player from "./components/Player";
import { createSignal, Show } from "solid-js";
import styles from "./App.module.css";

export default function App() {
  const [hide, setHide] = createSignal(true);
  return (
    <>
      <Show
        when={hide()}
        fallback={<p class={styles.empty}>Player is hidden.</p>}
      >
        <Player />
      </Show>
      <button class={styles.toggle} onClick={() => setHide(!hide())}>
        {hide() ? "Hide player" : "Show player"}
      </button>
    </>
  );
}
