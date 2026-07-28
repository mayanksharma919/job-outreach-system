class ReplyService {

  static hasRecruiterReplied(application) {

    const thread = GmailApp.getThreadById(
      application.threadId
    );

    if (!thread) {
      return false;
    }

    const senderEmail = Config.get(
      CONSTANTS.CONFIG_KEYS.SENDER_EMAIL
    ).toLowerCase();

    const messages = thread.getMessages();

    for (const message of messages) {

      const from = message.getFrom().toLowerCase();

      if (!from.includes(senderEmail)) {

        Logger.log(
          `Recruiter replied: ${application.company}`
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
            return;
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

    }

    }

}