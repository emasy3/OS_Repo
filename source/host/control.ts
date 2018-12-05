///<reference path="../globals.ts"/>

//
// Control Services
//
module TSOS {

    export class Control {

        public static hostInit(): void {
            // This is called from index.html's onLoad event via the onDocumentLoad function pointer.

            // Get a global reference to the canvas.  TODO: Should we move this stuff into a Display Device Driver?
            _Canvas = <HTMLCanvasElement>document.getElementById('display');

            // Get a global reference to the drawing context.
            _DrawingContext = _Canvas.getContext("2d");

            // Enable the added-in canvas text functions (see canvastext.ts for provenance and details).
            CanvasTextFunctions.enable(_DrawingContext);   // Text functionality is now built in to the HTML5 canvas. But this is old-school, and fun, so we'll keep it.

            // Clear the log text box.
            // Use the TypeScript cast to HTMLInputElement
            (<HTMLInputElement> document.getElementById("taHostLog")).value="";

            // Set focus on the start button.
            // Use the TypeScript cast to HTMLInputElement
            (<HTMLInputElement> document.getElementById("btnStartOS")).focus();

            // Check for our testing and enrichment core, which
            // may be referenced here (from index.html) as function Glados().
            if (typeof Glados === "function") {
                // function Glados() is here, so instantiate Her into
                // the global (and properly capitalized) _GLaDOS variable.
                _GLaDOS = new Glados();
                _GLaDOS.init();
            }
        }

        public static hostLog(msg: string, source: string = "?"): void {
            // Note the OS CLOCK.
            var clock: number = _OSclock;

            // Note the REAL clock in milliseconds since January 1, 1970.
            var now: number = new Date().getTime();

            // Build the log string.
            var str: string = "({ clock:" + clock + ", source:" + source + ", msg:" + msg + ", now:" + now  + " })"  + "\n";

            // Update the log console.
            var taLog = <HTMLInputElement> document.getElementById("taHostLog");
            taLog.value = str + taLog.value;

            // TODO in the future: Optionally update a log database or some streaming service.
        }


        //
        // Host Events
        //
        public static hostBtnStartOS_click(btn): void {
            // Disable the (passed-in) start button...
            btn.disabled = true;

            // .. enable the Halt and Reset buttons ...
            (<HTMLButtonElement>document.getElementById("btnHaltOS")).disabled = false;
            (<HTMLButtonElement>document.getElementById("btnReset")).disabled = false;

            // .. set focus on the OS console display ...
            document.getElementById("display").focus();

            // ... Create and initialize the CPU (because it's part of the hardware)  ...
            _CPU = new Cpu();  // Note: We could simulate multi-core systems by instantiating more than one instance of the CPU here.
                              //       There's more to do, like dealing with scheduling and such, but this would be a start. Pretty cool.
            //initialize memory
            _Memory = new Mem();
            this.MemView();
            // ... then set the host clock pulse ...
            _hardwareClockID = setInterval(Devices.hostClockPulse, CPU_CLOCK_INTERVAL);
            // .. and call the OS Kernel Bootstrap routine.
            _Kernel = new Kernel();
            _Kernel.krnBootstrap();  // _GLaDOS.afterStartup() will get called in there, if configured.
        }

        public static hostBtnHaltOS_click(btn): void {
            Control.hostLog("Emergency halt", "host");
            Control.hostLog("Attempting Kernel shutdown.", "host");
            // Call the OS shutdown routine.
            _Kernel.krnShutdown();
            // Stop the interval that's simulating our clock pulse.
            clearInterval(_hardwareClockID);
            // TODO: Is there anything else we need to do here?
        }

        public static hostBtnReset_click(btn): void {
            // The easiest and most thorough way to do this is to reload (not refresh) the document.
            location.reload(true);
            // That boolean parameter is the 'forceget' flag. When it is true it causes the page to always
            // be reloaded from the server. If it is false or not specified the browser may reload the
            // page from its cache, which is not what we want.
        }

        public static MemView(): void {
            var memTable = document.getElementById('memTable');
            var counter:number = 0;
            //for ever 8 items do the work
            for(let i = 0; i < _Memory.array.length / 8; i++){
                //row address
                var rowAddr = i * 8;
                //create current row and create first cell
                var currentRow = memTable.insertRow();
                var firstCell = currentRow.insertCell(0);

                var hexAddr: string = "0x";
                if(rowAddr.toString(16).length == 1){
                    hexAddr+="00";
                }
                if(rowAddr.toString(16).length == 2){
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
                for(let n = 0; n < 8; n++){
                    var rowCell = currentRow.insertCell();
                    rowCell.innerHTML = "00";
                }
                console.log("Value 1 second: " + (rowAddr.toString(16).length));


                hexAddr += rowAddr.toString(16).toUpperCase();
                firstCell.innerHTML = hexAddr;
                counter++;

            }
        }
    }
}
