import Report from "../../database/models/Report.js";
import User from "../../database/models/User.js";
import { getSession } from "../user/session/getSession.js";

const getReports = async ({ session, bookId } = {}) => {
    const user = await getSession(session);

    if (user.error) {
        return error;
    }

    if (user.rank !== "ADMIN") {
        return { error: "Brak uprawnień!" };
    }

    let reports = await Report.find().sort({_id:1});

    return reports ? {reports} : {reports:{}}
};

export default getReports;
