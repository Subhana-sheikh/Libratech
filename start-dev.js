import { spawn } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const isWindows = process.platform === 'win32';
const npmCmd = isWindows ? 'npm.cmd' : 'npm';

console.log('====================================================');
console.log('🚀 Starting Libratech Full-Stack Development Suite');
console.log('   - Backend API:  http://localhost:5000 (Port 5000, Auto-Reload)');
console.log('   - Frontend App: http://localhost:5173 (Port 5173, Vite HMR)');
console.log('====================================================\n');

// 1. Spawn Backend Server
const serverProc = spawn(npmCmd, ['run', 'dev'], {
  cwd: path.join(__dirname, 'server'),
  stdio: ['inherit', 'pipe', 'pipe'],
  shell: isWindows
});

serverProc.stdout.on('data', (data) => {
  const lines = data.toString().trim().split('\n');
  lines.forEach(line => console.log(`\x1b[36m[SERVER]\x1b[0m ${line}`));
});

serverProc.stderr.on('data', (data) => {
  const lines = data.toString().trim().split('\n');
  lines.forEach(line => console.log(`\x1b[33m[SERVER]\x1b[0m ${line}`));
});

// 2. Spawn Frontend Client
const clientProc = spawn(npmCmd, ['run', 'dev'], {
  cwd: path.join(__dirname, 'client'),
  stdio: ['inherit', 'pipe', 'pipe'],
  shell: isWindows
});

clientProc.stdout.on('data', (data) => {
  const lines = data.toString().trim().split('\n');
  lines.forEach(line => console.log(`\x1b[35m[CLIENT]\x1b[0m ${line}`));
});

clientProc.stderr.on('data', (data) => {
  const lines = data.toString().trim().split('\n');
  lines.forEach(line => console.log(`\x1b[31m[CLIENT]\x1b[0m ${line}`));
});

const cleanup = () => {
  console.log('\n🛑 Shutting down Libratech full-stack development processes...');
  try {
    if (serverProc && !serverProc.killed) {
      if (isWindows) spawn('taskkill', ['/pid', String(serverProc.pid), '/f', '/t']);
      else serverProc.kill('SIGTERM');
    }
    if (clientProc && !clientProc.killed) {
      if (isWindows) spawn('taskkill', ['/pid', String(clientProc.pid), '/f', '/t']);
      else clientProc.kill('SIGTERM');
    }
  } catch (e) {}
  process.exit(0);
};

process.on('SIGINT', cleanup);
process.on('SIGTERM', cleanup);
