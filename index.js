const Client = require('instagram-private-api').V1;
const { SlackNotifier } = require('./SlackNotifier');
const config = require('./config');

const device = new Client.Device(config.device);
const storage = new Client.CookieFileStorage(__dirname + config.storagePath);

const slackNotifier = new SlackNotifier(config.webHookUrl);
const messages = [];

const init = () => exec(Client.Session.create(device, storage, config.username, config.password));

const fetchLastMessage = (list) => {
  if (Array.isArray(list) && list.length >= 1) {
    return list[0].params;
  }

  return null;
};

const exec = (promise) => {
  if (promise) {
    return (promise)
      .then(session => [
        session,
        new Client.Feed.Inbox(session).all(),
        Client.Account.searchForUser(session, config.username), // Dirty Hack. Too sleepy right now.
      ])
      .spread((session, threads, account) => {
        if (!threads.length) {
          throw new Error('You threads are empty.'); // rejection
        } else {
          const isTrue = value => value.params.title === config.searchFor;
          const relevantThreadAsList = threads.filter(isTrue);

          if (relevantThreadAsList.length) {
            return [
              session,
              relevantThreadAsList[0],
              account.params.id,
            ];
          }

          throw new Error('No thread found for your specified name.');
        }
      })
      .spread((session, relevantThread, myAccountId) => {
        const { params: { threadId } } = relevantThread;

        return [
          session,
          relevantThread,
          myAccountId,
          new Client.Feed.ThreadItems(session, threadId).all(),
        ];
      })
      .spread((session, relevantThread, myAccountId, allMessages) => {
        const { params: { itemsSeenAt } } = relevantThread;
        const itemsSeenAsIds = Object.keys(itemsSeenAt);
        const lastSeenBy = itemsSeenAsIds[itemsSeenAsIds.length - 1];

        if (myAccountId !== Number(lastSeenBy)) {
          slackNotifier.notify('Congrats! Your message has been seen.', slackNotifier.callback);
        }

        if (messages.length) {
          if (allMessages.length > messages.length) {
            const latestMessage = fetchLastMessage(allMessages);
            if (
              (latestMessage !== null) &&
              (myAccountId === latestMessage.userId)
            ) {
              messages.push(latestMessage);
              slackNotifier.notify(`You have received a new message. "${latestMessage.text}"`, slackNotifier.callback);
            }
          }
        } else {
          allMessages.forEach(message => messages.push(message.params));
        }

        setTimeout(() => exec(promise), config.threshold);
      });
  }

  return setTimeout(init, config.threshold);
};

init();
