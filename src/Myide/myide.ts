import { NodeType } from "./entity/node";
import ProjectService from "./services/projectService";


let ps = new ProjectService();
let project = ps.load("C:\\Users\\Adrien\\Desktop\\gracious_jennings-ping-2024");

project.then(async (project) => {
    
    const nodeService = ps.getNodeService();

   

    let node = project.getRootNode().findChild("lesuperfichier");
    if (node !== null){
        await nodeService.update(node, 0, 0, Buffer.from('1234'));
    } else {
        await nodeService.create(project.getRootNode(), "lesuperfichier", NodeType.FILE);
    }
        

})
