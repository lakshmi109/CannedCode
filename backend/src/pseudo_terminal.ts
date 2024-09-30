//@ts-ignore 
import { fork, IPty } from 'node-pty';
import path from "path";

const SHELL = process.platform === 'win32' ? 'powershell.exe' : 'bash';

export class TerminalManager {
    private sessions: { [id: string]: {terminal: IPty, userId: string;} } = {};

    constructor() {
        this.sessions = {};
    }
    
    createPty(id: string, userId: string, onData: (data: string, id: number) => void) {
        let term = fork(SHELL, [], {
            cols: 100,
            name: 'xterm',
            cwd: path.join(__dirname, `../tmp/${userId}`)
        });
    
        term.on('data', (data: string) => onData(data, term.pid));
        this.sessions[id] = {
            terminal: term,
            userId
        };
        term.on('exit', () => {
            delete this.sessions[term.pid];
        });
        return term;
    }

    write(terminalId: string, data: string) {
        this.sessions[terminalId]?.terminal.write(data);
    }

    clear(terminalId: string) {
        this.sessions[terminalId].terminal.kill();
        delete this.sessions[terminalId];
    }
}
