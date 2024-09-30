import { spawn } from 'node-pty';

// Spawn a new shell
const shell = spawn('cmd.exe', [], {
  name: 'xterm-color',
  cols: 80,
  rows: 30,
  cwd: process.env.HOME,
  env: process.env
});

shell.on('data', function(data) {
  console.log(data);
});

shell.write('dir\r');
shell.write('exit\r');
