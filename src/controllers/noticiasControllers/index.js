import { Noticia } from "../../models/noticia.js";

// 🚀 CREAR CONTENIDO
export const crearNoticia = async (req, res) => {
  try {
    const { titulo, descripcion, imagenUrl, posicion, activo, link } = req.body;

    if (!titulo || !descripcion || !posicion) {
      return res.status(400).json({
        mensaje: "titulo, descripcion y posicion son obligatorios",
      });
    }

    const noticia = new Noticia({
      titulo,
      descripcion,
      imagenUrl: imagenUrl || null,
      posicion,
      activo: activo !== undefined ? activo : true,
      link: link || null,
    });

    const noticiaGuardada = await noticia.save();
    
    return res.status(201).json(noticiaGuardada);
  } catch (error) {
    return res.status(500).json({
      mensaje: "Error al crear noticia",
      error: error.message,
    });
  }
};

// 🔍 OBTENER TODOS LOS CONTENIDOS (CON FILTROS DINÁMICOS)
export const obtenerNoticias = async (req, res) => {
  try {
    // Capturamos filtros opcionales desde la URL (ej: ?posicion=atsa_hoteles&activo=true)
    const { posicion, activo } = req.query;
    
    // Construimos el objeto de búsqueda dinámicamente
    const filtros = {};
    
    if (posicion) {
      filtros.posicion = posicion;
    }
    
    if (activo !== undefined) {
      // Convertimos el string 'true'/'false' de la URL a un Booleano real
      filtros.activo = activo === "true";
    }

    // Buscamos aplicando los filtros si existen, u obtenemos todo si no se envían params
    const noticias = await Noticia.find(filtros).sort({ createdAt: -1 });
    
    return res.status(200).json(noticias);
  } catch (error) {
    return res
      .status(500)
      .json({ mensaje: "Error al obtener noticias", error: error.message });
  }
};

// 📌 OBTENER UN SOLO CONTENIDO POR ID
export const obtenerNoticia = async (req, res) => {
  try {
    const { id } = req.params;
    const noticia = await Noticia.findById(id);

    if (!noticia) {
      return res.status(404).json({ mensaje: "Noticia no encontrada" });
    }

    return res.status(200).json(noticia);
  } catch (error) {
    return res
      .status(500)
      .json({ mensaje: "Error al obtener noticia", error: error.message });
  }
};

// ✏️ ACTUALIZAR CONTENIDO (Limpieza de Payload Optimizada)
export const actualizarNoticia = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = { ...req.body };

    // Eliminamos del objeto cualquier campo que venga explícitamente como undefined
    Object.keys(updateData).forEach(
      (key) => updateData[key] === undefined && delete updateData[key]
    );

    const noticiaActualizada = await Noticia.findByIdAndUpdate(
      id,
      { $set: updateData },
      { new: true, runValidators: true } // runValidators asegura que respete el ENUM del modelo
    );

    if (!noticiaActualizada) {
      return res.status(404).json({ mensaje: "Noticia no encontrada" });
    }

    return res.status(200).json(noticiaActualizada);
  } catch (error) {
    return res.status(500).json({
      mensaje: "Error al actualizar noticia",
      error: error.message,
    });
  }
};

// 🗑️ ELIMINAR CONTENIDO
export const eliminarNoticia = async (req, res) => {
  try {
    const { id } = req.params;
    const noticiaEliminada = await Noticia.findByIdAndDelete(id);

    if (!noticiaEliminada) {
      return res.status(404).json({ mensaje: "Noticia no encontrada" });
    }

    return res.status(200).json({ mensaje: "Noticia eliminada correctamente" });
  } catch (error) {
    return res
      .status(500)
      .json({ mensaje: "Error al eliminar noticia", error: error.message });
  }
};