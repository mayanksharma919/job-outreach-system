class SystemMonitor {

  static start() {

    return {

        startTime: Date.now(),

        applicationsProcessed: 0,

        emailsSent: 0,

        repliesFound: 0,

        bouncesFound: 0,

        errors: 0

    };


  }

  static finish(run, status = "SUCCESS") {

    SystemRepository.append({

        timestamp: new Date(),

        status,

        duration: Date.now() - run.startTime,

        applicationsProcessed: run.applicationsProcessed,

        emailsSent: run.emailsSent,

        repliesFound: run.repliesFound,

        bouncesFound: run.bouncesFound,

        errors: run.errors

    });

    }

}