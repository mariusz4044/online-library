import User from "../../../database/models/User.js";

export const getSession = async (connectSession) => {
  if (!connectSession) {
    return {
      error: "Nie wykryto sessji użytkownika, odśwież strone!",
      important: true,
    };
  }

  const user = await User.findOne({ session: connectSession });

  if (!user) {
    return { error: "Sessja wygasła, zaloguj się ponownie!" };
  }

  return {
    userID: user._id,
    login: user.login,
    avatar: user.avatar,
    rank: user.rank,
    nick: user.nick,
    points: user.points,
    likeBooks: user.likeBooks,
  };
};

export const getFullSession = async (connectSession) => {
  if (!connectSession) {
    return {
      error: "Nie wykryto sessji użytkownika, odśwież strone!",
      important: true,
    };
  }

  const user = await User.findOne({ session: connectSession });

  if (!user) {
    return { error: "Sessja wygasła, zaloguj się ponownie!" };
  }

  return user;
};
