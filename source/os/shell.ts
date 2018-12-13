///<reference path="../globals.ts" />
///<reference path="../utils.ts" />
///<reference path="shellCommand.ts" />
///<reference path="userCommand.ts" />


/* ------------
   Shell.ts

   The OS Shell - The "command line interface" (CLI) for the console.

    Note: While fun and learning are the primary goals of all enrichment center activities,
          serious injuries may occur when trying to write your own Operating System.
   ------------ */

// TODO: Write a base class / prototype for system services and let Shell inherit from it.

module TSOS {
    export class Shell {
        // Properties
        public promptStr = ">";
        public commandList = [];
        public curses = "[fuvg],[cvff],[shpx],[phag],[pbpxfhpxre],[zbgureshpxre],[gvgf]";
        public apologies = "[sorry]";
        public shellState = "Running";

        constructor() {
        }

        public init() {
            var sc;
            var date = Date();
            document.getElementById("dateText").innerHTML = "Date: " + date;
            document.getElementById("statusText").innerHTML = "Status: " + this.shellState;
            //
            // Load the command list.

            // ver with alternate command options
            sc = new ShellCommand(this.shellVer,
                                 "ver",
                                 "- Displays the current version data.",
                                 "version",
                                 "v",
                                "   - Alternatives: v and version");
            this.commandList[this.commandList.length] = sc;

            // help
            sc = new ShellCommand(this.shellHelp,
                                  "help",
                                  "- This is the help command. Seek help.");
            this.commandList[this.commandList.length] = sc;

            // shutdown
            sc = new ShellCommand(this.shellShutdown,
                                  "shutdown",
                                  "- Shuts down the virtual OS but leaves the underlying host / hardware simulation running.");
            this.commandList[this.commandList.length] = sc;

            // cls
            sc = new ShellCommand(this.shellCls,
                                  "cls",
                                  "- Clears the screen and resets the cursor position.");
            this.commandList[this.commandList.length] = sc;

            // man <topic>
            sc = new ShellCommand(this.shellMan,
                                  "man",
                                  "<topic> - Displays the MANual page for <topic>.");
            this.commandList[this.commandList.length] = sc;

            // trace <on | off>
            sc = new ShellCommand(this.shellTrace,
                                  "trace",
                                  "<on | off> - Turns the OS trace on or off.");
            this.commandList[this.commandList.length] = sc;

            // rot13 <string>
            sc = new ShellCommand(this.shellRot13,
                                  "rot13",
                                  "<string> - Does rot13 obfuscation on <string>.");
            this.commandList[this.commandList.length] = sc;

            // prompt <string>
            sc = new ShellCommand(this.shellPrompt,
                                  "prompt",
                                  "<string> - Sets the prompt.");
            this.commandList[this.commandList.length] = sc;

             //Date
            sc = new ShellCommand(this.shellDate,
                                    "date",
                                   "- Displays the date and time.");
            this.commandList[this.commandList.length] = sc;

            //Wherami
            sc = new ShellCommand(this.shellWhereami,
                                     "whereami",
                                    "- Displays where user is in file hierarchy.");
            this.commandList[this.commandList.length] = sc;

            //magic8 ball
            // language=HTML
            sc = new ShellCommand(TSOS.Shell.shellMagic,
                                     "magic8",
                                    "<string> - A magic8 ball.",
                                    null,
                                    null,
                                   "   - Type magic8 followed by a question/statement.");
            this.commandList[this.commandList.length] = sc;

            //status
            sc = new ShellCommand(this.shellStatus,
                                     "status",
                                    "<string> - Displays user set status");
            this.commandList[this.commandList.length] = sc;

            //blue screen of death
            sc = new ShellCommand(this.shellBlue,
                                    "bsod",
                                   "<string> - Displays blue screen of death");
            this.commandList[this.commandList.length] = sc;

            //load
            sc = new ShellCommand(this.shellLoad,
                                    "load",
                                   "<string> - Validates user code");
            this.commandList[this.commandList.length] = sc;

            //run
            sc = new ShellCommand(this.shellRun,
                                    "run",
                                    "<string> - runs user code");
            this.commandList[this.commandList.length] = sc;
            //clear memory
            sc = new ShellCommand(this.shellClearMem,
                                    "clearmem",
                                    "<string> - clear partitions");
            this.commandList[this.commandList.length] = sc;
            //runall
            sc = new ShellCommand(this.shellRunAll,
                                    "runall",
                                    "<string> - run all programs loaded in memory or disk");
            this.commandList[this.commandList.length] = sc;
            // ps  - list the running processes and their IDs
            sc = new ShellCommand(this.shellPs,
                                    "ps",
                                    "<string> - show all programs loaded in memory or disk");
            this.commandList[this.commandList.length] = sc;

            // kill <id> - kills the specified process id.
            sc = new ShellCommand(this.shellKill,
                                    "kill",
                                    "<id> - show all programs loaded in memory or disk");
            this.commandList[this.commandList.length] = sc;
            // quantum <int> — let the user set the Round Robin quantum (measured in cpu cycles)
            sc = new ShellCommand(this.shellSetSchedule,
                                "setschedule",
                                "<id> - show all programs loaded in memory or disk");
            this.commandList[this.commandList.length] = sc;
            //setschedule algorithm
            sc = new ShellCommand(this.shellSetQuantum,
                                    "quantum",
                                    "<id> - show all programs loaded in memory or disk");
            this.commandList[this.commandList.length] = sc;

            // Display the initial prompt.
            this.putPrompt();
        }

