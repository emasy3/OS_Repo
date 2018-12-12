var State;
(function (State) {
    State["nue"] = "new";
    State["rdy"] = "ready";
    State["runnin"] = "running";
    State["done"] = "done";
})(State || (State = {}));
var TSOS;
(function (TSOS) {
    var Pcb = /** @class */ (function () {
        function Pcb(processId) {
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
        Pcb.prototype.toString = function () {
            return this.pId;
        };
        return Pcb;
    }());
    TSOS.Pcb = Pcb;
})(TSOS || (TSOS = {}));
