class SenderSelector {

  static getCurrentSenderEmail() {

    if (!this._currentSenderEmail) {

      this._currentSenderEmail =
        Config.get(
          CONSTANTS.CONFIG_KEYS.SENDER_EMAIL
        );

    }

    return this._currentSenderEmail;

  }

  static getCurrentSender() {

    const email =
      this.getCurrentSenderEmail();

    const sender =
      SenderRepository.getByEmail(email)

    if (!sender) {

      throw new Error(
        `Current sender '${email}' is not configured.`
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

    return sender.sentToday <
      sender.dailyLimit;

  }

}