/**
 * .
 * Created by gemtastic on 22/09/2015.
 */

var fs = require('fs');

var path = require('path');
var rootPath = path.dirname(require.main.filename);


/**
 * Checks is there is a log file/directory already,
 * if not it will create one.
 *
 * @param {string} filename - string with the name you wish to have of the log file.
 * @param callback
 */
function createLogfile(filename, callback){

  var path = rootPath + '/logs';

  checkAccess(rootPath, function(){
    checkFileExists(path + '/' + filename, function(){
      checkDirectoryExists(path, function(exists){
        exists ? createFile(path + '/' + filename, callback) : createDirectoryAndFile(path, filename, callback);
      });
    });
  });

}

/**
 * Checks if we have read and write access to the filesystem on provided path.
 *
 * @param path {string}  path to what you want to check access to.
 * @param {callback} callback
 */
function checkAccess(path, callback){
  fs.access(path, fs.R_OK & fs.W_OK, function(err){
    err ? console.log("No access!") : callback();
  });
}

/**
 * Checks if the file exists. If it does returns true, else runs the callback.
 *
 * @param path
 * @param callback
 * @returns true | null
 */
function checkFileExists(path, callback){
  checkStat(path, function(stats){
    if(stats){
      if(stats.isFile()){
        log('info', 'File already exists.');
        return true;
      } else {
        console.log('Path is not a file.');
      }
    } else {
      callback();
    }
  });
}

/**
 * Reads the stats of the provided path and injects the result into the callback.
 *
 * @param path
 * @param callback
 */
function checkStat(path, callback){
  fs.stat(path, function (err, stats) {
    err ? callback(): callback(stats);
  });
}

/**
 * Checks if the provided path is a directory, if not it injects it into the callback.
 *
 * @param path
 * @param callback
 */
function checkDirectoryExists(path, callback){
  checkStat(path, function(stats){
    if(stats){
      if(stats.isDirectory()){
        console.log('Directory already exists.');
        callback(true);
      } else {
        console.log('Path is not directory!');
      }
    } else {
      callback(false);
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
      return console.log('Could not make directory.');
    }
    checkStat(path, function () {
      console.log('Successfully created directory!');
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
function createFile(path, callback){
  var helloWorld = transformToLogStash('info', 'Created default logfile.');
  fs.writeFile(path, helloWorld, function(err){
    err ? console.log('Could not create file') : callback();
  });
}

/**
 * Writes to given file or to default logfile.
 * @param file
 * @param content
 * @param callback
 */
function writeToFile(file, content, callback){

}

/**
 * Creates and stringifies a javascript object to be like the logstash
 * specification requires.
 *
 * @param level
 * @param message
 * @returns content - A string of the JavaScript Object.
 */
function transformToLogStash(level, message){

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

function log(level, message, callback){

  var content = transformToLogStash(level, message);

  var file = checkFileExists(file, function(){
    console.log('File not found!');
  });

  if(file){
    checkAccess(file, function(){

    });
  }
}

createLogfile('logs.log', function(){
  console.log('Created Log File!');
});

module.exports = {
  log: log,
  createLogFile: createLogfile
};