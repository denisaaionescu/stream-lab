import "solid-js";

declare module "solid-js" {
  namespace JSX {
    interface IntrinsicElements {
      "moq-watch": {
        url?: string;
        name?: string;
        children?: JSX.Element;
      };
    }
  }
}
