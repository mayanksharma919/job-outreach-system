class Scheduler {
    

  static run() {

    // Process new applications first
        ApplicationProcessor.processNewApplications();

        RecoveryService.run();

        const monitor = SystemMonitor.start();

        try {

            const currentSender =
                Session.getEffectiveUser()
                    .getEmail()
                    .trim()
                    .toLowerCase();

            const applications =
                ApplicationRepository
                    .getActiveApplications()
                    .filter(application =>
                        application.senderAccount &&
                        application.senderAccount
                            .trim()
                            .toLowerCase() === currentSender
                    );

            AppLogger.info(
                `Current Sender: ${currentSender}`
            );

            AppLogger.info(
                `Applications Found: ${applications.length}`
            );

            applications.forEach(application => {

                AppLogger.info(
                    `${application.company} | ${application.senderAccount}`
                );

            });

            monitor.applicationsProcessed =
                applications.length;

            for (const application of applications) {

                AppLogger.info("================================");
                AppLogger.info("Company: " + application.company);

                const replied =
                    ReplyProcessor.process(application);

                AppLogger.info(
                    "ReplyProcessor: " + replied
                );

                const bounced =
                    BounceProcessor.process(application);

                AppLogger.info(
                    "BounceProcessor: " + bounced
                );

                const followed =
                    FollowUpProcessor.process(application);

                AppLogger.info(
                    "FollowUpProcessor: " + followed
                );

                if (replied) {
                    monitor.repliesFound++;
                }

                if (bounced) {
                    monitor.bouncesFound++;
                }

                if (followed) {
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