import { NodeType } from "./entity/node";
import ProjectService from "./services/projectService";

export const projectService = new ProjectService();
export const project = projectService.load("C:\\Users\\Adrien\\Desktop\\testcratesio\\testtttes")

