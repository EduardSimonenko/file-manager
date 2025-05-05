class Command {
  #notExecuteError = 'Method execute() must be implemented';

  constructor(currentDir = "") {
    this.currentDir = currentDir;
    this.updateWorkingDir = null;
  }

  execute() {
    throw new Error(this.#notExecuteError);
  }
}

export { Command };