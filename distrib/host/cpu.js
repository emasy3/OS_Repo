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
var TSOS;
(function (TSOS) {
    var Cpu = /** @class */ (function () {
        function Cpu(PC, Acc, Xreg, Yreg, Zflag, isExecuting) {
            if (PC === void 0) { PC = 0; }
            if (Acc === void 0) { Acc = 0; }
            if (Xreg === void 0) { Xreg = 0; }
            if (Yreg === void 0) { Yreg = 0; }
            if (Zflag === void 0) { Zflag = 0; }
            if (isExecuting === void 0) { isExecuting = false; }
            this.PC = PC;
            this.Acc = Acc;
            this.Xreg = Xreg;
            this.Yreg = Yreg;
            this.Zflag = Zflag;
            this.isExecuting = isExecuting;
        }
        Cpu.prototype.init = function () {
            this.PC = 0;
            this.Acc = 0;
            this.Xreg = 0;
            this.Yreg = 0;
            this.Zflag = 0;
            this.isExecuting = false;
        };
        Cpu.prototype.cycle = function (pcb, part) {
            this.isExecuting = true;
            _Kernel.krnTrace('CPU cycle');
            // TODO: Accumulate CPU usage and profiling statistics here.
            // Do the real work here. Be sure to set this.isExecuting appropriately.
            for (var i = pcb.prgCounter; i < part.length; i++) {
                var fetch = part[i].varX;
                var fetch1 = part[i].varY;
                var fetch2 = fetch + fetch1;
                switch (fetch2.toString()) {
                    //LDA with cons
                    case "A9":
                        //get value
                        var valX = part[i + 1].varX;
                        var valY = part[i + 1].varY;
                        //execute load
                        var accU = valX + valY;
                        pcb.inReg = "A9";
                        pcb.acc = accU;
                        pcb.prgCounter = i + 1;
                        i += 1;
                        break;
                    //LDA from memory
                    case "AD":
                        console.log("LDA mem command:");
                        var val = part[i + 1].varX + part[i + 1].varY;
                        val = val.toString();
                        var val2 = Number(parseInt(val, 16));
                        pcb.inReg = "AD";
                        pcb.prgCounter = i + 2;
                        i += 2;
                        var val3 = part[val2 - 1].varX + part[val2 - 1].varY;
                        pcb.acc = val3;
                        console.log("Type of val: " + typeof val2);
                        console.log("Hex value: " + val2);
                        console.log("Pcb accumulator value: " + pcb.acc);
                        //console.log(pcb.inReg);
                        console.log("Memory value at " + val2 + ":" + val3);
                        break;
                    //STA
                    case "8D":
                        console.log("STA command:");
                        var val = part[i + 1].varX + part[i + 1].varY;
                        val = val.toString();
                        var val2 = Number(parseInt(val, 16));
                        var test = false;
                        if (val2 == 0) {
                            pcb.inReg = "8D";
                            pcb.prgCounter = i + 2;
                            i += 2;
                            console.log("Partition at parameter val before set");
                            console.log(part[val2]);
                            part[val2].varX = pcb.acc.charAt(0);
                            part[val2].varY = pcb.acc.charAt(1);
                        }
                        else if (val2 < 257 && val2 > 0) {
                            pcb.inReg = "8D";
                            pcb.prgCounter = i + 2;
                            i += 2;
                            console.log("Partition at parameter val before set");
                            console.log(part[val2 - 1]);
                            part[val2 - 1].varX = pcb.acc.charAt(0);
                            part[val2 - 1].varY = pcb.acc.charAt(1);
                            test = true;
                        }
                        console.log("Accumulator : " + pcb.acc);
                        console.log("Partition at parameter val after");
                        if (test == true) {
                            console.log(part[val2 - 1]);
                        }
                        else {
                            console.log(part[val2]);
                        }
                        break;
                    //ADC adds mem value to accumulator
                    case "6D":
                        console.log("ADC command:");
                        var val = part[i + 1].varX + part[i + 1].varY;
                        val = val.toString();
                        var val2 = Number(parseInt(val, 16));
                        pcb.inReg = "6D";
                        pcb.prgCounter = i + 2;
                        i += 2;
                        var elemHx = Number(parseInt(part[val2 - 1].varX + part[val2 - 1].varY, 16));
                        var pcbHx = Number(parseInt(pcb.acc, 16));
                        var result = Number(pcbHx + elemHx);
                        pcb.acc = result;
                        console.log(val2);
                        console.log(elemHx);
                        console.log(pcbHx);
                        console.log(pcb.acc);
                        break;
                    //LDX loads x reg with cons
                    case "A2":
                        //execute load
                        console.log("LDX command");
                        pcb.inReg = "A2";
                        pcb.regX = part[i + 1].varX + part[i + 1].varY;
                        pcb.prgCounter = i + 1;
                        i += 1;
                        console.log("X register: " + pcb.regX);
                        break;
                    //loads x reg from memory
                    case "AE":
                        //execute load
                        console.log("LDX from memory command");
                        pcb.inReg = "AE";
                        var partIndx = Number(parseInt(part[i + 1].varX + part[i + 1].varY, 16));
                        if (partIndx == 0) {
                            pcb.regX = part[partIndx].varX + part[partIndx].varY;
                        }
                        else {
                            pcb.regX = part[partIndx - 1].varX + part[partIndx - 1].varY;
                        }
                        pcb.prgCounter = i + 2;
                        i += 2;
                        console.log("X register: " + pcb.regX);
                        break;
                    //LDY
                    case "A0":
                        //load y register with constant
                        console.log("LDY command");
                        pcb.inReg = "A0";
                        pcb.regY = part[i + 1].varX + part[i + 1].varY;
                        pcb.prgCounter = i + 1;
                        i += 1;
                        console.log("Y register: " + pcb.regY);
                        break;
                    //load y register from memory
                    case "AC":
                        //execute load
                        console.log("LDY from memory command");
                        pcb.inReg = "AC";
                        var partIndx = Number(parseInt(part[i + 1].varX + part[i + 1].varY, 16));
                        if (partIndx == 0) {
                            pcb.regY = part[partIndx].varX + part[partIndx].varY;
                        }
                        else {
                            pcb.regY = part[partIndx - 1].varX + part[partIndx - 1].varY;
                        }
                        pcb.prgCounter = i + 2;
                        i += 2;
                        console.log("Y register: " + pcb.regY);
                        break;
                    //NO operation
                    case "EA":
                        console.log("no op");
                        break;
                    //BRK
                    case "00":
                        console.log(part[i]);
                        return;
                    //Compare a byte from memory to Xreg
                    case "EC":
                        //execute load
                        console.log("CPX from memory command");
                        pcb.inReg = "EC";
                        var partIndx = Number(parseInt(part[i + 1].varX + part[i + 1].varY, 16));
                        if (partIndx >= 0) {
                            var HxVal = Number(parseInt(part[partIndx].varX + part[partIndx].varY, 16));
                            var HxRegX = Number(parseInt(pcb.regX, 16));
                            if (HxVal === HxRegX) {
                                this.Zflag = Number(parseInt("00", 16));
                            }
                            else {
                                this.Zflag = Number(parseInt("01", 16));
                            }
                        }
                        else {
                            console.log("Invalid hex value");
                        }
                        pcb.prgCounter = i + 2;
                        i += 2;
                        console.log("Y register: " + pcb.regY);
                        break;
                    //BNE
                    case "D0":
                        break;
                    //INC
                    case "EE":
                        break;
                    //SYS
                    case "FF":
                        break;
                    default:
                        /*pcb.inReg = "00";
                        pcb.acc = "00";
                        console.log("Error");
                        console.log(fetch2 + " is not a valid op code");
                        */ break;
                }
            }
            pcb.prState = "done";
            this.isExecuting = false;
        };
        Cpu.prototype.parse = function (str) {
            var arr = [];
            var input = str.replace(/\s/g, '');
            for (var i = 0; i < str.length; i += 2) {
                //check if current input value or the next value is undefined
                if (input[i] === undefined) {
                    break;
                }
                else if (input[i + 1] === undefined) {
                    input += "0";
                }
                var pairVal = input[i] + input[i + 1];
                console.log(pairVal);
                arr.push(pairVal);
            }
            console.log(arr);
        };
        return Cpu;
    }());
    TSOS.Cpu = Cpu;
})(TSOS || (TSOS = {}));
