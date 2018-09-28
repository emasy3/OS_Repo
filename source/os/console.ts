///<reference path="../globals.ts" />

/* ------------
     Console.ts

     Requires globals.ts

     The OS Console - stdIn and stdOut by default.
     Note: This is not the Shell. The Shell is the "command line interface" (CLI) or interpreter for this console.
     ------------ */

module TSOS {


    export class Console {

        constructor(public currentFont = _DefaultFontFamily,
                    public currentFontSize = _DefaultFontSize,
                    public currentXPosition = 0,
                    public currentYPosition = _DefaultFontSize,
                    public buffer = "",
                    public bufferCapt = [],
                    public recallIndx = 1,
                    public oldBuffer = "") {
        }

        public init(): void {
            this.clearScreen();
            this.resetXY();
        }

        private clearScreen(): void {
            _DrawingContext.clearRect(0, 0, _Canvas.width, _Canvas.height);
        }

        private resetXY(): void {
            this.currentXPosition = 0;
            this.currentYPosition = this.currentFontSize;
        }

        public handleInput(): void {
            while (_KernelInputQueue.getSize() > 0) {
                // Get the next character from the kernel input queue.
                var chr = _KernelInputQueue.dequeue();
                // Check to see if it's "special" (enter or ctrl-c) or "normal" (anything else that the keyboard device driver gave us).
                if (chr === String.fromCharCode(13)) { //     Enter key

                    //need this for command recall via the arrow keys
                    //every time the enter key is pressed we save the buffer
                    //we then add the save to the previous saves via concat
                    this.oldBuffer = this.buffer;                              //capture buffer and store
                    this.bufferCapt = this.bufferCapt.concat(this.oldBuffer);  //add to previous buffers to create Input String
                    this.recallIndx = 1;                                       //integer value to keep track of position when historyRecall is ran

                    // The enter key marks the end of a console command, so ...
                    // ... tell the shell ...
                    _OsShell.handleInput(this.buffer);
                    // ... and reset our buffer.
                    this.buffer = "";
                } else if (chr === String.fromCharCode(8)){  //backspace key
                    return this.delChar();                          //delchar deletes the last character
                }else if(chr === String.fromCharCode(9)){    //tab key
                    return this.matchComm();                        //function that looks for a command matching first two indicies
                } else if (chr === String.fromCharCode(37)){ //left arrow deterrent, used to avoid printing special chars
                    this.historyRecall(chr);
                } else if (chr === String.fromCharCode(38)) { //up arrow
                    this.historyRecall(chr);                         //history recall takes in a char and based on that moves up or down a stack of buffers
                } else if (chr === String.fromCharCode(39)) {//right arrow deterrent, used to avoid printing special chars
                    this.historyRecall(chr);
                } else if (chr === String.fromCharCode(40)) { //down arrow
                    this.historyRecall(chr);
                }
                else{
                    // This is a "normal" character, so ...
                    // ... draw it on the screen...
                    this.putText(chr);
                    // ... and add it to our buffer.
                    this.buffer += chr;
                }
                // TODO: Write a case for Ctrl-C.
            }
        }
        public historyRecall(chr): void{

            var arr2 = this.bufferCapt.toString();                    //set a string variable equal to our Input String we built above
            var arr = arr2.split( ',');                      //separate the Input String at each comma and change to an array
            var len = arr.length;
            var indx = len - this.recallIndx;                         //variable used to iterate over arr backward. recallIndx is a counter intially set to 1

            if(chr === String.fromCharCode(37)){                 //left arrow, must do this to overwrite key bindings to special chars
                console.log("Left Arrow");                             //Do something else in the future when shifted?
            }
            else if(chr === String.fromCharCode(38)){           //Up Arrow
                if(this.recallIndx < len) {                            //check that our counter: recallIndx(initially set to 1) is less then the length of our Input Array
                    if(this.buffer == arr[indx]){                      //check if the current buffer is equal to our buffer array at the indx value
                                                                            //so that we know if the user has iterrated to this value already and it is the end of the array
                                                                            //prevents printing twice when reiterating over array
                        indx = indx - 1;                               //bring the indx value down one
                        var ctx= _DrawingContext;
                        this.buffer=arr[indx];                         //reset buffer
                        this.currentXPosition = 0;                     //set current xposition to 0
                        var descent = ctx.fontDescent(this.currentFont, this.currentFontSize);
                                                                       //this seems complex but its really just the starting y point for clearing the screen
                        var rectY = this.currentYPosition + (this.currentFontSize - ctx.fontDescent(this.currentFont, this.currentFontSize));
                                                                       //how tall the letter is (i.e. how much to y space to clear)
                        var letrHeight = descent - this.currentFontSize - ctx.fontAscent(this.currentFont, this.currentFontSize) - (this.currentFontSize/4);
                                                                       //clear the letter
                        _DrawingContext.fontClear(this.currentXPosition, rectY, _Canvas.width, letrHeight, ctx);

                        this.putText(_OsShell.promptStr + arr[indx]);       //print to canvas
                        this.recallIndx += 1;                                    //add to recallIndx

                        //debugging purposes
                        console.log("Queue Value: " + this.buffer.toString());
                        console.log("Index Value: " + indx);
                        console.log("RecallIndex Value: " + this.recallIndx);
                        console.log("Length: " + len);
                    }else{                                              //when the above condition is not true do the following
                        var ctx = _DrawingContext;
                        this.buffer = "";                              //set buffer
                        this.buffer+=arr[indx];                        //add to it
                        this.currentXPosition = 0;

                                                                       //same as above
                        var descent = ctx.fontDescent(this.currentFont, this.currentFontSize);
                        var rectY = this.currentYPosition + (this.currentFontSize - ctx.fontDescent(this.currentFont, this.currentFontSize));
                        var letrHeight = descent - this.currentFontSize - ctx.fontAscent(this.currentFont, this.currentFontSize) - (this.currentFontSize/4);
                        _DrawingContext.fontClear(this.currentXPosition, rectY, _Canvas.width, letrHeight, ctx);

                        this.putText(_OsShell.promptStr + this.buffer.toString());
                        this.recallIndx += 1;

                        //debugging purposes
                        console.log("Queue Value: " + arr[indx]);
                        console.log("Index Value: " + indx);
                        console.log("RecallIndex Value: " + this.recallIndx);
                        console.log("Length: " + len);
                    }
                } else {                                                 //if the recallIndx is equal to len
                                                                         //meaning if indx is equal to 0 and recallIndx is equal to len
                                                                         //code is different from above in that it does not add to the recallIndx
                                                                         //indx is equal to zero so we dont want to add to the recallIndx
                                                                         //as this results in returning and undefined value
                    var ctx= _DrawingContext;
                    this.buffer = "";
                    this.buffer+=arr[indx];
                    this.currentXPosition = 0;
                    var descent = ctx.fontDescent(this.currentFont, this.currentFontSize);
                    var rectY = this.currentYPosition + (this.currentFontSize - ctx.fontDescent(this.currentFont, this.currentFontSize));
                    var letrHeight = descent - this.currentFontSize - ctx.fontAscent(this.currentFont, this.currentFontSize) - (this.currentFontSize/4);
                    _DrawingContext.fontClear(this.currentXPosition, rectY, _Canvas.width, letrHeight, ctx);

                    this.putText(_OsShell.promptStr + this.buffer.toString());

                    console.log("Queue Value: " + arr[indx]);
                    console.log("Index Value: " + indx);
                    console.log("RecallIndex Value: " + this.recallIndx);
                    console.log("Length: " + len);
                }
            }else if(chr === String.fromCharCode(39)){ //right, must do this to overwrite keybindings to special chars
                console.log("Right Arrow");
            }else if(chr === String.fromCharCode(40)){ //Down Arrow
                if(this.recallIndx > 1) {                     //check if the recallIndx is not 1, meaning up hasnt been called
                                                              //this code is different from the up arrow in two ways
                    indx = indx + 1;                          // we add to the indx so that we can eventually reach the end of the array(first element in recall)
                    var ctx= _DrawingContext;
                    this.buffer = "";
                    this.buffer+=arr[indx];
                    this.currentXPosition = 0;
                    var descent = ctx.fontDescent(this.currentFont, this.currentFontSize);
                    var rectY = this.currentYPosition + (this.currentFontSize - ctx.fontDescent(this.currentFont, this.currentFontSize));
                    var letrHeight = descent - this.currentFontSize - ctx.fontAscent(this.currentFont, this.currentFontSize) - (this.currentFontSize/4);
                    _DrawingContext.fontClear(this.currentXPosition, rectY, _Canvas.width, letrHeight, ctx);

                    this.putText(_OsShell.promptStr + this.buffer.toString());
                    this.recallIndx -= 1;                     //subtract from the recallIndx

                    console.log("Queue Value: " + arr[indx]);
                    console.log("Index Value: " + indx);
                    console.log("RecallIndex Value: " + this.recallIndx);
                    console.log("Length: " + len);

                }else if(this.buffer == ""){               //if the buffer is empty, i.e. up arrow has not been pressed yet
                    this.putText( "Use the up arrows to recall command history.");
                    this.advanceLine();
                    this.putText(_OsShell.promptStr);
                }
                else{                                        //otherwise if the recallIndx equals 1
                    var ctx= _DrawingContext;
                    this.buffer = "";
                    this.buffer+=arr[indx];
                    this.currentXPosition = 0;
                    var descent = ctx.fontDescent(this.currentFont, this.currentFontSize);
                    var rectY = this.currentYPosition + (this.currentFontSize - ctx.fontDescent(this.currentFont, this.currentFontSize));
                    var letrHeight = descent - this.currentFontSize - ctx.fontAscent(this.currentFont, this.currentFontSize) - (this.currentFontSize/4);
                    _DrawingContext.fontClear(this.currentXPosition, rectY, _Canvas.width, letrHeight, ctx);

                    this.putText(_OsShell.promptStr + this.buffer.toString());

                    console.log("Queue Value: " + arr[indx]);
                    console.log("Index Value: " + indx);
                    console.log(this.recallIndx);
                    console.log(len);
                }

            }
        }
        public putText(text): void {
            // My first inclination here was to write two functions: putChar() and putString().
            // Then I remembered that JavaScript is (sadly) untyped and it won't differentiate
            // between the two.  So rather than be like PHP and write two (or more) functions that
            // do the same thing, thereby encouraging confusion and decreasing readability, I
            // decided to write one function and use the term "text" to connote string or char.
            //
            // UPDATE: Even though we are now working in TypeScript, char and string remain undistinguished.
            //         Consider fixing that.
            if (text !== "") {
                // Draw the text at the current X and Y coordinates.
                _DrawingContext.drawText(this.currentFont, this.currentFontSize, this.currentXPosition, this.currentYPosition, text);
                // Move the current X position.
                var offset = _DrawingContext.measureText(this.currentFont, this.currentFontSize, text);
                this.currentXPosition = this.currentXPosition + offset;
            }
         }

