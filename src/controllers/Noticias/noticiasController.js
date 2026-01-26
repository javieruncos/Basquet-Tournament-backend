import cloudinary from "../../config/cloudinary.js";
import Noticias from "../../models/Noticias.js";
import fs from "fs";

export const crearNoticia = async (req, res) => {

    console.log("BODY:", req.body);
  console.log("FILE:", req.file);
  try {
    //verificar que se haya subido una imagen
    if (!req.file) {
      return res.status(400).json({ message: "La imagen es obligatoria" });
    }
    //
    const { title, content, author, category, tags } = req.body;

    //verificar que los campos no esten vacios
    if (!title || !content) {
      return res
        .status(400)
        .json({ message: "Todos los campos son obligatorios" });
    }

     //generar slug
    const slug = title
      .toLowerCase()
      .trim()
      .replace(/\s+/g, "-")
      .replace(/[^\w-]/g, "");


    //convertir el tags en un array valido
      const parsedTags = tags
      ? Array.isArray(tags)
        ? tags
        : tags.split(",").map(tag => tag.trim())
      : [];

    //subir la imagen temporal a cloudinary
    const result = await cloudinary.uploader.upload(req.file.path, {
      folder: "noticias",
      public_id: `${title}-${Date.now()}`,
    });

    const noticia = new Noticias({
      title,
      content,
      author,
      category,
      tags: parsedTags,
      slug,
      image: {
        url: result.secure_url,
        public_id: result.public_id,
      },
    });

    await noticia.save();

    fs.unlinkSync(req.file.path);

    res.status(201).json({ message: "Noticia creada correctamente" });
  } catch (error) {
    console.log("Error al crear la noticia", error);

    if (req.file && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }

    res.status(500).json({ message: "Error al crear la noticia" });
  }
};
