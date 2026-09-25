import Player from "./components/Player";
import { createSignal, Show } from "solid-js";
export default function App() {
  const [hide, setHide] = createSignal(true);
  return (
    <>
      <Show when={hide()} fallback={<p> Bye Bye</p>}>
        <Player />
      </Show>
      <button onClick={() => setHide(!hide())}>
        {hide() ? "Ascunde" : "Arata"}
      </button>
    </>
  );
}
