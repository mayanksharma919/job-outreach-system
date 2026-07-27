class GeminiService {

  static generate(prompt) {

    const apiKey = Config.getGeminiApiKey();

    const model = Config.get(
      CONSTANTS.CONFIG_KEYS.GEMINI_MODEL
    );

    const url =
      `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;

    const payload = {

      contents: [
        {
          parts: [
            {
              text: prompt
            }
          ]
        }
      ],

      generationConfig: {

        temperature: Number(
          Config.get(CONSTANTS.CONFIG_KEYS.TEMPERATURE)
        ),

        maxOutputTokens: Number(
          Config.get(CONSTANTS.CONFIG_KEYS.MAX_OUTPUT_TOKENS)
        )

      }

    };

    const options = {

      method: "post",

      contentType: "application/json",

      payload: JSON.stringify(payload),

      muteHttpExceptions: true

    };

    const start = Date.now();

    const response = Retry.execute(() => {

      const response = UrlFetchApp.fetch(url, options);

      const code = response.getResponseCode();

      // Retry only transient server errors
      if ([408, 500, 502, 503, 504].includes(code)) {
        throw new Error(`Retryable Gemini HTTP ${code}`);
      }

      return response;

    }, Number(
      Config.get(CONSTANTS.CONFIG_KEYS.MAX_RETRIES)
    ));

    const elapsed = Date.now() - start;

    const code = response.getResponseCode();

    AppLogger.info(`Gemini Model: ${model}`);
    AppLogger.info(`Gemini HTTP: ${code}`);
    AppLogger.info(`Gemini Time: ${elapsed} ms`);

    switch (code) {

      case 200:
        break;

      case 429:
        GeminiAvailability.disable();

        AppLogger.warn(
          "Gemini quota exceeded. Falling back to default email."
        );

        throw new Error("Gemini quota exceeded.");

      case 401:
        AppLogger.error(response.getContentText());
        throw new Error("Invalid Gemini API key.");

      case 403:
        AppLogger.error(response.getContentText());
        throw new Error("Gemini access denied.");

      default:
        AppLogger.error(response.getContentText());
        throw new Error(`Gemini HTTP ${code}`);

    }

    const json = JSON.parse(
      response.getContentText()
    );

    if (
      !json.candidates ||
      !json.candidates.length ||
      !json.candidates[0].content ||
      !json.candidates[0].content.parts ||
      !json.candidates[0].content.parts.length
    ) {

      throw new Error(
        "Gemini returned an empty response."
      );

    }

    const text =
      json.candidates[0].content.parts[0].text;

    if (!text || !text.trim()) {

      throw new Error(
        "Gemini returned empty text."
      );

    }

    return text.trim();

  }

}