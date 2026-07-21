class FollowUpProcessor {

  static process() {

    AppLogger.info(
      "Starting Follow Up Processor..."
    );

    const applications =
      ApplicationRepository.getApplicationsReadyForFollowUp();

    if (!applications.length) {

      AppLogger.info(
        "No follow ups due."
      );

      return;

    }

    let sent = 0;

    for (const application of applications) {

      try {

        const followUp =
          FollowUpGenerator.generate(
            application
          );

        GmailService.sendFollowUp(
          application,
          followUp
        );

        ApplicationRepository.markFollowUpSent(
          application
        );

        sent++;

        AppLogger.info(
          `Follow up sent: ${application.company}`
        );

      }
      catch (error) {

        AppLogger.error(
          `Follow up failed: ${application.company} - ${error}`
        );

      }

    }

    AppLogger.info(
      `Follow Up Processor completed. ${sent} follow ups sent.`
    );

  }

}