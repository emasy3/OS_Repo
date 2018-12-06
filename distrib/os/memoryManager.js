///<reference path="../globals.ts" />
var Partition = /** @class */ (function () {
    function Partition() {
        this.floor = 0;
        this.ceiling = 0;
        this.isEmpty = true;
        this.length = 0;
    }
    /*public partition: number[]*/ ;
    return Partition;
}());
var TSOS;
(function (TSOS) {
    var MemoryManager = /** @class */ (function () {
        function MemoryManager() {
            this.partitionLength = 256;
            this.parts = [];
            for (var i = 0; i < 3; i++) {
                this.parts[i] = new Partition();
                this.parts[i].length = 256;
                this.parts[i].floor = i * 256;
                this.parts[i].ceiling = ((i + 1) * this.partitionLength) - 1;
                this.parts[i].isEmpty = true;
                this.parts[i].partition = new Array(256);
            }
        }
        MemoryManager.prototype.load = function (code, partition) {
            var myPart = partition;
            var counter = this.parts[myPart].floor;
            for (var i = 0; i < code.length; i++) {
                var hex = code[i];
                _Memory.array[counter] = hex;
                counter++;
            }
            this.parts[myPart].isEmpty = false;
            for (var i = this.parts[myPart].floor; i < this.parts[myPart].ceiling; i++) {
                this.parts[myPart].partition[i] = _Memory.array[i];
            }
        };
        MemoryManager.prototype.gerPart = function (part) {
        };
        //get and return available partition
        MemoryManager.prototype.findEmptyPart = function (codeLen) {
            var parts = this.parts;
            var result = null;
            for (var i = 0; i < parts.length; i++) {
                if (parts[i].isEmpty && parts[i].ceiling >= codeLen) {
                    result = i;
                    return result;
                }
            }
            if (result = null) {
                console.log("No memory");
            }
            return null;
        };
        MemoryManager.prototype.verifySpace = function (codelen) {
            var parts = this.parts;
            for (var i = 0; i < this.parts.length; i++) {
                if (parts[i].isEmpty && parts[i].ceiling >= codelen) {
                    return true;
                }
            }
            return false;
        };
        return MemoryManager;
    }());
    TSOS.MemoryManager = MemoryManager;
})(TSOS || (TSOS = {}));
