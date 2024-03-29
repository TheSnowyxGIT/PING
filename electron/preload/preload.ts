import { contextBridge } from "electron";
import * as projectApi from "../APIs/ProjectApi"
import * as featuresApi from "../APIs/FeaturesApi"
import * as cratesApi from "../APIs/CratesApi"
import * as libraries from "./libraries"


contextBridge.exposeInMainWorld('features', featuresApi);
contextBridge.exposeInMainWorld('crates', cratesApi);
contextBridge.exposeInMainWorld('project', projectApi);
contextBridge.exposeInMainWorld('libraries', libraries);