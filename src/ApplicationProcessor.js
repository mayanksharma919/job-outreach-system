class ApplicationProcessor {

  static processNewApplications() {

    StartupValidationService.validate();

    try {

      if (!DeliverabilityService.canSendNow()) {

        const sender = SenderSelector.getCurrentSender();

        AppLogger.info(
            `Sender ${sender.email} has reached its daily limit (${sender.sentToday}/${sender.dailyLimit}).`
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

          const existingConversation =
            DuplicateProtectionService.findExistingConversation(
              application
            );

          if (existingConversation) {

            AppLogger.warn(

              `Recovered existing Gmail conversation for ${application.company}.`

            );

            ApplicationRepository.recoverFromGmail(

              application.rowNumber,

              existingConversation

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

          if (result.status === "DRAFT") {

            ApplicationRepository.markDraftCreated(
              application.rowNumber,
              senderEmail,
              result
            );

          } else if (result.status === "SENT") {

            ApplicationRepository.updateFields(
              application.rowNumber,
              {
                [Columns.APPLICATIONS.STATUS]:
                  CONSTANTS.STATUS.SENT,

                [Columns.APPLICATIONS.SENDER_ACCOUNT]:
                  senderEmail,

                [Columns.APPLICATIONS.THREAD_ID]:
                  result.threadId,

                [Columns.APPLICATIONS.DRAFT_ID]:
                  "",

                [Columns.APPLICATIONS.SENT_DATE]:
                  new Date(),

                [Columns.APPLICATIONS.UPDATED]:
                  new Date()
              }
            );

          }

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
            `Processed ${application.company}
            [${result.status}]
            Draft=${result.id}
            Thread=${result.threadId}`
          );

          AppLogger.info(
            `Processed ${application.company}`
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