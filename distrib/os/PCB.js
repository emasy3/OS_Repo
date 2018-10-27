var TSOS;
(function (TSOS) {
    var Pcb = /** @class */ (function () {
        function Pcb(prState, pId, prgCounter, regX, regY, regZ, inReg, priority, acc, part) {
            if (prState === void 0) { prState = State.nue; }
            if (pId === void 0) { pId = 0; }
            if (prgCounter === void 0) { prgCounter = 0; }
            if (regX === void 0) { regX = 0; }
            if (regY === void 0) { regY = 0; }
            if (regZ === void 0) { regZ = 0; }
            if (inReg === void 0) { inReg = ""; }
            if (priority === void 0) { priority = 0; }
            if (acc === void 0) { acc = ""; }
            if (part === void 0) { part = []; }
            this.prState = prState;
            this.pId = pId;
            this.prgCounter = prgCounter;
            this.regX = regX;
            this.regY = regY;
            this.regZ = regZ;
            this.inReg = inReg;
            this.priority = priority;
            this.acc = acc;
            this.part = part;
        }
        Pcb.prototype.toString = function () {
            return this.pId;
        };
        return Pcb;
    }());
    TSOS.Pcb = Pcb;
    var State;
    (function (State) {
        State["nue"] = "new";
        State["rdy"] = "ready";
        State["runnin"] = "running";
        State["done"] = "done";
    })(State || (State = {}));
})(TSOS || (TSOS = {}));
