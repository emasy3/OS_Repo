var TSOS;
(function (TSOS) {
    var Memory = /** @class */ (function () {
        function Memory(part1) {
            if (part1 === void 0) { part1 = [32][16]; }
            this.part1 = part1;
        }
        Memory.prototype.load = function (string) {
            var j = 0;
            for (var i = 0; i < string.length; i++) {
                if (i % 16 == 1) {
                    j++;
                }
                this.part1[j][i] = string[i];
            }
            return this.part1.toString();
        };
        return Memory;
    }());
    TSOS.Memory = Memory;
})(TSOS || (TSOS = {}));
