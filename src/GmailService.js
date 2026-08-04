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

    Logger.log("Resume Name: " + resumeBlob.getName());
    Logger.log("Resume Size: " + resumeBlob.getBytes().length);
    Logger.log("Resume Content Type: " + resumeBlob.getContentType());

    const currentUser =
      Session.getEffectiveUser().getEmail().trim().toLowerCase();

    const configuredSender =
      SenderSelector.getCurrentSenderEmail().trim().toLowerCase();

    if (
        EmailEventRepository.isSuppressed(
            application.recipientEmail
        )
    ) {

        throw new Error(
            `${application.recipientEmail} has previously hard bounced.`
        );

    }

if (currentUser !== configuredSender) {
  throw new Error(
    `Configured sender ${configuredSender} does not match executing user ${currentUser}`
  );
}


    if (Config.get(CONSTANTS.CONFIG_KEYS.DRY_RUN) === "TRUE") {

      AppLogger.warn("========== DRY RUN ==========");
      AppLogger.info(
        `To: ${application.recipientEmail}`
      );
      AppLogger.info(`Subject: ${email.subject}`);
      AppLogger.info(email.body);

      return {
        success: true,
        dryRun: true
      };

    }

    GmailApp.sendEmail(

      application.recipientEmail,

      email.subject,

      email.body,

      {
        attachments: [resumeBlob]
      }

    );

    // Find the message we just sent
    Utilities.sleep(3000);

    const threads = GmailApp.search(
      `to:${application.recipientEmail} subject:"${email.subject}" in:sent newer_than:1d`,  
      0,
      5
    );

    if (!threads.length) {

      throw new Error(
        "Sent email thread could not be located."
      );

    }

    AppLogger.info("========== THREADS FOUND ==========");

    threads.forEach((thread, index) => {

      const message = thread.getMessages().slice(-1)[0];

      AppLogger.info(`Thread ${index}`);

     AppLogger.info(`ThreadId: ${thread.getId()}`);

      AppLogger.info(`Subject: ${message.getSubject()}`);

      AppLogger.info(`To: ${message.getTo()}`);

    });

    const thread = threads.reduce((latest, current) => {

    const latestDate =
      latest.getLastMessageDate().getTime();

    const currentDate =
      current.getLastMessageDate().getTime();

    return currentDate > latestDate
      ? current
      : latest;

  });

    this.applyLabel(thread);

    EmailEventRepository.log(

      application.recipientEmail,

      configuredSender,

      "SENT",

      "INITIAL",

      email.subject

  );

    return {

      id: "",

      threadId: thread.getId(),

      status: "SENT"

    };

  }



  static sendFollowUp(application, followUp) {

    const thread = GmailApp.getThreadById(application.threadId);

    if (!thread) {
      throw new Error(`Thread not found: ${application.threadId}`);
    }

    const messages = thread.getMessages();
    const lastMessage = messages[messages.length - 1];
    const subject = lastMessage.getSubject();

    Logger.log("Subject: " + subject);

    // Fetch the RFC headers of the LAST message
    const gmailMessage = Gmail.Users.Messages.get(
      "me",
      lastMessage.getId(),
      {
        format: "metadata",
        metadataHeaders: [
          "Message-ID",
          "References"
        ]
      }
    );

    const headers = gmailMessage.payload.headers;

    const rfcMessageId =
      headers.find(h => h.name.toLowerCase() === "message-id")?.value;

    if (!rfcMessageId) {
      throw new Error("Unable to find RFC Message-ID.");
    }

    const existingReferences =
        headers.find(
            h => h.name.toLowerCase() === "references"
        )?.value || "";

    const validReferences =
        existingReferences
            .split(/\s+/)
            .filter(ref => ref.startsWith("<") && ref.endsWith(">"))
            .join(" ");

    const references =
        validReferences
            ? `${validReferences} ${rfcMessageId}`
            : rfcMessageId;


    const mime = [
      `From: ${lastMessage.getFrom()}`,
      `To: ${application.recipientEmail}`,
      `Subject: ${subject}`,
      "MIME-Version: 1.0",
      "Content-Type: text/plain; charset=UTF-8",
      "Content-Transfer-Encoding: 7bit",
      `In-Reply-To: ${rfcMessageId}`,
      `References: ${references}`,
      "",
      followUp.body
    ].join("\r\n");


    const raw = Utilities.base64EncodeWebSafe(
      Utilities.newBlob(mime).getBytes()
    );

    Gmail.Users.Messages.send(
      {
        raw: raw,
        threadId: application.threadId
      },
      "me"
    );

    return {
      success: true,
      threadId: application.threadId,
      sentAt: new Date()
  };
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

    Logger.log(JSON.stringify({
      company: application.company,
      threadId: application.threadId,
      type: typeof application.threadId,
      length: String(application.threadId).length
    }));

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

  static debugThread(application) {

    const thread = GmailApp.getThreadById(
      application.threadId
    );

    if (!thread) {
      throw new Error("Thread not found");
    }

    const messages = thread.getMessages();

    Logger.log("======================================");
    Logger.log(`Thread Id: ${thread.getId()}`);
    Logger.log(`Messages : ${messages.length}`);

    messages.forEach((message, index) => {

      Logger.log("--------------------------------------");
      Logger.log(`Message ${index + 1}`);
      Logger.log(`Id       : ${message.getId()}`);
      Logger.log(`Date     : ${message.getDate()}`);
      Logger.log(`Plain    : ${message.getPlainBody().substring(0, 100)}`);
      Logger.log(`From     : ${message.getFrom()}`);
      Logger.log(`To       : ${message.getTo()}`);
      Logger.log(`Cc       : ${message.getCc()}`);
      Logger.log(`Reply-To : ${message.getReplyTo()}`);
      Logger.log(`Subject  : ${message.getSubject()}`);

    });

}
  
}

function debugThreadIds() {

  const threads = GmailApp.search('newer_than:1d', 0, 5);

  threads.forEach(thread => {

    const message = thread.getMessages()[0];

    Logger.log("==================================");
    Logger.log("Apps Script Thread ID : " + thread.getId());
    Logger.log("Apps Script Message ID: " + message.getId());

    const gmailMessage = Gmail.Users.Messages.get(
      "me",
      message.getId()
    );

    Logger.log("Gmail API Thread ID   : " + gmailMessage.threadId);
    Logger.log("Gmail API Message ID  : " + gmailMessage.id);

  });

}