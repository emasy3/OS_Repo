//
// glados.js - It's for testing. And enrichment.
//


function Glados() {
   this.version = 2112;

   this.init = function() {
      var msg = "Hello [subject name here]. Let's test project ZERO.\n";
      msg += "Before we start, however, keep in mind that although fun and learning are our primary goals, serious injuries may occur. ";
      msg += "Cake, and grief counseling, will be available at the conclusion of the test.";
      alert(msg);
   };

   this.afterStartup = function() {

      // Test the 'ver' command.
      _KernelInputQueue.enqueue('v');
      _KernelInputQueue.enqueue('e');
      _KernelInputQueue.enqueue('r');
		TSOS.Kernel.prototype.krnInterruptHandler(KEYBOARD_IRQ, [13, false]);

       // Test alternate command 'vers90j'.
       _KernelInputQueue.enqueue('v');
       _KernelInputQueue.enqueue('e');
       _KernelInputQueue.enqueue('r');
       _KernelInputQueue.enqueue('s');
       _KernelInputQueue.enqueue('i');
       _KernelInputQueue.enqueue('o');
       _KernelInputQueue.enqueue('n');
       TSOS.Kernel.prototype.krnInterruptHandler(KEYBOARD_IRQ, [13, false]);

       // Test alternate command 'v'.
       _KernelInputQueue.enqueue('v');
       TSOS.Kernel.prototype.krnInterruptHandler(KEYBOARD_IRQ, [13, false]);




   };
}