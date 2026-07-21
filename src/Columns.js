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

    SENDER_ACCOUNT: 10,

    DRAFT_ID: 11,
    THREAD_ID: 12,

    FOLLOW_UP_COUNT: 13,
    LAST_FOLLOW_UP: 14,

    REPLIED: 15,

    PRIORITY: 16,
    CREATED: 17,
    UPDATED: 18,

    ERROR: 19,

    CLAIMED_BY: 20,
    CLAIMED_AT: 21

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