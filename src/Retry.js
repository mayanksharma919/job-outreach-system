class Retry {

  /**
   * Executes a function with retry support.
   *
   * @param {Function} fn Function to execute.
   * @param {number} maxRetries Maximum retry attempts.
   * @param {number} delayMs Initial delay in milliseconds.
   * @returns {*} Function result.
   */
  static execute(fn, maxRetries = 3, delayMs = 2000) {

    let attempt = 0;

    while (true) {

      try {

        return fn();

      } catch (error) {

        attempt++;

        if (attempt > maxRetries) {

          AppLogger.error(
            `Retry failed after ${attempt} attempts.`
          );

          throw error;

        }

        AppLogger.warn(
          `Retry ${attempt}/${maxRetries}. Waiting ${delayMs} ms...`
        );

        Utilities.sleep(delayMs);

        // Exponential backoff
        delayMs *= 2;

      }

    }

  }

}