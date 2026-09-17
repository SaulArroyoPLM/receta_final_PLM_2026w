import { Injectable } from '@angular/core';
import { Medicamento } from '../interfaces/medicamento.interface';
import { Observable, of } from 'rxjs'; // ✅ Para retornar observable

@Injectable({
  providedIn: 'root'
})
export class MedicamentosService {

  private medicamentos: Medicamento[] = [
   
     

  {
    id: 1,
    marca: "AC-FAST",
    solucion: "Tabletas",
    laboratorio: "AC-FAST",
    sustancia: "PARACETAMOL",
    presentaciones: [
      "1 Caja, 10 Tabletas, 500 mg",
      "1 Caja, 20 Tabletas, 500 mg",
      "1 Frasco, 10 Tabletas, 500 mg"
    ],
    indicacion: "Analgésico y antipirético para cefalea, neuralgias, dolores articulares, fiebre y síntomas de resfriado. No irrita el estómago como los salicilatos.",
    dosis: "Adultos: 1-2 tabletas cada 6-8 horas. Niños >12 años: igual. Máx. 4 g/día. Oral.",
    imagen: "https://www.plmconnection.com/plmservices/PharmaSearchEngine/Mexico/DEF/SIDEF/400x400/sanfer_ac_fast_tabs_500mg_caja10.png",
    imagenDetalle: "https://www.plmconnection.com/plmservices/PharmaSearchEngine/Mexico/DEF/SIDEF/400x400/sanfer_ac_fast_tabs_500mg_caja10.png",
    link: "detalle-medicamento"
  },
  {
    id: 2,
    marca: "IBUPROFENO",
    solucion: "Tabletas",
    laboratorio: "Genérico PLM",
    sustancia: "IBUPROFENO",
    presentaciones: [
      "1 Caja, 20 Tabletas, 200 mg",
      "1 Caja, 40 Tabletas, 400 mg",
      "1 Caja, 10 Tabletas, 600 mg",
      "Suspensión oral, 120 ml, 100 mg/5 ml"
    ],
    indicacion: "Antiinflamatorio no esteroideo para artritis, dolor moderado, dismenorrea y fiebre. Reduce inflamación y agregación plaquetaria.",
    dosis: "Adultos: 200-400 mg cada 6-8 horas. Máx. 1.2 g/día. Oral, con alimentos.",
    imagen: "https://www.plmconnection.com/plmservices/PharmaSearchEngine/Mexico/DEF/Logos/400x400/arlex.png",
    imagenDetalle: "https://www.plmconnection.com/plmservices/PharmaSearchEngine/Mexico/DEF/Logos/400x400/arlex.png",
    link: "detalle-medicamento"
  },
  {
    id: 3,
    marca: "NAPROXENO",
    solucion: "Tabletas",
    laboratorio: "AMSA",
    sustancia: "NAPROXENO",
    presentaciones: [
      "1 Caja, 20 Tabletas, 250 mg",
      "1 Caja, 10 Tabletas, 500 mg",
      "1 Caja, 14 Tabletas, 375 mg",
      "Suspensión, 120 ml, 125 mg/5 ml"
    ],
    indicacion: "Tratamiento de artritis reumatoide, osteoartritis, gota aguda y dismenorrea. Inhibe prostaglandinas para reducir dolor e inflamación.",
    dosis: "Adultos: 250-500 mg cada 12 horas. Inicial: 500 mg. Oral, con comida.",
    imagen: "https://www.plmconnection.com/plmservices/PharmaSearchEngine/Mexico/DEF/SIDEF/400x400/amsa_naproxeno_tabs_250mg_30.png",
    imagenDetalle: "https://www.plmconnection.com/plmservices/PharmaSearchEngine/Mexico/DEF/SIDEF/400x400/amsa_naproxeno_tabs_250mg_30.png",
    link: "detalle-medicamento"
  },
  {
    id: 4,
    marca: "METAMIZOL SÓDICO",
    solucion: "Tabletas",
    laboratorio: "Genérico PLM",
    sustancia: "METAMIZOL SÓDICO",
    presentaciones: [
      "1 Caja, 10 Tabletas, 500 mg",
      "1 Caja, 20 Tabletas, 300 mg",
      "Ampolleta inyectable, 2 ml, 500 mg",
      "Supositorio, 10, 500 mg"
    ],
    indicacion: "Analgésico para cólicos renales, biliares, dolor postoperatorio y fiebre alta. Efecto rápido sin irritación gástrica.",
    dosis: "Adultos: 500 mg-1 g cada 6-8 horas. Máx. 4 g/día. Oral o IM/IV.",
    imagen: "https://www.plmconnection.com/plmservices/PharmaSearchEngine/Mexico/DEF/SIDEF/400x400/amsa_metamizolsodico_tabs_500mg_10.png",
    imagenDetalle: "https://www.plmconnection.com/plmservices/PharmaSearchEngine/Mexico/DEF/SIDEF/400x400/amsa_metamizolsodico_tabs_500mg_10.png",
    link: "detalle-medicamento"
  },
  {
    id: 5,
    marca: "OMEPRAZOL",
    solucion: "Cápsulas",
    laboratorio: "Genérico PLM",
    sustancia: "OMEPRAZOL",
    presentaciones: [
      "1 Caja, 14 Cápsulas, 20 mg",
      "1 Caja, 28 Cápsulas, 10 mg",
      "1 Caja, 7 Cápsulas, 40 mg"
    ],
    indicacion: "Úlcera gástrica/duodenal, reflujo gastroesofágico y síndrome de Zollinger-Ellison. Inhibe bomba de protones para reducir ácido.",
    dosis: "Adultos: 20-40 mg/día por 4-8 semanas. Tomar en ayunas. Oral.",
    imagen: "https://www.plmconnection.com/plmservices/PharmaSearchEngine/Mexico/DEF/Logos/400x400/apotex.png",
    imagenDetalle: "https://www.plmconnection.com/plmservices/PharmaSearchEngine/Mexico/DEF/Logos/400x400/apotex.png",
    link: "detalle-medicamento"
  },
  {
    id: 6,
    marca: "PANTOPRAZOL",
    solucion: "Tabletas",
    laboratorio: "Genérico PLM",
    sustancia: "PANTOPRAZOL",
    presentaciones: [
      "1 Caja, 14 Tabletas, 20 mg",
      "1 Caja, 28 Tabletas, 40 mg",
      "1 Caja, 7 Tabletas, 40 mg"
    ],
    indicacion: "Tratamiento de erosiones esofágicas por reflujo, úlceras y prevención en terapia con AINE. Bloquea secreción ácida gástrica.",
    dosis: "Adultos: 20-40 mg/día. Máx. 8 semanas. Oral, antes de comidas.",
    imagen: "https://www.plmconnection.com/plmservices/PharmaSearchEngine/Mexico/DEF/Logos/400x400/apotex.png",
    imagenDetalle: "https://www.plmconnection.com/plmservices/PharmaSearchEngine/Mexico/DEF/Logos/400x400/apotex.png",
    link: "detalle-medicamento"
  },
  {
    id: 7,
    marca: "AMOXICILINA",
    solucion: "Cápsulas",
    laboratorio: "Genérico PLM",
    sustancia: "AMOXICILINA",
    presentaciones: [
      "1 Caja, 20 Cápsulas, 500 mg",
      "1 Caja, 12 Cápsulas, 250 mg",
      "Suspensión, 100 ml, 125 mg/5 ml"
    ],
    indicacion: "Infecciones bacterianas: otitis, sinusitis, neumonía y urinarias. Antibiótico beta-lactámico de amplio espectro.",
    dosis: "Adultos: 250-500 mg cada 8 horas. Niños: 20-40 mg/kg/día. Oral.",
    imagen: "https://www.plmconnection.com/plmservices/PharmaSearchEngine/Mexico/DEF/Logos/400x400/AMSA.png",
    imagenDetalle: "https://www.plmconnection.com/plmservices/PharmaSearchEngine/Mexico/DEF/Logos/400x400/AMSA.png",
    link: "detalle-medicamento"
  },
  {
    id: 8,
    marca: "METFORMINA",
    solucion: "Tabletas",
    laboratorio: "Genérico PLM",
    sustancia: "METFORMINA",
    presentaciones: [
      "1 Caja, 60 Tabletas, 500 mg",
      "1 Caja, 30 Tabletas, 850 mg",
      "1 Caja, 30 Tabletas, 1000 mg"
    ],
    indicacion: "Diabetes tipo 2 con obesidad. Mejora control glucémico, reduce resistencia a insulina. Combinar con dieta y ejercicio.",
    dosis: "Adultos: 500-850 mg cada 12 horas. Máx. 2.5 g/día. Oral, con comidas.",
    imagen: "https://www.plmconnection.com/plmservices/PharmaSearchEngine/Ecuador/DEF/Logos/400x400/nifa_logo.png",
    imagenDetalle: "https://www.plmconnection.com/plmservices/PharmaSearchEngine/Ecuador/DEF/Logos/400x400/nifa_logo.png",
    link: "detalle-medicamento"
  },
  {
    id: 9,
    marca: "LOSARTÁN",
    solucion: "Comprimidos",
    laboratorio: "Genérico PLM",
    sustancia: "LOSARTÁN",
    presentaciones: [
      "1 Caja, 30 Comprimidos, 50 mg",
      "1 Caja, 30 Comprimidos, 100 mg",
      "1 Caja, 30 Comprimidos, 50/12.5 mg (con HCT)"
    ],
    indicacion: "Hipertensión arterial esencial. Bloqueador de receptores de angiotensina II para reducir presión sanguínea.",
    dosis: "Adultos: 50 mg/día. Ajustar hasta 100 mg. Oral.",
    imagen: "https://www.plmconnection.com/plmservices/PharmaSearchEngine/Mexico/DEF/SIDEF/400x400/amsa_losartan_50mg_comp_30comp.png",
    imagenDetalle: "https://www.plmconnection.com/plmservices/PharmaSearchEngine/Mexico/DEF/SIDEF/400x400/amsa_losartan_50mg_comp_30comp.png",
    link: "detalle-medicamento"
  },
  {
    id: 10,
    marca: "ENALAPRIL",
    solucion: "Tabletas",
    laboratorio: "Genérico PLM",
    sustancia: "ENALAPRIL",
    presentaciones: [
      "1 Caja, 30 Tabletas, 5 mg",
      "1 Caja, 30 Tabletas, 10 mg",
      "1 Caja, 30 Tabletas, 20 mg"
    ],
    indicacion: "Hipertensión y insuficiencia cardíaca congestiva. Inhibidor de ECA para relajar vasos sanguíneos.",
    dosis: "Adultos: 5-20 mg/día en 1-2 tomas. Máx. 40 mg/día. Oral.",
    imagen: "https://www.plmconnection.com/plmservices/PharmaSearchEngine/Mexico/DEF/SIDEF/400x400/amsa_losartanhdroctz_comprmds_100mgcj15.png",
    imagenDetalle: "https://www.plmconnection.com/plmservices/PharmaSearchEngine/Mexico/DEF/SIDEF/400x400/amsa_losartanhdroctz_comprmds_100mgcj15.png",
    link: "detalle-medicamento"
  },
  {
    id: 11,
    marca: "AMLODIPINO",
    solucion: "Tabletas",
    laboratorio: "Genérico PLM",
    sustancia: "AMLODIPINO",
    presentaciones: [
      "1 Caja, 30 Tabletas, 5 mg",
      "1 Caja, 30 Tabletas, 10 mg"
    ],
    indicacion: "Hipertensión y angina estable. Bloqueador de canales de calcio para dilatar arterias.",
    dosis: "Adultos: 5-10 mg/día. Oral, una vez al día.",
    imagen: "https://www.plmconnection.com/plmservices/PharmaSearchEngine/Mexico/DEF/SIDEF/400x400/pfizer_amlodipino_5mg_30_tabs.png",
    imagenDetalle: "https://www.plmconnection.com/plmservices/PharmaSearchEngine/Mexico/DEF/SIDEF/400x400/pfizer_amlodipino_5mg_30_tabs.png",
    link: "detalle-medicamento"
  },
  {
    id: 12,
    marca: "SIMVASTATINA",
    solucion: "Tabletas",
    laboratorio: "Genérico PLM",
    sustancia: "SIMVASTATINA",
    presentaciones: [
      "1 Caja, 30 Tabletas, 10 mg",
      "1 Caja, 30 Tabletas, 20 mg",
      "1 Caja, 30 Tabletas, 40 mg"
    ],
    indicacion: "Hipercolesterolemia primaria y mixta. Inhibe HMG-CoA reductasa para bajar LDL y triglicéridos.",
    dosis: "Adultos: 10-40 mg/día por la noche. Oral.",
    imagen: "https://www.plmconnection.com/plmservices/PharmaSearchEngine/Mexico/DEF/SIDEF/400x400/plm.jpg",
    imagenDetalle: "https://www.plmconnection.com/plmservices/PharmaSearchEngine/Mexico/DEF/SIDEF/400x400/plm.jpg",
    link: "detalle-medicamento"
  },
  {
    id: 13,
    marca: "ATORVASTATINA",
    solucion: "Tabletas",
    laboratorio: "Genérico PLM",
    sustancia: "ATORVASTATINA",
    presentaciones: [
      "1 Caja, 30 Tabletas, 10 mg",
      "1 Caja, 30 Tabletas, 20 mg",
      "1 Caja, 30 Tabletas, 40 mg",
      "1 Caja, 30 Tabletas, 80 mg"
    ],
    indicacion: "Prevención cardiovascular en hiperlipidemia. Reduce colesterol total y LDL.",
    dosis: "Adultos: 10-80 mg/día. Oral, cualquier hora.",
    imagen: "https://www.plmconnection.com/plmservices/PharmaSearchEngine/Mexico/DEF/SIDEF/400x400/amsa_atorvastatina_tab_20mg_10.png",
    imagenDetalle: "https://www.plmconnection.com/plmservices/PharmaSearchEngine/Mexico/DEF/SIDEF/400x400/amsa_atorvastatina_tab_20mg_10.png",
    link: "detalle-medicamento"
  },
  {
    id: 14,
    marca: "CLONAZEPAM",
    solucion: "Tabletas",
    laboratorio: "TEMPUS",
    sustancia: "CLONAZEPAM",
    presentaciones: [
      "1 Caja, 30 Tabletas, 0.5 mg",
      "1 Caja, 30 Tabletas, 2 mg",
      "1 Caja, 30 Tabletas, 1 mg"
    ],
    indicacion: "Epilepsia (ausencias, mioclonías) y trastornos de pánico. Benzodiazepina para control de convulsiones.",
    dosis: "Adultos: 0.5-2 mg/día dividido. Ajustar gradualmente. Oral.",
    imagen: "https://www.plmconnection.com/plmservices/PharmaSearchEngine/Mexico/DEF/SIDEF/400x400/pisa_panazeclox_clonazepam_tabletas2mgsolucionoral25mgml_30y100tabsfrasco10mlcongoteropipeta.png",
    imagenDetalle: "https://www.plmconnection.com/plmservices/PharmaSearchEngine/Mexico/DEF/SIDEF/400x400/pisa_panazeclox_clonazepam_tabletas2mgsolucionoral25mgml_30y100tabsfrasco10mlcongoteropipeta.png",
    link: "detalle-medicamento"
  },
  {
    id: 15,
    marca: "DIAZEPAM",
    solucion: "Comprimidos",
    laboratorio: "Genérico PLM",
    sustancia: "DIAZEPAM",
    presentaciones: [
      "1 Caja, 20 Comprimidos, 5 mg",
      "1 Caja, 20 Comprimidos, 10 mg",
      "Ampolleta inyectable, 2 ml, 10 mg"
    ],
    indicacion: "Ansiedad, espasmos musculares y convulsiones agudas. Sedante y ansiolítico de acción media.",
    dosis: "Adultos: 2-10 mg, 2-4 veces/día. Oral o IV/IM.",
    imagen: "https://www.plmconnection.com/plmservices/PharmaSearchEngine/Mexico/DEF/SIDEF/400x400/tempus_diazepam_familia.png",
    imagenDetalle: "https://www.plmconnection.com/plmservices/PharmaSearchEngine/Mexico/DEF/SIDEF/400x400/tempus_diazepam_familia.png",
    link: "detalle-medicamento"
  },
  {
    id: 16,
    marca: "LEVOTIROXINA SÓDICA",
    solucion: "Tabletas",
    laboratorio: "Genérico PLM",
    sustancia: "LEVOTIROXINA SÓDICA",
    presentaciones: [
      "1 Caja, 30 Tabletas, 50 mcg",
      "1 Caja, 30 Tabletas, 100 mcg",
      "1 Caja, 30 Tabletas, 25 mcg"
    ],
    indicacion: "Hipotiroidismo, bocio simple y supresión de TSH en cáncer tiroideo. Reemplazo hormonal tiroideo.",
    dosis: "Adultos: 50-100 mcg/día en ayunas. Ajustar por TSH. Oral.",
    imagen: "https://www.plmconnection.com/plmservices/PharmaSearchEngine/Mexico/DEF/SIDEF/400x400/amsa_levotiroxinasodica_tabs_cj100.png",
    imagenDetalle: "https://www.plmconnection.com/plmservices/PharmaSearchEngine/Mexico/DEF/SIDEF/400x400/amsa_levotiroxinasodica_tabs_cj100.png",
    link: "detalle-medicamento"
  },
  {
    id: 17,
    marca: "COMPLEJO B FORTE",
    solucion: "Comprimidos",
    laboratorio: "QUÍMICA ARISTON",
    sustancia: "COMPLEJO B (B1, B6, B12)",
    presentaciones: [
      "1 Caja, 30 Comprimidos recubiertos",
      "1 Frasco, 60 Comprimidos"
    ],
    indicacion: "Deficiencias vitamínicas, neuritis, anemia y astenia. Apoya metabolismo, nervios y formación sanguínea.",
    dosis: "Adultos: 1-3 comprimidos/día por 3 meses. Oral, con agua.",
    imagen: "https://www.plmconnection.com/plmservices/PharmaSearchEngine/Mexico/DEF/SIDEF/400x400/amsa_complejoBdiclofenaco_tabs_1mg.png",
    imagenDetalle: "https://www.plmconnection.com/plmservices/PharmaSearchEngine/Mexico/DEF/SIDEF/400x400/amsa_complejoBdiclofenaco_tabs_1mg.png",
    link: "detalle-medicamento"
  },
  {
    id: 18,
    marca: "CIPROFLOXACINO",
    solucion: "Cápsulas",
    laboratorio: "Genérico PLM",
    sustancia: "CIPROFLOXACINO",
    presentaciones: [
      "1 Caja, 10 Cápsulas, 500 mg",
      "1 Caja, 14 Cápsulas, 250 mg",
      "Tabletas recubiertas, 10, 750 mg"
    ],
    indicacion: "Infecciones urinarias, respiratorias y gastrointestinales por bacterias gram-negativas. Fluoroquinolona de amplio espectro.",
    dosis: "Adultos: 250-750 mg cada 12 horas. 7-14 días. Oral.",
    imagen: "https://www.plmconnection.com/plmservices/PharmaSearchEngine/Mexico/DEF/SIDEF/400x400/amsa_ciprofloxacino_sol_3mg.png",
    imagenDetalle: "https://www.plmconnection.com/plmservices/PharmaSearchEngine/Mexico/DEF/SIDEF/400x400/amsa_ciprofloxacino_sol_3mg.png",
    link: "detalle-medicamento"
  },
  {
    id: 19,
    marca: "SALBUTAMOL",
    solucion: "Aerosol",
    laboratorio: "Genérico PLM",
    sustancia: "SALBUTAMOL",
    presentaciones: [
      "1 Inhalador, 200 dosis, 100 mcg/dosis",
      "1 Frasco, 120 ml, jarabe 2 mg/5 ml",
      "Solución nebulizable, 20 ml, 5 mg/ml"
    ],
    indicacion: "Asma bronquial y EPOC aguda. Broncodilatador beta-2 agonista para alivio rápido de síntomas.",
    dosis: "Adultos: 1-2 inhalaciones cada 4-6 horas. Oral o inhalado.",
    imagen: "https://www.plmconnection.com/plmservices/PharmaSearchEngine/Mexico/DEF/Logos/400x400/jayor.png",
    imagenDetalle: "https://www.plmconnection.com/plmservices/PharmaSearchEngine/Mexico/DEF/Logos/400x400/jayor.png",
    link: "detalle-medicamento"
  },
  {
    id: 20,
    marca: "DICLOFENACO SÓDICO",
    solucion: "Solución inyectable/Tabletas",
    laboratorio: "Genérico PLM",
    sustancia: "DICLOFENACO SÓDICO",
    presentaciones: [
      "1 Caja, 10 Ampollas, 75 mg/3 ml",
      "1 Caja, 20 Tabletas, 50 mg",
      "1 Caja, 10 Sobres granulados, 50 mg"
    ],
    indicacion: "Artritis, dolor postoperatorio y cólicos. AINE para inhibir ciclooxigenasa y reducir prostaglandinas inflamatorias.",
    dosis: "Adultos: 50-150 mg/día dividido. IM/IV inicial, luego oral.",
    imagen: "https://www.plmconnection.com/plmservices/PharmaSearchEngine/Mexico/DEF/Logos/400x400/Degorts.png",
    imagenDetalle: "https://www.plmconnection.com/plmservices/PharmaSearchEngine/Mexico/DEF/Logos/400x400/Degorts.png",
    link: "detalle-medicamento"
  },
  {
      id: 21,
      marca: "ZYXEM",
      solucion: "AMZA",
      laboratorio: "Chinoin",
      sustancia: "LEVOCETIRIZINA",
      presentaciones: [
        "1 Caja, 30 Comprimidos, 2 mg",
        "1 Caja, 30 Comprimidos, 2 mg",
        "1 Caja, 30 Comprimidos, 2 mg",
        "1 Caja, 30 Comprimidos, 2 mg",
      ],
      indicacion: "Indicación terapéutica",
      dosis: "Dosis y vía de administración",
      imagen: "https://www.plmconnection.com/plmservices/PharmaSearchEngine/Mexico/DEF/SIDEF/400x400/amsa_levocetirizina_5mg_tab_10.png",
      imagenDetalle: "https://www.plmconnection.com/plmservices/PharmaSearchEngine/Mexico/DEF/SIDEF/400x400/amsa_levocetirizina_5mg_tab_10.png",  
      link: "detalle-medicamento"
    },
    {
      id: 2,
      marca: "LIPITOR",
      solucion: "Tableta", 
      laboratorio: "VIATRIS",
      sustancia: "ATORVASTATINA",
      presentaciones: [
        "1 Caja, 20 Tabletas, 10 mg",
        "1 Caja, 30 Tabletas, 10 mg",
        "1 Caja, 15 Tabletas, 20 mg",
        "1 Caja, 30 Tabletas, 20 mg",
        "1 Caja, 30 Tabletas, 40 mg",
        "1 Caja, 1 Frasco(s), 30 Tabletas, 80 mg",
        "2 Caja, 30 Tabletas, 10 mg",
        "2 Caja, 30 Tabletas, 20 mg",
        "2 Caja, 30 Tabletas, 40 mg",
        "2 Caja, 2 Frasco(s), 30 Tabletas, 80 mg",
        
      ],
      indicacion: "Indicación terapéutica",
      dosis: "Dosis y vía de administración",
      imagen: "https://www.plmconnection.com/plmservices/PharmaSearchEngine/Mexico/DEF/SIDEF/400x400/viatris_lipitor_fam.png",
      imagenDetalle: "https://www.plmconnection.com/plmservices/PharmaSearchEngine/Mexico/DEF/SIDEF/400x400/viatris_lipitor_fam.png",  
      link: "detalle-medicamento"
    },
];

  constructor() {}

  getMedicamentos(): Medicamento[] {
    return this.medicamentos;
  }

  getMedicamentoById(id: number): Medicamento | undefined {
    return this.medicamentos.find(m => m.id === id);
  }

  // ✅ Método para buscar (filtro local por marca o sustancia)
  buscarMedicamentos(query: string): Observable<Medicamento[]> {
    if (!query) return of([]);
    
    const lowerQuery = query.toLowerCase();
    const resultados = this.medicamentos.filter(med => 
      (med.marca?.toLowerCase().includes(lowerQuery)) || 
      (med.sustancia?.toLowerCase().includes(lowerQuery))
    );
    return of(resultados);
  }
}