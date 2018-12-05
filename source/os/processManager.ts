///<reference path="../globals.ts" />

module TSOS {
    export class ProcessManager {
        public pid: number = 0;

        constructor() {
            _ResidentQueue = new Queue();
            _ReadyQueue = new Queue();
        }

        public newProcess(code, priority): Pcb{
            if(code.length > _MMU.partitionLimit){
                _StdOut.putText("Failed. Program is over 256 bytes.");
                return;
            }
            if(_MMU.verifySpace(code.length)){
                var emptyPart:number = _MMU.findEmptyPart(code.length);

            }else {
                console.log("Failed!");
                _StdOut.putText("Program load failed! You are out of memory.");
                return;
            }
            var program = new Pcb(this.pid);
            program.part = _MMU.parts[emptyPart];
            _MMU.load(code, emptyPart);
            //put program on resident queue
            _ResidentQueue.enqueue(program);
            program.prState = "new";

            _StdOut.putText("Program loaded in memory, pid:  " + this.pid);
            this.pid++;
            console.log(this.pid);
            console.log(_ResidentQueue);
            return program;
        }
        public isEmpty(){

        }

        public enqueue(element) {

        }

        public dequeue() {

        }

        public toString() {

        }
    }
}