// types/global.d.ts
export {};

declare global {
  interface Window {
    __PLASMIC_USER__?: any;
    plasmicUser?: any;
  }
}
