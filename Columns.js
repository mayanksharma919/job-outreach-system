const Columns = {

  APPLICATIONS: {

    COMPANY: 0,
    JOB_TITLE: 1,
    JOB_URL: 2,
    JOB_DESCRIPTION: 3,
    RECIPIENT_NAME: 4,
    RECIPIENT_EMAIL: 5,
    RECIPIENT_ROLE: 6,

    APPLIED_DATE: 7,
    SENT_DATE: 8,

    STATUS: 9,

    ASSIGNED_SENDER: 10,
    SENDER_ACCOUNT: 11,

    DRAFT_ID: 12,
    THREAD_ID: 13,

    FOLLOW_UP_COUNT: 14,
    LAST_FOLLOW_UP: 15,

    REPLIED: 16,

    PRIORITY: 17,
    CREATED: 18,
    UPDATED: 19,

    ERROR: 20

},

  SENDERS: {

    EMAIL: 0,
    STATUS: 1,
    DAILY_LIMIT: 2,
    SENT_TODAY: 3,

    WARMUP_STAGE: 4,
    HEALTH_SCORE: 5,

    LAST_SENT: 6,
    LAST_RESET: 7

  }

};

class ColumnHelper {

  static sheet(columnIndex) {

    return columnIndex + 1;

  }

}