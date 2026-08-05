function testConfig() {

  Logger.log(
    Config.get(
      CONSTANTS.CONFIG_KEYS.GEMINI_MODEL
    )
  );

  Logger.log(
    Config.get(
      CONSTANTS.CONFIG_KEYS.MODE
    )
  );

}


function testSenderConfiguration() {
  Logger.log(SenderSelector.getCurrentSenderEmail());
}



function whoAmI() {
  Logger.log(Session.getEffectiveUser().getEmail());
}

function sendTestEmail() {

  GmailApp.sendEmail(
    "mayanksharma919@gmail.com",
    "Apps Script Multi Sender Test",
    "This should come from connect.mayankhimself@gmail.com"
  );

}


function testResumeAttachment() {

  const blob = ResumeService.getBlob();

  Logger.log("Name: " + blob.getName());
  Logger.log("Content Type: " + blob.getContentType());
  Logger.log("Size: " + blob.getBytes().length);

  GmailApp.sendEmail(
    "mayankxsharmaone@gmail.com",   // Replace with your email
    "Resume Attachment Test",
    "Testing the resume attachment.",
    {
      attachments: [blob]
    }
  );
}


function debugResumeFile() {

  const fileId = Config.get(
    CONSTANTS.CONFIG_KEYS.RESUME_FILE_ID
  );

  const file = DriveApp.getFileById(fileId);

  Logger.log("Name: " + file.getName());
  Logger.log("Mime Type: " + file.getMimeType());

}


function testSpreadsheet() {

  const id =
    PropertiesService
      .getScriptProperties()
      .getProperty("SPREADSHEET_ID");

  Logger.log(id);

}


function refreshConfig() {
  Config.clearCache();
}


function debugFollowUpCandidates() {

  const applications =
      ApplicationRepository.getActiveApplications();

  applications.forEach(application => {

    Logger.log(
      `${application.company}
Status=${application.status}
Sent=${application.sentDate}
FollowUps=${application.followUpCount}
Thread=${application.threadId}`
    );

  });

}

function debugOneThread() {

  const threadId = "19faa73035af1521";   // <-- paste one failing thread ID here

  const thread = GmailApp.getThreadById(threadId);

  if (!thread) {
    Logger.log("NOT FOUND");
    return;
  }

  Logger.log("FOUND");
  Logger.log(thread.getFirstMessageSubject());
}

function debugNewestSentThread() {

  const threads = GmailApp.search(
    'in:sent newer_than:7d',
    0,
    10
  );

  threads.forEach((thread, index) => {

    Logger.log("==========");
    Logger.log(index);
    Logger.log(thread.getId());
    Logger.log(thread.getFirstMessageSubject());

  });

}


function findThreadBySubject() {

  const subject = "Application for Data Engineer (m/w/d) (Data Engineer)"; // <-- use one failing subject

  const threads = GmailApp.search(
    `subject:"${subject}"`,
    0,
    10
  );

  Logger.log("Found: " + threads.length);

  threads.forEach(thread => {

    Logger.log("====================");
    Logger.log(thread.getId());
    Logger.log(thread.getFirstMessageSubject());

  });

}

function debugApplicationThread() {

  const company = "inovex GmbH"; // <-- replace

  const app = ApplicationRepository
      .getApplications()
      .find(a => a.company === company);

  Logger.log("Stored Thread ID: " + app.threadId);

  const thread = GmailApp.getThreadById(app.threadId);

  Logger.log("Exists: " + (thread != null));

  if (thread) {

    Logger.log(thread.getFirstMessageSubject());

  }

}


function testThread() {
  const id = "19fcbc67d015d79c";

  const thread = GmailApp.getThreadById(id);

  Logger.log(thread);

  if (thread) {
    Logger.log(thread.getFirstMessageSubject());
  }
}


function debugBrunel() {

  const threadId = "19fae890027c9925";

  const thread = GmailApp.getThreadById(threadId);

  if (!thread) {
    Logger.log("Thread NOT FOUND");
    return;
  }

  Logger.log("Subject: " + thread.getFirstMessageSubject());

  const messages = thread.getMessages();

  Logger.log("Messages: " + messages.length);

  messages.forEach((message, index) => {

    Logger.log("--------------------");
    Logger.log(index + 1);
    Logger.log("From: " + message.getFrom());
    Logger.log("Date: " + message.getDate());
    Logger.log("Draft: " + message.isDraft());

  });

}


function debugSingleFollowUp() {

  const threadId = "19fae890027c9925";

  const application =
      ApplicationRepository
          .getActiveApplications()
          .find(app => app.threadId === threadId);

  if (!application) {

    Logger.log("Application not found");

    return;

  }

  Logger.log(application.company);

  const result =
      FollowUpProcessor.process(application);

  Logger.log("RESULT = " + result);

}


function debugOldFollowUp() {

  const threadId = "PASTE_OLD_THREAD_ID_HERE";

  const application =
      ApplicationRepository
          .getActiveApplications()
          .find(app => app.threadId === threadId);

  Logger.log(application);

  Logger.log(
      FollowUpProcessor.process(application)
  );

}


function checkDuplicateThreadIds() {

  const apps = ApplicationRepository.getApplications();

  const map = {};

  apps.forEach(app => {

    if (!app.threadId) return;

    if (!map[app.threadId]) {
      map[app.threadId] = [];
    }

    map[app.threadId].push(app.company);

  });

  Object.entries(map).forEach(([threadId, companies]) => {

    if (companies.length > 1) {

      Logger.log(threadId);

      Logger.log(companies.join(", "));

      Logger.log("----------------------");

    }

  });

}