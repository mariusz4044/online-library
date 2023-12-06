import User from "../../database/models/User.js";
import { getFullSession } from "./session/getSession.js";
import Report from "../../database/models/Report.js";

export const ReportBug = async ({ session, message }) => {
  const user = await getFullSession(session);
  if (user.error) return user;

  if (!message || message.length > 1500) {
    return {
      error: `Wiadomość przekracza ilość znaków o ${message.length - 1500}`,
    };
  }

  const lastReport = await Report.find({ author: user._id })
    .limit(1)
    .sort({ $natural: -1 });

  if (lastReport.length) {
    if (lastReport[0].date > Date.now() - 60 * 60 * 1000) {
      return { error: "Maksymalnie jedno zgłoszenie na godzine!" };
    }
  }

  const newReport = await new Report({
    author: user._id,
    message,
    date: Date.now(),
  });

  await newReport.save();
  return { success: "Pomyślnie wysłano zgłoszenie!" };
};
