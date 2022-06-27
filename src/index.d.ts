export declare global {
    interface Window {
      // add you custom properties and methods
      electron: typeof import("../electron/preload/api")
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


