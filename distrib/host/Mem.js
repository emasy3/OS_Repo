///<reference path="../globals.ts" />
/* ------------
     Mem.ts


     ------------ */
var TSOS;
(function (TSOS) {
    var Memory = /** @class */ (function () {
        //self explanatory; creates and fills memory array with zeros size of 3 256 byte partitions
        function Memory() {
            this.array = new Array(768);
            for (var i = 0; i < this.array.length; i++) {
                this.array[i] = "00";
            }
        }
        return Memory;
    }());
    TSOS.Memory = Memory;
})(TSOS || (TSOS = {}));
