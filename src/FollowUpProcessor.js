class FollowUpProcessor {

  static process(application) {

    AppLogger.info(
        `Checking follow-up eligibility: ${application.company}`
    );

    try {

      if (
        !FollowUpService.isFollowUpDue(application)
      ) {

        AppLogger.info(
            `Not yet due: ${application.company}`
        );
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

      application.followUpCount++;
      application.lastFollowUp = new Date();

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