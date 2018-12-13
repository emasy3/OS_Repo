///<reference path="../globals.ts" />

module TSOS{
    export class Scheduler{
        public algorithm: number;
        public counter: number;
        public burst: number;
        public quantum: number;
        public isRunning: boolean;

        constructor(){
            this.isRunning = true;
            this.counter = 0;
            this.burst = 0;
            this.quantum = 6;
            this.algorithm = 1;
        }

        public check(){
            if(_ReadyQueue.q.length > 0){
                switch (this.algorithm) {
                    case 1: //Round Robin
                        if(this.counter >= this.quantum){
                            console.log("interrupt");
                            _KernelInterruptQueue.enqueue(new Interrupt(CONTEXTSWITCH_IRQ));
                            this.counter = 0;
                        }
                        this.counter++;
                        console.log("case 1");
                        break;
                    case 2://FCFS
                        this.counter++;
                        break;
                    case 3:// priority
                        console.log("Ready Quwuw before:" );
                        console.log(_ReadyQueue);
                        this.sortByPriority();
                        console.log("Ready Quwuw after:" );
                        console.log(_ReadyQueue);
                        break;
                }
                if(!_CPU.isExecuting){
                    TSOS.Scheduler.checkReady();
                }
            }
        }
        public static checkReady(){
            if(_ReadyQueue.getSize() > 0){
                _ProcessManager.runProcess();

            }else {
                _CPU.isExecuting = false;
            }
        }
        public sortByPriority(){
            if(_ReadyQueue.getSize() > 1) {
                _ReadyQueue.q.sort(function (a, b) {
                    return b.priority - a.priority;
                });
                //console.log("Ready Queue");
                //console.log(_ReadyQueue);
            }
        }

    }
}