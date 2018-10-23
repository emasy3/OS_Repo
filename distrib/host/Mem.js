///<reference path="../globals.ts" />
/* ------------
     CPU.ts

     Requires global.ts.

     Routines for the host CPU simulation, NOT for the OS itself.
     In this manner, it's A LITTLE BIT like a hypervisor,
     in that the Document environment inside a browser is the "bare metal" (so to speak) for which we write code
     that hosts our client OS. But that analogy only goes so far, and the lines are blurred, because we are using
     TypeScript/JavaScript in both the host and client environments.

     This code references page numbers in the text book:
     Operating System Concepts 8th edition by Silberschatz, Galvin, and Gagne.  ISBN 978-0-470-12872-5
     ------------ */
var PairVal = /** @class */ (function () {
    function PairVal() {
        this.varX = 0;
        this.varY = 0;
    }
    return PairVal;
}());
var TSOS;
(function (TSOS) {
    var Mem = /** @class */ (function () {
        function Mem() {
            this.partA = [];
            for (var i = 0; i < 256; i++) {
                this.partA[i] = new PairVal();
            }
        }
        Mem.prototype.load = function (str, part) {
            var input = str.replace(/\s/g, '');
            var j = 0;
            for (var i = 0; i < str.length; i += 2) {
                //check if current input value or the next value is undefined
                if (input[i] === undefined) {
                    break;
                }
                else if (((i % 2) === 0) && input[i + 1] === undefined) {
                    input += "0";
                }
                var pairVal = new PairVal();
                pairVal.varX = input[i];
                pairVal.varY = input[i + 1];
                if (i < 512) {
                    part[j] = pairVal;
                }
                j += 1;
            }
        };
        Mem.prototype.print = function (part) {
            /*for(var i = 0; i < part.length; i++){
                console.log("varX: " + part[i].varX + " varY: " + part[i].varY);
            }*/
            return part.valueOf();
        };
        return Mem;
    }());
    TSOS.Mem = Mem;
})(TSOS || (TSOS = {}));