        public putPrompt() {
            _StdOut.putText(this.promptStr);
        }

        public handleInput(buffer) {
            _Kernel.krnTrace("Shell Command~" + buffer);
            //
            // Parse the input...
            //
            var userCommand = this.parseInput(buffer);
            // ... and assign the command and args to local variables.
            var cmd = userCommand.command;
            var args = userCommand.args;
            //
            // Determine the command and execute it.
            //
            // TypeScript/JavaScript may not support associative arrays in all browsers so we have to iterate over the
            // command list in attempt to find a match.  TODO: Is there a better way? Probably. Someone work it out and tell me in class.
            var index: number = 0;
            var found: boolean = false;
            var fn = undefined;
            while (!found && index < this.commandList.length) {
                switch(cmd){
                    case this.commandList[index].command:{
                        found = true;
                        fn = this.commandList[index].func;
                        break;
                    }
                    case this.commandList[index].command1:{
                        found = true;
                        fn = this.commandList[index].func;
                        break;
                    }
                    case this.commandList[index].command2:{
                        found = true;
                        fn = this.commandList[index].func;
                        break;
                    }

                    default: {
                        ++index;
                        break;
                    }
                }
            }
            if (found) {
                this.execute(fn, args);
            } else {
                // It's not found, so check for curses and apologies before declaring the command invalid.
                if (this.curses.indexOf("[" + Utils.rot13(cmd) + "]") >= 0) {     // Check for curses.
                    this.execute(this.shellCurse);
                } else if (this.apologies.indexOf("[" + cmd + "]") >= 0) {        // Check for apologies.
                    this.execute(this.shellApology);
                } else { // It's just a bad command. {
                    this.execute(this.shellInvalidCommand);
                }
            }
        }

        // Note: args is an option parameter, ergo the ? which allows TypeScript to understand that.
        public execute(fn, args?) {
            // We just got a command, so advance the line...
            _StdOut.advanceLine();
            // ... call the command function passing in the args with some über-cool functional programming ...
            fn(args);
            // Check to see if we need to advance the line again
            if (_StdOut.currentXPosition > 0) {
                _StdOut.advanceLine();
            }
            // ... and finally write the prompt again.
            this.putPrompt();
        }

