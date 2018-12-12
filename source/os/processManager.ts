///<reference path="../globals.ts" />

module TSOS {
    export class ProcessManager {
        public pid: number;
        public currentPCB;

        constructor() {
            this.pid = 0;
            this.currentPCB = null;
            //create queues
            _ResidentQueue = new Queue();
            _ReadyQueue = new Queue();
        }

        public newProcess(code, priority): Pcb{
            if(code.length > _MemoryManager.partitionLimit){
                _StdOut.putText("Failed. Program is over 256 bytes.");
                return;
            }
            var program = new Pcb(this.pid);
            program.prState = "new";
            //check for empty memory space
            var partIndx = _MemoryManager.findEmptyPart(code.length);
            if(partIndx != null){
                //set the partition 
                program.partition = _MemoryManager.parts[partIndx];
                //put program on resident queue
                _ResidentQueue.enqueue(program);
                //load to main memory
                _MemoryManager.load(code, partIndx);
                //set location to memory
                program.location = "memory";
            }else {
                console.log("Failed!");
                _StdOut.putText("Program load failed! You are out of memory.");
                return;
            }
            _StdOut.putText("Program loaded in memory, pid:  " + this.pid);
            this.pid++;
            return program;
        }
        //dequeue the readyqueue and sync it with the cpu until its done
        //set its state
        public runProcess() {
            this.currentPCB = _ReadyQueue.dequeue();
            _CPU.sync(this.currentPCB);
            this.currentPCB.prState = "running";

        }
        public killProcess(){
            //reset cpu and registers
            _CPU.reset();
            //clear the partition
            _MemoryManager.clearPart(this.currentPCB.partition.indx);
            //update views(tables)
            Control.memViewUpdate();
            Control.hostLog("Exiting process " + this.currentPCB.pId, "os");
            Control.cpuViewUpdate();
            //debug log
            console.log("process cleared");
            //update current pcb
            this.currentPCB = null;

        }
        
    }
}