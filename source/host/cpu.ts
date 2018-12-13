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

module TSOS {

    export class Cpu {

        constructor(public PC: number = 0,
                    public Ireg: number = 0,
                    public Acc: number = 0,
                    public Xreg: number = 0,
                    public Yreg: number = 0,
                    public Zflag: number = 0,
                    public isExecuting: boolean = false,) {

        }

        public cycle(): void {

            if(_MemoryManager.checkBounds(this.PC)){
                // TODO: Accumulate CPU usage and profiling statistics here.
                var fetch = _MemoryManager.readMem(this.PC);
                // Do the real work here. Be sure to set this.isExecuting appropriately
                _Kernel.krnTrace('CPU cycle: ' + fetch);
                switch (fetch) {
                    //LDA with cons
                    case "A9":
                        //console.log("LDA with cons");
                        //execute load
                        //gets current pcb
                        var pcb = _ProcessManager.currentPCB;

                        //set values of pcb and cpu
                        pcb.inReg = _MemoryManager.readMem(this.PC);
                        pcb.acc = parseInt(_MemoryManager.readMem(this.PC+1), 16);
                        this.Ireg = _MemoryManager.readMem(this.PC);
                        this.Acc = parseInt(_MemoryManager.readMem(this.PC+1), 16);
                        this.PC += 2;
                        pcb.prgCounter = this.PC;
                        break;
                    //LDA from memory
                    case "AD":
                        //console.log("LDA mem command:");
                        //get pcb and set values of of it and cpu
                        //next byte/s
                        var val = _MemoryManager.readMem(this.PC + 2) +
                            _MemoryManager.readMem(this.PC + 1);
                        //set pcb and cpu
                        var pcb = _ProcessManager.currentPCB;
                        pcb.acc = _MemoryManager.readMem(parseInt(val, 16));
                        pcb.inReg = _MemoryManager.readMem(this.PC);
                        this.Acc = _MemoryManager.readMem(parseInt(val, 16));
                        this.Ireg = _MemoryManager.readMem(this.PC);
                        this.PC += 3;
                        pcb.prgCounter = this.PC;
                        break;
                    //STA
                    case "8D":
                        //console.log("STA command:");
                        //same as above
                        //gets next byte/s
                        var memVal = _MemoryManager.readMem(this.PC + 2) +
                            _MemoryManager.readMem(this.PC + 1);
                        //acc
                        var accuVal = parseInt(this.Acc.toString(16), 16);
                        //write to memory
                        _MemoryManager.write(parseInt(memVal, 16), accuVal);
                        //set pcb and cpu
                        var pcb = _ProcessManager.currentPCB;
                        pcb.inReg = _MemoryManager.readMem(this.PC);
                        this.Ireg = _MemoryManager.readMem(this.PC);
                        this.PC +=3;
                        pcb.prgCounter = this.PC;
                        break;
                    //ADC adds mem value to accumulator
                    case "6D":
                        //console.log("ADC command:");
                        var val = _MemoryManager.readMem(this.PC + 2) +
                            _MemoryManager.readMem(this.PC + 1);
                        var addr = parseInt(val, 16);
                        //set pcb and cpu
                        var pcb = _ProcessManager.currentPCB;
                        pcb.acc = this.Acc + parseInt(_MemoryManager.readMem(addr), 16);
                        pcb.inReg = _MemoryManager.readMem(this.PC);
                        // @ts-ignore
                        this.Acc = this.Acc + parseInt(_MemoryManager.readMem(addr), 16);
                        this.Ireg = _MemoryManager.readMem(this.PC);
                        this.PC +=3;
                        pcb.prgCounter = this.PC;
                        break;
                    //LDX loads x reg with cons
                    case "A2":
                        //execute load
                        //console.log("LDX command");
                        //same as above
                        var pcb = _ProcessManager.currentPCB;
                        //loading x with pc + 1 in memory array
                        pcb.regX = parseInt(_MemoryManager.readMem(this.PC + 1), 16);
                        pcb.inReg = _MemoryManager.readMem(this.PC);
                        this.Xreg = parseInt(_MemoryManager.readMem(this.PC + 1), 16);
                        this.Ireg = _MemoryManager.readMem(this.PC);
                        this.PC += 2;
                        pcb.prgCounter = this.PC;
                        break;
                    //loads x reg from memory
                    case "AE":
                        //execute load
                        //console.log("LDX from memory command");
                        //next byte/s
                        var val = _MemoryManager.readMem(this.PC + 2) +
                            _MemoryManager.readMem(this.PC + 1);
                        //same as above
                        var pcb = _ProcessManager.currentPCB;
                        //loading x with val in mem from byte above
                        pcb.regX = _MemoryManager.readMem(parseInt(val, 16));
                        pcb.inReg = _MemoryManager.readMem(this.PC);
                        this.Xreg = _MemoryManager.readMem(parseInt(val, 16));
                        this.Ireg = _MemoryManager.readMem(this.PC);
                        this.PC += 3;
                        pcb.prgCounter = this.PC;
                        break;
                    //LDY
                    case "A0":
                        //load y register with constant
                        //console.log("LDY command");

                        //same as above
                        //loading y with next byte in mem array
                        var pcb = _ProcessManager.currentPCB;
                        pcb.inReg = _MemoryManager.readMem(this.PC);
                        pcb.regY= parseInt(_MemoryManager.readMem(this.PC + 1), 16);
                        this.Ireg = _MemoryManager.readMem(this.PC);
                        this.Yreg = parseInt(_MemoryManager.readMem(this.PC + 1), 16);
                        this.PC += 2;
                        pcb.prgCounter = this.PC;
                        break;
                    //load y register from memory
                    case "AC":
                        //execute load
                        //console.log("LDY from memory command");
                        var val = _MemoryManager.readMem(this.PC + 2) +
                            _MemoryManager.readMem(this.PC + 1);
                        //same as above
                        //loading y with val found at val byte in memory array
                        var pcb = _ProcessManager.currentPCB;
                        pcb.inReg = _MemoryManager.readMem(this.PC);
                        pcb.regY= _MemoryManager.readMem(parseInt(val, 16));
                        this.Ireg = _MemoryManager.readMem(this.PC);
                        this.Yreg = _MemoryManager.readMem(parseInt(val, 16));
                        this.PC += 3;
                        pcb.prgCounter = this.PC;
                        break;
                    //NO operation
                    case "EA":
                        //console.log("no op");
                        var pcb = _ProcessManager.currentPCB;
                        pcb.inReg = _MemoryManager.readMem(this.PC);
                        this.Ireg = _MemoryManager.readMem(this.PC);
                        this.PC++;
                        pcb.prgCounter = this.PC;
                        break;
                    //BRK
                    case "00":
                        //console.log("break system call");
                        //TODO: create a system call for a process exit using an interrupt
                        _KernelInterruptQueue.enqueue(new Interrupt(TERMINATEPROG_IRQ));
                        break;
                    //Compare a byte from memory to Xreg, sets ZFlag to one if equal
                    case "EC":
                        //execute load
                        //console.log("CPX from memory command");
                        var val = _MemoryManager.readMem(this.PC + 2) +
                            _MemoryManager.readMem(this.PC + 1);
                        //parseInt for memory Index
                        var memIndx = parseInt(val, 16);
                        //read byte from memory to compare
                        var memByte = parseInt((_MemoryManager.readMem(memIndx)).toString(), 16);

                        //same work as first few cases
                        //get current pcb set its values to the cpus
                        var pcb = _ProcessManager.currentPCB;

                        //compare and set zflag accordingly
                        if(memByte == this.Xreg){
                            this.Zflag = 1;
                            pcb.regZ = this.Zflag;
                        }else{
                            this.Zflag = 0;
                            pcb.regZ = this.Zflag;
                        }

                        pcb.inReg = _MemoryManager.readMem(this.PC);
                        this.Ireg = _MemoryManager.readMem(this.PC);
                        this.PC+=3;
                        pcb.prgCounter = this.PC;
                        break;
                    //BNE
                    case "D0":
                        //console.log("Branch n bytes");
                        if(this.Zflag == 0){
                            //branch n bytes if Z flag = 0
                            var nBytes = parseInt(_MemoryManager.readMem(this.PC + 1), 16);
                            this.PC = (this.PC + nBytes + 2) % 256;
                            //console.log("First");
                        }else{
                            this.PC +=2;
                            //console.log("Second");
                        }
                        this.Ireg = _MemoryManager.readMem(this.PC);
                        var pcb = _ProcessManager.currentPCB;
                        pcb.prgCounter = this.PC;
                        pcb.inReg = this.Ireg;
                        break;
                    //INC
                    //Increment the value of a byte
                    case "EE":
                        //read bytes
                        var memVal = _MemoryManager.readMem(this.PC + 2) +
                            _MemoryManager.readMem(this.PC + 1);
                        //convert to decimal so it can be fed to memory reader
                        var index = parseInt(memVal, 16);
                        //read val at index
                        var readVal = parseInt(_MemoryManager.readMem(index), 16);
                        readVal++;
                        _MemoryManager.write(index, readVal);
                        //console.log("INC command");

                        this.PC+= 3;
                        var pcb = _ProcessManager.currentPCB;
                        pcb.prgCounter = this.PC;
                        break;
                    //SYS
                    case "FF":
                        //System Call
                        //01 Xreg =print the value of integer stored in Y reg
                        //02 Xreg = print the value of the 00-terminated string stored at the address in the Y register
                        if(this.Xreg == 1){
                            _KernelInterruptQueue.enqueue(new Interrupt(SYSTEMCALL_IRQ, 1));

                        }else if(this.Xreg == 2) {
                            _KernelInterruptQueue.enqueue(new Interrupt(SYSTEMCALL_IRQ, 2));
                        }
                        this.PC++;
                        var pcb = _ProcessManager.currentPCB;
                        pcb.prgCounter = this.PC;
                        break;
                    default:
                        _KernelInterruptQueue.enqueue(new Interrupt(TERMINATEPROG_IRQ));
                        /*pcb.inReg = "00";
                        pcb.acc = "00";
                        //console.log("Error");
                        //console.log(fetch2 + " is not a valid op code");
                        */break;
                }
            }

        }
        public hexCheck(val):string{
            //checks an decimal value of and decides whether it needs a leading 0 for display in html or not
            var hex = "";
            if(val < 16){
                hex+= "0";
            }
            return hex;
        }
        public reset(){
              this.PC = 0;
              this.Ireg = 0;
              this.Acc = 0;
              this.Xreg = 0;
              this.Yreg = 0;
              this.Zflag = 0;
              this.isExecuting = false;

        }

        public sync(pcb){
          this.Acc = pcb.acc;
          this.PC = pcb.prgCounter;
          this.Xreg = pcb.regX;
          this.Yreg = pcb.regY;
          this.Zflag = pcb.regZ;
          this.isExecuting = true;
        }
    }
}
