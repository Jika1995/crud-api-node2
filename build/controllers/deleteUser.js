import { findById, remove } from "../models/userModel.js";
export const deleteUser = async (req, res, id) => {
    try {
        if (!id.match(/[a-f0-9-]{36}$/)) {
            res.writeHead(404, { "Content-Type": "application/json" });
            res.end(JSON.stringify({ message: 'UserId is invalid' }));
        }
        ;
        try {
            await findById(id);
            await remove(id);
            res.writeHead(204, { "Content-Type": "application/json" });
            res.end(JSON.stringify({ message: ` User ${id} removed` }));
        }
        catch (err) {
            res.writeHead(404, { "Content-Type": "application/json" });
            res.end(JSON.stringify({ message: "User Not Found" }));
        }
    }
    catch (err) {
        console.log(err);
    }
};
//# sourceMappingURL=deleteUser.js.map