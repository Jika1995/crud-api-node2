import { findById } from "../models/userModel.js";
export const getUserById = async (req, res, id) => {
    try {
        if (!id.match(/[a-f0-9-]{36}$/)) {
            res.writeHead(404, { "Content-Type": "application/json" });
            res.end(JSON.stringify({ message: 'UserId is invalid' }));
        }
        ;
        try {
            const user = await findById(id);
            res.writeHead(200, { "Content-Type": "application/json" });
            res.end(JSON.stringify(user));
        }
        catch (err) {
            res.writeHead(404, { "Content-Type": "application/json" });
            res.end(JSON.stringify({ message: 'User not found' }));
        }
    }
    catch (err) {
        console.log(err);
    }
};
//# sourceMappingURL=getUserById.js.map