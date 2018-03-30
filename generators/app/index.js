'use strict';
const Generator = require('yeoman-generator');
const chalk = require('chalk');
const _ = require('lodash');

module.exports = class extends Generator {
  prompting() {
    this.log(`Welcome to the ${chalk.green('generator-webdash-plugin')} generator!`);

    const prompts = [
      {
        type: 'input',
        name: 'name',
        message:
          'Enter the plugin name (must start with webdash- ie: webdash-my-plugin): ',
        required: true,
        default: this.appname
      }
    ];

    return this.prompt(prompts).then(props => {
      this.props = props;
    });
  }

  writing() {
    this.elementName = this.props.name;
    this.className = _.camelCase(this.elementName);
    this.className = this.className[0].toUpperCase() + this.className.substr(1);
    this.friendlyName = this.elementName.replace(/-/g, ' ');

    // Api
    this.fs.copy(this.templatePath('api/api.js'), this.destinationPath('api.js'));

    // Element
    this.fs.copy(
      this.templatePath('element/webdash-template.html'),
      this.destinationPath(`${this.elementName}.html`),
      {
        process: this._processWebdashTemplate.bind(this)
      }
    );

    this.fs.copy(
      this.templatePath('element/README.md'),
      this.destinationPath('README.md'),
      {
        process: this._processPluginNames.bind(this)
      }
    );

    this.fs.copy(
      this.templatePath('element/polymer.json'),
      this.destinationPath('polymer.json')
    );

    this.fs.copy(
      this.templatePath('element/bower.json'),
      this.destinationPath('bower.json'),
      { process: this._processWebdashTemplate.bind(this) }
    );

    this.fs.copy(
      this.templatePath('element/package.json'),
      this.destinationPath('package.json'),
      { process: this._processWebdashTemplate.bind(this) }
    );

    this.fs.copy(this.templatePath('_gitignore'), this.destinationPath('.gitignore'));

    this.fs.copy(
      this.templatePath('element/index.html'),
      this.destinationPath('index.html'),
      { process: this._processWebdashTemplate.bind(this) }
    );

    this.fs.copy(
      this.templatePath('element_test/index.html'),
      this.destinationPath('test/index.html'),
      { process: this._processWebdashTemplate.bind(this) }
    );

    this.fs.copy(
      this.templatePath('element_test/webdash-template_test.html'),
      this.destinationPath(`test/${this.elementName}_test.html`),
      { process: this._processWebdashTemplate.bind(this) }
    );

    this.fs.copy(
      this.templatePath('element_demo/index.html'),
      this.destinationPath(`demo/index.html`),
      { process: this._processWebdashTemplate.bind(this) }
    );
  }

  _processPluginNames(content) {
    let template = content.toString();
    template = template.replace(/plugin-friendly-name/g, this.friendlyName);
    template = template.replace(/plugin-name/g, this.elementName);
    return template;
  }

  _processWebdashTemplate(content) {
    let template = content.toString();
    template = template.replace(/webdash-template/g, this.elementName);
    template = template.replace(/WebdashTemplate/g, this.className);
    return template;
  }

  install() {
    this.installDependencies();
  }
};