        public parseInput(buffer): UserCommand {
            var retVal = new UserCommand();

            // 1. Remove leading and trailing spaces.
            buffer = Utils.trim(buffer);

            // 2. Lower-case it.
            buffer = buffer.toLowerCase();

            // 3. Separate on spaces so we can determine the command and command-line args, if any.
            var tempList = buffer.split(" ");

            // 4. Take the first (zeroth) element and use that as the command.
            var cmd = tempList.shift();  // Yes, you can do that to an array in JavaScript.  See the Queue class.
            // 4.1 Remove any left-over spaces.
            cmd = Utils.trim(cmd);
            // 4.2 Record it in the return value.
            retVal.command = cmd;

            // 5. Now create the args array from what's left.
            for (var i in tempList) {
                var arg = Utils.trim(tempList[i]);
                if (arg != "") {
                    retVal.args[retVal.args.length] = tempList[i];
                }
            }
            return retVal;
        }

        //
        // Shell Command Functions.  Kinda not part of Shell() class exactly, but
        // called from here, so kept here to avoid violating the law of least astonishment.
        //
        public shellInvalidCommand() {
            _StdOut.putText("Invalid Command. ");
            if (_SarcasticMode) {
                _StdOut.putText("Unbelievable. You, [subject name here],");
                _StdOut.advanceLine();
                _StdOut.putText("must be the pride of [subject hometown here].");
            } else {
                _StdOut.putText("Type 'help' for, well... help.");
            }
        }

        public shellCurse() {
            _StdOut.putText("Oh, so that's how it's going to be, eh? Fine.");
            _StdOut.advanceLine();
            _StdOut.putText("Bitch.");
            _SarcasticMode = true;
        }

        public shellApology() {
           if (_SarcasticMode) {
              _StdOut.putText("I think we can put our differences behind us.");
              _StdOut.advanceLine();
              _StdOut.putText("For science . . . You monster.");
              _SarcasticMode = false;
           } else {
              _StdOut.putText("For what?");
           }
        }

        public shellVer(args) {
            _StdOut.putText(APP_NAME + " version " + APP_VERSION);
        }

        public shellHelp(args) {
            _StdOut.putText("Commands:");
            for (var i in _OsShell.commandList) {
                _StdOut.advanceLine();
                if(_OsShell.commandList[i].description1){
                    _StdOut.putText("  " + _OsShell.commandList[i].command + " " + _OsShell.commandList[i].description);
                    _StdOut.advanceLine();
                    _StdOut.putText("  " + _OsShell.commandList[i].description1);
                }else{
                    _StdOut.putText("  " + _OsShell.commandList[i].command + " " + _OsShell.commandList[i].description);
                }
            }
        }

        public shellShutdown(args) {
             _StdOut.putText("Shutting down...");
             // Call Kernel shutdown routine.
            _Kernel.krnShutdown();
            // TODO: Stop the final prompt from being displayed.  If possible.  Not a high priority.  (Damn OCD!)
        }

        public shellCls(args) {
            _StdOut.clearScreen();
            _StdOut.resetXY();
        }

        public shellMan(args) {
            if (args.length > 0) {
                switch (args[0]) {
                    case "help":
                        _StdOut.putText("Help displays a list of (hopefully) valid commands.");
                        break;
                    // TODO: Make descriptive MANual page entries for the the rest of the shell commands here.
                    default:
                        _StdOut.putText("No manual entry for " + args[0] + ".");
                }
            } else {
                _StdOut.putText("Usage: man <topic>  Please specify a topic.");
            }
        }

        public shellTrace(args) {
            if (args.length > 0) {
                var setting = args[0];
                switch (setting) {
                    case "on":
                        if (_Trace && _SarcasticMode) {
                            _StdOut.putText("Trace is already on, doofus.");
                        } else {
                            _Trace = true;
                            _StdOut.putText("Trace ON");
                        }
                        break;
                    case "off":
                        _Trace = false;
                        _StdOut.putText("Trace OFF");
                        break;
                    default:
                        _StdOut.putText("Invalid arguement.  Usage: trace <on | off>.");
                }
            } else {
                _StdOut.putText("Usage: trace <on | off>");
            }
        }

