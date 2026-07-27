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

        AppLogger.info("========== PROMPT ==========");
        AppLogger.info(prompt);

        AppLogger.info("========== GEMINI RAW RESPONSE ==========");
        AppLogger.info(response);

      const parsed = ResponseParser.parse(response);

      return {
        subject: `Application for ${application.jobTitle}`,
        body: parsed.body
      };

    } catch (error) {

      AppLogger.warn(
        "Gemini unavailable. Using template generator."
      );
      

      AppLogger.info(JSON.stringify(context));

      return TemplateEmailGenerator.generate(
        application,
        context,
        options
      );

    }

  }
}