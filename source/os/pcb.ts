



module TSOS {

    export class Pcb{
    constructor(public prState: number = 0,
        public prId: number = 0,
        public prgCounter: number = 0,
        public regX: number = 0,
        public regY: number = 0,
        public regZ: number = 0,
        public inReg: number = 0,
        public priority: number = 0,
        public acc: number = 0,){}
        public toString() {
            return this.prId;
        }

    }
}