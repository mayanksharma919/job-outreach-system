class DuplicateProtectionService {

  static findExistingConversation(application) {

    const enabled = Config.get(
      CONSTANTS.CONFIG_KEYS.ENABLE_DUPLICATE_CHECK
    );

    if (enabled !== "TRUE") {

      return null;

    }

    const label = Config.get(
      CONSTANTS.CONFIG_KEYS.GMAIL_LABEL
    );

    const query =
      `label:"${label}" to:${application.recipientEmail}`;

    const threads =
      GmailApp.search(query, 0, 1);

    if (threads.length === 0) {

      return null;

    }

    const thread = threads[0];

    return {

      threadId: thread.getId(),

      hasSentMessage:
        GmailService.threadHasSentMessage(
          thread.getId()
        )

    };

  }

}