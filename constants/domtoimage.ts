declare module "dom-to-image-more" {
  const domToImage: {
    toPng: (node: HTMLElement) => Promise<string>;
    toJpeg: (node: HTMLElement, quality?: number) => Promise<string>;
    toBlob: (node: HTMLElement) => Promise<Blob>;
    toPixelData: (node: HTMLElement) => Promise<Uint8ClampedArray>;
    toSvg: (node: HTMLElement) => Promise<string>;
  };
  export default domToImage;
}
