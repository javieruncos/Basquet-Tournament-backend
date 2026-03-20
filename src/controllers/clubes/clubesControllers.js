import clubes from "../../models/clubes.js";
import cloudinary from "../../config/cloudinary.js";
import fs from "fs";
import { Jugador } from "../../models/jugador.js";
import mongoose from "mongoose";

// export const crearClubes = async (req, res) => {
//    console.log("ENTRÓ A crearClubes");
//   console.log(req.body);
//   try {
//     if (!req.file) {
//       return res.status(400).json({ message: "La imagen es obligatoria" });
//     }

//     const { name, shortname, category, description, colors } = req.body;

//     if (!name || !shortname || !category) {
//       return res
//         .status(400)
//         .json({ message: "Name, shortname y category son obligatorios" });
//     }

//     const baseSlug = name
//       .toLowerCase()
//       .normalize("NFD")
//       .replace(/[\u0300-\u036f]/g, "")
//       .replace(/[^a-z0-9]+/g, "-")
//       .replace(/(^-|-$)+/g, "");

//     const uniqueSlug = `${baseSlug}-${Date.now()}`;

//     const result = await cloudinary.uploader.upload(req.file.path, {
//       folder: "clubes",
//       public_id: uniqueSlug,
//     });

//     let parsedColors = {};

//     if (req.body.colors) {
//       parsedColors = JSON.parse(req.body.colors);
//     }

//     const newClubes = new clubes({
//       name,
//       shortname,
//       category,
//       description,
//       colors: parsedColors,
//       slug: uniqueSlug,
//       logo: {
//         url: result.secure_url,
//         public_id: result.public_id,
//       },
//     });

//     await newClubes.save();

//     fs.unlinkSync(req.file.path);

//     res.status(201).json(newClubes);
//   } catch (error) {
//     if (req.file && fs.existsSync(req.file.path)) {
//       fs.unlinkSync(req.file.path);
//     }
//     res.status(500).json({ message: "Error al crear el club" });
//   }
// };
export const crearClubes = async (req, res) => {
  console.log("ENTRÓ A crearClubes");
  console.log(req.body);

  try {
    if (!req.file) {
      return res.status(400).json({ message: "La imagen es obligatoria" });
    }

    const {
      name,
      shortname,
      category,
      description,
      city,
      active,
      colors,
    } = req.body;

    if (!name || !shortname || !category) {
      return res
        .status(400)
        .json({ message: "Name, shortname y category son obligatorios" });
    }

    // ✅ Parsear colores de forma segura
    let parsedColors = {};

    if (colors) {
      try {
        parsedColors =
          typeof colors === "string" ? JSON.parse(colors) : colors;
      } catch {
        return res.status(400).json({ message: "Formato de colores inválido" });
      }
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
      public_id: uniqueSlug,
    });

    const newClubes = new clubes({
      name,
      shortname,
      category,
      description,
      city,
      active: active === "true", // 👈 convertir a boolean real
      colors: parsedColors,
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
    console.error("ERROR AL CREAR CLUB:", error); // 🔥 CLAVE

    if (req.file && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }

    res.status(500).json({ message: "Error al crear el club" });
  }
};

export const obtenerClubes = async (req, res) => {
  try {
    const { name, shortname, category } = req.query;

    const filters = {};

    if (name) filters.name = { $regex: name, $options: "i" };
    if (shortname) filters.shortname = { $regex: shortname, $options: "i" };
    if (category) filters.category = category;

    const respuesta = await clubes.find(filters).sort({ createdAt: -1 });

    res.status(200).json(respuesta);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener los clubes" });
  }
};

export const obtenerClubesPorId = async (req, res) => {
  const { id } = req.params;
  try {
    const club = await clubes.findById(id);

    if (!club) {
      return res.status(400).json({ message: "Club no encontrado" });
    }

    res.status(200).json(club);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener los clubes" });
  }
};

export const actualizarClubes = async (req, res) => {
  const { id } = req.params;

  try {
    const club = await clubes.findById(id);
    if (!club) {
      return res.status(404).json({ message: "Club no encontrado" });
    }

    const updateData = { ...req.body };

    delete updateData.slug;

    if (updateData.active !== undefined) {
      updateData.active = updateData.active === "true";
    }

    if (updateData.colors && typeof updateData.colors === "string") {
      try {
        updateData.colors = JSON.parse(updateData.colors);
      } catch {
        return res.status(400).json({ message: "Formato de colores inválido" });
      }
    }

    if (req.file) {
      if (club.logo?.public_id) {
        await cloudinary.uploader.destroy(club.logo.public_id);
      }

      const result = await cloudinary.uploader.upload(req.file.path, {
        folder: "clubes",
      });

      updateData.logo = {
        url: result.secure_url,
        public_id: result.public_id,
      };

      fs.unlinkSync(req.file.path);
    }

    const clubActualizado = await clubes.findByIdAndUpdate(id, updateData, {
      new: true,
    });

    res.status(200).json(clubActualizado);
  } catch (error) {
    if (req.file && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }
    res.status(500).json({ message: "Error al actualizar el club" });
  }
};

export const borrarClubes = async (req, res) => {
  const { id } = req.params;

  try {
    const club = await clubes.findById(id);
    if (!club) {
      return res.status(404).json({ message: "Club no encontrado" });
    }

    if (club.logo?.public_id) {
      await cloudinary.uploader.destroy(club.logo.public_id);
    }

    await clubes.findByIdAndDelete(id);

    res.status(200).json({ message: "Club borrado correctamente" });
  } catch (error) {
    res.status(500).json({ message: "Error al borrar el club" });
  }
};

export const obtenerJugadoresPorClub = async (req, res) => {
  const { clubId } = req.params;

  // Validar que sea un ObjectId válido
  if (!mongoose.Types.ObjectId.isValid(clubId)) {
    return res.status(400).json({ message: "ID de club no válido" });
  }

  try {
    // Buscar jugadores que pertenezcan a ese club
    const jugadores = await Jugador.find({ clubId })
      .select("nombre numero posicion estadisticas")
      .sort({ numero: 1 });

    if (!jugadores.length === 0) {
      return res
        .status(404)
        .json({ message: "No se encontraron jugadores para este club" });
    }

    res.status(200).json(jugadores);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
