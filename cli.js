const vorpal = require('vorpal')();
const inquirer = require('inquirer');
const path = require('path');
const fs = require('fs');

var configUrl = path.join(__dirname, './_data/config.json');

var initQuestion = [
  {
    type:'input',
    name:'title',
    message:'Enter a title'
  },
  {
    type:'input',
    name:'website',
    message:'Enter your blog url'
  },
  {
    type:'input',
    name:'author',
    message:'Enter you name'
  },
  {
    type:'input',
    name:'host',
    message:'Enter your host name'
  },
  {
    type:'input',
    name:'port',
    message:'Enter a port for the server'
  },
  {
    type:'input',
    name:'username',
    message:'Enter a username for accessing console'
  },
  {
    type:'input',
    name:'password',
    message:'Enter a password for console'
  }
]

vorpal
  .command('say [words...]')
  .option('-b, --backwards')
  .option('-t, --twice')
  .action(function (args, callback) {
    let str = args.words.join(' ');
    str = (args.options.backwards) ?
      str.split('').reverse().join('') :
      str;
    this.log(str);
    callback();
  });

vorpal
  .command('init' ,'Setup a blog')
  .action(function (args, callback) {
    inquirer.prompt(initQuestion).then(answers => {
      fs.writeFileSync(configUrl, JSON.stringify(answers, null, 2));
      this.log('Done!');
      callback();
    })
  });

vorpal.delimiter('bloom$').show()
