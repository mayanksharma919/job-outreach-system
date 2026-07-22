class Scheduler {

  static run() {

    AppLogger.info(
      "===== Scheduler Started ====="
    );

    const applications =
      ApplicationRepository.getActiveApplications();

    AppLogger.info(
      `Active applications: ${applications.length}`
    );

    for (const application of applications) {

      if (
        ReplyProcessor.process(application)
      ) {
        continue;
      }

      if (
        BounceProcessor.process(application)
      ) {
        continue;
      }

      FollowUpProcessor.process(application);

    }

    AppLogger.info(
      "===== Scheduler Finished ====="
    );

  }

}