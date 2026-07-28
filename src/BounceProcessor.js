class BounceProcessor {

  static process(application) {

    try {

      const bounce =
        BounceService.hasBounced(application);

      if (!bounce.bounced) {

        return false;

      }

      ApplicationRepository.updateStatus(
        application,
        CONSTANTS.STATUS.BOUNCED
      );

      EmailEventRepository.log(

          application.recipientEmail,

          application.senderAccount,

          "BOUNCE",

          bounce.type,

          bounce.reason

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