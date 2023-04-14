import colors from "colors";

type Information = {
  infoMessage?: string;
  successMessage?: string;
  errorMessage?: string;
};

function logger(origin: string, message: string, information: Information = {}) {
    const subMessage = information.infoMessage
        ? colors.yellow(information.infoMessage)
        : information.successMessage
            ? colors.green(information.successMessage)
            : information.errorMessage
                ? colors.red(information.errorMessage.red)
                : "";

    console.log(`${Date.now()} - ${origin} - ${message}${subMessage ? ` - ${subMessage}` : ""}`);
}

export { logger };
