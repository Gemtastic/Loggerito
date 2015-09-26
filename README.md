##Loggerito
This is a small and simple logger that logs to file in logstash objects.

####How to install
>npm install git://github.com/Gemtastic/Loggerito.git

####How to use:
A simple logging example:

```javascript
    var logger = require('loggerito');
    
    logger.log('greeting', 'Hello to the world!', 'default', function(){
        console.log('Log entry created!');
        
        logger.addLog('info.log', 'infolog', function(){
            console.log('Logfile created!');
        });
    });
```

####`log(level, message[, loggername[, callback]])`
**Level** _*required_ Is your logging level.

**Message** _*required_ Is the message you'd like to log.

**loggername** If you have made your own logger you may specify it here.

**callback** If you wish to have a callback make sure it's the last argument into the `log()` function.

#####Description:
`log()` will always create a default log file if that does not already exists upon it's first call in your project. `log()` will log to the default log file if a specific logname has not been entered or there is no logger created by that name. **Default logger will be created in a "logs" file in your project root.**

####`addLog(filename, name[, callback])`

**filename** _*required_ The filename of your new log.

**name** _*required_ the internal name id for your logger.

**callback** If you wish to have a callback you may add one.

#####Description:
All new logfiles will have their own file and be by default put into a "logs" file your project root. All new logs will have an init log upon creation.
