##Loggerito
This is a small and simple logger that logs to file in logstash objects.


###How to use:
A simple logging example:

```javascript
var logger = require('loggerito');

logger.log('hello', 'Hello to the world!', function(){
console.log('Log created!');
});
```

#### `log(level, message[, loggername[, callback]])`
- **Level** _*required_ Is your logging level.

- **Message** _*required_ Is the message you'd like to log.

- **loggername** If you have made your own logger you may specify it here.

- **callback** If you wish to have a callback make sure it's the last argument into the `log()` function.

#### `addLog(filename, name, callback)`

- **filename** _*required_ The filename of your new log.

- **name** _*required_ the internal name id for your logger.

- **callback** If you wish to have a callback you may add one.
