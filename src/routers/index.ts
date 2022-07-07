import { Router } from "express";

import { makeBattle, getRanking } from "./../controllers/fightController.js";
import { validateSchema } from "./../middlewares/schemaValidatorMiddleware.js";
import { battleSchema } from "./../schemas/fightSchema.js";

const router = Router();

router.post("/battle", validateSchema(battleSchema), makeBattle);
router.get("/ranking", getRanking);

export default router;
