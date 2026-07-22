class BounceService {

  static hasBounced(application) {

    const thread =
      GmailApp.getThreadById(application.threadId);

    if (!thread) {
      return false;
    }

    const messages =
      thread.getMessages();

    for (const message of messages) {

      const from =
        message.getFrom().toLowerCase();

      const subject =
        message.getSubject().toLowerCase();

      if (
        from.includes("mailer-daemon") ||
        from.includes("mail delivery subsystem") ||
        from.includes("postmaster")
      ) {

        Logger.log(
          `Bounce detected: ${application.company}`
        );

        return true;
      }

      if (
        subject.includes("delivery") ||
        subject.includes("undelivered") ||
        subject.includes("returned")
      ) {

        Logger.log(
          `Bounce detected: ${application.company}`
        );

        return true;
      }

    }

    return false;

  }

}