function processFollowUps() {

  StartupValidationService.validate();

  const applications =
    ApplicationRepository.getApplicationsAwaitingReply();

  let processed = 0;

  for (const application of applications) {

    if (FollowUpProcessor.process(application)) {
      processed++;
    }

  }

  AppLogger.info(
    `Follow-ups sent: ${processed}`
  );

}