class ApplicationProcessor {

  static processNewApplications() {

    try {

      if (!DeliverabilityService.canSendNow()) {

        AppLogger.info(
          "Outside configured sending hours."
        );

        return;

      }

      DeliverabilityService.sleepBeforeProcessing();

      let success = 0;
      let failed = 0;
      let processed = 0;

      while (true) {

        if (!SenderSelector.canCurrentSenderSend()) {

          AppLogger.info(
            "Current sender cannot send any more emails today."
          );

          break;

        }

        // Every 10 processed applications, reclaim abandoned jobs
        if (processed % 10 === 0) {

          ApplicationRepository.releaseExpiredClaims();

        }

        if (!DeliverabilityService.canProcess(processed)) {

          AppLogger.info(
            "Daily email limit reached."
          );

          break;

        }

        const application =
          AssignmentService.claimNextApplication();

        if (application) {

          WorkerStatusService.onApplicationClaimed(
              application
          );

        }

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
            RetryService.execute(

              () => GmailService.send(
                application,
                email
              ),

              `Send email: ${application.company}`

            );

          if (!result.success) {

            throw result.error;

          }

          const sender =
            SenderSelector.getCurrentSender();

          const senderEmail =
            sender.email;

          ApplicationRepository.markDraftCreated(
            application.rowNumber,
            senderEmail,
            result
          );

          success++;

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

          DeliverabilityService.sleepBetweenEmails();

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

          WorkerStatusService.onWorkerError(error);

        }

      }

      AppLogger.info("====================================");
      AppLogger.info(`Processed          : ${processed}`);
      AppLogger.info(`Successful Drafts  : ${success}`);
      AppLogger.info(`Failed             : ${failed}`);
      AppLogger.info("====================================");

    }
    finally {

      WorkerStatusService.onWorkerIdle();

    }

  }

}