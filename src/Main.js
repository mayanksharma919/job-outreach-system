function generateDrafts() {

  ApplicationProcessor.processNewApplications();

}


function processDraftStatuses() {

  DraftStatusService.process();

}

function processFollowUps() {

  FollowUpProcessor.process();

}

function updateReplies() {

  const applications =
    ApplicationRepository.getSentApplications();

  for (const application of applications) {

    const replied =
      ReplyTrackingService.hasReply(
        application
      );

    if (replied) {

      ApplicationRepository.markReplied(
        application.rowNumber
      );

      AppLogger.info(
        `Reply found: ${application.recipientEmail}`
      );

    }

  }

}

function syncSentDrafts() {

  DraftStatusService.syncSentDrafts();

}


function testSyncSentDrafts() {

  DraftStatusService.syncSentDrafts();

}

function testSentApplications() {

  const applications =
    ApplicationRepository.getSentApplications();

  Logger.log(applications);

}


function testSenders() {

  Logger.log(
    SenderRepository.getSenders()
  );

}


function testSenderSelector() {

  const sender =
    SenderSelector.getNextSender();

  Logger.log(sender);

}


function testCurrentSender() {

  Logger.log(
    SenderSelector.getCurrentSender()
  );

  Logger.log(
    SenderSelector.canCurrentSenderSend()
  );

}

function processReplies() {

  ReplyProcessor.process();

}

function testGmailService() {
  Logger.log("typeof Gmail = " + typeof Gmail);
  Logger.log("typeof GmailApp = " + typeof GmailApp);
}


function testGmailService() {
  Logger.log("typeof Gmail = " + typeof Gmail);
}


function debugThread() {

  const application =
    ApplicationRepository
      .getSentApplications()[0];

  GmailService.debugThread(application);

}


function testReplyDetection() {

  const applications =
      ApplicationRepository
          .getApplicationsByStatus(
              CONSTANTS.STATUS.SENT
          );

  if (!applications.length) {

      Logger.log("No SENT applications.");

      return;

  }

  const application = applications[0];

  Logger.log(
      ReplyService.hasRecruiterReplied(
          application
      )
  );

}

function testUpdateReplies() {

  ReplyService.updateReplies();

}

function testBounceDetection() {

  const applications =
    ApplicationRepository.getApplications();

  for (const application of applications) {

    BounceProcessor.process(application);

  }

}


function runScheduler() {

  Scheduler.run();

}

function installSystem() {

  InstallationService.install();

}


function refreshDashboard() {

  DashboardService.refresh();

}


function processNewApplications() {

  ApplicationProcessor.processNewApplications();

}


function installWorker() {

  WorkerInstallerService.install();

}


function install() {

  InstallationService.install();

}