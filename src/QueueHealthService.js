class QueueHealthService {

  static run() {

    const report = {
      totalApplications: 0,
      newApplications: 0,
      processingApplications: 0,
      sentApplications: 0,

      duplicateClaims: [],
      duplicateThreads: [],
      duplicateDrafts: [],
      orphanedRows: [],
      duplicateCompanies: [],
      stuckRows: []
    };

    const sheet = SpreadsheetService.getSheet(
      CONSTANTS.SHEETS.APPLICATIONS
    );

    const values = sheet.getDataRange().getValues();

    report.totalApplications = values.length - 1;

    this.checkStatuses(values, report);
    this.checkDuplicateClaims(values, report);
    this.checkDuplicateThreads(values, report);
    this.checkDuplicateDrafts(values, report);
    this.checkOrphanedRows(values, report);
    this.checkDuplicateCompanies(values, report);
    this.checkStuckRows(values, report);

    this.printReport(report);

    this.saveReport(report);

    return report;
  }


  static checkStuckRows(values, report) {

    const now = new Date();

    for (let i = 1; i < values.length; i++) {

        const status =
            values[i][Columns.APPLICATIONS.STATUS];

        if (status !== CONSTANTS.STATUS.PROCESSING)
            continue;

        const updated =
            values[i][Columns.APPLICATIONS.UPDATED];

        if (!(updated instanceof Date))
            continue;

        const ageMinutes =
            (now - updated) / 60000;

        if (ageMinutes >= 30) {

            report.stuckRows.push({

                row: i + 1,

                sender:
                    values[i][Columns.APPLICATIONS.SENDER_ACCOUNT],

                updated,

                ageMinutes:
                    Math.round(ageMinutes)

            });

        }

    }

}
  static checkStatuses(values, report) {

    for (let i = 1; i < values.length; i++) {

        const status =
        values[i][Columns.APPLICATIONS.STATUS];

        switch (status) {

        case CONSTANTS.STATUS.NEW:
            report.newApplications++;
            break;

        case CONSTANTS.STATUS.PROCESSING:
            report.processingApplications++;
            break;

        case CONSTANTS.STATUS.SENT:
            report.sentApplications++;
            break;

        }

    }

    }

    static checkDuplicateThreads(values, report) {

        const seen = {};

        for (let i = 1; i < values.length; i++) {

            const threadId =
            values[i][Columns.APPLICATIONS.THREAD_ID];

            if (!threadId)
            continue;

            if (seen[threadId]) {

            report.duplicateThreads.push({
                threadId,
                rows: [seen[threadId], i + 1]
            });

            } else {

            seen[threadId] = i + 1;

            }

        }

        }

    static checkDuplicateDrafts(values, report) {

        const seen = {};

        for (let i = 1; i < values.length; i++) {

            const draftId =
            values[i][Columns.APPLICATIONS.DRAFT_ID];

            if (!draftId)
            continue;

            if (seen[draftId]) {

            report.duplicateDrafts.push({
                draftId,
                rows: [seen[draftId], i + 1]
            });

            } else {

            seen[draftId] = i + 1;

            }

        }

        }

    static checkDuplicateClaims(values, report) {

        const seen = {};

        for (let i = 1; i < values.length; i++) {

            const claim =
            values[i][Columns.APPLICATIONS.CLAIMED_BY];

            if (!claim)
            continue;

            if (seen[claim]) {

            report.duplicateClaims.push({
                claim,
                rows: [seen[claim], i + 1]
            });

            } else {

            seen[claim] = i + 1;

            }

        }

        }

    static checkOrphanedRows(values, report) {

    for (let i = 1; i < values.length; i++) {

        const status =
        values[i][Columns.APPLICATIONS.STATUS];

        const sender =
        values[i][Columns.APPLICATIONS.SENDER_ACCOUNT];

        if (
        status === CONSTANTS.STATUS.PROCESSING &&
        !sender
        ) {

        report.orphanedRows.push(i + 1);

        }

    }

    }

    static checkDuplicateCompanies(values, report) {

        const seen = {};

        for (let i = 1; i < values.length; i++) {

            const company = String(
                values[i][Columns.APPLICATIONS.COMPANY]
            )
            .trim()
            .toLowerCase();

            if (company === "")
            continue;

            if (seen[company]) {

            report.duplicateCompanies.push({
                company,
                rows: [seen[company], i + 1]
            });

            } else {

            seen[company] = i + 1;

            }

        }

        }
    
    static printReport(report) {

        AppLogger.info("");

        AppLogger.info("========== QUEUE HEALTH ==========");

        AppLogger.info("Total Applications : " + report.totalApplications);

        AppLogger.info("NEW                : " + report.newApplications);

        AppLogger.info("PROCESSING         : " + report.processingApplications);

        AppLogger.info("SENT               : " + report.sentApplications);

        AppLogger.info("");

        AppLogger.info("Duplicate Claims   : " + report.duplicateClaims.length);

        AppLogger.info("Duplicate Threads  : " + report.duplicateThreads.length);

        if (report.duplicateThreads.length) {

            AppLogger.info(
                JSON.stringify(report.duplicateThreads, null, 2)
            );

        }

        AppLogger.info("Duplicate Drafts   : " + report.duplicateDrafts.length);

        AppLogger.info("Duplicate Companies: " + report.duplicateCompanies.length);

        AppLogger.info("Orphaned Rows      : " + report.orphanedRows.length);

        AppLogger.info(
            "Stuck Rows         : " +
            report.stuckRows.length
        );

        if (report.stuckRows.length) {

        AppLogger.info(
            JSON.stringify(
                report.stuckRows,
                null,
                2
            )
        );

    }

        AppLogger.info("");

        AppLogger.info(

            report.duplicateClaims.length === 0 &&
            report.duplicateThreads.length === 0 &&
            report.duplicateDrafts.length === 0 &&
            report.orphanedRows.length === 0 &&
            report.stuckRows.length === 0

            ? "QUEUE HEALTH: ✅ HEALTHY"

            : "QUEUE HEALTH: ❌ PROBLEMS DETECTED"

        );

        }

    static saveReport(report) {

    const sheet = SpreadsheetService.getSheet(
        CONSTANTS.SHEETS.QUEUE_HEALTH
    );

    const healthy =
        report.duplicateClaims.length === 0 &&
        report.duplicateThreads.length === 0 &&
        report.duplicateDrafts.length === 0 &&
        report.orphanedRows.length === 0 &&
        report.stuckRows.length === 0;

    sheet.appendRow([

        new Date(),

        report.totalApplications,

        report.newApplications,

        report.processingApplications,

        report.sentApplications,

        report.duplicateClaims.length,

        report.duplicateThreads.length,

        report.duplicateDrafts.length,

        report.duplicateCompanies.length,

        report.orphanedRows.length,

        report.stuckRows.length,

        healthy
            ? "HEALTHY"
            : "PROBLEMS"

    ]);

}

}
