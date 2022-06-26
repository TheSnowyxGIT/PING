//Uses node.js process manager
import * as child_process from 'child_process'
import {lookpath} from "lookpath"

export interface RunScriptReport {
    code: number,
    stderr: string,
    stdout: string
}

export async function exists_script(script: string): Promise<boolean> {
    const path = await lookpath(script);
    return path !== undefined;
}

// This function will output the lines from the script 
// and will return the full combined output
// as well as exit code when it's done (using the callback).
export function run_script(command: string, args: string[], path: string): Promise<RunScriptReport> {
    return new Promise((resolve, reject) => {
        var child = child_process.spawn(command, args, {
            cwd: path
        });
        // You can also use a variable to save the output for when the script closes later
        child.on('error', (error) => {
            reject(error.name);
        });

        child.stdout.setEncoding('utf8');
        child.stderr.setEncoding('utf8');

        let stderr: string = "";
        let stdout: string = "";

        child.stdout.on('data', (data) => {
            //Here is the output
            stdout += data.toString();   
        });
        child.stderr.on('data', (data) => {
            //Here is the output from the command
            stderr += data.toString();   
        });
    
        child.on('close', (code) => {
            //Here you can get the exit code of the script  
            resolve({
                code: code,
                stderr: stderr,
                stdout: stdout
            })
        });
    })
}
