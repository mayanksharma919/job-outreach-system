class RecoveryService {

  static run() {

    AppLogger.info("Starting Recovery Service...");

    const recovered =
        this.recoverRows();

    AppLogger.info(
        `Recovery Service completed. Recovered ${recovered} rows.`
    );

}

    static recoverRows() {

        const sheet =
            SpreadsheetService.getSheet(
                CONSTANTS.SHEETS.APPLICATIONS
            );

        const values =
            sheet.getDataRange().getValues();

        const now = new Date();

        let recovered = 0;

        for (let i = 1; i < values.length; i++) {

            const row = values[i];

            if (
                row[Columns.APPLICATIONS.STATUS] !==
                CONSTANTS.STATUS.PROCESSING
            ) {
                continue;
            }

            const updated =
                row[Columns.APPLICATIONS.UPDATED];

            if (!(updated instanceof Date))
                continue;

            const age =
                (now - updated) / 60000;

            if (
                age <
                CONSTANTS.RECOVERY.STUCK_MINUTES
            ) {
                continue;
            }

            this.resetRow(
                sheet,
                row,
                i + 1,
                "Recovered automatically"
            );

            recovered++;

        }

        return recovered;

    }

    static resetRow(
        sheet,
        row,
        rowNumber,
        reason
    ) {

        let retries =
            Number(
                row[
                    Columns.APPLICATIONS.RETRY_COUNT
                ]
            ) || 0;

        retries++;

        row[
            Columns.APPLICATIONS.RETRY_COUNT
        ] = retries;

        row[
            Columns.APPLICATIONS.LAST_ERROR
        ] = reason;

        row[
            Columns.APPLICATIONS.UPDATED
        ] = new Date();

        row[
            Columns.APPLICATIONS.CLAIMED_BY
        ] = "";

        row[
            Columns.APPLICATIONS.CLAIMED_AT
        ] = "";

        row[
            Columns.APPLICATIONS.SENDER_ACCOUNT
        ] = "";

        if (
            retries >=
            CONSTANTS.RECOVERY.MAX_RETRIES
        ) {

            row[
                Columns.APPLICATIONS.STATUS
            ] =
            CONSTANTS.STATUS.FAILED;

        } else {

            row[
                Columns.APPLICATIONS.STATUS
            ] =
            CONSTANTS.STATUS.NEW;

        }

        sheet
            .getRange(
                rowNumber,
                1,
                1,
                row.length
            )
            .setValues([row]);

    }

    static retryRow(sheet, values, rowIndex, reason) {

        const retries =
            Number(
                values[rowIndex][Columns.APPLICATIONS.RETRY_COUNT]
            ) || 0;

        const row = rowIndex + 1;

        if (retries >= 3) {

            sheet.getRange(
                row,
                Columns.APPLICATIONS.STATUS + 1
            ).setValue("FAILED");

        } else {

            sheet.getRange(
                row,
                Columns.APPLICATIONS.STATUS + 1
            ).setValue(CONSTANTS.STATUS.NEW);

            sheet.getRange(
                row,
                Columns.APPLICATIONS.RETRY_COUNT + 1
            ).setValue(retries + 1);

        }

        sheet.getRange(
            row,
            Columns.APPLICATIONS.CLAIMED_BY + 1
        ).setValue("");

        sheet.getRange(
            row,
            Columns.APPLICATIONS.SENDER_ACCOUNT + 1
        ).setValue("");

        sheet.getRange(
            row,
            Columns.APPLICATIONS.LAST_ERROR + 1
        ).setValue(reason);

        sheet.getRange(
            row,
            Columns.APPLICATIONS.UPDATED + 1
        ).setValue(new Date());

    }



}