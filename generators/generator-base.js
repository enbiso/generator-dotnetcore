'use strict';
var path = require('path'),
    chalk = require('chalk'),
    util = require('util'),
    _ = require('lodash'),
    packagejs = require('../package.json'),
    semver = require('semver'),
    shelljs = require('shelljs'),
    yeoman = require('yeoman-generator');

const GENERATOR_DOTNETCORE = 'generator-dotnetcore';
/**
 * Base generator
 * @constructor
 */
function BaseGenerator() {
    yeoman.Base.apply(this, arguments);
}

util.inherits(BaseGenerator, yeoman.Base);

/**
 * Prints the logo
 *               _
 *              | |
 *    _ __   ___| |_    ___ ___  _ __ ___
 *   | '_ \ / _ \ __|  / __/ _ \| '__/ _ \
 *  _| | | |  __/ |_  | (_| (_) | | |  __/
 * (_)_| |_|\___|\__|  \___\___/|_|  \___|
 */
BaseGenerator.prototype.printLogo = function () {
    this.log(' \n' +
        chalk.white('              _') + ' \n' +
        chalk.white('             | |') + ' \n' +
        chalk.white('   _ __   ___| |_    ___ ___  _ __ ___') + ' \n' +
        chalk.white('  | \'_ \\ / _ \\ __|  / __/ _ \\| \'__/ _ \\') + ' \n' +
        chalk.white(' _| | | |  __/ |_  | (_| (_) | | |  __/') + ' \n' +
        chalk.white('(_)_| |_|\\___|\\__|  \\___\\___/|_|  \\___|') + ' \n'
    );
    this.log(chalk.white.bold(' .NET Core Yeoman Generator ' + chalk.yellow('v' + packagejs.version) +'\n'));
    this.checkForNewVersion();
};
/**
 * Check for new versions
 */
BaseGenerator.prototype.checkForNewVersion = function () {
    try {
        shelljs.exec('npm show ' + GENERATOR_DOTNETCORE + ' version', {silent:true}, function (code, stdout, stderr) {
            if (!stderr && semver.lt(packagejs.version, stdout)) {
                this.log(
                    chalk.yellow(' ______________________________________________________________________________\n\n') +
                    chalk.yellow('  Generator update available: ') + chalk.green.bold(stdout.replace('\n','')) + chalk.gray(' (current: ' + packagejs.version + ')') + '\n' +
                    chalk.yellow('  Run ' + chalk.magenta('npm install -g ' + GENERATOR_DOTNETCORE ) + ' to update.\n') +
                    chalk.yellow(' ______________________________________________________________________________\n')
                );
            }
        }.bind(this));
    } catch (err) {
        // fail silently as this function doesnt affect normal generator flow
    }
};
/**
 * Add numbering to a question
 *
 * @param {String} msg - question text
 * @param {boolean} cond - increment question
 */
BaseGenerator.prototype.getNumberedQuestion = function (msg, cond) {
    var order;
    if (cond) {
        ++this.currentQuestion;
    }
    order = '(' + this.currentQuestion + '/' + this.totalQuestions + ') ';
    return order + msg;
};
/**
 * ask a prompt for apps name.
 *
 * @param {object} generator - generator instance to use
 */
BaseGenerator.prototype.askApplicationName = function (generator) {
    var done = generator.async();
    var defaultAppBaseName = this.getDefaultAppName();
    var getNumberedQuestion = this.getNumberedQuestion.bind(this);
    generator.prompt({
        type: 'input',
        name: 'baseName',
        validate: function (input) {
            if (!(/^([a-zA-Z0-9_]*)$/.test(input))) {
                return 'Your application name cannot contain special characters or a blank space';
            }
            return true;
        },
        message: function (response) {
            return getNumberedQuestion('What is the base name of your application?', true);
        },
        default: defaultAppBaseName
    }).then(function (prompt) {
        generator.baseName = prompt.baseName;
        done();
    }.bind(generator));
};
/**
 * exports
 * @type {BaseGenerator}
 */
module.exports = BaseGenerator;
