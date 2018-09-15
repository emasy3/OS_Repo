var TSOS;
(function (TSOS) {
    var ShellCommand = /** @class */ (function () {
        function ShellCommand(func, command, description, command1, command2, description1) {
            if (description === void 0) { description = ""; }
            this.func = func;
            this.command = command;
            this.description = description;
            this.command1 = command1;
            this.command2 = command2;
            this.description1 = description1;
        }
        return ShellCommand;
    }());
    TSOS.ShellCommand = ShellCommand;
})(TSOS || (TSOS = {}));
