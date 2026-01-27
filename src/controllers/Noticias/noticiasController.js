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
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)+/g, "");

    //convertir el tags en un array valido
    const parsedTags = tags
      ? Array.isArray(tags)
        ? tags
        : tags.split(",").map((tag) => tag.trim())
      : [];

    //subir la imagen temporal a cloudinary
    const result = await cloudinary.uploader.upload(req.file.path, {
      folder: "noticias",
      public_id: `${slug}-${Date.now()}`,
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

    //guardar la noticia en la base de datos
    await noticia.save();

    //borrar la imagen de la carpeta uploads
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

export const getNoticias = async (req, res) => {
  try {
    const { author, category, published } = req.query;

    const filters = {};

    if (author) filters.author = author;
    if (category) filters.category = category;

    if (typeof published === "string") {
      filters.published = published === "true";
    }

    //si existe un filtro , tramos la noticia mas reciente
    const news = await Noticias.find(filters).sort({ createdAt: -1 });

    res.status(200).json(news);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error al obtener las noticias" });
  }
};

export const getNoticiaById = async (req, res) => {
  try {
    const { id } = req.params;
    //buscamos noticia por Id
    const noticia = await Noticias.findById(id);
    if (!noticia) {
      return res.status(404).json({ message: "Noticia no encontrada" });
    }

    res.status(200).json(noticia);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener la noticia" });
  }
};

export const updateNoticia = async (req, res) => {
  const { id } = req.params;

  try {
    const noticia = await Noticias.findById(id);
    if (!noticia) {
      return res.status(404).json({ message: "Noticia no encontrada" });
    }

    const updateData = { ...req.body };

    // 👉 Si viene nueva imagen
    if (req.file) {
      // borrar imagen anterior de cloudinary
      if (noticia.image?.public_id) {
        await cloudinary.uploader.destroy(noticia.image.public_id);
      }

      // subir nueva imagen
      const result = await cloudinary.uploader.upload(req.file.path, {
        folder: "noticias",
      });

      updateData.image = {
        url: result.secure_url,
        public_id: result.public_id,
      };

      // borrar archivo temporal
      fs.unlinkSync(req.file.path);
    }

    const noticiaActualizada = await Noticias.findByIdAndUpdate(
      id,
      updateData,
      { new: true },
    );

    res.status(200).json(noticiaActualizada);
  } catch (error) {
    console.log(error);

    // limpieza por si falla algo
    if (req.file && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }

    res.status(500).json({ message: "Error al actualizar la noticia" });
  }
};



export const borrarNoticias = async (req, res) => {

   const {id} = req.params;

  try {
    //buscamos la noticia por id
    const noticia = await Noticias.findById(id);
     
     if(!noticia){
      return res.status(404).json({message: 'Noticia no encontrada'});
     }

     //borramos la imagen de cloudinary
     if(noticia.image?.public_id){
      await cloudinary.uploader.destroy(noticia.image.public_id);
     }
     
     //borramos la noticia de la base de datos
     await Noticias.findByIdAndDelete(id);

     res.status(200).json({message: 'Noticia borrada correctamente'});
  } catch (error) {
    console.log(error);
    res.status(500).json({message: 'Error al borrar la noticia'});
  }
}
