/* eslint-disable @typescript-eslint/no-explicit-any */
import { findById, update } from "../models/userModel.js";
import { getPostData } from "../utils/utils.js";

export const updateUser = async (req: any, res: any, id: string) => {
    try {

        if (!id.match(/[a-f0-9-]{36}$/)) {
            res.writeHead(404, { "Content-Type": "application/json" });
            res.end(JSON.stringify({ message: 'UserId is invalid' }))
        };

        try {
            const user = await findById(id)
            const body = await getPostData(req);
            const { username, age, hobbies } = JSON.parse(body);

            const userData = {
                username: username || user.username,
                age: age || user.age,
                hobbies: hobbies || user.hobbies
            }

            const updatedUser = await update(id, userData);
            res.writeHead(200, { "Content-Type": "application/json" })
            return res.end(JSON.stringify(updatedUser))

        } catch (err) {
            res.writeHead(404, { "Content-Type": "application/json" })
            return res.end(JSON.stringify({ message: 'User not found' }))
        }

    } catch (err) {
        console.log(err);

    }
}