        public advanceLine(num?): void {
            for(var i: number = 0; i <= num; i++){
                this.advanceLine();
            }
            this.currentXPosition = 0;
            /*
             * Font size measures from the baseline to the highest point in the font.
             * Font descent measures from the baseline to the lowest point in the font.
             * Font height margin is extra spacing between the lines.
             */
            this.currentYPosition += _DefaultFontSize +
                                     _DrawingContext.fontDescent(this.currentFont, this.currentFontSize) +
                                     _FontHeightMargin;

            // TODO: Handle scrolling. (iProject 1)
            var changeYPosition = this.currentYPosition + _DefaultFontSize +
                _DrawingContext.fontDescent(this.currentFont, this.currentFontSize) +
                _FontHeightMargin;                                                    //changes the y position

            if(this.currentYPosition > 400){                                         //if the y position is greater than the height of the canvas
                var savedImg = _DrawingContext.canvas.toDataURL();                   //save an image of the canvas
                _DrawingContext.canvas.height = changeYPosition + 1;                 //reset the canvas height
                var newImg = new Image();
                newImg.src = savedImg;                                               //source our new image
                newImg.onload = function () {
                    _DrawingContext.drawImage(newImg, 0, 0);              //draw on load
                }
            }
            document.getElementById("divConsole").scrollTop = changeYPosition; //scroll to ypos
        }

