class GeminiAvailability {

  static isAvailable() {

    if (this.available === undefined) {
      this.available = true;
    }

    return this.available;

  }

  static disable() {

    this.available = false;

    AppLogger.warn(
      "Gemini disabled for current execution."
    );

  }

}