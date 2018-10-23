var TSOS;
(function (TSOS) {
    var Pcb = /** @class */ (function () {
        function Pcb(prState, prId, prgCounter, regX, regY, regZ, inReg, priority, acc) {
            if (prState === void 0) { prState = 0; }
            if (prId === void 0) { prId = 0; }
            if (prgCounter === void 0) { prgCounter = 0; }
            if (regX === void 0) { regX = 0; }
            if (regY === void 0) { regY = 0; }
            if (regZ === void 0) { regZ = 0; }
            if (inReg === void 0) { inReg = 0; }
            if (priority === void 0) { priority = 0; }
            if (acc === void 0) { acc = 0; }
            this.prState = prState;
            this.prId = prId;
            this.prgCounter = prgCounter;
            this.regX = regX;
            this.regY = regY;
            this.regZ = regZ;
            this.inReg = inReg;
            this.priority = priority;
            this.acc = acc;
        }
        Pcb.prototype.toString = function () {
            return this.prId;
        };
        return Pcb;
    }());
    TSOS.Pcb = Pcb;
})(TSOS || (TSOS = {}));
