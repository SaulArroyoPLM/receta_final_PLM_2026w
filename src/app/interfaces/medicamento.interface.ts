// src/app/interfaces/medicamento.interface.ts

export interface Medicamento {
  id: number;
  
  // Propiedades del buscador
  nombre?: string;
  presentacion?: string;
  composicion?: string;
  contenido?: string;
  
  // Propiedades de las cards
  marca?: string;
  solucion?: string;
  laboratorio: string;
  sustancia?: string;
  indicacion?: string;
  dosis?: string;
  letra?: string;
  formaFarmaceutica?: string;
  presentaciones?: string[];
  link?: string;
  
  // Imágenes (comunes para ambos)
  imagen: string;
  imagenDetalle?: string;
  imagenBuscador?: string;
  
  // Información detallada IPPA (usada en el modal)
  ippaInfo?: {
    descripcionPropiedades?: {
      propiedadesFarmaceuticas?: string;
      composicion?: string;
      presentacion?: string;
      almacenamiento?: string;
    };
    usoSeguridad?: {
      indicacionesTerapeuticas?: string;
      dosisViaAdministracion?: string;
      contraindicaciones?: string;
      restriccionesEmbarazo?: string;
      precauciones?: string;
      leyendasProteccion?: string;
    };
    efectosRiesgos?: {
      reaccionesAdversas?: string;
      interacciones?: string;
      hallazgosLaboratorio?: string;
      sobredosificacion?: string;
    };
  };
}