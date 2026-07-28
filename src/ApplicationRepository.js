class ApplicationRepository {

  static getSheet() {

    return SpreadsheetService.getSheet(
      CONSTANTS.SHEETS.APPLICATIONS
    );

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

    recipientTag:
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

  static getActiveApplications() {

    return this
      .getApplications()
      .filter(application =>
        application.status === CONSTANTS.STATUS.SENT
      );

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

  static recoverFromGmail(
    rowNumber,
    conversation
  ) {

    this.updateFields(
      rowNumber,
      {

        [Columns.APPLICATIONS.STATUS]:

          conversation.hasSentMessage
            ? CONSTANTS.STATUS.SENT
            : CONSTANTS.STATUS.DRAFT_CREATED,

        [Columns.APPLICATIONS.THREAD_ID]:
          conversation.threadId,

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


  static markSent(
    rowNumber,
    senderEmail,
    threadId
) {

    const now = new Date();

    this.updateFields(
        rowNumber,
        {
            [Columns.APPLICATIONS.STATUS]:
                CONSTANTS.STATUS.SENT,

            [Columns.APPLICATIONS.SENDER_ACCOUNT]:
                senderEmail,

            [Columns.APPLICATIONS.THREAD_ID]:
                threadId,

            [Columns.APPLICATIONS.DRAFT_ID]:
                "",

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

  static claimNextApplication(senderEmail) {

    const lock = LockService.getScriptLock();

    if (!lock.tryLock(5000)) {

    AppLogger.info(
        `Could not obtain queue lock for ${senderEmail}.`
    );

    AppLogger.info(
        `Claimed row ${rowNumber} by ${senderEmail}`
      );

    return null;

}

    try {

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

      this.updateFields(
        i + 1,
        {
          [Columns.APPLICATIONS.STATUS]: CONSTANTS.STATUS.PROCESSING,
          [Columns.APPLICATIONS.CLAIMED_BY]: token,
          [Columns.APPLICATIONS.CLAIMED_AT]: now,
          [Columns.APPLICATIONS.UPDATED]: now,
          [Columns.APPLICATIONS.SENDER_ACCOUNT]: senderEmail
        }
      );

      SpreadsheetApp.flush();

      const updatedRow =
        sheet
          .getRange(i + 1, 1, 1, row.length)
          .getValues()[0];


      AppLogger.info(
        `Claimed row ${i + 1} | Status=${updatedRow[Columns.APPLICATIONS.STATUS]} | Sender=${updatedRow[Columns.APPLICATIONS.SENDER_ACCOUNT]}`
      );

      return this.mapRow(
        updatedRow,
        i + 1
      );

    }

    return null;

  }
  finally {

    lock.releaseLock();

  }

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

      AppLogger.info(
        `Releasing expired claim: ${row[Columns.APPLICATIONS.COMPANY]}`
      );

      this.updateFields(
        i + 1,
        {
          [Columns.APPLICATIONS.STATUS]: CONSTANTS.STATUS.NEW,
          [Columns.APPLICATIONS.CLAIMED_BY]: "",
          [Columns.APPLICATIONS.CLAIMED_AT]: "",
          [Columns.APPLICATIONS.UPDATED]: now
        }
      );

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

  static updateStatus(application, status) {

    this.updateFields(
      application.rowNumber,
      {

        [Columns.APPLICATIONS.STATUS]:
          status,

        [Columns.APPLICATIONS.UPDATED]:
          new Date()

      }
    );

  }


  static getApplicationsAwaitingReply() {

    return this.getApplications()
      .filter(application =>

        application.status === CONSTANTS.STATUS.SENT &&
        application.threadId

      );

  }

}




