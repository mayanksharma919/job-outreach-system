class SenderSelector {


  static currentSenderEmail = null;

  static getCurrentSender() {

    if (this.currentSender) {

      return this.currentSender;

    }

    const email =
      this.getCurrentSenderEmail();

    const sender =
      SenderRepository
        .getAll()
        .find(sender =>
          sender.email === email
        );

    if (!sender) {

      throw new Error(
        `Current sender '${email}' is not configured.`
      );

    }

    this.currentSender = sender;

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

  static getCurrentSenderEmail() {

    if (this.currentSenderEmail) {
      return this.currentSenderEmail;
    }

    this.currentSenderEmail =
      Config.get(
        CONSTANTS.CONFIG_KEYS.SENDER_EMAIL
      );

    return this.currentSenderEmail;

  }

}

