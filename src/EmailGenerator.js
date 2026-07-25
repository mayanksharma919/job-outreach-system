class EmailGenerator {

  static generate(application, options = {}) {

    const context = ContextBuilder.build(application);

    const isFollowUp = options.followUp === true;

    const followUpNumber = application.followUpCount + 1;

    if (!GeminiAvailability.isAvailable()) {

      return TemplateEmailGenerator.generate(
        application,
        context,
        options
      );

    }

    try {

      const prompt = isFollowUp
        ? PromptBuilder.buildFollowUp(
            application,
            followUpNumber
          )
        : PromptBuilder.build(
            application
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
        context,
        options
      );

    }

  }
}