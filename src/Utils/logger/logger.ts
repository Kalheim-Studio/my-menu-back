function logger(message: string, subMessage = "") {
    console.log(`${Date.now()} - ${message}${subMessage ? ` - ${subMessage}` : ""}`);
}

export { logger };
