import EventEmitter from "events";

export class Stream<Type> extends EventEmitter {
    push(data: Type){
        this.emit("data", data);
    }

    close(){
        this.emit("end");
    }
}
