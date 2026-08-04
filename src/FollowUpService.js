class FollowUpService {

  static isFollowUpDue(application) {

    const maxFollowUps = Number(
      Config.get(CONSTANTS.CONFIG_KEYS.MAX_FOLLOW_UPS)
    );

    if (application.followUpCount >= maxFollowUps) {
      return false;
    }

    const afterDays = Number(
      Config.get(CONSTANTS.CONFIG_KEYS.FOLLOW_UP_AFTER_DAYS)
    );

    const referenceDate =
      application.lastFollowUp || application.sentDate;

    if (!referenceDate) {
      return false;
    }

    const now = new Date();

    const days =
      (now - referenceDate) / (1000 * 60 * 60 * 24);

    // 👇 ADD THIS
    AppLogger.info(
      "FOLLOW-UP CHECK | " +
      "Company=" + application.company +
      " | Reference=" + referenceDate +
      " | Now=" + now +
      " | Days=" + days +
      " | Required=" + afterDays +
      " | Due=" + (days >= afterDays)
    );

    return days >= afterDays;
  }

}