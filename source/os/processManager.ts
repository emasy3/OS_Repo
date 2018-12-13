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

        public newProcess(code, priorityVal?): Pcb{
            if(code.length > _MemoryManager.partitionLimit){
                _StdOut.putText("Failed. Program is over 256 bytes.");
                return;
            }
            var program = new Pcb(this.pid);
            program.prState = "new";
            program.priority = priorityVal;
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

        public saveState(){
            this.currentPCB.prgCounter = _CPU.PC;
            this.currentPCB.inReg = _CPU.Ireg;
            this.currentPCB.regX= _CPU.Xreg;
            this.currentPCB.regY = _CPU.Yreg;
            this.currentPCB.regZ = _CPU.Zflag;
            this.currentPCB.acc = _CPU.Acc;
        }
        //dequeue the readyqueue and sync it with the cpu until its done
        //set its state
        public runProcess() {
            this.currentPCB = _ReadyQueue.dequeue();
            _CPU.sync(this.currentPCB);
            this.currentPCB.prState = "running";
            //_StdOut.putText("Running process " + this.currentPCB.pId);
            //_StdOut.advanceLine();

        }
        public static getProcess(pid){
            for(var i = 0; i < _ResidentQueue.q.length; i++){
                if(_ResidentQueue.q[i].pId == pid){
                    return _ResidentQueue.q[i];
                }
            }
            return console.log("no process matches this pid");
        }
        public killProcess(args?){
            //reset cpu and registers
            _CPU.reset();
            if(args){
                var pcb = TSOS.ProcessManager.getProcess(args);

            }else {
                var pcb = this.currentPCB;
                _StdOut.advanceLine(2);
            }
            if(pcb != null){
                //clear the partition
                _MemoryManager.clearPart(pcb.partition.indx);
                pcb.prState = "finished";
                _StdOut.putText("Exiting process " + pcb.pId);
                _StdOut.advanceLine();
                Control.hostLog("Exiting process " + pcb.pId, "os");
            }
            //update views(tables)
            Control.memViewUpdate();
            Control.cpuViewUpdate();
            Control.pcbViewUpdate();
            //update current pcb
            pcb = null;
            //debug log
            console.log("process cleared");

        }
        
    }
}