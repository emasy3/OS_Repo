///<reference path="../globals.ts" />

class Partition{
    public floor: number = 0;
    public ceiling: number = 0;
    public isEmpty = true;
    /*public partition: number[]*/;
    public partition: Partition[];
    public length: number = 0;
}


module TSOS {

    export class MemoryManager{
        public parts: Partition[];
        public partitionLength: number = 256;

        constructor() {
            this.parts = [];

           for(var i: number = 0; i < 3; i++){
                this.parts[i] = new Partition();
                this.parts[i].length = 256;
                this.parts[i].floor = i*256;
                this.parts[i].ceiling = ((i+1)*this.partitionLength) - 1;
                this.parts[i].isEmpty = true;
                this.parts[i].partition = new Array(256);
            }
        }

        public  load(code, partition): void {

            let myPart = partition;
            let counter = this.parts[myPart].floor;
            for(let i = 0; i < code.length; i++){
                let hex = code[i];
                _Memory.array[counter] = hex;
                counter++
            }
            this.parts[myPart].isEmpty = false;

            for(let i = this.parts[myPart].floor; i < this.parts[myPart].ceiling; i++){
                this.parts[myPart].partition[i] = _Memory.array[i];

            }
        }
        public gerPart(part): any {


        }
        //get and return available partition
        public findEmptyPart(codeLen): number {
            var parts = this.parts;
            var result: number = null;
            for(let i = 0; i < parts.length; i++){
                if(parts[i].isEmpty && parts[i].ceiling >= codeLen){
                    result = i;
                    return result;
                }
            }
            if(result = null){
                console.log("No memory");
            }
            return null;
        }
        public verifySpace(codelen){
            var parts = this.parts;
            for(let i = 0; i < this.parts.length; i++){
                if(parts[i].isEmpty && parts[i].ceiling >= codelen){

                    return true;
                }
            }
            return false;
        }

    }
}

