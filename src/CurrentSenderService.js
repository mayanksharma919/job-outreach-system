class CurrentSenderService {

  static getEmail() {

    return Session
      .getActiveUser()
      .getEmail();

  }

  static getSender() {

    const email =
      this.getEmail();

    const sender =
      SenderRepository
        .getAll()
        .find(sender =>
          sender.email === email
        );

    if (!sender) {

      throw new Error(
        `Sender '${email}' not configured.`
      );

    }

    return sender;

  }

}