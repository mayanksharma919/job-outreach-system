class ReplyService {

  static hasRecruiterReplied(application) {

    if (!application.threadId) {

        return false;

    }

    const thread = GmailApp.getThreadById(
      application.threadId
    );

    if (!thread) {
      return false;
    }

    const senderEmail =
        application.senderAccount
            .trim()
            .toLowerCase();

    const messages = thread.getMessages();

    // Skip the first message because it is always our initial email.
    for (let i = 1; i < messages.length; i++) {

        const from =
            messages[i]
                .getFrom()
                .toLowerCase();

        AppLogger.info(
            `Checking reply from: ${from}`
        );

        if (!from.includes(senderEmail)) {

            AppLogger.info(
                `External reply detected: ${from}`
            );

            return true;

        }

    }

    return false;

  }

  static updateReplies() {

    const applications =
        ApplicationRepository.getApplicationsByStatus(
        CONSTANTS.STATUS.SENT
        );

    for (const application of applications) {

        if (application.status === CONSTANTS.STATUS.REPLIED) {
            continue;
        }

        if (!application.threadId) {
        continue;
        }

        if (!this.hasRecruiterReplied(application)) {
        continue;
        }

        Logger.log(
        `Marking ${application.company} as replied.`
        );

        ApplicationRepository.updateStatus(
            application,
            CONSTANTS.STATUS.REPLIED
        );

        EmailEventRepository.log(

          application.recipientEmail,

          application.senderAccount,

          "REPLY",

          "RECRUITER",

          application.company

      );

      AppLogger.info(
          `Reply detected: ${application.company}`
      );

    }

    }

}