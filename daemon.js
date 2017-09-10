const Service = require('node-linux').Service;
const { SlackNotifier } = require('./SlackNotifier');
const config = require('./config');

/* eslint-disable no-console */
const svc = new Service({
  name: 'insta-daemon',
  description: 'Instagram daemon to notify me in case I receive a message',
  script: './index.js',
});

svc.on('install', () => {
  const slackNotifier = new SlackNotifier(config.webHookUrl);
  slackNotifier.notify('Installing insta-daemon on your machine.', slackNotifier.callback);
  console.info('Installing insta-daemon.');
});

svc.on('uninstall', () => console.info('Uninstalling insta-daemon.'));

svc.on('start', () => console.info('Starting insta-daemon.'));

svc.on('alreadyinstalled', () => console.info('insta-daemon is already installed as a service.'));

svc.on('stop', () => console.info('Stopping insta-daemon.'));

svc.on('invalidinstallation', () => console.info('You are probably missing required packages.'));

svc.install();
