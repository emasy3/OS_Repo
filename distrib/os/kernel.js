///<reference path="../globals.ts" />
///<reference path="queue.ts" />
/* ------------
     Kernel.ts

     Requires globals.ts
              queue.ts

     Routines for the Operating System, NOT the host.

     This code references page numbers in the text book:
     Operating System Concepts 8th edition by Silberschatz, Galvin, and Gagne.  ISBN 978-0-470-12872-5
     ------------ */
var TSOS;
(function (TSOS) {
    var Kernel = /** @class */ (function () {
        function Kernel() {
        }
        //
        // OS Startup and Shutdown Routines
        //
        Kernel.prototype.krnBootstrap = function () {
            TSOS.Control.hostLog("bootstrap", "host"); // Use hostLog because we ALWAYS want this, even if _Trace is off.
            // Initialize our global queues.
            _KernelInterruptQueue = new TSOS.Queue(); // A (currently) non-priority queue for interrupt requests (IRQs).
            _KernelBuffers = new Array(); // Buffers... for the kernel.
            _KernelInputQueue = new TSOS.Queue(); // Where device input lands before being processed out somewhere.
            // Initialize the console.
            _Console = new TSOS.Console(); // The command line interface / console I/O device.
            _Console.init();
            // Initialize standard input and output to the _Console.
            _StdIn = _Console;
            _StdOut = _Console;
            // Load the Keyboard Device Driver
            this.krnTrace("Loading the keyboard device driver.");
            _krnKeyboardDriver = new TSOS.DeviceDriverKeyboard(); // Construct it.
            _krnKeyboardDriver.driverEntry(); // Call the driverEntry() initialization routine.
            this.krnTrace(_krnKeyboardDriver.status);
            //
            // ... more?
            //
            _ProcessManager = new TSOS.ProcessManager();
            _MemoryManager = new TSOS.MemoryManager();
            _Scheduler = new TSOS.Scheduler();
            // Enable the OS Interrupts.  (Not the CPU clock interrupt, as that is done in the hardware sim.)
            this.krnTrace("Enabling the interrupts.");
            this.krnEnableInterrupts();
            // Launch the shell.
            this.krnTrace("Creating and Launching the shell.");
            _OsShell = new TSOS.Shell();
            _OsShell.init();
            // Finally, initiate student testing protocol.
            if (_GLaDOS) {
                _GLaDOS.afterStartup();
            }
        };
        Kernel.prototype.krnShutdown = function () {
            this.krnTrace("begin shutdown OS");
            // TODO: Check for running processes.  If there are some, alert and stop. Else...
            // ... Disable the Interrupts.
            this.krnTrace("Disabling the interrupts.");
            this.krnDisableInterrupts();
            //
            // Unload the Device Drivers?
            // More?
            //
            this.krnTrace("end shutdown OS");
        };
        Kernel.prototype.krnOnCPUClockPulse = function () {
            /* This gets called from the host hardware simulation every time there is a hardware clock pulse.
               This is NOT the same as a TIMER, which causes an interrupt and is handled like other interrupts.
               This, on the other hand, is the clock pulse from the hardware / VM / host that tells the kernel
               that it has to look for interrupts and process them if it finds any.                           */
            // Check for an interrupt, are any. Page 560
            if (_KernelInterruptQueue.getSize() > 0) {
                // Process the first interrupt on the interrupt queue.
                // TODO: Implement a priority queue based on the IRQ number/id to enforce interrupt priority.
                var interrupt = _KernelInterruptQueue.dequeue();
                this.krnInterruptHandler(interrupt.irq, interrupt.params);
            }
            else if (_CPU.isExecuting) { // If there are no interrupts then run one CPU cycle if there is anything being processed. {
                _CPU.cycle();
                TSOS.Control.cpuViewUpdate();
                //check scheduler
                _Scheduler.check();
                TSOS.Control.memViewUpdate();
                TSOS.Control.pcbViewUpdate();
                //console.log("cycle:");
                //Control.pcbViewUpdate();
            }
            else { // If there are no interrupts and there is nothing being executed then just be idle. {
                this.krnTrace("Idle");
                _Scheduler.check();
                //console.log("not executing");
                //console.log(_ReadyQueue.q);
                //check ready queue
            }
        };
        //
        // Interrupt Handling
        //
        Kernel.prototype.krnEnableInterrupts = function () {
            // Keyboard
            TSOS.Devices.hostEnableKeyboardInterrupt();
            // Put more here.
        };
        Kernel.prototype.krnDisableInterrupts = function () {
            // Keyboard
            TSOS.Devices.hostDisableKeyboardInterrupt();
            // Put more here.
        };
        Kernel.prototype.krnInterruptHandler = function (irq, params) {
            // This is the Interrupt Handler Routine.  See pages 8 and 560.
            // Trace our entrance here so we can compute Interrupt Latency by analyzing the log file later on. Page 766.
            this.krnTrace("Handling IRQ~" + irq);
            // Invoke the requested Interrupt Service Routine via Switch/Case rather than an Interrupt Vector.
            // TODO: Consider using an Interrupt Vector in the future.
            // Note: There is no need to "dismiss" or acknowledge the interrupts in our design here.
            //       Maybe the hardware simulation will grow to support/require that in the future.
            switch (irq) {
                case TIMER_IRQ:
                    this.krnTimerISR(); // Kernel built-in routine for timers (not the clock).
                    break;
                case KEYBOARD_IRQ:
                    _krnKeyboardDriver.isr(params); // Kernel mode device driver
                    _StdIn.handleInput();
                    break;
                case TERMINATEPROG_IRQ:
                    _ProcessManager.killProcess();
                    break;
                case SYSTEMCALL_IRQ:
                    this.krnSystemCall(params);
                    break;
                case CONTEXTSWITCH_IRQ:
                    //_Mode = 0;
                    TSOS.Control.hostLog("Switching", "os");
                    TSOS.Kernel.krnContextSwitch();
                    break;
                default:
                    this.krnTrapError("Invalid Interrupt Request. irq=" + irq + " params=[" + params + "]");
            }
        };
        Kernel.krnContextSwitch = function () {
            _CPU.reset();
            console.log("worked");
            //save state of running process
            //_ProcessManager.saveState();
            _Scheduler.counter = 0;
            //put the running process back on the ready queue
            _ReadyQueue.enqueue(_ProcessManager.currentPCB);
            _ProcessManager.currentPCB.prState = "ready";
            _ProcessManager.runProcess();
        };
        Kernel.prototype.krnSystemCall = function (params) {
            switch (params) {
                case 1:
                    //01 in x reg, so print byte in y
                    var num = parseInt(_CPU.Yreg.toString(), 16);
                    _StdOut.putText(num.toString());
                    _StdOut.advanceLine();
                    break;
                case 2:
                    //02 in x reg, so print 00-terminate string stored at address in y reg
                    var byteAddr = _CPU.Yreg + _ProcessManager.currentPCB.partition.ground;
                    //console.log("MemAddress in y reg: " + byteAddr);
                    ///while loop checks if current byte address is equal to 00
                    var arr = [];
                    while (_Memory.array[byteAddr] != "00") {
                        //console.log(_Memory.array[byteAddr]);
                        arr.push(parseInt(_Memory.array[byteAddr], 16));
                        //_Console.buffer+=_Memory.array[byteAddr];
                        //this.bufferCheck(_Console.buffer, byteAddr);
                        byteAddr++;
                    }
                    var chars = arr.map(function (x) { return String.fromCharCode(x); });
                    var str = chars.join("");
                    _StdOut.putText(str);
                    break;
            }
        };
        Kernel.prototype.bufferCheck = function (buffer, addr) {
            if (buffer.length > 50) {
                _StdOut.advanceLine();
            }
            //console.log("functionHelper");
            _StdOut.putText(String.fromCharCode(_Memory.array[addr]));
        };
        Kernel.prototype.krnTimerISR = function () {
            // The built-in TIMER (not clock) Interrupt Service Routine (as opposed to an ISR coming from a device driver). {
            // Check multiprogramming parameters and enforce quanta here. Call the scheduler / context switch here if necessary.
        };
        //
        // System Calls... that generate software interrupts via tha Application Programming Interface library routines.
        //
        // Some ideas:
        // - ReadConsole
        // - WriteConsole
        // - CreateProcess
        // - ExitProcess
        // - WaitForProcessToExit
        // - CreateFile
        // - OpenFile
        // - ReadFile
        // - WriteFile
        // - CloseFile
        //
        // OS Utility Routines
        //
        Kernel.prototype.krnTrace = function (msg) {
            // Check globals to see if trace is set ON.  If so, then (maybe) log the message.
            if (_Trace) {
                if (msg === "Idle") {
                    // We can't log every idle clock pulse because it would lag the browser very quickly.
                    if (_OSclock % 10 == 0) {
                        // Check the CPU_CLOCK_INTERVAL in globals.ts for an
                        // idea of the tick rate and adjust this line accordingly.
                        TSOS.Control.hostLog(msg, "OS");
                    }
                }
                else {
                    TSOS.Control.hostLog(msg, "OS");
                }
            }
        };
        Kernel.prototype.krnTrapError = function (msg) {
            TSOS.Control.hostLog("OS ERROR - TRAP: " + msg);
            // TODO: Display error on console, perhaps in some sort of colored screen. (Maybe blue?)
            _StdOut.advanceLine(20);
            TSOS.Utils.changeColor("#4C4CFF");
            //console.log("hi");
            _StdOut.putText("OS ERROR - TRAP: " + msg);
            this.krnShutdown();
        };
        return Kernel;
    }());
    TSOS.Kernel = Kernel;
})(TSOS || (TSOS = {}));
