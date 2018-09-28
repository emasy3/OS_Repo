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
            // ps  - list the running processes and their IDs
            // kill <id> - kills the specified process id.

            //
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

        public shellLoad(){
            //load user input and check that its hex
            var doc = (<HTMLInputElement> document.getElementById("taProgramInput")).value; //get value of doc
            var a = doc.toString();
            var arr = [a][0];
            var isValid = true;
            var endOf = false;
            var current;

            if(a.length > 0){
                while(isValid && !endOf){
                    for(let i = 0; i < arr.length; i++){
                        switch (arr[i]) {
                            case "0":                                               //check the current value
                                current = 0;                                       //set our holder
                                console.log(current);                               //debugging
                                if(i == (arr.length -1)){endOf = true;}            //check if i is the size of length-1
                                break;                                             //and set our boolean to stop while
                            case "1":
                                current = 1;
                                console.log(current);
                                if(i == (arr.length -1)){endOf = true;}
                                break;
                            case "2":
                                current = 2;
                                console.log(current);
                                if(i == (arr.length -1)){endOf = true;}
                                break;
                            case "3":
                                current = 3;
                                console.log(current);
                                if(i == (arr.length -1)){endOf = true;}
                                break;
                            case "4":
                                current = 4;
                                console.log(current);
                                if(i == (arr.length -1)){endOf = true;}
                                break;
                            case "5":
                                current = 5;
                                console.log(current);
                                if(i == (arr.length -1)){endOf = true;}
                                break;
                            case "6":
                                current = 6;
                                console.log(current);
                                if(i == (arr.length -1)){endOf = true;}
                                break;
                            case "7":
                                current = 7;
                                console.log(current);
                                if(i == (arr.length -1)){endOf = true;}
                                break;
                            case "8":
                                current = 8;
                                console.log(current);
                                if(i == (arr.length -1)){endOf = true;}
                                break;
                            case "9":
                                current = 9;
                                console.log(current);
                                if(i == (arr.length -1)){endOf = true;}
                                break;
                            case "A":
                                current = 10;
                                console.log(current);
                                if(i == (arr.length -1)){endOf = true;}
                                break;
                            case "B":
                                current = 11;
                                console.log(current);
                                if(i == (arr.length -1)){endOf = true;}
                                break;
                            case "C":
                                current = 12;
                                console.log(current);
                                if(i == (arr.length -1)){endOf = true;}
                                break;
                            case "D":
                                current = 13;
                                console.log(current);
                                if(i == (arr.length -1)){endOf = true;}
                                break;
                            case "E":
                                current = 14;
                                console.log(current);
                                if(i == (arr.length -1)){endOf = true;}
                                break;
                            case "F":
                                current = 15;
                                console.log(current);
                                if(i == (arr.length -1)){endOf = true;}
                                break;
                            case " ":
                                current = " ";
                                console.log(current);
                                if(i == (arr.length -1)){endOf = true;}
                                break;

                            default:
                                isValid = false;
                                current = arr[i].toString();
                                if(i == (arr.length -1)){endOf = true;}
                                break;
                        }
                    }
                }
                //if we run into a character we dont have a case for, i.e. the default
                if(!isValid){
                    _StdOut.putText("Invalid Program Data at: ");
                    _StdOut.advanceLine();
                    _StdOut.putText("   Instance: " + current);
                    _StdOut.advanceLine();
                }else{
                    console.log(arr);
                    _StdOut.putText("Program input accepted");
                }
            }
        }

    }
}