        public delChar(): void {
            var finalIndx = this.buffer[this.buffer.length - 1];                     //save final indx
            this.buffer = this.buffer.slice(0,-1);                                   //cut character from buffer
            var ctx= _DrawingContext;

            //clear letter from canvas
            var letrWidth = ctx.measureText(this.currentFont, this.currentFontSize, finalIndx);
            this.currentXPosition = this.currentXPosition - letrWidth;
            var descent = ctx.fontDescent(this.currentFont, this.currentFontSize);
            var letrHeight = descent - this.currentFontSize - ctx.fontAscent(this.currentFont, this.currentFontSize) - (this.currentFontSize/4);

            var rectX = this.currentXPosition;
            var rectY = this.currentYPosition + (this.currentFontSize - ctx.fontDescent(this.currentFont, this.currentFontSize));

            _DrawingContext.fontClear(rectX, rectY, letrWidth, letrHeight, ctx);
        }

        static genCommands(a): any {                                       //helper function that makes an array of command attributes and returns it
            for (var i =0; i < _OsShell.commandList.length; i++){
                var holder = _OsShell.commandList[i];
                var command = holder.command;
                a.push(command);
            }
            return a;
        }
                                                //make this command more efficient
        public matchComm(): void {              //function to check if the current buffer matches a command in our gencommand list
            var a = [];
            var commands = TSOS.Console.genCommands(a);
            var b = this.buffer;
            var startingChar = b[0];
            var ctx= _DrawingContext;
            var rectY = this.currentYPosition + (this.currentFontSize - ctx.fontDescent(this.currentFont, this.currentFontSize));
            console.log(startingChar);


            for(let i =0; i < commands.length; i++) { //for all commands in our list check if its first two characters match a command
                let com = commands[i];
                if (startingChar == com.charAt(0)) {
                    if (b[1] == com.charAt(1)) {
                        this.buffer = "";
                        this.buffer+=com.toString();
                        this.currentXPosition = 0;
                        var descent = ctx.fontDescent(this.currentFont, this.currentFontSize);
                        var letrHeight = descent - this.currentFontSize - ctx.fontAscent(this.currentFont, this.currentFontSize) - (this.currentFontSize/4);
                        _DrawingContext.fontClear(this.currentXPosition, rectY, _Canvas.width, letrHeight, ctx);

                        this.putText(_OsShell.promptStr + com.toString());
                    } else {
                        console.log("No match for: " + b[1] + " " + com.toString());
                    }
                }else{ console.log("no match for " + startingChar + " " + com.toString());
                }
            }
        }
    }
 }
