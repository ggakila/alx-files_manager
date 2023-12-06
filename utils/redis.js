import { MongoClient } from "mongodb";

const HOST = process.env.DB_HOST || "localhost";
const PORT = process.env.DB_PORT || 27017;
const DATABASE = process.env.DB_DATABASE || "files_manager";

class DBClient {
	constructor() {
		this.client = new MongoClient(`mongodb://${HOST}:${PORT}`, {
			useUnifiedTopology: true,
			useNewUrlParser: true,
		});

		this.client.connect((err) => {
			if (!err) {
				this.db = this.client.db(`${DATABASE}`);
				this.users = this.db.collection("users");
				this.files = this.db.collection("files");
			} else {
				console.log(err.message);
				this.db = false;
			}
		});
	}

	isAlive() {
		return this.client.isConnected();
	}

	async nbUsers() {
		if (!this.db) {
			return 0;
		}

		const usersNum = await this.users.countDocuments();
		return usersNum;
	}

	async nbFiles() {
		if (!this.db) {
			return 0;
		}

		const filesNum = await this.files.countDocuments();
		return filesNum;
	}
}

const dbClient = new DBClient();
export default dbClient;
