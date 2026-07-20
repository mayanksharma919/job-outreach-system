class AssignmentService {

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