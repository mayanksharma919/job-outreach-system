class FollowUpProcessor {

  static process(application) {

    AppLogger.info(
        `FOLLOWUP CHECK -> ${application.company}`
    );

    AppLogger.info(`========== FOLLOW UP ==========`);

    AppLogger.info(`Company      : ${application.company}`);
    AppLogger.info(`Status       : ${application.status}`);
    AppLogger.info(`Thread       : ${application.threadId}`);
    AppLogger.info(`Sent Date    : ${application.sentDate}`);
    AppLogger.info(`FollowUps    : ${application.followUpCount}`);

    try {

      const due =
        FollowUpService.isFollowUpDue(application);

      AppLogger.info(`Is Due       : ${due}`);

      if (!due) {

        AppLogger.info("Skipping follow-up.");

        return false;

      }

      AppLogger.info("Generating follow-up...");

      const followUp =
        FollowUpTemplateService.generate(application);

      AppLogger.info("Sending follow-up...");

      const result =
        RetryService.execute(
          

          () => GmailService.sendFollowUp(
            application,
            followUp
          ),

          `Follow-up: ${application.company}`

        );

      AppLogger.info(
        JSON.stringify(result)
      );

      if (!result.success) {

        AppLogger.error(
          "RetryService returned failure."
        );

        return false;

      }

      AppLogger.info(
        "Updating sheet..."
      );

      ApplicationRepository.markFollowUpSent(
        application
      );

      AppLogger.info(
        "Follow-up completed successfully."
      );

      return true;

    }
    catch (error) {

      AppLogger.error(error);

      return false;

    }

  }

}