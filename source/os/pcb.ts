
enum State {
    nue = "new",
    rdy = "ready",
    runnin = "running",
    done = "done",
}


module TSOS {

    export class Pcb{
        public prState: string;
        public pId: number;
        public prgCounter: number;
        public regX: number;
        public regY: number;
        public regZ: number;
        public inReg: string;
        public priority: number;
        public acc: number;
        public partition;
        public location;

        constructor(processId){
            this.pId = processId;
            this.prState = "new";
            this.regX = 0;
            this.regY = 0;
            this.regZ = 0;
            this.partition = 0;
            this.acc = 0;
            this.inReg = "00";
            this.prgCounter = 0;
            this.priority = 1;
            this.location = "none";
        }
        public toString() {
            return this.pId;
        }

    }
}