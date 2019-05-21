const vorpal = require('vorpal')();
var bloomConfig = require('./_data/config');
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
  .command('init')
  .action(function (args, callback) {
    inquirer.prompt(questions).then(answers => {
      console.log(`Hi ${answers['name']}!`)
    })
    callback();
  });


vorpal.show()
