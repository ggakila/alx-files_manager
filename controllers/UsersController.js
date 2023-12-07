import dbClient from "../utils/db";
import sha1 from "sha1";

class UsersController {
	static async postNew(req, res) {
		const { email, password } = req.body;

		if (!email) {
			return res.status(400).json({ error: "Missing email" });
		}
		if (!password) {
			return res.status(400).json({ error: "Missing password" });
		}
		const existingUser = await dbClient.users.findOne({ email });
		if (existingUser) {
			return res.status(400).json({ error: "Already exist" });
		}
		try {
			const hashedPassword = sha1(password);
			const newUser = await dbClient.users.insertOne({
				email,
				password: hashedPassword,
			});
			const responseUser = {
				email: newUser.ops[0].email,
				id: newUser.ops[0]._id,
			};

			return res.status(201).json(responseUser);
		} catch (error) {
			console.error(`Error creating user: ${error.message}`);
			return res.status(500).json({ error: "Internal Server Error" });
		}
	}
}

export default UsersController;
