class FollowUpProcessor {

  static process(application) {

    try {

      if (
        !FollowUpService.isFollowUpDue(application)
      ) {
        return false;
      }

      const followUp =
        FollowUpGenerator.generate(
          application
        );

      const result =
        RetryService.execute(

          () => GmailService.sendFollowUp(
            application,
            followUp
          ),

          `Follow-up: ${application.company}`

        );

      if (!result.success) {

        ApplicationRepository.updateStatus(

          application,

          CONSTANTS.STATUS.FAILED

        );

        AppLogger.error(

          `Follow-up permanently failed: ${application.company}`

        );

        return false;

      }

      ApplicationRepository.markFollowUpSent(
        application
      );

      AppLogger.info(
        `Follow up sent: ${application.company}`
      );

      return true;

    }
    catch (error) {

      AppLogger.error(
        `Follow up failed: ${application.company} - ${error}`
      );

      return false;

    }

  }

}