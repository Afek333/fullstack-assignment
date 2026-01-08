const { Kafka } = require("kafkajs");
const log4js = require("log4js");

// log4js configuration
log4js.configure({
  appenders: {
    out: { type: "stdout" }
  },
  categories: {
    default: { appenders: ["out"], level: "info" }
  }
});

const logger = log4js.getLogger();

// Kafka configuration
const kafka = new Kafka({
  clientId: "cdc-consumer",
  brokers: ["kafka:9092"]
});

const consumer = kafka.consumer({ groupId: "cdc-consumer-group" });

async function run() {
  await consumer.connect();
  await consumer.subscribe({
    topic: "appdb-changes",
    fromBeginning: true
  });

  logger.info("CDC Consumer started, waiting for messages...");

  await consumer.run({
    eachMessage: async ({ topic, partition, message }) => {
      const value = message.value.toString();

      logger.info({
        timestamp: new Date().toISOString(),
        topic,
        partition,
        message: JSON.parse(value)
      });
    }
  });
}

run().catch(err => {
  logger.error("Consumer crashed", err);
  process.exit(1);
});
