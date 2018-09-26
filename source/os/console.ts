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
                    // The enter key marks the end of a console command, so ...
                    //capture buffer
                    this.oldBuffer = this.buffer;
                    this.bufferCapt = this.bufferCapt.concat(this.oldBuffer);
                    this.recallIndx = 1;

                    // ... tell the shell ...
                    _OsShell.handleInput(this.buffer);
                    // ... and reset our buffer.
                    this.buffer = "";
                } else if (chr === String.fromCharCode(8)){
                    return this.delChar();
                }else if(chr === String.fromCharCode(9)){
                    return this.matchComm();
                } else if (chr === String.fromCharCode(37)){
                    this.historyRecall(chr);
                } else if (chr === String.fromCharCode(38)) {
                    this.historyRecall(chr);
                } else if (chr === String.fromCharCode(39)) {
                    this.historyRecall(chr);
                } else if (chr === String.fromCharCode(40)) {
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
            var arr2 = this.bufferCapt.toString();
            //arr3.concat();
            var arr = [arr2.split( ',')];
            var arr3 = arr[0].concat();
            var len = arr3.length;
            var indx = len - this.recallIndx;
            var arr5 = this.oldBuffer.toString();
            console.log(arr5);

            if(chr === String.fromCharCode(37)){
                console.log("Left Arrow");
            }
            else if(chr === String.fromCharCode(38)){
                if(this.recallIndx < len) {
                    if(this.buffer == arr3[indx]){
                        indx = indx - 1;
                        var ctx= _DrawingContext;
                        this.buffer+=arr3[indx];
                        this.currentXPosition = 0;
                        var descent = ctx.fontDescent(this.currentFont, this.currentFontSize);
                        var rectY = this.currentYPosition + (this.currentFontSize - ctx.fontDescent(this.currentFont, this.currentFontSize));
                        var letrHeight = descent - this.currentFontSize - ctx.fontAscent(this.currentFont, this.currentFontSize) - (this.currentFontSize/4);
                        _DrawingContext.fontClear(this.currentXPosition, rectY, _Canvas.width, letrHeight, ctx);

                        this.putText(_OsShell.promptStr + this.buffer.toString());
                        this.recallIndx += 1;
                        console.log("Queue Value: " + arr3[indx]);
                        console.log("Index Value: " + indx);
                        console.log("RecallIndex Value: " + this.recallIndx);
                        console.log("Length: " + len);
                    }else {
                        var ctx= _DrawingContext;
                        this.buffer = "";
                        this.buffer+=arr3[indx];
                        this.currentXPosition = 0;
                        var descent = ctx.fontDescent(this.currentFont, this.currentFontSize);
                        var rectY = this.currentYPosition + (this.currentFontSize - ctx.fontDescent(this.currentFont, this.currentFontSize));
                        var letrHeight = descent - this.currentFontSize - ctx.fontAscent(this.currentFont, this.currentFontSize) - (this.currentFontSize/4);
                        _DrawingContext.fontClear(this.currentXPosition, rectY, _Canvas.width, letrHeight, ctx);

                        this.putText(_OsShell.promptStr + this.buffer.toString());
                        this.recallIndx += 1;
                        console.log("Queue Value: " + arr3[indx]);
                        console.log("Index Value: " + indx);
                        console.log("RecallIndex Value: " + this.recallIndx);
                        console.log("Length: " + len);
                    }
                } else {
                    var ctx= _DrawingContext;
                    this.buffer = "";
                    this.buffer+=arr3[indx];
                    this.currentXPosition = 0;
                    var descent = ctx.fontDescent(this.currentFont, this.currentFontSize);
                    var rectY = this.currentYPosition + (this.currentFontSize - ctx.fontDescent(this.currentFont, this.currentFontSize));
                    var letrHeight = descent - this.currentFontSize - ctx.fontAscent(this.currentFont, this.currentFontSize) - (this.currentFontSize/4);
                    _DrawingContext.fontClear(this.currentXPosition, rectY, _Canvas.width, letrHeight, ctx);

                    this.putText(_OsShell.promptStr + this.buffer.toString());

                    console.log("Queue Value: " + arr3[indx]);
                    console.log("Index Value: " + indx);
                    console.log("RecallIndex Value: " + this.recallIndx);
                    console.log("Length: " + len);
                }
            }else if(chr === String.fromCharCode(39)){
                console.log("Right Arrow");
            }else if(chr === String.fromCharCode(40)){
                console.log("Down Arrow");
                if(this.recallIndx > 1) {

                    indx = indx + 1;
                    var ctx= _DrawingContext;
                    this.buffer = "";
                    this.buffer+=arr3[indx];
                    this.currentXPosition = 0;
                    var descent = ctx.fontDescent(this.currentFont, this.currentFontSize);
                    var rectY = this.currentYPosition + (this.currentFontSize - ctx.fontDescent(this.currentFont, this.currentFontSize));
                    var letrHeight = descent - this.currentFontSize - ctx.fontAscent(this.currentFont, this.currentFontSize) - (this.currentFontSize/4);
                    _DrawingContext.fontClear(this.currentXPosition, rectY, _Canvas.width, letrHeight, ctx);
                    this.putText(_OsShell.promptStr + this.buffer.toString());
                    this.recallIndx -= 1;
                    console.log("Queue Value: " + arr3[indx]);
                    console.log("Index Value: " + indx);
                    console.log("RecallIndex Value: " + this.recallIndx);
                    console.log("Length: " + len);

                }else{
                    var ctx= _DrawingContext;
                    this.buffer = "";
                    this.buffer+=arr3[indx];
                    this.currentXPosition = 0;
                    var descent = ctx.fontDescent(this.currentFont, this.currentFontSize);
                    var rectY = this.currentYPosition + (this.currentFontSize - ctx.fontDescent(this.currentFont, this.currentFontSize));
                    var letrHeight = descent - this.currentFontSize - ctx.fontAscent(this.currentFont, this.currentFontSize) - (this.currentFontSize/4);
                    _DrawingContext.fontClear(this.currentXPosition, rectY, _Canvas.width, letrHeight, ctx);

                    this.putText(_OsShell.promptStr + this.buffer.toString());

                    console.log("Queue Value: " + arr3[indx]);
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

        public advanceLine(): void {
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
                _FontHeightMargin;

            if(this.currentYPosition > 400){
                var savedImg = _DrawingContext.canvas.toDataURL();
                _DrawingContext.canvas.height = changeYPosition + 3;
                var newImg = new Image();
                newImg.src = savedImg;
                newImg.onload = function () {
                    _DrawingContext.drawImage(newImg, 0, 0);
                }
            }
            document.getElementById("divConsole").scrollTop = changeYPosition;
        }

        public delChar(): void {
            var finalIndx = this.buffer[this.buffer.length - 1];
            this.buffer = this.buffer.slice(0,-1);
            var ctx= _DrawingContext;

            var letrWidth = ctx.measureText(this.currentFont, this.currentFontSize, finalIndx);
            this.currentXPosition = this.currentXPosition - letrWidth;
            var descent = ctx.fontDescent(this.currentFont, this.currentFontSize);
            var letrHeight = descent - this.currentFontSize - ctx.fontAscent(this.currentFont, this.currentFontSize) - (this.currentFontSize/4);

            var rectX = this.currentXPosition;
            var rectY = this.currentYPosition + (this.currentFontSize - ctx.fontDescent(this.currentFont, this.currentFontSize));

            _DrawingContext.fontClear(rectX, rectY, letrWidth, letrHeight, ctx);
        }

        public genCommands(a) {
            for (var i =0; i < _OsShell.commandList.length; i++){
                var holder = _OsShell.commandList[i];
                var command = holder.command;
                a.push(command);
            }
            return a;
        }
        public matchComm(): void {
            var a = [];
            var commands = this.genCommands(a);
            var b = this.buffer;
            var startingChar = b[0];
            var ctx= _DrawingContext;
            var rectY = this.currentYPosition + (this.currentFontSize - ctx.fontDescent(this.currentFont, this.currentFontSize));
            console.log(startingChar);


            for(let i =0; i < commands.length; i++) {
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
