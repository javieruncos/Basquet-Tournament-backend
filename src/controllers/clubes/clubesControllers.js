import { modelNames } from "mongoose";
import clubes from "../../models/clubes";
import cloudinary from "../../config/cloudinary";

export const crearClubes = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "La imagen es obligatoria" });
    }

    const { name, shortname, category, description, colors } = req.body;

    if (!name || !shortname || !category) {
      return res
        .status(400)
        .json({ message: "Name, shortname y category son obligatorios" });
    }

    const baseSlug = name
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)+/g, "");

       const uniqueSlug = `${baseSlug}-${Date.now()}`;

    const result = await cloudinary.uploader.upload(req.file.path, {
      folder: "clubes",
      public_id:uniqueSlug,
    });

    const newClubes = new clubes({
      name,
      shortname,
      category,
      description,
      colors,
      slug: uniqueSlug,
      logo: {
        url: result.secure_url,
        public_id: result.public_id,
      },
    });

    await newClubes.save();

    fs.unlinkSync(req.file.path);

    res.status(201).json(newClubes);

  } catch (error) {
    if (req.file && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }
   res.status(500).json({ message: "Error al crear el club" });
  }
};
