class NotificationService {
  static notifyRepeatedFailure(deviceId, failureCount) {
    const message = `Device Alert! Device ${deviceId} has failed ${failureCount} times.`;
    console.log(message);
    return message;
  }
}

module.exports = NotificationService;
