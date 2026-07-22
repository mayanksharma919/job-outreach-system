class BounceProcessor {

  static process(application) {

    try {

      if (
        !BounceService.hasBounced(application)
      ) {
        return false;
      }

      ApplicationRepository.updateStatus(
        application,
        CONSTANTS.STATUS.BOUNCED
      );

      AppLogger.info(
        `Bounce detected: ${application.company}`
      );

      return true;

    }
    catch (error) {

      AppLogger.error(
        `Bounce check failed: ${application.company} - ${error}`
      );

      return false;

    }

  }

}