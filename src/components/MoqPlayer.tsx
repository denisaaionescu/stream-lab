import "@moq/watch/element";

export default function MoqPlayer() {
  return (
    <moq-watch url="http://localhost:4443" name="bbb.hang">
      <canvas></canvas>
    </moq-watch>
  );
}
