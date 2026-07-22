class ReplyProcessor {

  static process(application) {

    try {

      const hasReply =
        ReplyService.hasRecruiterReplied(application);

      if (!hasReply) {
        return false;
      }

      ApplicationRepository.updateStatus(
        application,
        CONSTANTS.STATUS.REPLIED
      );

      AppLogger.info(
        `Reply detected: ${application.company}`
      );

      return true;

    } catch (error) {

      AppLogger.error(
        `Reply check failed: ${application.company} - ${error}`
      );

      return false;

    }

  }

}