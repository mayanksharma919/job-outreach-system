class WorkerService {

  static getCurrentWorker() {

    const email = Config.get(
      CONSTANTS.CONFIG_KEYS.SENDER_EMAIL
    );

    const worker =
      SenderRepository.getByEmail(email);

    if (!worker) {

      throw new Error(

        `Sender account not found: ${email}`

      );

    }

    return worker;

  }

}