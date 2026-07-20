class EmailGenerator {

  static generate(application) {

    const context = ContextBuilder.build(application);

    if (!GeminiAvailability.isAvailable()) {

      return TemplateEmailGenerator.generate(
        application,
        context
      );

    }

    try {

      const prompt = PromptBuilder.build(
        application,
        context
      );

      const response =
        GeminiService.generate(prompt);

      return ResponseParser.parse(response);

    } catch (error) {

      AppLogger.warn(
        "Gemini unavailable. Using template generator."
      );

      return TemplateEmailGenerator.generate(
        application,
        context
      );

    }

  }

}