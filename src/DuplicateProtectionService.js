class DuplicateProtectionService {

  static alreadyContacted(application) {

    const enabled = Config.get(
      CONSTANTS.CONFIG_KEYS.ENABLE_DUPLICATE_CHECK
    );

    if (enabled !== "TRUE") {

      return false;

    }

    const label = Config.get(
      CONSTANTS.CONFIG_KEYS.GMAIL_LABEL
    );

    const query =
      `label:"${label}" to:${application.recipientEmail}`;

    const threads =
      GmailApp.search(query, 0, 1);

    return threads.length > 0;

  }

}