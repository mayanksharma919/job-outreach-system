class DraftStatusService {

  static process() {

    AppLogger.info(
      "Checking draft statuses..."
    );

    const applications =
      ApplicationRepository.getApplicationsByStatus(
        CONSTANTS.STATUS.DRAFT_CREATED
      );

    if (!applications.length) {

      AppLogger.info(
        "No draft applications found."
      );

      return;

    }

    let updated = 0;

    for (const application of applications) {

      try {

        if (!application.threadId) {
          continue;
        }

        const sent =
          GmailService.threadHasSentMessage(
            application.threadId
          );

        if (!sent) {
          continue;
        }

        ApplicationRepository.markSent(
          application.rowNumber
        );

        updated++;

        AppLogger.info(
          `Marked as SENT: ${application.company}`
        );

      }
      catch (error) {

        AppLogger.error(
          `DraftStatusService - ${application.company}: ${error}`
        );

      }

    }

    AppLogger.info(
      `Draft synchronization complete. ${updated} application(s) updated.`
    );

  }

}