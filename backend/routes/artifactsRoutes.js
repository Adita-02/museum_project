import express from 'express';
import {
 createArtifact,
 getArtifacts,
 updateArtifact,
 deleteArtifact
} from "../controllers/artifactController.js";
import verifyAdmin from "../middleware/verifyAdmin.js";

const router = express.Router();

router.get('/', getArtifacts);
router.post('/add', verifyAdmin, createArtifact);
router.put('/update/:id', verifyAdmin, updateArtifact);
router.delete('/delete/:id', verifyAdmin, deleteArtifact);

export default router;