module TSOS {
    export class ShellCommand {
        constructor(public func: any,
                    public command,
                    public description = "",
                    public command1?,
                    public command2?,
                    public description1?) {
        }
    }
}
