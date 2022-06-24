export declare global {
    interface Window {
      // add you custom properties and methods
      electron: typeof import("../electron/preload/api")
    }
  }
  