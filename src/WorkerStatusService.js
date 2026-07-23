class WorkerStatusService {

  static onWorkerStarted() {

    this.update({
      status: "RUNNING",
      activity: "Started",
      company: "",
      error: ""
    });

  }

  static onApplicationClaimed(application) {

    this.update({
      status: "RUNNING",
      activity: "Processing",
      company: application.company,
      error: ""
    });

  }

  static onEmailSent() {

    this.update({
      status: "RUNNING",
      activity: "Email Sent",
      company: "",
      error: ""
    });

  }

  static onWorkerIdle() {

    this.update({
      status: "IDLE",
      activity: "Waiting",
      company: "",
      error: ""
    });

  }

  static onWorkerError(error) {

    this.update({
      status: "ERROR",
      activity: "Failed",
      company: "",
      error: error.toString()
    });

  }

  static heartbeat(activity = "Running") {

    this.update({
      status: "RUNNING",
      activity,
      company: "",
      error: ""
    });

  }

  static update(data) {

    const sender =
      SenderSelector.getCurrentSender();

    WorkerStatusRepository.upsert({

      sender: sender.email,

      status: data.status,

      lastHeartbeat: new Date(),

      currentCompany: data.company,

      sentToday: sender.sentToday,

      lastError: data.error,

      lastActivity: data.activity

    });

  }

}