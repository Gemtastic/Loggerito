/**
 * .
 * Created by gemtastic on 22/09/2015.
 */

var fs = require('fs');
var path = require('path');

var rootPath = path.dirname(require.main.filename);
var loggers = [];
var defaultLogger = {
    name: 'default',
    path: rootPath + '/logs',
    filename: 'logs.log'
};
var loaded;
loggers.push(defaultLogger);

/**
 * Checks is there is a log file in the standard log directory already,
 * if not it will create one.
 *
 * @param {string} logger - string with the name you wish to have of the log file.
 * @param callback
 */
function createLogfile(logger, callback) {
    checkAccess(rootPath, function () {
        checkFileExists(logger.path + '/' + logger.filename, function (err, exists) {
            if (err) return console.log('Error: ' + err);
            if (!exists) {
                checkDirectoryExists(logger.path, function (err, exists) {
                    if (err) return console.log('Error: ' + err);
                    exists ? createFile(logger.path + '/' + logger.filename, callback) :
                            createDirectoryAndFile(logger.path, logger.filename, callback);
                });
            } else {
                callback();
            }
        });
    });
}

/**
 * Adds a new logger if a logger with the provided name does not exist.
 * Callback recieves creation status true or false.
 * 
 * @param {string} filename
 * @param {string} name
 * @param {function} callback
 */
function addLogger(filename, name, callback) {
    var exists = checkIfLoggerExists(name);

    if (!exists) {
        var logger = new Logger(filename, name, '/' + 'logs');
        loggers.push(logger);
        callback(true);
    } else {
        callback(false);
    }
}

/**
 * Creates a new logger object.
 * 
 * @param {string} filename
 * @param {string} name
 * @param {string} path
 * @returns {newLogger.logger} new logger object
 */
function Logger(filename, name, path) {
    var logger = {
        name: name,
        path: rootPath + path,
        filename: filename
    };
    return logger;
}

/**
 * Checks if logger name is registered, returns boolean if exists or not.
 *  
 * @param {string} name
 * @returns {Boolean}
 */
function checkIfLoggerExists(name) {
    var exists = findInLoggers(name);
    if (exists !== undefined) {
        return true;
    }
    return false;
}

/**
 * Finds a name in the loggers if there, else nothing.
 * 
 * @param {type} name
 * @returns boolean | undefined
 */
function findInLoggers(name) {
    for (var i = 0; i < loggers.length; i++) {
        if (loggers[i].name === name) {
            return loggers[i];
        }
    }
}

/**
 * Checks if we have read and write access to the filesystem on provided path.
 *
 * @param path {string}  path to what you want to check access to.
 * @param {callback} callback
 */
function checkAccess(path, callback) {
    fs.access(path, fs.R_OK & fs.W_OK, function (err) {
        err ? callback(err) : callback(null, true);
    });
}

/**
 * Checks if the file exists. If it does returns true, else runs the callback.
 *
 * @param path
 * @param callback
 * @returns true | null
 */
function checkFileExists(path, callback) {
    checkStat(path, function (stats) {
        if (stats) {
            if (stats.isFile()) {
                callback(null, true);
            } else {
                callback(new Error('Path is not a file.', path));
            }
        } else {
            callback(null, false);
        }
    });
}

/**
 * Reads the stats of the provided path and injects the result into the callback.
 *
 * @param path
 * @param callback
 */
function checkStat(path, callback) {
    fs.stat(path, function (err, stats) {
        err ? callback() : callback(stats);
    });
}

/**
 * Checks if the provided path is a directory, if not it injects it into the callback.
 *
 * @param path
 * @param callback
 */
function checkDirectoryExists(path, callback) {
    checkStat(path, function (stats) {
        if (stats) {
            if (stats.isDirectory()) {
                callback(undefined, true);
            } else {
                callback(new Error('Path is not directory.', path));
            }
        } else {
            callback(null, false);
        }
    });
}

/**
 * Creates a directory with the provided path and confirms the creation before calling on the createFile method.
 *
 * @param path
 * @param filename
 * @param callback
 */
function createDirectoryAndFile(path, filename, callback) {
    fs.mkdir(path, function (err) {
        if (err) {
            return console.log('Could not make directory: ' + err);
        }
        checkStat(path, function () {
            createFile(path + '/' + filename, callback);
        });
    });
}

/**
 * Creates a file of the given path with creation log.
 *
 * @param path
 * @param callback
 */
function createFile(path, callback) {
    var helloWorld = transformToLogStash('info', 'Created this log file.');
    fs.writeFile(path, helloWorld, function (err) {
        err ? console.log('Could not create file: ' + err) : callback();
    });
}

/**
 * Writes to given file or to default logfile.
 * @param file
 * @param content
 * @param callback
 */
function writeToFile(file, content, callback) {
    fs.appendFile(file, '\n' + content, function (err) {
        if (err) throw err;
        callback();
    });
}

/**
 * Creates and stringifies a javascript object to be like the logstash
 * specification requires.
 *
 * @param level
 * @param message
 * @returns content - A string of the JavaScript Object.
 */
function transformToLogStash(level, message) {

    var entry = {
        "@message": message,
        "@timestamp": new Date().toISOString(),
        "@fields": {
            "level": level
        }
    };

    var content = JSON.stringify(entry);
    return content;
}

/**
 * Checks if there is a loggername and if it exists it returns the named logger
 * or the default logger.
 * 
 * @param {type} loggername
 * @param {type} callback
 * @returns {undefined}
 */
function selectLogger(loggername, callback) {
    var logger;
    if (typeof loggername === "string") {
        logger = findInLoggers(loggername) || findInLoggers('default');
    } else {
        logger = findInLoggers('default');
    }
    callback(logger);
}

/**
 * Checks if the logfile has been created, if not it creates it and the default
 * log directory.
 * 
 * @param {type} callback
 * @returns {undefined}
 */
function isLoaded(callback) {
    if (!loaded) {
        createLogfile(findInLoggers('default'), function () {
            loaded = true;
            callback(true);
        });
    } else {
        callback(false);
    }
}

/**
 * Logging function exposed to the API. Validates the arguments and if log-file
 * exists or not if provided. Will choose the default logging file if provided 
 * logger doesn't exist.
 * 
 * @param {string} level
 * @param {string} message
 * @param {string} loggername
 * @param {function} callback
 */
function log(level, message, loggername, callback) {
    var content = transformToLogStash(level, message);
    var theseArguments = arguments;
    
    if (arguments.length < 2) throw new Error('Log failed due to incorrect log-put.', arguments.length);
    
    isLoaded(function (result) {
        var name;
        typeof loggername === 'string' ? name = loggername : name = '';
        
        selectLogger(name, function(logger){
            checkFileExists(logger.path + '/' + logger.filename, function (err, exists) {
                if (err) throw new err;
                checkAccess(logger.path + '/' + logger.filename, function (err, exists) {
                    if(err) throw new err;
                    writeToFile(logger.path + '/' + logger.filename, content, function () {
                        if (typeof theseArguments[theseArguments.length - 1] === 'function') {
                            var lastFunction = theseArguments[theseArguments.length - 1];
                            lastFunction(true);
                        }
                    });
                });
            });
        });
    });
}

/**
 * Adds creates a new logger object and a logfile for it.
 * 
 * @param {string} filename
 * @param {string} name
 * @param {function} callback
 */
function addLog(filename, name, callback){
    addLogger(filename, name, function(){
        createLogfile(findInLoggers(name), callback);
    });
}

module.exports = {
    log: log,
    addLog: addLog
};