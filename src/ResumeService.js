class ResumeService {

  static getFile() {

    const fileId = Config.get(
      CONSTANTS.CONFIG_KEYS.RESUME_FILE_ID
    );

    if (!fileId) {

      throw new Error(
        "Resume File ID not configured."
      );

    }

    return DriveApp.getFileById(fileId);

  }

  static getBlob() {

    return this.getFile().getBlob();

  }

}