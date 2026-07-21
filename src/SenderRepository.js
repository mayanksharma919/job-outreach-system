class SenderRepository {

  static getSheet() {

    return SpreadsheetApp
      .getActiveSpreadsheet()
      .getSheetByName(CONSTANTS.SHEETS.SENDER_ACCOUNTS);

  }

  static getAll() {

    const sheet = this.getSheet();
    const values = sheet.getDataRange().getValues();

    const senders = [];

    for (let i = 1; i < values.length; i++) {

      const row = values[i];

      senders.push({

        rowNumber: i + 1,

        email: row[Columns.SENDERS.EMAIL],

        status: row[Columns.SENDERS.STATUS],

        dailyLimit: Number(
          row[Columns.SENDERS.DAILY_LIMIT]
        ),

        sentToday: Number(
          row[Columns.SENDERS.SENT_TODAY]
        ),

        warmupStage: row[
          Columns.SENDERS.WARMUP_STAGE
        ],

        healthScore: Number(
          row[Columns.SENDERS.HEALTH_SCORE]
        ),

        lastSent: row[
          Columns.SENDERS.LAST_SENT
        ],

        lastReset: row[
          Columns.SENDERS.LAST_RESET
        ]

      });

    }

    return senders;

  }

  static getActive() {

    return this.getAll().filter(
      sender => sender.status === "ACTIVE"
    );

  }

  static incrementSentToday(email) {

    const sender = this.getAll().find(
      s => s.email === email
    );

    if (!sender) {

      throw new Error(
        `Sender not found: ${email}`
      );

    }

    this.getSheet()
      .getRange(
        sender.rowNumber,
        ColumnHelper.sheet(
          Columns.SENDERS.SENT_TODAY
        )
      )
      .setValue(sender.sentToday + 1);

  }

  static resetDailyCounters() {

    const sheet = this.getSheet();

    this.getAll().forEach(sender => {

      sheet.getRange(
        sender.rowNumber,
        ColumnHelper.sheet(
          Columns.SENDERS.SENT_TODAY
        )
      ).setValue(0);

      sheet.getRange(
        sender.rowNumber,
        ColumnHelper.sheet(
          Columns.SENDERS.LAST_RESET
        )
      ).setValue(new Date());

    });

  }

}