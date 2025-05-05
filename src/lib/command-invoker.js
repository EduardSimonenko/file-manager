class CommandInvoker {
  #currentCommand;

  setCommand(command) {
    this.#currentCommand = command;
  }

  async executeCommand() {
    if (!this.#currentCommand) {
      throw new Error('No command set');
    }

    try {
      return await this.#currentCommand.execute();
    } finally {
      this.#currentCommand = null;
    }
  }
}

export { CommandInvoker };