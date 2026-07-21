/**
 * Centralized logging.
 * Replace Logger.log() everywhere else.
 */
class AppLogger {

  static info(message) {
    Logger.log(`[INFO] ${message}`);
  }

  static warn(message) {
    Logger.log(`[WARN] ${message}`);
  }

  static error(message) {
    Logger.log(`[ERROR] ${message}`);
  }

  static debug(message) {

    // Later we'll read this from Config
    const debugEnabled = true;

    if (debugEnabled) {
      Logger.log(`[DEBUG] ${message}`);
    }

  }

}