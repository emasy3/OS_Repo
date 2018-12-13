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
        ProcessManager.prototype.newProcess = function (code, priorityVal) {
            if (code.length > _MemoryManager.partitionLimit) {
                _StdOut.putText("Failed. Program is over 256 bytes.");
                return;
            }
            var program = new TSOS.Pcb(this.pid);
            program.prState = "new";
            program.priority = priorityVal;
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
            //_StdOut.putText("Running process " + this.currentPCB.pId);
            //_StdOut.advanceLine();
        };
        ProcessManager.getProcess = function (pid) {
            for (var i = 0; i < _ResidentQueue.q.length; i++) {
                if (_ResidentQueue.q[i].pId == pid) {
                    return _ResidentQueue.q[i];
                }
            }
            return console.log("no process matches this pid");
        };
        ProcessManager.prototype.killProcess = function (args) {
            //reset cpu and registers
            _CPU.reset();
            if (args) {
                var pcb = TSOS.ProcessManager.getProcess(args);
            }
            else {
                var pcb = this.currentPCB;
                _StdOut.advanceLine(2);
            }
            if (pcb != null) {
                //clear the partition
                _MemoryManager.clearPart(pcb.partition.indx);
                pcb.prState = "finished";
                _StdOut.putText("Exiting process " + pcb.pId);
                _StdOut.advanceLine();
                TSOS.Control.hostLog("Exiting process " + pcb.pId, "os");
            }
            console.log(_ReadyQueue);
            //update views(tables)
            TSOS.Control.memViewUpdate();
            TSOS.Control.cpuViewUpdate();
            TSOS.Control.pcbViewUpdate();
            //Control.readyQueueUpdate();
            //update current pcb
            this.currentPCB = null;
            //debug log
            console.log("process cleared");
        };
        return ProcessManager;
    }());
    TSOS.ProcessManager = ProcessManager;
})(TSOS || (TSOS = {}));
