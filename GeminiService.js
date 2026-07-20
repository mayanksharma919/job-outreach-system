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

      return UrlFetchApp.fetch(url, options);

    }, Number(
        Config.get(CONSTANTS.CONFIG_KEYS.MAX_RETRIES)
    ));

    const elapsed = Date.now() - start;

    const code = response.getResponseCode();

    AppLogger.info(`Gemini HTTP ${code}`);
    AppLogger.info(`Gemini Time ${elapsed} ms`);

    if (code !== 200) {

      if (code === 429 || code === 503) {

        GeminiAvailability.disable();

      }

      AppLogger.error(response.getContentText());

      throw new Error(response.getContentText());

    }

    const json = JSON.parse(response.getContentText());

    if (
      !json.candidates ||
      !json.candidates.length ||
      !json.candidates[0].content ||
      !json.candidates[0].content.parts ||
      !json.candidates[0].content.parts.length
    ) {

      throw new Error("Gemini returned an empty response.");

    }

    const text = json.candidates[0].content.parts[0].text;

    if (!text) {

      throw new Error("Gemini returned empty text.");

    }

    return text;

  }

}


