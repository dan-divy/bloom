require('shelljs/global');
const vorpal = require('vorpal')();
const inquirer = require('inquirer');
const path = require('path');
const fs = require('fs');

var configUrl = path.join(__dirname, './_data/config.json');
var dbUrl = path.join(__dirname, './_data/catalog.json');
var database = require(dbUrl);
var config = require(configUrl);


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
    type:'password',
    name:'password',
    message:'Enter a password for console'
  }
]

var newBlogQuestions = [
  {
    type:'input',
    name:'title',
    message:'Give a great title for your post'
  },
  {
    type:'input',
    name:'caption',
    message:'Give a small description'
  }
];

vorpal
  .command('new' ,'Create a new post')
  .action(function (args, callback) {
    inquirer.prompt(newBlogQuestions).then(answers => {
      answers["suffix"] = answers["title"].replace(/\s+/g, '-').toLowerCase();
      database[answers["suffix"]] = {
        suffix: answers["suffix"],
        title:answers["title"],
        date:new Date(),
        file:answers["suffix"]+".md",
        author:config.author,
        caption:answers["caption"]
      }
      fs.writeFileSync(dbUrl, JSON.stringify(database, null, 2));
      fs.writeFileSync(path.join(__dirname, '_dist/posts/'+answers["suffix"]+".md"), `# ${answers["title"]}`);
      this.log('Success! New post created '+answers["suffix"]+".md");
      callback();
    })
  });

vorpal
  .command('init')
  .alias('setup')
  .description('Setup a blog')
  .action(function (args, callback) {
    inquirer.prompt(initQuestion).then(answers => {

      fs.writeFileSync(configUrl, JSON.stringify(answers, null, 2));
      this.log('Done!');
      callback();
    })
  });

vorpal
  .command('serve [commands...]')
  .alias('start')
  .description('Start the blog server')
  .action(function (args, callback) {
    if(args.commands && args.commands[0] == 'infinte') {
      exec('forever start app.js', (code, output) => {
        console.log('Exit Code : '+ code);
        console.log('Output : '+ output);
      });
    }
    else {
      exec('node app.js', (code, output) => {
        console.log('Exit Code : '+ code);
        console.log('Output : '+ output);
      });
    }
  });
console.log("Type help to view commands..")
vorpal.delimiter('bloom $ ').show()
