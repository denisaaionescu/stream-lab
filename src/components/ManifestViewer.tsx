import { createResource } from "solid-js";
type Props = {
  url: string;
};
export default function ManifestViewer(props: Props) {
  const fetchText = async (url: string) => {
    const response = await fetch(url);
    return response.text();
  };
  const [manifest] = createResource(() => props.url, fetchText);
  return <pre>{manifest()}</pre>;
}
