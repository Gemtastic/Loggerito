/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */


var logger = require('./app');

logger.log('hello', 'Hello to the world! 12314D', 'david', function(){
    console.log('My first log!');
    logger.addLog('info.log', 'infolog', function(){
        console.log('created new log!');
        logger.log('info', 'I am testing stuff', 'infolog');
    });
});


function makeLog() {
    logger.log('hello', 'Hello to the world! ABCD', 'default', addLogger);
}

function addLogger() {
    
}
    
//logger.log('info', 'I am testing stuff', 'infolog');