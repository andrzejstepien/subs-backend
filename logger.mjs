import pino from 'pino'
import path from 'path'
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// const transport = pino.transport({
//     targets: [{
//         level: 'trace',
//         target: 'pino-pretty' // must be installed separately
//     }, {
//         level: 'trace',
//         target: 'pino/file',
//         options: { destination: `${__dirname}/app.log` }
//     }]
// })
export default pino(
    {
      level: 'info',
      formatters: {
        level: (label) => {
          return { level: label.toUpperCase() };
        },
      },
      timestamp: pino.stdTimeFunctions.isoTime,
    },
    //pino.destination(`${__dirname}/app.log`)
  );