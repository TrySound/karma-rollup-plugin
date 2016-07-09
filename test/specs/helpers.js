import { Server } from 'karma';

export function revert(promise, reason = 'Unexpected resolved Promised') {
  return promise.then(
    () => { throw new Error(reason); },
    () => {}
  );
}

export function runKarma(config) {
  return new Promise((resolve, reject) => {
    new Server(config, exitCode => {
      if (exitCode) {
        reject(`Karma has exited with ${exitCode}`);
      } else {
        resolve();
      }
    }).start();
  });
}