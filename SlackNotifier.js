const IncomingWebhook = require('@slack/client').IncomingWebhook;

/* eslint-disable no-console */
/* eslint-disable class-methods-use-this */
class SlackNotifier {
  constructor(webhookUrl) {
    this.hook = new IncomingWebhook(webhookUrl);
  }

  callback(err, header, statusCode) {
    if (err) {
      console.error('An error has occurred while sending the notification.');
    } else {
      console.info(`Notified with ${statusCode}.`);
    }
  }

  notify(message, callback) {
    return this.hook.send(message, callback);
  }
}

exports.SlackNotifier = SlackNotifier;
