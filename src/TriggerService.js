class TriggerService {

  static installScheduler() {

    const handler =
      "runScheduler";

    const triggers =
      ScriptApp.getProjectTriggers();

    for (const trigger of triggers) {

      if (
        trigger.getHandlerFunction() === handler
      ) {

        AppLogger.info(
          "Scheduler trigger already exists."
        );

        return;

      }

    }

    ScriptApp.newTrigger(handler)

      .timeBased()

      .everyHours(1)

      .create();

    AppLogger.info(
      "Scheduler trigger created."
    );

  }

}