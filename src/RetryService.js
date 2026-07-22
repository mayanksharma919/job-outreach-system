class RetryService {

  static execute(operation, description) {

    const maxAttempts = Number(
      Config.get(
        CONSTANTS.CONFIG_KEYS.MAX_RETRIES
      ) || 3
    );

    let lastError;

    for (
      let attempt = 1;
      attempt <= maxAttempts;
      attempt++
    ) {

      try {

        const result = operation();

        return {

          success: true,

          value: result

        };

      }
      catch (error) {

        lastError = error;

        AppLogger.error(

          `${description} failed (Attempt ${attempt}/${maxAttempts})`

        );

        if (attempt < maxAttempts) {

          Utilities.sleep(
            attempt * 2000
          );

        }

      }

    }

    return {

      success: false,

      error: lastError

    };

  }

}