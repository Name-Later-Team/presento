import { SocketService } from "../services/socket.service.js";

/**
 *
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 */
export async function postAuthenticationTicketAsync(req, res) {
    const { accessToken, tokenType } = req.session?.user ?? {};
    const authorization = `${tokenType} ${accessToken}`;

    const { path } = req;

    try {
        const socketService = new SocketService();

        const ticketRes = await socketService.postJsonRequestAsync(path, {}, { Authorization: authorization });

        return res.send(ticketRes.data);
    } catch (error) {
        // pass error to client
        return res.status(error.status).send(error.data);
    }
}