        public shellRot13(args) {
            if (args.length > 0) {
                // Requires Utils.ts for rot13() function.
                _StdOut.putText(args.join(' ') + " = '" + Utils.rot13(args.join(' ')) +"'");
            } else {
                _StdOut.putText("Usage: rot13 <string>  Please supply a string.");
            }
        }

        public shellPrompt(args) {
            if (args.length > 0) {
                _OsShell.promptStr = args[0];
            } else {
                _StdOut.putText("Usage: prompt <string>  Please supply a string.");
            }
        }

        public shellDate(args) {
            let d = Date();
            _StdOut.putText("The date is " + d.toString()); //prints date
        }

        public shellWhereami(args){
            _StdOut.putText("root/"); //placeholder command for something more substantial
        }

        static shellMagic(args){
            //creates an 8 ball array if args is not empty and if the buffer ends with a question mark
            if((args.length > 0) && (_Console.buffer[_Console.buffer.length -1] == "?")){
                let sides = ["Don't count on it.", "As I see it, yes.",
                    "It is certain", "Reply hazy, try again.", "My reply is no.",
                    "Most likely", "It is decidedly so.", "Ask again later",
                    "My sources say no.", "Outlook good.", "Without a doubt.",
                    "Better not tell you now.", "Outlook not so good.", "Signs point to yes.",
                    "Yes - definitely.", "Cannot predict now.", "Very doubtful", "Yes",
                    "You may rely on it.", "Concentrate and ask again."];
                let selector = sides[Math.floor(Math.random()*sides.length)]; //performs a random selection
                _StdOut.putText(selector);                                       //prints selection
                //debug
                console.log(_Console.buffer);
            }else{
                console.log("No parameter found for " + args[0]);
                console.log(args[0]);
                _StdOut.putText("Please end the command with a question. ex: \'me?\'");
            }
        }

        public shellStatus(args){
                                                            //command to be changed, sets status to whatever is specified, otherwise its running.
            let myState = this.shellState;
            if(args.length > 0){
                let sent = "";
                for( let i = 0; i < args.length; i++){
                    sent = sent + args[i] + " ";

                }
                document.getElementById("statusText").innerHTML = "Status: " + sent;
            } else {
                _StdOut.putText("Usage: status <string>  Please specify a string.");
                document.getElementById("statusText").innerHTML = "Status: " + myState;

            }
        }

        public shellBlue(){
            var msg = "Your system has ran into a problem and needs to restart.";    //bsod
            _Kernel.krnTrapError(msg);
        }

        public shellLoad(args?){
            //console.log(_Memory.array);
            //load user input and check that its hex
            var doc = (<HTMLInputElement> document.getElementById("taProgramInput")).value; //get value of doc
            doc = doc.replace(/\r?\n|\r/g, " ");
            doc = doc.replace(/\s+/g, " ").trim();
            //regular expression used for testing whether user code is valid
            var regX = /^[\d\sa-fA-F]+$/;
            var isValid = true;
            //array obtained from doc splitting at spaces
            var arr = doc.split(" ");
            var priority: number = 0;
            //check priority length for validity
            if (args.length > 1) {
                _StdOut.putText("Please supply a valid priority number (0 is highest, 1 is default).");
                return;
            }
            if (args.length == 1) {
                if (!args[0].match(/^[0-9]\d*$/)) {
                    _StdOut.putText("Please supply a valid priority number (0 is highest, 1 is default).");
                    return;
                }else{
                    priority = args[0];
                }
            }
            //test for invalid character
            for(var i = 0; i < arr.length; i++){
                var byteCode = arr[i];
                //regx from above used to tes our bytecode array
                if((regX.test(byteCode) && byteCode.length == 2)){
                    /*console.log("Valid byte: " + byteCode)*/
                }else{
                    isValid = false;
                    _StdOut.putText("Invalid Code: " + byteCode);
                    return;
                }
            }
            //check validity marker
            if(isValid){
                _StdOut.putText("Code accepted.. attempting to creating Process");
                _StdOut.advanceLine(1);
                //create new process
                var program = _ProcessManager.newProcess(arr, priority);
                Control.memViewUpdate();
                Control.pcbViewUpdate();
                //console.log(program);
                //console.log(_ResidentQueue);
            }
        }

