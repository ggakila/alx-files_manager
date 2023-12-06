import { createClient } from "redis";
import { promisify } from "util";

class RedisClient {
	constructor() {
		this.client = createClient();

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
		await asyncSet(key, value, "EX", durationInSeconds);
        await this.client.expire(key, durationInSeconds);
	}

	async del(key) {
		const asyncDel = promisify(this.client.del).bind(this.client);
		return asyncDel(key);
	}
}

const redisClient = new RedisClient();
export default redisClient;
