'use strict';
var util = require('util'),
    yeoman = require('yeoman-generator'),
    chalk = require('chalk'),
    packagejs = require('../../package.json'),
    prompts = require('./prompts'),
    baseGenerator = require('../generator-base'),
    yosay = require('yosay');

/**
 * Define the core generator
 * @type {*|void|Object}
 */
var DotNetCoreGenerator = yeoman.Base.extend({});
util.inherits(DotNetCoreGenerator, baseGenerator);

const constants = require('../generator-constants');

module.exports = DotNetCoreGenerator.extend({
    /**
     * Constructor
     */
    constructor: function () {
        yeoman.Base.apply(this, arguments);
        /**
         * Configuration options
         * @type {{}}
         */
        this.configOptions = {};
        /**
         * Adds the support for --minimal flag
         */
        this.option('minimal', {
            desc: 'Generate only the files required to build and run the application',
            type: Boolean,
            defaults: false
        });

        //initialize the variables
        this.currentQuestion = 0;
        this.totalQuestions = constants.QUESTIONS;
        this.minimal = this.configOptions.minimal = this.options['minimal'] || this.config.get('minimal');
    },
    /**
     * Initializing the generator
     */
    initializing: {
        /**
         * Display logo
         */
        displayLogo: function () {
            this.printLogo();
        },
        /**
         * Check dotnet installed
         */
        checkDotnet: function () {
            if (!this.checkInstall || this.skipServer) return;
            var done = this.async();
            exec('dotnet -version', function (err, stdout, stderr) {
                if (err) {
                    this.warning('dotnet core not found on your computer.\n',
                        ' Download from https://www.microsoft.com/net/core');
                }
                done();
            }.bind(this));
        },
        /**
         * Check bower installed
         */
        checkBower: function () {
            if (!this.checkInstall || this.skipClient) return;
            var done = this.async();
            exec('bower --version', function (err) {
                if (err) {
                    this.warning('bower is not found on your computer.\n',
                        ' Install bower using npm command: ' + chalk.yellow('npm install -g bower')
                    );
                }
                done();
            }.bind(this));
        },
        /**
         * check gulp installed
         */
        checkGulp: function () {
            if (!this.checkInstall || this.skipClient) return;
            var done = this.async();
            exec('gulp --version', function (err) {
                if (err) {
                    this.warning('gulp is not found on your computer.\n',
                        ' Install gulp using npm command: ' + chalk.yellow('npm install -g gulp-cli')
                    );
                }
                done();
            }.bind(this));
        },
        /**
         * Setup variables
         */
        setupVars: function () {
            this.applicationType = this.config.get('applicationType');
            if (!this.applicationType) {
                this.applicationType = 'console';
            }
            this.baseName = this.config.get('baseName');
            var configFound = this.baseName !== undefined && this.applicationType !== undefined;
            if (configFound) {
                this.existingProject = true;
            }
        }
    },
    /**
     * Prompting on questions
     * @returns {*}
     */
    prompting: {
        askForApplicationType: prompts.askForApplicationType,
        askForModuleName: prompts.askForModuleName
    },
    /**
     * Configuring
     */
    configuring: {
        setup: function () {
            this.configOptions.baseName = this.baseName;
            this.generatorType = 'app';
            if (this.applicationType === 'console') {
                this.generatorType = 'console';
                this.minimal = this.configOptions.minimal = false;
            }
            if (this.applicationType === 'console-min') {
                this.generatorType = 'console';
                this.minimal = this.configOptions.minimal = true;
            }
        }
    },
    /**
     * Default values
     */
    default: {
        setSharedConfigOptions: function () {
            this.configOptions.lastQuestion = this.currentQuestion;
            this.configOptions.totalQuestions = this.totalQuestions;
        },

        saveConfig: function () {
            this.config.set('generatorVersion', packagejs.version);
            this.config.set('applicationType', this.applicationType);
            this.config.set('baseName', this.baseName);
            this.minimal && this.config.set('minimal', true);
        }
    },
    /**
     * Writing the content
     */
    writing: {
        
    },

    install: function () {
        this.installDependencies();
    }
});
