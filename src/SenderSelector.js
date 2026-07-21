class SenderSelector {

  static getCurrentSender() {

    const email =
      Session.getActiveUser().getEmail();

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