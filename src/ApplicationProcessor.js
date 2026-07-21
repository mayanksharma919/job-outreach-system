class ApplicationProcessor {

  static processNewApplications() {

    let success = 0;
    let failed = 0;
    let processed = 0;

    if (
      !SenderSelector.canCurrentSenderSend()
    ) {

      AppLogger.info(
        "Current sender cannot send any more emails today."
      );

      return;

    }

    while (true) {

      if (
        !DeliverabilityService.canProcess(processed)
      ) {

        AppLogger.info(
          "Daily email limit reached."
        );

        break;

      }

      const application =
        AssignmentService.claimNextApplication();

      if (!application) {

        AppLogger.info(
          "No more applications to process."
        );

        break;

      }

      processed++;

      try {

        AppLogger.info(
          `Processing: ${application.company}`
        );

        if (
          DuplicateProtectionService.alreadyContacted(
            application
          )
        ) {

          AppLogger.warn(
            `Skipping ${application.recipientEmail}. Already contacted.`
          );

          ApplicationRepository.updateStatus(
            application.rowNumber,
            CONSTANTS.STATUS.REJECTED
          );

          continue;

        }

        const email =
          EmailGenerator.generate(application);

        const result =
          GmailService.send(
            application,
            email
          );

        const senderEmail =
          Session.getActiveUser().getEmail();

        ApplicationRepository.markDraftCreated(
          application.rowNumber,
          senderEmail,
          result
        );

        if (
          !CompanyRepository.exists(
            application.company
          )
        ) {

          CompanyRepository.create(
            application.company,
            senderEmail
          );

        }

        SenderRepository.incrementSentToday(
          senderEmail
        );

        success++;

        AppLogger.info(
          `Processed ${application.company} (${result.status})`
        );

      }
      catch (error) {

        failed++;

        AppLogger.error(
          `${application.company}: ${error}`
        );

        ApplicationRepository.updateError(
          application.rowNumber,
          error.toString()
        );

      }

    }

    AppLogger.info("====================================");
    AppLogger.info(`Processed          : ${processed}`);
    AppLogger.info(`Successful Drafts  : ${success}`);
    AppLogger.info(`Failed             : ${failed}`);
    AppLogger.info("====================================");

  }

}