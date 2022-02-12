import axios from "axios";
import { Router } from "express";
import { validateCombination } from "../helpers/validateCombination";
import GenerateRandomService from "../services/GenerateRandomService";
import UploadToProviders from "../services/UploadToProviders";
import { doesCombinationExists } from "../utils/doesCombinationExists";

const routes = Router();

routes.get("/generate-random/", async (req, res) => {
  const generatedFileDir = await GenerateRandomService.execute("");
  const url = await UploadToProviders.execute(generatedFileDir);

  return res.redirect(url);
});

routes.get("/generate-random/:combination", async (req, res) => {
  const { combination } = req.params;

  if (combination) {
    const error = validateCombination(combination);
    if (error) return res.status(401).json({ message: error });

    const exists = await doesCombinationExists(combination);
    if (exists) return res.redirect(exists);
  }

  const generatedFileDir = await GenerateRandomService.execute(combination);
  const url = await UploadToProviders.execute(generatedFileDir);

  return res.redirect(url);
});

export default routes;
