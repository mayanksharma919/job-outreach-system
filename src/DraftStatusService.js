class DraftStatusService {

  static syncSentDrafts() {

    const sheet =
      ApplicationRepository.getSheet();

    const values =
      sheet.getDataRange().getValues();

    for (let i = 1; i < values.length; i++) {

      const row = values[i];

      const status =
        row[Columns.APPLICATIONS.STATUS];

      // if (
      //   status !==
      //   CONSTANTS.STATUS.DRAFT_CREATED
      // ) {
      //   continue;
      // }

      Logger.log(
        `Row ${i + 1}: Status = ${status}`
      );

      if (
        status !==
        CONSTANTS.STATUS.DRAFT_CREATED
      ) {
        continue;
      }

      const threadId =
        row[Columns.APPLICATIONS.THREAD_ID];

      if (!threadId) {
        continue;
      }

      if (
        !GmailService.threadHasSentMessage(
          threadId
        )
      ) {
        continue;
      }

      ApplicationRepository.markSent(i + 1);

      Logger.logSuccess(
      `Marked as SENT: ${
        row[Columns.APPLICATIONS.COMPANY]
      }`
    );
    }

  }

}