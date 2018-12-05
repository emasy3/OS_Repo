///<reference path="../globals.ts" />
var TSOS;
(function (TSOS) {
    var ProcessManager = /** @class */ (function () {
        function ProcessManager() {
            this.pid = 0;
            _ResidentQueue = new TSOS.Queue();
            _ReadyQueue = new TSOS.Queue();
        }
        ProcessManager.prototype.newProcess = function (code, priority) {
            if (code.length > _MMU.partitionLimit) {
                _StdOut.putText("Failed. Program is over 256 bytes.");
                return;
            }
            if (_MMU.verifySpace(code.length)) {
                var emptyPart = _MMU.findEmptyPart(code.length);
            }
            else {
                console.log("Failed!");
                _StdOut.putText("Program load failed! You are out of memory.");
                return;
            }
            var program = new TSOS.Pcb(this.pid);
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
        };
        ProcessManager.prototype.isEmpty = function () {
        };
        ProcessManager.prototype.enqueue = function (element) {
        };
        ProcessManager.prototype.dequeue = function () {
        };
        ProcessManager.prototype.toString = function () {
        };
        return ProcessManager;
    }());
    TSOS.ProcessManager = ProcessManager;
})(TSOS || (TSOS = {}));
