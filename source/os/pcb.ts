



module TSOS {

    export class Pcb{
    constructor(public prState: string = State.nue,
        public pId: number = 0,
        public prgCounter: number = 0,
        public regX: number = 0,
        public regY: number = 0,
        public regZ: number = 0,
        public inReg: string = "",
        public priority: number = 0,
        public acc: string = "",
        public part: PairVal[] = [],){}
        public toString() {
            return this.pId;
        }

    }
    enum State {
        nue = "new",
        rdy = "ready",
        runnin = "running",
        done = "done",
    }
}