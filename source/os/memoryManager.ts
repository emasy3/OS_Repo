///<reference path="../globals.ts" />

class Partition{
    public ground: number = 0;
    public ceiling: number = 0;
    public isEmpty = true;
    /*public partition: number[]*/;
    public length: number = 0;
    public indx: number = 0;
}


module TSOS {

    export class MemoryManager{
        public parts: Partition[];
        public partitionLength: number = 256;

        constructor() {
            this.parts = [];

           for(var i: number = 0; i < 3; i++){
               //create 3 memory partition object mappings of RAM and has nothing to do with the disk, everything to do with random access memories: such a great album; daft punk is amazing.
                this.parts[i] = new Partition();
                this.parts[i].length = 256;
                this.parts[i].ground = i*256;
                this.parts[i].ceiling = ((i+1)*this.partitionLength) - 1;
                this.parts[i].indx = i;
                this.parts[i].isEmpty = true;
            }
        }
        //loads to given partition
        public  load(code, partition): void {
            let myPart = partition;
            //counter for i
            let counter = this.parts[myPart].ground;
            //fill only the codes length worth of cells
            for(let i = 0; i < code.length; i++){
                _Memory.array[counter] = code[i];
                counter++
            }
            this.parts[myPart].isEmpty = false;

        }
    
        //get and return available partition
        public findEmptyPart(codeLen): any {
            var parts = this.parts;
            var result: number = null;

            //for loop to find an empty partition
            for(let i = 0; i < parts.length; i++){
                if(parts[i].isEmpty && this.partitionLength >= codeLen){
                    result = i;
                    return result;
                }
            }
            //if result is null, output to console and return null value for use elsewhere.
            if(result == null){
                console.log("No memory");
                _StdOut.putText("No memory!");
                _StdOut.advanceLine();
            }
            return result;
        }
        //checks if pc is within bounds of current partition
        public checkBounds(pc):boolean{
            var pcb = _ProcessManager.currentPCB;
            var part = pcb.partition;
            return pc + part.ground < part.ground + this.partitionLength
                && pc + part.ground >= part.ground;
        }

        //checks boundas and return string of address
        public readMem(pc){
            if(this.checkBounds(pc)){
                var str = "";
                str = str +  _Memory.array[_ProcessManager.currentPCB.partition.ground + pc];
                return  str;
            }
            return null;
        }
        //check bounds and set the memory array at the index plus the current partition's
        //ground to the value provided plus a hex check
        public write(addr, val: number){
            if(this.checkBounds(addr)){
                var part = _ProcessManager.currentPCB.partition;
                var valHx = _CPU.hexCheck(val);
                _Memory.array[part.ground + addr] = valHx + val.toString(16).toUpperCase();
            }
        }
        //clears an entire partition
        public clearPart(indx){
            var part = this.parts[indx];
            var partFloor = part.ground;
            var partCeiling = partFloor + 256;
            for(var i = partFloor; i < partCeiling; i++){
                _Memory.array[i] = "00";
            }
            this.parts[indx].isEmpty = true;
            Control.memViewUpdate();
        }

    }
}

