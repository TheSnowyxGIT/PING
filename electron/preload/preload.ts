import { contextBridge } from "electron";
import * as api from "./api"

contextBridge.exposeInMainWorld('electron', api);
