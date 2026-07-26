class SenderSelector {

  static getCurrentSenderEmail() {

    if (!this._currentSenderEmail) {

      const email = PropertiesService
        .getScriptProperties()
        .getProperty(CONSTANTS.CONFIG_KEYS.SENDER_EMAIL);

      if (!email) {
        throw new Error(
          "SENDER_EMAIL missing from Script Properties."
        );
      }

      this._currentSenderEmail = email.trim();

    }

    return this._currentSenderEmail;
  }

  static getCurrentSender() {

    const email =
      this.getCurrentSenderEmail();

    const sender =
      SenderRepository.getByEmail(email);

    if (!sender) {

      throw new Error(
        `Current sender '${email}' is not configured.`
      );

    }

    // Safety check
    const actualEmail = Session.getEffectiveUser().getEmail();

    if (
      actualEmail.toLowerCase() !==
      sender.email.toLowerCase()
    ) {
      throw new Error(
        `Configured sender (${sender.email}) does not match executing account (${actualEmail}).`
      );
    }

    return sender;

  }

  static canCurrentSenderSend() {

    const sender =
      this.getCurrentSender();

    if (sender.status !== "ACTIVE") {

      return false;

    }

    AppLogger.info(
      `Sender: ${sender.email}`
    );

    AppLogger.info(
      `Status: ${sender.status}`
    );

    AppLogger.info(
      `Sent Today: ${sender.sentToday}`
    );

    AppLogger.info(
      `Daily Limit: ${sender.dailyLimit}`
    );

    return sender.sentToday <
      sender.dailyLimit;

  }

}