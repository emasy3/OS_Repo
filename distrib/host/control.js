///<reference path="../globals.ts"/>
//
// Control Services
//
var TSOS;
(function (TSOS) {
    var Control = /** @class */ (function () {
        function Control() {
        }
        Control.hostInit = function () {
            // This is called from index.html's onLoad event via the onDocumentLoad function pointer.
            // Get a global reference to the canvas.  TODO: Should we move this stuff into a Display Device Driver?
            _Canvas = document.getElementById('display');
            // Get a global reference to the drawing context.
            _DrawingContext = _Canvas.getContext("2d");
            // Enable the added-in canvas text functions (see canvastext.ts for provenance and details).
            TSOS.CanvasTextFunctions.enable(_DrawingContext); // Text functionality is now built in to the HTML5 canvas. But this is old-school, and fun, so we'll keep it.
            // Clear the log text box.
            // Use the TypeScript cast to HTMLInputElement
            document.getElementById("taHostLog").value = "";
            // Set focus on the start button.
            // Use the TypeScript cast to HTMLInputElement
            document.getElementById("btnStartOS").focus();
            // Check for our testing and enrichment core, which
            // may be referenced here (from index.html) as function Glados().
            if (typeof Glados === "function") {
                // function Glados() is here, so instantiate Her into
                // the global (and properly capitalized) _GLaDOS variable.
                _GLaDOS = new Glados();
                _GLaDOS.init();
            }
        };
        Control.hostLog = function (msg, source) {
            if (source === void 0) { source = "?"; }
            // Note the OS CLOCK.
            var clock = _OSclock;
            // Note the REAL clock in milliseconds since January 1, 1970.
            var now = new Date().getTime();
            // Build the log string.
            var str = "({ clock:" + clock + ", source:" + source + ", msg:" + msg + ", now:" + now + " })" + "\n";
            // Update the log console.
            var taLog = document.getElementById("taHostLog");
            taLog.value = str + taLog.value;
            // TODO in the future: Optionally update a log database or some streaming service.
        };
        //
        // Host Events
        //
        Control.hostBtnStartOS_click = function (btn) {
            // Disable the (passed-in) start button...
            btn.disabled = true;
            // .. enable the Halt and Reset buttons ...
            document.getElementById("btnHaltOS").disabled = false;
            document.getElementById("btnReset").disabled = false;
            // .. set focus on the OS console display ...
            document.getElementById("display").focus();
            // ... Create and initialize the CPU (because it's part of the hardware)  ...
            _CPU = new TSOS.Cpu(); // Note: We could simulate multi-core systems by instantiating more than one instance of the CPU here.
            //       There's more to do, like dealing with scheduling and such, but this would be a start. Pretty cool.
            //initialize memory
            _Memory = new TSOS.Mem();
            this.memView();
            // ... then set the host clock pulse ...
            _hardwareClockID = setInterval(TSOS.Devices.hostClockPulse, CPU_CLOCK_INTERVAL);
            // .. and call the OS Kernel Bootstrap routine.
            _Kernel = new TSOS.Kernel();
            _Kernel.krnBootstrap(); // _GLaDOS.afterStartup() will get called in there, if configured.
        };
        Control.hostBtnHaltOS_click = function (btn) {
            Control.hostLog("Emergency halt", "host");
            Control.hostLog("Attempting Kernel shutdown.", "host");
            // Call the OS shutdown routine.
            _Kernel.krnShutdown();
            // Stop the interval that's simulating our clock pulse.
            clearInterval(_hardwareClockID);
            // TODO: Is there anything else we need to do here?
        };
        Control.hostBtnReset_click = function (btn) {
            // The easiest and most thorough way to do this is to reload (not refresh) the document.
            location.reload(true);
            // That boolean parameter is the 'forceget' flag. When it is true it causes the page to always
            // be reloaded from the server. If it is false or not specified the browser may reload the
            // page from its cache, which is not what we want.
        };
        Control.memView = function () {
            var memoryTable = document.getElementById('memoryTable');
            var counter = 0;
            //for ever 8 items do the work
            for (var i = 0; i < _Memory.array.length / 8; i++) {
                //row address
                var rowAddr = i * 8;
                //create current row and create first cell
                var currentRow = memoryTable.insertRow();
                var firstCell = currentRow.insertCell(0);
                var hexAddr = "0x";
                if (rowAddr.toString(16).length == 1) {
                    hexAddr += "00";
                }
                if (rowAddr.toString(16).length == 2) {
                    console.log("Value 1: " + (rowAddr.toString(16).length));
                    hexAddr += "0";
                    console.log("Counter: " + counter);
                    console.log("rowAddr: " + rowAddr);
                    console.log("rowAddr 16: " + rowAddr.toString(16).toUpperCase());
                    console.log("Hex: " + hexAddr);
                    /*console.log("Hex: " + hexAddr);
                    console.log("RowAddy: " + rowAddr);*/
                }
                //fill all cells in each row
                for (var n = 0; n < 8; n++) {
                    var rowCell = currentRow.insertCell();
                    rowCell.innerHTML = "00";
                }
                hexAddr += rowAddr.toString(16).toUpperCase();
                firstCell.innerHTML = hexAddr;
                counter++;
                console.log("Value 1 second: " + (rowAddr.toString(16).length));
            }
        };
        Control.memUpdate = function () {
            var memoryTable = document.getElementById('memoryTable');
            for (var i = 0; i < _Memory.array.length / 8; i++) {
                var currentRow = memoryTable.rows[i];
                var rowAddr = i * 8;
                var hexAddr = "0x";
                if (rowAddr.toString(16).length == 1) {
                    hexAddr += "00";
                }
                if (rowAddr.toString(16).length == 2) {
                    hexAddr += "0";
                }
                hexAddr += rowAddr.toString(16).toUpperCase();
                currentRow.cells[0].innerHTML = hexAddr;
                for (var n = 0; n < 8; n++) {
                    var nextCell = currentRow.cells[n + 1];
                    var indx = i * 8;
                    indx = indx + n;
                    var memVal = _Memory.array[indx];
                    nextCell.innerHTML = memVal.toString(16).toUpperCase();
                    console.log(memVal);
                }
            }
            // console.log(_Memory.array);
        };
        return Control;
    }());
    TSOS.Control = Control;
})(TSOS || (TSOS = {}));
