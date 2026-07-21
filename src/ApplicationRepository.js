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
        Columns.APPLICATIONS.REPLIED
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

  static markReplied(rowNumber) {

    this.updateFields(
      rowNumber,
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

      this.updateFields(
        i + 1,
        {
          [Columns.APPLICATIONS.STATUS]:
            CONSTANTS.STATUS.PROCESSING,

          [Columns.APPLICATIONS.CLAIMED_BY]:
            "",

          [Columns.APPLICATIONS.CLAIMED_AT]:
            now,

          [Columns.APPLICATIONS.UPDATED]:
            now
        }
      );

      return this.mapRow(
        row,
        i + 1
      );

    }

    return null;

  }

}




