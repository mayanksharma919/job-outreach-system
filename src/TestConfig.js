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