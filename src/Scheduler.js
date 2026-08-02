class Scheduler {
    

  static run() {

    // Process new applications first
        ApplicationProcessor.processNewApplications();

        RecoveryService.run();

        const monitor = SystemMonitor.start();

        try {

            const applications =
                ApplicationRepository.getActiveApplications();


            AppLogger.info(
                `Applications eligible for reply/follow-up: ${applications.length}`
            );

            applications.forEach(application => {

                AppLogger.info(
                    `${application.company} | Status=${application.status} | FollowUps=${application.followUpCount} | Sent=${application.sentDate}`
                );

            });

            monitor.applicationsProcessed =
                applications.length;

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

            QueueHealthService.run();

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