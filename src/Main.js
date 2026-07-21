function generateDrafts() {

  ApplicationProcessor.processNewApplications();

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


function processFollowUps() {

  FollowUpProcessor.processPendingFollowUps();

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