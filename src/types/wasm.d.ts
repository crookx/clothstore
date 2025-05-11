declare module "*.wasm" {
  const content: any;
  export default content;
}

declare module "farmhash-modern" {
  export function hash32(input: string): number;
  export function hash64(input: string): string;
  export function fingerprint32(input: string): number;
  export function fingerprint64(input: string): string;
}