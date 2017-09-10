# instagram-daemon
A daemon micro-service that notifies you on slack in case there 's any activity on your instagram threads

##### Note: This is a small script I wrote for personal stuff to notify me on a slack channel in case I get any activity on my instagram threads. Thought the example might be useful for somebody else as well.

### Getting Started
Before starting the service you would need to update the configuration variables specified in `config.js`.

| **Variable** | **Description** |
|----------|-------|
|  webHookUrl  |   Your slack channel webhook url.    |
|  username |  Your instagram username. |
|  password | Your instagram password. |
|  device |  Any string can be provided. (A dependency for instagram-private-api). |
| storagePath | An initial storage file. This will not save your instagram threads or any other account information. |
| searchFor | Instagram username for the person you want to subscribe to. The service will notify you in case your message is seen by this username and in case you receive a message. |

#### For linux and Mac machines only

```
node daemon.js
```

This would install the service on your host. This will also send you an installation update on your specified slack channel.

To start the service

```
service instadaemon start
```

You can check the service status

```
service instadaemon status
```

Note that if you prefer running it as a node script just run

```
node index.js
```

#### For Windows
Running it as a service on `Windows` isn't supported, but you can easily run it via node

```
node index.js
```