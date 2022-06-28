import { contextBridge } from "electron";
import * as api from "./api"
import * as libraries from "./libraries"

contextBridge.exposeInMainWorld('electron', api);
contextBridge.exposeInMainWorld('libraries', libraries);
