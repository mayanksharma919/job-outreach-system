class ReplyProcessor {

  static process() {

    AppLogger.info(
      "Checking replies..."
    );

    const applications =
      ApplicationRepository.getApplicationsAwaitingReply();

    let replies = 0;

    for (const application of applications) {

      try {

        if (
          !GmailService.hasReply(application)
        ) {
          continue;
        }

        ApplicationRepository.markReplied(
          application
        );

        replies++;

        AppLogger.info(
          `Reply detected: ${application.company}`
        );

      }
      catch (error) {

        AppLogger.error(
          `Reply check failed: ${application.company} - ${error}`
        );

      }

    }

    AppLogger.info(
      `${replies} replies detected.`
    );

  }

}