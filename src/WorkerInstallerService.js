class WorkerInstallerService {

  static install() {

    AppLogger.info("====================================");
    AppLogger.info("Installing Worker...");
    AppLogger.info("====================================");

    this.verifyConfiguration();

    TriggerService.createWorkerTrigger();

    WorkerStatusService.onWorkerIdle();

    AppLogger.info("====================================");
    AppLogger.info("Worker installed successfully.");
    AppLogger.info("====================================");

  }

  static verifyConfiguration() {

    const sender =
      SenderSelector.getCurrentSender();

    AppLogger.info(
      `Worker Sender: ${sender.email}`
    );

    if (sender.status !== "ACTIVE") {

      throw new Error(
        `${sender.email} is not ACTIVE.`
      );

    }

  }

}