        public shellRun(args){
            //check for a pid
            if(args.length > 0){
                //used for debug
                var found = false;
                for(var i = 0; i <  _ResidentQueue.getSize(); i++){
                    if(_ResidentQueue.q[i].pId == args){
                        //check if the process is finished(killed)
                        if(_ResidentQueue.q[i].prState == "finished"){
                            return _StdOut.putText("Will not run. Process: "+ _ResidentQueue.q[i].pId + " is finished");
                        }
                        //add to ready queue if found
                        _ReadyQueue.enqueue(_ResidentQueue.q[i]);
                        found = true;
                        break;
                        //_CPU.cycle(_ResidentQueue.q[i], _ResidentQueue.q[i]);
                    }
                }
                if(found == false){
                    _StdOut.putText("Program id: " + args.toString() +" is invalid.");
                }
            }else {
                _StdOut.putText("error");
            }
        }
        public shellClearMem(){
            _StdOut.putText("Clearing memory");
            _StdOut.advanceLine();
            for(var i = 0; i < _MemoryManager.parts.length; i++){
                _MemoryManager.clearPart(0);
                _StdOut.putText("...");
                _StdOut.putText(" ");
            }
            _StdOut.advanceLine();
            _StdOut.putText("Memory cleared");
        }
        public shellRunAll(){
            //_Scheduler.sortByPriority();
            for(var i = 0; i < _ResidentQueue.q.length; i++){
                if(_ResidentQueue.q[i].prState == "new"){
                    _ResidentQueue.q[i].prState = "ready";
                    _ReadyQueue.enqueue(_ResidentQueue.q[i]);

                }
            }
            if(_ResidentQueue.q.length == 0){
                _StdOut.putText("No new programs to run");
            }
            //_Scheduler.sortByPriority();
        }
        public shellPs(){
            for(var i = 0; i < _ResidentQueue.q.length; i++){
                _StdOut.putText(String("Program "+ _ResidentQueue.q[i]) + " loaded in " + _ResidentQueue.q[i].location.toString());
                _StdOut.advanceLine(1);

            }
            if(_ResidentQueue.q.length == 0){
                _StdOut.putText("No processes in job Queue.");
                _StdOut.advanceLine();
                _StdOut.putText("Run load to load a program into memory.");
                _StdOut.advanceLine();
            }
        }
        public shellKill(args){
            if(args.length > 2){
                _StdOut.putText("Please supply a valid pid in decimal 0-9.");
            }else if(args.length < 3){
                _ProcessManager.killProcess(args);
            }
        }
        public shellSetSchedule(args){
            if(args.length == 0){
                _StdOut.putText("Please enter a valid scheduler");
                _StdOut.advanceLine();
                _StdOut.putText("rr - round robin");
                _StdOut.advanceLine();
                _StdOut.putText("fcfs - first come first served");
                _StdOut.advanceLine();
                _StdOut.putText("priority - priority");
            }else{
                switch (args.toString()) {
                    case "rr":
                        _Scheduler.algorithm = 1; //round robin
                        _StdOut.putText("Scheduler set to robin");
                        break;
                    case "fcfs":
                        _Scheduler.algorithm = 2;
                        _StdOut.putText("Scheduler set to first come first serve");
                        break;
                    case "priority":
                        _Scheduler.algorithm = 3;
                        _StdOut.putText("Scheduler set to priority");
                        break;
                    default:
                        console.log("default");
                        break;
                }
            }

        }
        public shellSetQuantum(args){
            if(/^\d+$/.test(args)){
                console.log("working");
                _Scheduler.quantum = Number(args);
                console.log(_Scheduler.quantum);

            }else {
                _StdOut.putText("Please supply a vlid quantum");
            }
        }
    }
}
