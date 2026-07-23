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

    } finally {

      lock.releaseLock();

    }

  }

}