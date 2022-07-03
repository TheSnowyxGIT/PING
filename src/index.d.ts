export declare global {
    interface Window {
      // add you custom APIs
      features: typeof import("../electron/APIs/FeaturesApi"),
      crates: typeof import("../electron/APIs/CratesApi"),
      project: typeof import("../electron/APIs/ProjectApi"),
      libraries: typeof import("../electron/preload/libraries"),
    }
    type Project = import("../electron/myide/entity/project").MyProject
}
  

declare module 'react' {
  interface HTMLAttributes<T> extends AriaAttributes, DOMAttributes<T> {
    // extends React's HTMLAttributes
    directory?: string;        // remember to make these attributes optional....
    webkitdirectory?: string;
  }
}


