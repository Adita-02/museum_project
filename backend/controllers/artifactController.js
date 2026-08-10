import Artifact from "../models/artifact.js";

// Create a new artifact
export const createArtifact = async (req, res) => {
    try {
        const artifact = await Artifact.create(req.body);

        res.json({
            message: "Artifact created successfully",
            artifact,
        });
    } catch (error) {
        res.status(500).json({
            message: "Server Error",
            error: error.message,
        });
    }
};

// Get all artifacts
export const getArtifacts = async (req, res) => {
    try {
        const {search, category} = req.query;

        let filter = {};

        if (search) {
            filter.title = { $regex: search, $options: 'i' }; // Case-insensitive search
        }

        if (category) {
            filter.category = category;
        }

        const artifacts = await Artifact.find(filter).sort({ createdAt: -1 });
        res.json(artifacts);
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error });
    }
};

//Update a artifact
export const updateArtifact = async (req, res) => {
    try {
        const updated = await Artifact.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );
        res.json({
            message: 'Artifact updated successfully',
            updated,
        });
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error });
    }
}

// Delete a artifact
export const deleteArtifact = async (req, res) => {
    try {
        await Artifact.findByIdAndDelete(req.params.id);
        res.json({ message: 'Artifact deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error });
    }
}