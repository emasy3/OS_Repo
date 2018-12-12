///<reference path="../globals.ts" />
var TSOS;
(function (TSOS) {
    var ProcessManager = /** @class */ (function () {
        function ProcessManager() {
            this.pid = 0;
            this.currentPCB = null;
            //create queues
            _ResidentQueue = new TSOS.Queue();
            _ReadyQueue = new TSOS.Queue();
        }
        ProcessManager.prototype.newProcess = function (code, priority) {
            if (code.length > _MemoryManager.partitionLimit) {
                _StdOut.putText("Failed. Program is over 256 bytes.");
                return;
            }
            var program = new TSOS.Pcb(this.pid);
            program.prState = "new";
            //check for empty memory space
            var partIndx = _MemoryManager.findEmptyPart(code.length);
            if (partIndx != null) {
                //set the partition 
                program.partition = _MemoryManager.parts[partIndx];
                //put program on resident queue
                _ResidentQueue.enqueue(program);
                //load to main memory
                _MemoryManager.load(code, partIndx);
                //set location to memory
                program.location = "memory";
            }
            else {
                console.log("Failed!");
                _StdOut.putText("Program load failed! You are out of memory.");
                return;
            }
            _StdOut.putText("Program loaded in memory, pid:  " + this.pid);
            this.pid++;
            return program;
        };
        //dequeue the readyqueue and sync it with the cpu until its done
        //set its state
        ProcessManager.prototype.runProcess = function () {
            this.currentPCB = _ReadyQueue.dequeue();
            _CPU.sync(this.currentPCB);
            this.currentPCB.prState = "running";
        };
        ProcessManager.prototype.killProcess = function () {
            //reset cpu and registers
            _CPU.reset();
            //clear the partition
            _MemoryManager.clearPart(this.currentPCB.partition.indx);
            this.currentPCB.prState = "finished";
            //update views(tables)
            TSOS.Control.memViewUpdate();
            TSOS.Control.hostLog("Exiting process " + this.currentPCB.pId, "os");
            TSOS.Control.cpuViewUpdate();
            TSOS.Control.pcbViewUpdate();
            //update current pcb
            this.currentPCB = null;
            //debug log
            console.log("process cleared");
        };
        return ProcessManager;
    }());
    TSOS.ProcessManager = ProcessManager;
})(TSOS || (TSOS = {}));
