import { MongoClient } from "mongodb";

const DB_HOST = process.env.DB_HOST || "localhost";
const DB_PORT = process.env.DB_PORT || 27017;
const DB_DATABASE = process.env.DB_DATABASE || "files_manager";

class DBClient {
	constructor() {
		
		this.client = new MongoClient(`mongodb://${DB_HOST}:${DB_PORT}`, {
			useUnifiedTopology: true,
			useNewUrlParser: true,
		});

		
		this.client.connect((err) => {
			if (!err) {
				this.db = this.client.db(DB_DATABASE);
				this.users = this.db.collection("users");
				this.files = this.db.collection("files");
			} else {
				console.error(`MongoDB connection error: ${err.message}`);
				this.db = null;
			}
		});
	}

	isAlive() {
		return !!this.db; 
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
