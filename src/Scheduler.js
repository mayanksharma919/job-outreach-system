class Scheduler {

  static run() {

    const monitor = SystemMonitor.start();

    try {

        const applications =
        ApplicationRepository.getActiveApplications();

        monitor.applicationsProcessed = applications.length;

        for (const application of applications) {

            if (ReplyProcessor.process(application)) {
                monitor.repliesFound++;
            }

            if (BounceProcessor.process(application)) {
                monitor.bouncesFound++;
            }

            if (FollowUpProcessor.process(application)) {
                monitor.emailsSent++;
            }

        }

        SystemMonitor.finish(
        monitor,
        "SUCCESS"
        );

    } catch (error) {

        monitor.errors++;

        SystemMonitor.finish(
        monitor,
        "FAILED"
        );

        throw error;

    }

    }

}