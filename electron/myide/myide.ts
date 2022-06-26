import {exists_script, run_script} from "../utils/runScripts";
import { NodeType } from "./entity/node";
import ProjectService from "./services/projectService";


let ps = new ProjectService();
let project = ps.load("C:\\Users\\Adrien\\Desktop\\testcratesio\\testtttes");


project.then(async (project) => {
    
    console.log(Array.from(project.getAspects()).length)

   
        

})

