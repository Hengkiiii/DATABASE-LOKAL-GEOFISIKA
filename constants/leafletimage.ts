declare module "leaflet-image" {
  import { Map as LeafletMap } from "leaflet";

  type LeafletImageCallback = (
    error: Error | null,
    canvas: HTMLCanvasElement | null
  ) => void;

  export default function leafletImage(
    map: LeafletMap,
    callback: LeafletImageCallback
  ): void;
}
