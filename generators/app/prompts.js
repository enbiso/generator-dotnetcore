'use strict';

/**
 * Prompts
 * @constructor
 */
function Prompts() {

}
/**
 * Ask for Application type
 */
Prompts.askForApplicationType = function () {
    if (this.existingProject) return;

    const DEFAULT_APPTYPE = 'console';

    var done = this.async();
    var getNumberedQuestion = this.getNumberedQuestion.bind(this);

    this.prompt({
        type: 'list',
        name: 'applicationType',
        message: function (response) {
            return getNumberedQuestion('Which *type* of application would you like to create?', true);
        },
        choices: [
            {
                value: DEFAULT_APPTYPE,
                name: 'Console Application'
            },
            {
                value: 'console-min',
                name: 'Console Application - Minimal'
            }
        ],
        default: DEFAULT_APPTYPE
    }).then(function (prompt) {
        this.applicationType = this.configOptions.applicationType = prompt.applicationType;
        done();
    }.bind(this));
};
/**
 * Ask for module name
 */
Prompts.askForApplicationName = function() {
    if (this.existingProject) return;

    this.askApplicationName(this);
    this.configOptions.lastQuestion = this.currentQuestion;
    this.configOptions.totalQuestions = this.totalQuestions;
};
/**
 * Exports
 * @type {Prompts}
 */
module.exports = Prompts;
