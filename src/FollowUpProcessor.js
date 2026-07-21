class FollowUpProcessor {

  static processPendingFollowUps() {

    const followUps =
      FollowUpRepository.getPendingFollowUps();

    AppLogger.info(
      `Found ${followUps.length} pending follow-ups.`
    );

    for (const followUp of followUps) {

      try {

        AppLogger.info(
          `Processing follow-up for ${followUp.company}`
        );

        // We'll replace this in the next step.
        GmailService.sendFollowUp(followUp);

        ApplicationRepository.updateFollowUp(

          followUp.rowNumber,

          followUp.followUpCount + 1,

          new Date()

        );

        AppLogger.info(
          `Follow-up sent for ${followUp.company}`
        );

      } catch (error) {

        AppLogger.error(
          `Failed follow-up for ${followUp.company}: ${error}`
        );

      }

    }

    AppLogger.info(
      "Follow-up processing completed."
    );

  }

}