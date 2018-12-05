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

    export class Mem {
        public array;

        constructor() {
            this.array = new Array(768);

            for(let i = 0; i < this.array.length; i++){
                this.array[i] = "00";
            }
        }


        public print(part): any {

            /*for(var i = 0; i < part.length; i++){
                console.log("varX: " + part[i].varX + " varY: " + part[i].varY);
            }*/
            return part.valueOf();
        }

    }
}
