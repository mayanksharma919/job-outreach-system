class DashboardService {

  static refresh() {

    const applications =
      ApplicationRepository.getApplications();

    const metrics = {

      total: applications.length,

      new: 0,

      claimed: 0,

      drafts: 0,

      sent: 0,

      replied: 0,

      bounced: 0,

      failed: 0,

      closed: 0

    };

    for (const application of applications) {

      switch (application.status) {

        case CONSTANTS.STATUS.NEW:
          metrics.new++;
          break;

        case CONSTANTS.STATUS.CLAIMED:
          metrics.claimed++;
          break;

        case CONSTANTS.STATUS.DRAFT_CREATED:
          metrics.drafts++;
          break;

        case CONSTANTS.STATUS.SENT:
          metrics.sent++;
          break;

        case CONSTANTS.STATUS.REPLIED:
          metrics.replied++;
          break;

        case CONSTANTS.STATUS.BOUNCED:
          metrics.bounced++;
          break;

        case CONSTANTS.STATUS.FAILED:
          metrics.failed++;
          break;

        case CONSTANTS.STATUS.CLOSED:
          metrics.closed++;
          break;

      }

    }

    const rows = DashboardFormatter.format(metrics);

        DashboardRepository.write(rows);

  }

}