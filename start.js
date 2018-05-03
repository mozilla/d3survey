const pm2 = require('pm2')

const {
  WEB_CONCURRENCY,
  WEB_MEMORY
} = process.env;

const options = {
  name: 'Facebook Survey',
  script: 'server.js',
  exec_mode: 'cluster',
  instances: WEB_CONCURRENCY || -1,
  max_memory_restart: `${WEB_MEMORY || 512}M`
};

pm2.connect((err) => {
  if (err) {
    console.error(err);
    process.exit(1);
  }

  pm2.start(options, (err) => {
    if (err) {
      return console.error('Error while launching the app', err.stack || err);
    }

    // send logs to stdout
    pm2.launchBus((err, bus) => {
      console.log('[PM2] log streaming started');

      bus.on('log:out', (packet) => console.log(`[App:${packet.process.name}] ${packet.data}`));

      bus.on('log:err', (packet) => console.log(`[App:${packet.process.name}[Err] ${packet.data}`));
    });
  });
});
