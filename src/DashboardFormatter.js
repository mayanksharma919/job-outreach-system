class DashboardFormatter {

  static format(metrics) {

    return [

      ["Metric", "Value"],

      ["Total Applications", metrics.total],

      ["New", metrics.new],

      ["Claimed", metrics.claimed],

      ["Draft Created", metrics.drafts],

      ["Sent", metrics.sent],

      ["Replied", metrics.replied],

      ["Bounced", metrics.bounced],

      ["Failed", metrics.failed],

      ["Closed", metrics.closed],

      ["Last Updated", new Date()]

    ];

  }

}