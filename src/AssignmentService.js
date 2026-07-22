class AssignmentService {

  static claimNextApplication() {

    const lock =
      LockService.getScriptLock();

    lock.waitLock(10000);

    try {

      const sender =
          SenderSelector.getCurrentSender();

      return ApplicationRepository
          .claimNextApplication(
              sender.email
          );

    }
    finally {

      lock.releaseLock();

    }

  }

  static assign(application) {

    const availableSenders = SenderRepository
      .getActive()
      .filter(sender =>
        sender.sentToday < sender.dailyLimit
      );

    if (availableSenders.length === 0) {

      throw new Error(
        "No sender accounts available."
      );

    }

    availableSenders.sort(
      (a, b) => a.sentToday - b.sentToday
    );

    return availableSenders[0];

  }

}