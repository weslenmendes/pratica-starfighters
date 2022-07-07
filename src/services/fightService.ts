import axios from "axios";

import fightRepository from "./../repositories/fightRepository.js";

interface makeBattleResponse {
  winner: string;
  loser: string;
  draw: boolean;
}

async function userExistInGitHub(username: string) {
  const userUrl = `${process.env.GITHUB_API_URL}/users/${username}/repos`;

  try {
    const response = await axios.get(userUrl);

    return response.data;
  } catch (e) {
    if (e.response?.status === 404) {
      throw { type: "notFound", message: `User ${username} not found` };
    }
  }
}

async function userExistsInDB(username: string) {
  const user = await fightRepository.getFighter(username);

  return user;
}

async function updateWin(username: string) {
  const user = await userExistsInDB(username);

  if (user) {
    await fightRepository.updateFighter(
      username,
      user.wins + 1,
      user.draws,
      user.losses,
    );
    return;
  }

  await fightRepository.addFighter(username, 1, 0, 0);
}

async function updateDraw(username: string) {
  const user = await userExistsInDB(username);

  if (user) {
    await fightRepository.updateFighter(
      username,
      user.wins,
      user.draws + 1,
      user.losses,
    );
    return;
  }

  await fightRepository.addFighter(username, 0, 1, 0);
}

async function updateLoss(username: string) {
  const user = await userExistsInDB(username);

  if (user) {
    await fightRepository.updateFighter(
      username,
      user.wins,
      user.draws,
      user.losses + 1,
    );
    return;
  }

  await fightRepository.addFighter(username, 0, 0, 1);
}

export async function makeBattle(
  firstUser: string,
  secondUser: string,
): Promise<makeBattleResponse> {
  const [fighterUser, anotherUser] = await Promise.all([
    userExistInGitHub(firstUser),
    userExistInGitHub(secondUser),
  ]);

  const firstUserScore = fighterUser?.reduce((acc, curr) => {
    return acc + curr.stargazers_count;
  }, 0);
  const secondUserScore = anotherUser?.reduce((acc, curr) => {
    return acc + curr.stargazers_count;
  }, 0);

  if (firstUserScore === undefined || secondUserScore === undefined) {
    throw {
      type: "notFound",
      message: `User ${firstUser} or ${secondUser} not found`,
    };
  }

  const isDraw = firstUserScore === secondUserScore;
  const isFirstUserTheWinner = firstUserScore > secondUserScore;

  if (isDraw) {
    await updateDraw(firstUser);
    await updateDraw(secondUser);
    return {
      winner: null,
      loser: null,
      draw: true,
    };
  }

  if (isFirstUserTheWinner) {
    await updateWin(firstUser);
    await updateLoss(secondUser);
    return {
      winner: firstUser,
      loser: secondUser,
      draw: false,
    };
  }

  await updateLoss(firstUser);
  await updateWin(secondUser);
  return {
    winner: secondUser,
    loser: firstUser,
    draw: false,
  };
}

export async function getRanking() {
  const ranking = await fightRepository.getFighters();

  return ranking;
}
