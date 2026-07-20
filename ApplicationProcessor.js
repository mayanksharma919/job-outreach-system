class ApplicationProcessor {

  static processNewApplications() {

    const applications =
      ApplicationRepository.getNewApplications();

    AppLogger.info(
      `Found ${applications.length} new application(s).`
    );

    let success = 0;
    let failed = 0;

    if (
      !SenderSelector.canCurrentSenderSend()
    ) {

      AppLogger.info(
        "Current sender cannot send any more emails today."
      );

      return;

    }

    for (let i = 0; i < applications.length; i++) {

      if (!DeliverabilityService.canProcess(i)) {

        AppLogger.info(
          "Daily email limit reached."
        );

        break;

      }

      const application = applications[i];

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

      } catch (error) {

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
    AppLogger.info(`Total Applications : ${applications.length}`);
    AppLogger.info(`Successful Drafts  : ${success}`);
    AppLogger.info(`Failed             : ${failed}`);
    AppLogger.info("====================================");

  }

}