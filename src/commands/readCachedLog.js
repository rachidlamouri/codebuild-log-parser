const inquirer = require('inquirer');
const chalk = require('chalk');
const _ = require('lodash');
const { fileUtils } = require('../utils');

class Command {
  constructor(line) {
    const [, code] = line.match(/Running command (.*)/);

    Object.assign(this, {
      line,
      code,
      lines: [],
    });
  }

  addLine(line) {
    if (line !== this.line) {
      this.lines.push(line);
    }
  }
}

class Phase {
  constructor(name) {
    Object.assign(this, {
      name,
      lines: [],
      commands: [],
    });
  }

  addLine (line) {
    this.lines.push(line);

    if (this.commands.length > 0) {
      _.last(this.commands).addLine(line);
    }
  }

  addCommand (line) {
    this.commands.push(new Command(line));
  }
}

const getPhases = (log) => (
  log.split('\n')
    .reduce(
      (phases, line) => {
        const phaseStartMatch = line.match(/Entering phase ([A-Z_]*)/);
        if (phaseStartMatch !== null) {
          const [, phaseName] = phaseStartMatch;

          phases.push(new Phase(phaseName));
        }

        const lastPhase = _.last(phases);

        const isCommandStart = line.match(/\[Container\] [0-9\/]* [0-9:]* Running command/);
        if (isCommandStart) {
          lastPhase.addCommand(line);
        }

        lastPhase.addLine(line);

        return phases;
      },
      [new Phase('DOWNLOAD_SOURCE')],
    )
);

class RenderNode {
  constructor(parentNode, name, depth = 0) {
    Object.assign(this, {
      name,
      depth,
      children: [],
      parent: parentNode,
    });
  }

  addChild(node) {
    this.children.push(node);
  }
}

class NavigationNode extends RenderNode {}
class TextNode extends RenderNode {}

const createRenderNodes = (phases) => {
  const phasesNode = new NavigationNode(null, 'Phases');

  phases.forEach((phase) => {
    const phaseNode = new NavigationNode(phasesNode, phase.name);
    phasesNode.addChild(phaseNode);
    phase.lines.forEach((line) => {
      phaseNode.addChild(new TextNode(phaseNode, line));
    });

    phase.commands.forEach((command) => {
      const commandNode = new NavigationNode(phasesNode, command.code, 1);
      phasesNode.addChild(commandNode);

      command.lines.forEach((line) => {
        commandNode.addChild(new TextNode(phaseNode, line));
      });
    });
  });

  return phasesNode;
};

const render = (node) => {
  console.clear();
  const horizontalLine = chalk.blue(_.padStart('', node.name.length, '-'));
  console.log();
  console.log(horizontalLine);
  console.log(chalk.blue(node.name));
  console.log(horizontalLine);

  node.children.forEach((childNode, index, list) => {
    const padding = childNode instanceof NavigationNode
      ? _.padStart('', 2 * childNode.depth)
      : '';
    const numDigits = list.length.toString().length;
    const lineNumber = childNode instanceof NavigationNode
      ? chalk.blue(_.padStart(index, numDigits))
      : '';

    console.log(`${padding}${lineNumber} ${childNode.name}`);
  });

  return inquirer.prompt([
    {
      type: 'input',
      message: 'goto',
      name: 'input',
    },
  ])
    .then(({ input }) => {
      if (input.match(/^[0-9]+$/)) {
        const index = parseInt(input, 10);
        if (index < node.children.length && node.children[index] instanceof NavigationNode) {
          render(node.children[index]);
          return
        }
      }

      if (node.parent !== null) {
        render(node.parent);
        return;
      }

      render(node);
    })
};

module.exports.readCachedLog = (groupName, streamName) => {
  const log = fileUtils.readFile(groupName, streamName);
  const phases = getPhases(log);
  const phasesNode = createRenderNodes(phases);
  render(phasesNode);
};
