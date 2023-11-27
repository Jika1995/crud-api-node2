import { findById } from "../models/userModel.js";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const getUserById = async (req: any, res: any, id: string) => {
    try {
        const user = await findById(id);

        if (!user) {

            res.writeHead(404, { "Content-Type": "application/json" });
            res.end(JSON.stringify({ message: 'User not found' }))

        } else {

            res.writeHead(200, { "Content-Type": "application/json" })
            res.end(JSON.stringify(user))

        }
    } catch (err) {
        console.log(err);
    }
}