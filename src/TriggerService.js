class TriggerService {

  static installScheduler() {

    this.createTrigger(
      "runScheduler",
      builder => builder.everyHours(1)
    );

  }

  static installWorker() {

    this.createTrigger(
      "processNewApplications",
      builder => builder.everyMinutes(5)
    );

  }

  static createTrigger(handler, configure) {

    const triggers =
      ScriptApp.getProjectTriggers();

    for (const trigger of triggers) {

      if (trigger.getHandlerFunction() === handler) {

        AppLogger.info(
          `${handler} trigger already exists.`
        );

        return;

      }

    }

    const trigger =
      ScriptApp.newTrigger(handler)
        .timeBased();

    configure(trigger).create();

    AppLogger.info(
      `${handler} trigger created.`
    );

  }


  static installWorker() {

    this.createTrigger(
      "processNewApplications",
      builder => builder.everyMinutes(5)
    );

  }

}