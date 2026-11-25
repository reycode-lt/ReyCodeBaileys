
import './Utils/long-safe.js';
import makeWASocket from './Socket/index.js';
import chalk from 'chalk';

console.log(chalk.hex('#00c2ff')(`
██████╗ ███████╗██╗   ██╗
██╔══██╗██╔════╝╚██╗ ██╔╝
██████╔╝█████╗   ╚████╔╝
██╔══██╗██╔══╝    ╚██╔╝
██║  ██║███████╗   ██║
╚═╝  ╚═╝╚══════╝   ╚═╝
`));

console.log(
  chalk.bold.hex('#00c2ff')(
    'ReyCodeBaileys'
  )
);

console.log(
  chalk.gray(
    'WhatsApp Multi-Device Library'
  )
);

console.log(
  chalk.white('Maintained by ') +
  chalk.cyan('ReyCodeDGTL') +
  '\n'
);

console.log(
  chalk.gray('GitHub Repository:')
);

console.log(
  chalk.cyan(
    'https://github.com/reycode-lt/ReyCodeBaileys\n'
  )
);

export * from '../WAProto/index.js';
export * from './Utils/index.js';
export * from './Types/index.js';
export * from './Defaults/index.js';
export * from './WABinary/index.js';
export * from './WAM/index.js';
export * from './WAUSync/index.js';
export * from './Store/index.js';

export { makeWASocket };
export default makeWASocket;
