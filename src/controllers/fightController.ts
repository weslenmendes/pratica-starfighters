import { Request, Response } from "express";
import * as fightService from "./../services/fightService.js";

export async function makeBattle(req: Request, res: Response) {
  const { firstUser, secondUser } = req.body;

  const result = await fightService.makeBattle(firstUser, secondUser);

  res.send(result);
}

export async function getRanking(req: Request, res: Response) {
  const ranking = await fightService.getRanking();

  res.send({ fighters: ranking });
}
