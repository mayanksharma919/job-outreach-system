class FollowUpRepository {

  static getPendingFollowUps() {

    const sheet =
      ApplicationRepository.getSheet();

    const values =
      sheet.getDataRange().getValues();

    const followUps = [];

    const maxFollowUps = Number(
      Config.get(
        CONSTANTS.CONFIG_KEYS.MAX_FOLLOW_UPS
      )
    );

    const afterDays = Number(
      Config.get(
        CONSTANTS.CONFIG_KEYS.FOLLOW_UP_AFTER_DAYS
      )
    );

    const today = new Date();

    for (let i = 1; i < values.length; i++) {

      const row = values[i];

      const status = row[Columns.APPLICATIONS.STATUS];

      const threadId = row[Columns.APPLICATIONS.THREAD_ID];

      const followUpCount = Number(
        row[Columns.APPLICATIONS.FOLLOW_UP_COUNT] || 0
      );

      const lastFollowUp = row[Columns.APPLICATIONS.LAST_FOLLOW_UP];

      const sentDate =
        row[Columns.APPLICATIONS.SENT_DATE];

      Logger.log("----------------------");
      Logger.log(
      "Company: " +
      row[Columns.APPLICATIONS.COMPANY]
    );
      Logger.log("Status: " + status);
      Logger.log("Thread ID: " + threadId);
      Logger.log("Follow-up Count: " + followUpCount);
      Logger.log("Last Follow-up: " + lastFollowUp);

      if (status !== CONSTANTS.STATUS.SENT) {
        continue;
      }

      if (followUpCount >= maxFollowUps) {
        continue;
      }


      const referenceDate =
        lastFollowUp || sentDate;

      if (!referenceDate) {
        continue;
      }

      const days =
        (today - new Date(referenceDate))
        / (1000 * 60 * 60 * 24);


      if (days < afterDays) {
        continue;
      }

      followUps.push({

        rowNumber: i + 1,

        company:
          row[Columns.APPLICATIONS.COMPANY],

        recipientName:
          row[Columns.APPLICATIONS.RECIPIENT_NAME],

        recipientEmail:
          row[Columns.APPLICATIONS.RECIPIENT_EMAIL],

        threadId,

        followUpCount

      });

    }

    return followUps;

  }

}