class ReplyTrackingService {

  static hasReply(application) {

    if (!application.threadId) {
      return false;
    }

    const thread =
      GmailApp.getThreadById(
        application.threadId
      );

    if (!thread) {
      return false;
    }

    const messages =
      thread.getMessages();

    if (messages.length <= 1) {
      return false;
    }

    const myEmail =
      Session.getActiveUser().getEmail();

    for (const message of messages) {

      if (
        message.isDraft() ||
        message.isInChats()
      ) {
        continue;
      }

      if (
        !message.getFrom().includes(myEmail)
      ) {
        return true;
      }

    }

    return false;

  }

}