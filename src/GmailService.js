class GmailService {

  static send(application, email) {

    const mode = Config.get(
      CONSTANTS.CONFIG_KEYS.MODE
    );

    if (mode === CONSTANTS.MODE.DRAFT) {

      return this.createDraft(
        application,
        email
      );

    }

    if (mode === CONSTANTS.MODE.AUTO_SEND) {

      return this.sendEmail(
        application,
        email
      );

    }

    throw new Error(`Unknown MODE: ${mode}`);

  }

  static createDraft(application, email) {

    const resumeBlob = ResumeService.getBlob();

    const draft = GmailApp.createDraft(

      application.recipientEmail,

      email.subject,

      email.body,

      {
        attachments: [resumeBlob]
      }

    );

    const message = draft.getMessage();
    const thread = message.getThread();

    this.applyLabel(thread);

    return {

      id: draft.getId(),

      threadId: thread.getId(),

      status: "DRAFT"

    };

  }

  static sendEmail(application, email) {

    const resumeBlob = ResumeService.getBlob();

    GmailApp.sendEmail(

      application.recipientEmail,

      email.subject,

      email.body,

      {
        attachments: [resumeBlob]
      }

    );

    // Find the message we just sent
    Utilities.sleep(2000);

    const threads = GmailApp.search(
      `to:${application.recipientEmail} newer_than:1d`,
      0,
      5
    );

    if (!threads.length) {

      throw new Error(
        "Sent email thread could not be located."
      );

    }

    const thread = threads[0];

    this.applyLabel(thread);

    return {

      id: "",

      threadId: thread.getId(),

      status: "SENT"

    };

  }



  static sendFollowUp(application, followUp) {

    const thread =
    GmailApp.getThreadById(
        application.threadId
    );

    thread.reply(
        followUp.body
    );

    if (!thread) {

      throw new Error(
        `Thread not found: ${followUp.threadId}`
      );

    }

    const subject =
      `Following up regarding my application`;

    const body =
  `Hi ${followUp.recipientName},

  I hope you're doing well.

  I wanted to follow up regarding my application and check whether you've had a chance to review it.

  I'm still very interested in the opportunity and would be happy to provide any additional information if needed.

  Looking forward to hearing from you.

  Best regards,
  Mayank Sharma`;

    thread.reply(
      body
    );

}
  static applyLabel(thread) {

    const labelName = Config.get(
      CONSTANTS.CONFIG_KEYS.GMAIL_LABEL
    );

    let label =
      GmailApp.getUserLabelByName(labelName);

    if (!label) {

      label =
        GmailApp.createLabel(labelName);

    }

    thread.addLabel(label);

  }

  static threadHasSentMessage(threadId) {

    const thread = GmailApp.getThreadById(threadId);

    if (!thread) {
      return false;
    }

    const messages = thread.getMessages();

    for (const message of messages) {

      if (!message.isDraft()) {
        return true;
      }

    }

    return false;

  }

  static hasReply(application) {

    const thread =
      GmailApp.getThreadById(
        application.threadId
      );

    if (!thread) {
      Logger.log("Thread not found");
      return false;
    }

    const messages = thread.getMessages();

    Logger.log(`Messages: ${messages.length}`);

    Logger.log(`Sender Account: ${application.senderAccount}`);

    messages.forEach((message, index) => {

      Logger.log(
        `Message ${index + 1}`
      );

      Logger.log(
        `From: ${message.getFrom()}`
      );

      Logger.log(
        `To: ${message.getTo()}`
      );

      Logger.log(
        `Subject: ${message.getSubject()}`
      );

    });

    return false;

  }
}

