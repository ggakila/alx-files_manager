import redis from "redis";
import { promisify } from "util";

const HOST = process.env.REDIS_HOST || "localhost";
const PORT = process.env.REDIS_PORT || 6379;

class RedisClient {
	constructor() {
		this.client = redis.createClient({ host: HOST, port: PORT });

		// Display any error in the console
		this.client.on("error", (err) => {
			console.error(`Redis client error: ${err}`);
		});
	}

	isAlive() {
		return this.client.connected;
	}

	async get(key) {
		const asyncGet = promisify(this.client.get).bind(this.client);
		return asyncGet(key);
	}

	async set(key, value, durationInSeconds) {
		const asyncSet = promisify(this.client.set).bind(this.client);
		return asyncSet(key, value, "EX", durationInSeconds);
	}

	async del(key) {
		const asyncDel = promisify(this.client.del).bind(this.client);
		return asyncDel(key);
	}
}

// Create and export an instance of RedisClient
const redisClient = new RedisClient();
export default redisClient;
