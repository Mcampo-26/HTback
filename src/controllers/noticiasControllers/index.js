import { Noticia } from "../../models/noticia.js";



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



  export const obtenerNoticias = async (req, res) => {
    try {
      const noticias = await Noticia.find().sort({ createdAt: -1 });
      return res.status(200).json(noticias);
    } catch (error) {
      return res
        .status(500)
        .json({ mensaje: "Error al obtener noticias", error: error.message });
    }
  };

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

  export const actualizarNoticia = async (req, res) => {
    try {
      const { id } = req.params;
      const { titulo, descripcion, imagenUrl, posicion, activo, link } = req.body;
  
      const noticiaActualizada = await Noticia.findByIdAndUpdate(
        id,
        {
          ...(titulo !== undefined && { titulo }),
          ...(descripcion !== undefined && { descripcion }),
          ...(imagenUrl !== undefined && { imagenUrl }),
          ...(posicion !== undefined && { posicion }),
          ...(activo !== undefined && { activo }),
          ...(link !== undefined && { link }), // ✅ IMPORTANTE
        },
        { new: true }
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

