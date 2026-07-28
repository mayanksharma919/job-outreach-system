class BounceService {

  static hasBounced(application) {

    const thread =
      GmailApp.getThreadById(application.threadId);

    if (!thread) {

      return {
        bounced: false
      };

    }

    const messages = thread.getMessages();

    for (const message of messages) {

      const from =
        message.getFrom().toLowerCase();

      const subject =
        message.getSubject().toLowerCase();

      const body =
        message.getPlainBody().toLowerCase();

      if (
        from.includes("mailer-daemon") ||
        from.includes("mail delivery subsystem") ||
        from.includes("postmaster") ||
        subject.includes("delivery") ||
        subject.includes("undelivered") ||
        subject.includes("returned")
      ) {

        return {

          bounced: true,

          type: this.classify(body),

          reason: subject

        };

      }

    }

    return {

      bounced: false

    };

  }

  static classify(body) {

    if (

      body.includes("user unknown") ||

      body.includes("recipient address rejected") ||

      body.includes("no such user") ||

      body.includes("does not exist") ||

      body.includes("550")

    ) {

      return "HARD";

    }

    if (

      body.includes("mailbox full") ||

      body.includes("quota exceeded") ||

      body.includes("452") ||

      body.includes("over quota")

    ) {

      return "SOFT";

    }

    return "TEMPORARY";

  }

}