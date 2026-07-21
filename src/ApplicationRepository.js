class ApplicationRepository {

  static getSheet() {

    return SpreadsheetApp
      .openById(CONSTANTS.SPREADSHEET_ID)
      .getSheetByName(CONSTANTS.SHEETS.APPLICATIONS);

  }

  static updateFields(
    rowNumber,
    updates
  ) {

    const sheet = this.getSheet();

    for (const [column, value] of Object.entries(updates)) {

      sheet
        .getRange(
          rowNumber,
          Number(column) + 1
        )
        .setValue(value);

    }

  }

  static mapRow(row, rowNumber) {

  return {

    rowNumber,

    company:
      row[Columns.APPLICATIONS.COMPANY],

    jobTitle:
      row[Columns.APPLICATIONS.JOB_TITLE],

    jobUrl:
      row[Columns.APPLICATIONS.JOB_URL],

    jobDescription:
      row[Columns.APPLICATIONS.JOB_DESCRIPTION],

    recipientName:
      row[Columns.APPLICATIONS.RECIPIENT_NAME],

    recipientEmail:
      row[Columns.APPLICATIONS.RECIPIENT_EMAIL],

    recipientRole:
      row[Columns.APPLICATIONS.RECIPIENT_ROLE],

    appliedDate:
      row[Columns.APPLICATIONS.APPLIED_DATE],

    sentDate:
      row[Columns.APPLICATIONS.SENT_DATE],

    status:
      row[Columns.APPLICATIONS.STATUS],

    senderAccount:
      row[Columns.APPLICATIONS.SENDER_ACCOUNT],

    draftId:
      row[Columns.APPLICATIONS.DRAFT_ID],

    threadId:
      row[Columns.APPLICATIONS.THREAD_ID],

    followUpCount:
      Number(
        row[
          Columns.APPLICATIONS.FOLLOW_UP_COUNT
        ] || 0
      ),

    lastFollowUp:
      row[
        Columns.APPLICATIONS.LAST_FOLLOW_UP
      ],

    replied:
      row[
        Columns.APPLICATIONS.REPLIED],

    priority:
      row[
        Columns.APPLICATIONS.PRIORITY
      ],

    created:
      row[
        Columns.APPLICATIONS.CREATED
      ],

    updated:
      row[
        Columns.APPLICATIONS.UPDATED
      ],

    error:
      row[
        Columns.APPLICATIONS.ERROR
      ]

  };

} 

  static getApplications() {

  const sheet = this.getSheet();

  const values =
    sheet.getDataRange().getValues();

  const applications = [];

  for (let i = 1; i < values.length; i++) {

    applications.push(

      this.mapRow(
        values[i],
        i + 1
      )

    );

  }

  return applications;

}


  static getNewApplications() {

    return this
      .getApplications()
      .filter(application =>

        application.status ===
        CONSTANTS.STATUS.NEW

      );

}



  static getSentApplications() {

  return this
    .getApplications()
    .filter(application =>

      application.status ===
      CONSTANTS.STATUS.SENT

    );

}

  static getPendingFollowUps() {

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

  return this
    .getSentApplications()
    .filter(application => {

      if (application.replied === true) {
        return false;
      }

      if (
        application.followUpCount >= maxFollowUps
      ) {
        return false;
      }

      const referenceDate =
        application.lastFollowUp ||
        application.sentDate;

      if (!referenceDate) {
        return false;
      }

      const days =
        (today - new Date(referenceDate))
        / (1000 * 60 * 60 * 24);

      return days >= afterDays;

    });

}

  static markDraftCreated(
  rowNumber,
  senderEmail,
  draft
) {

  this.updateFields(
    rowNumber,
    {

      [Columns.APPLICATIONS.STATUS]:
        CONSTANTS.STATUS.DRAFT_CREATED,

      [Columns.APPLICATIONS.SENDER_ACCOUNT]:
        senderEmail,

      [Columns.APPLICATIONS.DRAFT_ID]:
        draft.id,

      [Columns.APPLICATIONS.THREAD_ID]:
        draft.threadId,

      [Columns.APPLICATIONS.UPDATED]:
        new Date()

    }
  );

}

  static updateError(
  rowNumber,
  error
) {

  this.updateFields(
    rowNumber,
    {

      [Columns.APPLICATIONS.ERROR]:
        error,

      [Columns.APPLICATIONS.STATUS]:
        CONSTANTS.STATUS.ERROR,

      [Columns.APPLICATIONS.UPDATED]:
        new Date()

    }
  );

}

  static updateStatus(
    rowNumber,
    status
  ) {

    this.updateFields(
      rowNumber,
      {

        [Columns.APPLICATIONS.STATUS]:
          status,

        [Columns.APPLICATIONS.UPDATED]:
          new Date()

      }
    );

  }

  static markReplied(application) {

    this.updateFields(
      application.rowNumber,
      {

        [Columns.APPLICATIONS.REPLIED]:
          true,

        [Columns.APPLICATIONS.STATUS]:
          CONSTANTS.STATUS.REPLIED,

        [Columns.APPLICATIONS.UPDATED]:
          new Date()

      }
    );

  }



  static markSent(rowNumber) {

    const now = new Date();

    this.updateFields(
      rowNumber,
      {

        [Columns.APPLICATIONS.STATUS]:
          CONSTANTS.STATUS.SENT,

        [Columns.APPLICATIONS.SENT_DATE]:
          now,

        [Columns.APPLICATIONS.UPDATED]:
          now

      }
    );

  }


  static updateFollowUp(
    rowNumber,
    followUpCount,
    lastFollowUp
  ) {

    this.updateFields(
      rowNumber,
      {

        [Columns.APPLICATIONS.FOLLOW_UP_COUNT]:
          followUpCount,

        [Columns.APPLICATIONS.LAST_FOLLOW_UP]:
          lastFollowUp,

        [Columns.APPLICATIONS.UPDATED]:
          new Date()

      }
    );

  }

  static assignSender(
    rowNumber,
    senderEmail
  ) {

    this.updateFields(
      rowNumber,
      {
        [Columns.APPLICATIONS.ASSIGNED_SENDER]:
          senderEmail,

        [Columns.APPLICATIONS.UPDATED]:
          new Date()
      }
    );

}

  static claimNextApplication() {

    const sheet = this.getSheet();

    const values = sheet.getDataRange().getValues();

    const now = new Date();

    for (let i = 1; i < values.length; i++) {

      const row = values[i];

      if (
        row[Columns.APPLICATIONS.STATUS] !==
        CONSTANTS.STATUS.NEW
      ) {
        continue;
      }

      const token =
        this.generateClaimToken();

      sheet.getRange(
        i + 1,
        ColumnHelper.sheet(
          Columns.APPLICATIONS.CLAIMED_BY
        )
      ).setValue(token);

      sheet.getRange(
        i + 1,
        ColumnHelper.sheet(
          Columns.APPLICATIONS.CLAIMED_AT
        )
      ).setValue(now);

      SpreadsheetApp.flush();

      const verify =
        sheet
          .getRange(
            i + 1,
            1,
            1,
            row.length
          )
          .getValues()[0];

      if (
        verify[
          Columns.APPLICATIONS.CLAIMED_BY
        ] !== token
      ) {

        continue;

      }

      const currentToken =
        sheet.getRange(
          i + 1,
          ColumnHelper.sheet(
            Columns.APPLICATIONS.CLAIMED_BY
          )
        ).getValue();

      if (currentToken !== token) {

        continue;

      }

      row[Columns.APPLICATIONS.STATUS] =
        CONSTANTS.STATUS.PROCESSING;

      row[Columns.APPLICATIONS.CLAIMED_BY] =
        token;

      row[Columns.APPLICATIONS.CLAIMED_AT] =
        now;

      row[Columns.APPLICATIONS.UPDATED] =
        now;

      sheet.getRange(
          i + 1,
          1,
          1,
          row.length
        )
        .setValues([row]);

      SpreadsheetApp.flush();

      return this.mapRow(
        row,
        i + 1
      );

    }

    return null;

  }

  static generateClaimToken() {

    return Utilities.getUuid();

}
  static releaseExpiredClaims() {

    const sheet = this.getSheet();

    const values = sheet.getDataRange().getValues();

    const now = new Date();

    const timeoutMillis =
      CONSTANTS.QUEUE.CLAIM_TIMEOUT_MINUTES * 60 * 1000;

    for (let i = 1; i < values.length; i++) {

      const row = values[i];

      // Skip anything not being processed
      if (row[Columns.APPLICATIONS.STATUS] !== CONSTANTS.STATUS.PROCESSING) {
        continue;
      }

      const claimedAt =
        row[Columns.APPLICATIONS.CLAIMED_AT];

      // If there is no timestamp, ignore
      if (!claimedAt) {
        continue;
      }

      const age = now - new Date(claimedAt);

      if (age < timeoutMillis) {
        continue;
      }

      Logger.log(
        `Releasing expired claim: ${row[Columns.APPLICATIONS.COMPANY]}`
      );

      row[Columns.APPLICATIONS.STATUS] = CONSTANTS.STATUS.NEW;
      row[Columns.APPLICATIONS.CLAIMED_BY] = "";
      row[Columns.APPLICATIONS.CLAIMED_AT] = "";
      row[Columns.APPLICATIONS.UPDATED] = now;

      sheet
        .getRange(i + 1, 1, 1, row.length)
        .setValues([row]);

    }

    SpreadsheetApp.flush();

  }

  static getApplicationsByStatus(status) {

    const sheet = this.getSheet();

    const values = sheet.getDataRange().getValues();

    const applications = [];

    for (let i = 1; i < values.length; i++) {

      const row = values[i];

      if (
        row[Columns.APPLICATIONS.STATUS] !== status
      ) {
        continue;
      }

      applications.push(
        this.mapRow(
          row,
          i + 1
        )
      );

    }

    return applications;

  }

  static getApplicationsReadyForFollowUp() {

    const applications =
      this.getApplicationsByStatus(
        CONSTANTS.STATUS.SENT
      );

    const now = new Date();

    const ready = [];

    for (const application of applications) {

      Logger.log({
        company: application.company,
        status: application.status,
        sentDate: application.sentDate,
        lastFollowUp: application.lastFollowUp,
        followUpCount: application.followUpCount,
        replied: application.replied
      });

      if (application.replied) {
        continue;
      }

      if (
        application.followUpCount >= 3
      ) {
        continue;
      }

      const lastActivity =
        application.lastFollowUp ||
        application.sentDate;

      if (!lastActivity) {
        continue;
      }

      const days =
        Math.floor(
          (now - new Date(lastActivity))
          / (1000 * 60 * 60 * 24)
        );

      if (days < 5) {
        continue;
      }

      ready.push(application);

    }

    return ready;

  }

  static markFollowUpSent(application) {

    this.updateFields(
      application.rowNumber,
      {

        [Columns.APPLICATIONS.FOLLOW_UP_COUNT]:
          application.followUpCount + 1,

        [Columns.APPLICATIONS.LAST_FOLLOW_UP]:
          new Date(),

        [Columns.APPLICATIONS.UPDATED]:
          new Date()

      }
    );

  } 

  static getApplicationsAwaitingReply() {

    return this.getApplications()
      .filter(application =>

        application.status === CONSTANTS.STATUS.SENT &&
        !application.replied &&
        application.threadId

      );

  }

}




