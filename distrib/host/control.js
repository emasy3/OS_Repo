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
            _Memory = new TSOS.Memory();
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
                //leading byte string for row address to display--located in firstCell
                var hexAddr = "0x";
                //check value of rowaddr and set leading hex accordingly
                if (rowAddr.toString(16).length == 1) {
                    hexAddr += "00";
                }
                if (rowAddr.toString(16).length == 2) {
                    hexAddr += "0";
                }
                //combine the hex and row address in a hex format
                hexAddr += rowAddr.toString(16).toUpperCase();
                //set first cell as this address
                firstCell.innerHTML = hexAddr;
                //fill all cells in each row
                for (var n = 0; n < 8; n++) {
                    var rowCell = currentRow.insertCell();
                    rowCell.innerHTML = "00";
                }
                counter++;
            }
        };
        Control.memViewUpdate = function () {
            var memoryTable = document.getElementById('memoryTable');
            //for every row in our array do the work
            for (var i = 0; i < _Memory.array.length / 8; i++) {
                var currentRow = memoryTable.rows[i];
                //current row address is a multiple of 8 as each row has 8 items
                var rowAddr = i * 8;
                //leading hex work
                var hexAddr = "0x";
                if (rowAddr.toString(16).length == 1) {
                    hexAddr += "00";
                }
                if (rowAddr.toString(16).length == 2) {
                    hexAddr += "0";
                }
                //combine hex and row
                hexAddr += rowAddr.toString(16).toUpperCase();
                //set address(first) cell
                currentRow.cells[0].innerHTML = hexAddr;
                //for all of the rest of the cells
                for (var n = 0; n < 8; n++) {
                    //the next cell we skip 0 because of the address cell
                    var nextCell = currentRow.cells[n + 1];
                    //mem index (a combination of n and the row value)
                    var meMindx = i * 8;
                    meMindx = meMindx + n;
                    //value from memory at memIndx
                    var memVal = _Memory.array[meMindx];
                    //set inner html
                    nextCell.innerHTML = memVal.toString(16).toUpperCase();
                }
            }
            // console.log(_Memory.array);
        };
        Control.cpuViewUpdate = function () {
            //sel explanatory, get element update values at the second row because of header
            var cpuTable = document.getElementById("cpuTable");
            var row = cpuTable.rows[1];
            var cells = row.cells;
            //IR
            var irHex = _CPU.hexCheck(_CPU.Ireg);
            cells[0].innerHTML = irHex + _CPU.Ireg.toString(16).toUpperCase();
            //PC
            var pcHex = _CPU.hexCheck(_CPU.PC);
            cells[1].innerHTML = pcHex + _CPU.PC.toString(16).toUpperCase();
            //ACC
            var accHex = _CPU.hexCheck(_CPU.Acc);
            cells[2].innerHTML = accHex + _CPU.Acc.toString(16).toUpperCase();
            //x
            var xregHx = _CPU.hexCheck((_CPU.Xreg));
            cells[3].innerHTML = xregHx + _CPU.Xreg.toString(16).toUpperCase();
            //y
            var yregHx = _CPU.hexCheck(_CPU.Yreg);
            cells[4].innerHTML = yregHx + _CPU.Yreg.toString(16).toUpperCase();
            //z
            var zregHx = _CPU.hexCheck(_CPU.Zflag);
            cells[5].innerHTML = zregHx + _CPU.Zflag.toString(16).toUpperCase();
        };
        Control.pcbViewUpdate = function () {
            //check if the tables rows minus the header row, is less then the length of our resident queue of pcbs
            var pcbTable = document.getElementById("pcbTable");
            if (pcbTable.rows.length - 1 === _ResidentQueue.q.length) {
                this.pcbRowUpdate(pcbTable);
                //console.log("first");
            }
            else {
                //if it is, add a new row and do the work and return
                this.pcbNewRow(pcbTable);
                //console.log("resident q length: " + _ResidentQueue.q.length);
                //console.log("pcb table length-1: " + (pcbTable.rows.length-1));
            }
        };
        Control.pcbRowUpdate = function (table) {
            //for each pcb in the Resident queue starting from 0, update their corresponding display
            for (var i = 0; i < _ResidentQueue.q.length; i++) {
                var row = table.rows[i + 1];
                var cells = row.cells;
                //var pid
                var program = _ResidentQueue.q[i];
                //_ResidentQueue.enqueue(program);
                //Pid
                var cell = cells[0];
                //leading hex
                var pidHx = _CPU.hexCheck(program.pId);
                cell.innerHTML = pidHx + program.pId;
                //Location
                var cell0 = cells[1];
                var locHx = _CPU.hexCheck(program.location);
                cell0.innerHTML = locHx + program.location.toString();
                //Priority
                var cell1 = cells[2];
                var priorHx = _CPU.hexCheck(program.priority);
                cell1.innerHTML = priorHx + program.priority;
                //State
                var cell2 = cells[3];
                var stateHx = _CPU.hexCheck(program.prState);
                cell2.innerHTML = stateHx + program.prState.toString();
                //IR
                var cell4 = cells[4];
                var irHx = _CPU.hexCheck(program.inReg);
                cell4.innerHTML = irHx + program.inReg.toString();
                //PC
                var cell3 = cells[5];
                var pcHx = _CPU.hexCheck(program.prgCounter);
                cell3.innerHTML = pcHx + program.prgCounter.toString(16).toUpperCase();
                //Acc
                var cell5 = cells[6];
                var accHx = _CPU.hexCheck(program.acc);
                cell5.innerHTML = accHx + program.acc.toString(16).toUpperCase();
                //X
                var cell6 = cells[7];
                var xregHx = _CPU.hexCheck(program.regX);
                cell6.innerHTML = xregHx + program.regX.toString(16).toUpperCase();
                //Y
                var cell7 = cells[8];
                var yHx = _CPU.hexCheck(program.regY);
                cell7.innerHTML = yHx + program.regY.toString(16).toUpperCase();
                //Z
                var cell8 = cells[9];
                var zHx = _CPU.hexCheck(program.regZ);
                cell8.innerHTML = zHx + program.regZ.toString(16).toUpperCase();
                //console.log("rowIpdated");
            }
        };
        Control.pcbNewRow = function (table) {
            for (var i = table.rows.length - 1; i < _ResidentQueue.q.length; i++) {
                var row = table.insertRow();
                var program = _ResidentQueue.q[i];
                //_ResidentQueue.enqueue(program);
                //Pid
                var cell = row.insertCell(0);
                var pidHx = _CPU.hexCheck(program.pId);
                cell.innerHTML = pidHx + program.pId;
                //Location
                var cell0 = row.insertCell(1);
                var locHx = _CPU.hexCheck(program.location);
                cell0.innerHTML = locHx + program.location.toString();
                //Priority
                var cell1 = row.insertCell(2);
                var priorHx = _CPU.hexCheck(program.priority);
                cell1.innerHTML = priorHx + program.priority;
                //State
                var cell2 = row.insertCell(3);
                var stateHx = _CPU.hexCheck(program.prState);
                cell2.innerHTML = stateHx + program.prState.toString();
                //IR
                var cell4 = row.insertCell(4);
                var irHx = _CPU.hexCheck(program.inReg);
                cell4.innerHTML = irHx + program.inReg.toString();
                //PC
                var cell3 = row.insertCell(5);
                var pcHx = _CPU.hexCheck(program.prgCounter);
                cell3.innerHTML = pcHx + program.prgCounter.toString(16).toUpperCase();
                //Acc
                var cell5 = row.insertCell(6);
                var accHx = _CPU.hexCheck(program.acc);
                cell5.innerHTML = accHx + program.acc.toString(16).toUpperCase();
                //X
                var cell6 = row.insertCell(7);
                var xregHx = _CPU.hexCheck(program.regX);
                cell6.innerHTML = xregHx + program.regX.toString(16).toUpperCase();
                //Y
                var cell7 = row.insertCell(8);
                var yHx = _CPU.hexCheck(program.regY);
                cell7.innerHTML = yHx + program.regY.toString(16).toUpperCase();
                //Z
                var cell8 = row.insertCell(9);
                var zHx = _CPU.hexCheck(program.regZ);
                cell8.innerHTML = zHx + program.regZ.toString(16).toUpperCase();
                //console.log("worked");
            }
        };
        Control.readyQueueUpdate = function () {
            var rdyTable = document.getElementById("rdyTable");
            var queue = [];
            while (rdyTable.rows.length > 1) {
                rdyTable.deleteRow(rdyTable.rows.length - 1);
            }
            for (var i = 0; i < _ReadyQueue.getSize(); i++) {
                var program = _ReadyQueue.q[i];
                queue.push(program);
            }
            if (_ProcessManager.currentPCB != null) {
                queue.push(_ProcessManager.currentPCB);
            }
            while (queue.length > 0) {
                var newPcb = queue.pop();
                var row = rdyTable.insertRow();
                // PID
                var cell0 = row.insertCell();
                cell0.innerHTML = newPcb.pId.toString();
                // State
                var cell2 = row.insertCell();
                cell2.innerHTML = newPcb.prState;
                // Priority
                var cell3 = row.insertCell();
                cell3.innerHTML = newPcb.priority.toString();
                // Location
                var cell4 = row.insertCell();
                cell4.innerHTML = newPcb.location.toString();
            }
        };
        return Control;
    }());
    TSOS.Control = Control;
})(TSOS || (TSOS = {}));
