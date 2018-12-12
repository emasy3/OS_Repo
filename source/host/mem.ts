///<reference path="../globals.ts" />

/* ------------
     Mem.ts


     ------------ */


module TSOS {

    export class Memory {
        public array;
        //self explanatory; creates and fills memory array with zeros size of 3 256 byte partitions
        constructor() {
            this.array = new Array(768);

            for(let i = 0; i < this.array.length; i++){
                this.array[i] = "00";
            }
        }


    }
}
