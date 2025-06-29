export const capitalize_first_letter = (str: string): string => {
  return str.charAt(0).toUpperCase() + str.slice(1);
}
export const companies: { id: number; name_company: string; description: string; email?: string; networks?: string; phones?: string[], keywords?: string }[] = [
  {
    id: 1,
    name_company: "Alternativas Inclusivas y Sostenibles para la Vida - AVIDA",
    description: "Trabajan por el desarrollo sostenible en el norte del Perú, promoviendo la equidad, igualdad y el bienestar de las comunidades.",
    email: "avida@avida.org.pe",
    networks: "https://www.facebook.com/avidaongperu/",
    keywords: "Desarrollo sostenible"
  },
  {
    id: 2,
    name_company: "Impacta - Jóvenes por la Gestión Pública",
    description: "¡Juventud en acción por un cambio real! Movilizan a jóvenes para transformar la gestión pública y construir un país más justo.",
    email: "d.leguiaballon@gmail.com",
    networks: "https://www.facebook.com/impacta.pe/",
    keywords: "Gestión pública"
  },
  {
    id: 3,
    name_company: "Instituto de Democracia y Derechos Humanos (Idehpucp)",
    description: "Un espacio para el diálogo, la formación y la investigación sobre democracia y derechos humanos. Líderes que promueven una sociedad más justa y equitativa.",
    email: "impacto_idehpucp@pucp.pe",
    networks: "https://www.facebook.com/IDEHPUCP/",
    keywords: "Derechos humanos"
  },
  {
    id: 4,
    name_company: "Asociación Siembra un Árbol Arequipa",
    description: "Aire más puro, paisajes más verdes y una comunidad más conectada. Siembra un Árbol Arequipa lo hace posible.",
    email: "siembraunarbolarequipa@gmail.com",
    phones: ["967311436"],
    networks: "https://www.facebook.com/SiembraArbolArequipa",
    keywords: "Medio Ambiente"
  },
  {
    id: 5,
    name_company: "ASOCIACION CULTURAL DE ARTE POPULAR LOS ANGELES",
    description: "Arte que transforma. A través del teatro y la danza, promueven la reflexión sobre derechos humanos y el cuidado del medio ambiente.",
    email: "rafael.hernandez@gmail.com",
    networks: "https://www.facebook.com/angeles.teatro/about",
    keywords: "Arte y cultura"
  },
  {
    id: 6,
    name_company: "United Peruvian Youth",
    description: "El futuro de Perú en manos de sus jóvenes. Brindan herramientas para promover el cambio y la participación desde la educación.",
    email: "lcevallos@unitedperuvianyouth.com",
    networks: "https://www.facebook.com/unitedperuvianyouth",
    keywords: "Liderazgo"
  },
  {
    id: 7,
    name_company: "Asociación Cultural Dreams Imagination",
    description: "Conectan el arte y la educación en Trujillo con proyectos que inspiran creatividad y transforman el aprendizaje.",
    email: "dreamsimaginationperu@gmail.com",
    networks: "http://www.facebook.com/teatroDi",
    keywords: "Arte y cultura"
  },
  {
    id: 8,
    name_company: "Sci Lab",
    description: "Acercan la ciencia a la comunidad con proyectos que hacen del conocimiento algo emocionante y accesible para todos.",
    email: "mamanihuamanpaloma@gmail.com",
    networks: "https://www.facebook.com/scilabciencia",
    keywords: "Educación"
  },
  {
    id: 9,
    name_company: "Asociación Equipo21",
    description: "Trabajan para que las personas con Síndrome de Down sean parte activa y valorada en todos los espacios de la sociedad.",
    phones: ["941778261", "956820020"],
    networks: "https://www.facebook.com/people/Asociaci%C3%B3n-Equipo21-Arequipa/100064353114898/",
    keywords: "Inclusión y discapacidad"
  },
  {
    id: 10,
    name_company: "Agrupación Desarrollo Estudiantil (ADE)",
    description: "Son una comunidad juvenil que crea espacios donde el aprendizaje y el crecimiento se mezclan para generar cambios positivos en la forma en que vivimos juntos.",
    email: "milagrocarrion17@gmail.com",
    networks: "https://es-la.facebook.com/adeeconomia/",
    keywords: "Gremio estudiantil"
  },
  {
    id: 11,
    name_company: "Asociación de desarrollo y crecimiento personal",
    description: "Apoyo personalizado para personas con discapacidad. Trabajan de la mano con el SINAPEDIS para mejorar su calidad de vida.",
    email: "evillafuerte@pucp.edu.pe",
    networks: "https://www.facebook.com/AdecepONG/?ref=page_internal",
    phones: ["941778261", "956820020"],
    keywords: "Inclusión y discapacidad"
  },
  {
    id: 12,
    name_company: "Asociación Capaz Perú",
    description: "Metodologías participativas que resaltan las diversas capacidades en los ámbitos cultural, educativo y organizacional, generando un impacto real y transformador.",
    email: "contacto@capaz.org.pe",
    networks: "https://www.facebook.com/capazperu/",
    keywords: "Inclusión y discapacidad"
  },
  {
    id: 13,
    name_company: "Asociación Psico Inclusiva Kipu Llaxta",
    description: "Impulsan la inclusión de personas con discapacidad en Perú, a través de iniciativas de desarrollo social y progreso sostenible.",
    email: "contacto@kipullaxta.org.pe",
    phones: ["997184424"],
    networks: "https://www.facebook.com/KipuLlaxta/",
    keywords: "Inclusión y discapacidad"
  },
  {
    id: 14,
    name_company: "Asociación Luchando Contra Viento y Marea",
    description: "Brindan asistencia legal para defender los derechos de personas con discapacidad, luchando contra viento y marea por su igualdad.",
    email: "asoc.lcvm@gmail.com",
    networks: "https://www.facebook.com/luchandocontravientoymarea/",
    keywords: "Inclusión y discapacidad"
  },
  {
    id: 15,
    name_company: "Asociación Síndrome de Down Provincia Ica - ASDPI",
    description: "Padres que apoyan la integración de niños, jóvenes y adultos con Síndrome de Down en Ica, promoviendo su inclusión y desarrollo en la comunidad.",
    email: "asdpi_21@hotmail.com",
    networks: "https://www.facebook.com/ASDPI/",
    keywords: "Inclusión y discapacidad"
  },
  {
    id: 16,
    name_company: "Asociación de Desórdenes del Ciclo de la Urea y Metabólicas - ADCUM",
    description: "Brindan apoyo e información sobre los Desórdenes del Ciclo de la Urea y enfermedades metabólicas, orientando a pacientes y cuidadores.",
    email: "adcumperu@gmail.com",
    networks: "https://www.facebook.com/adcum.peru/",
    keywords: "Salud"
  },
  {
    id: 17,
    name_company: "Asociación de padres y amigos de personas con trastorno del espectro autista - ASPAU",
    description: "Calidad de vida para personas con TEA en Perú, impulsando su integración en la sociedad y la comunidad.",
    email: "aspauperu4@gmail.com",
    networks: "https://www.facebook.com/AUTISMO.ASPAU.PERU/?locale=es_LA",
    keywords: "Inclusión y discapacidad"
  },
  {
    id: 18,
    name_company: "Andares",
    description: "Educación, terapia y oportunidades laborales para personas con discapacidad, respaldados por más de 21 años de transformar vidas.",
    networks: "https://www.facebook.com/centroandares.lima/?locale=es_LA",
    keywords: "Inclusión y discapacidad"
  },
  {
    id: 19,
    name_company: "Academy Champions Kids Ramon Robles",
    description: "Impulsan la inclusión y el desarrollo de niños migrantes y refugiados, construyendo un Perú que acoja a todos.",
    email: "academychampionskidsramonroble@gmail.com",
    phones: ["981787985"],
    networks: "https://www.facebook.com/p/Champions-Kids-Ram%C3%B3n-Robles-100091377174563/?paipv=0&eav=AfZxEYdzGi584L1lzhFyLRxdgxGzNIMz6bPuHVk5o4-dwdoQ-I2wqxPvJvD_hBC-Aa0&_rdr",
    keywords: "Refugiados y migrantes"
  },
  {
    id: 20,
    name_company: "Acción contra el Hambre",
    description: "Luchan contra el hambre en más de 50 países, enfrentando sus causas y efectos con acciones humanitarias.",
    email: "info@accioncontraelhambre.pe",
    networks: "https://www.facebook.com/accioncontraelhambreperu/?locale=es_LA",
    keywords: "Alimentación"
  },
  {
    id: 21,
    name_company: "Acción y Desarrollo",
    description: "Luchan contra la violencia de género, promoviendo la igualdad y colaborando con el Estado y la sociedad civil.",
    email: "info@accionydesarrollo.org",
    networks: "https://www.facebook.com/accionydesarrollo.org/?locale=es_LA",
    keywords: "Género"
  },
  {
    id: 22,
    name_company: "Agencia Adventista para el Desarrollo y Recursos Asistenciales (ADRA)",
    description: "Brindan ayuda de emergencia y desarrollo a personas vulnerables en todo el mundo, como parte de la Iglesia Adventista.",
    email: "plinio.vergara@adra.org.pe",
    networks: "https://www.facebook.com/adraperu/",
    keywords: "Desarrollo sostenible"
  },
  {
    id: 23,
    name_company: "Aldeas Infantiles",
    description: "Tenemos derecho a vivir en familia, por eso apoyan a niñas, niños y adolescentes que han perdido o están en riesgo de perder ese cuidado.",
    phones: ["5112007800"],
    networks: "www.facebook.com/AldeasInfantilesSOS.Pe",
    keywords: "Infancias"
  },
  {
    id: 24,
    name_company: "Amnistía Internacional",
    description: "Son un movimiento global independiente que defiende y promueve los derechos humanos en todo el mundo.",
    email: "m.navarro@amnistia.org.pe",
    networks: "www.facebook.com/aiperu/",
    keywords: "Derechos Humanos"
  },
  {
    id: 25,
    name_company: "Angeles del Camino",
    description: "Acompañan a migrantes, refugiados y solicitantes de refugio, brindando asesoría en salud, educación y trámites migratorios para abrir nuevas oportunidades.",
    email: "944 519 220",
    networks: "https://www.facebook.com/profile.php?id=100064173395529&_rdc=1&_rdr",
    keywords: "Refugiados y migrantes"
  },
  {
    id: 26,
    name_company: "Asociación Protección Población Vulnerable (APPV)",
    description: "Luchan por una sociedad libre de violencia de género, empoderando a mujeres, niños y adolescentes para construir un futuro de equidad.",
    email: "mfdeortiz@gmail.com",
    networks: "https://www.facebook.com/APPVASOC/",
    keywords: "Género"
  },
  {
    id: 27,
    name_company: "ASOCIACION CCEFIRO",
    description: "Luchan por el derecho a la salud de comunidades excluidas, ofreciendo apoyo comunitario a quienes enfrentan VIH/SIDA, tuberculosis y adicciones.",
    email: "juliorc28_2@yahoo.es",
    networks: "https://www.facebook.com/asociacion.ccefiro/?locale=es_LA",
    keywords: "Salud"
  },
  {
    id: 28,
    name_company: "Asociación Pasos Firmes",
    description: "Ayudan a mujeres migrantes a dar pasos firmes, ofreciéndoles apoyo y fortaleciéndolas para enfrentar los desafíos de la migración.",
    email: "asociacionpasosfirmes@gmail.com",
    phones: ["905451524"],
    networks: "https://www.facebook.com/AsociacionPasosFirmes",
    keywords: "Refugiados y migrantes"
  },
  {
    id: 29,
    name_company: "Asociación de Venezolanos en Trujillo (Asoventru)",
    description: "Orientación gratuita a migrantes venezolanos en Trujillo, promoviendo su integración y bienestar para encontrar un nuevo comienzo.",
    email: "directivaasoventru@gmail.com",
    phones: ["929953192"],
    networks: "https://www.facebook.com/asociaciondevenezolanosentrujillo/?locale=es_LA",
    keywords: "Refugiados y migrantes"
  },
  {
    id: 30,
    name_company: "AVSI",
    description: "Crean proyectos educativos y de cooperación que inspiran el autoconocimiento y dejan una huella positiva en las comunidades.",
    email: "administracion.peru@avsi.org",
    networks: "https://it-it.facebook.com/fondazioneavsi/",
    keywords: "Desarrollo sostenible"
  },
  {
    id: 31,
    name_company: "Ayuda en Acción",
    description: "Lideran proyectos que colocan a la infancia y juventud en el centro, empoderándolos para ser protagonistas del cambio y el desarrollo social.",
    email: "mfernandez@ayudaenaccion.org",
    networks: "https://www.facebook.com/ayudaenaccion.peru/",
    keywords: "Infancias"
  },
  {
    id: 32,
    name_company: "CAPLAB - Centro de Servicios para la Capacitación Laboral y el Desarrollo",
    description: "Transforman el capital humano con proyectos innovadores que responden a las necesidades sociales y económicas, tanto en la ciudad como en el campo.",
    email: "caplab@caplab.org.pe                                                 ",
    phones: ["+5114801663"],
    networks: "https://facebook.com/caplabcentral",
    keywords: "Desarrollo sostenible"
  },
  {
    id: 33,
    name_company: "CAPS",
    description: "Salud mental y derechos humanos para todos, con un enfoque psicosocial que impulsa el bienestar y el desarrollo personal.",
    email: "psico@caps.org.pe",
    networks: "https://www.facebook.com/CentroDeAtencionPsicosocial/?locale=es_LA",
    keywords: "Salud mental"
  },
  {
    id: 34,
    name_company: "CARE",
    description: "Impulsan proyectos de desarrollo social que transforman la vida de millones de personas vulnerables.",
    email: "jfontela@caps.org.pe",
    networks: "https://www.facebook.com/CAREenPeru/",
    keywords: "Desarrollo sostenible"
  },
  {
    id: 35,
    name_company: "Cáritas",
    description: "Transforman comunidades vulnerables con proyectos de desarrollo humano, basados en justicia, solidaridad y el respeto a la dignidad de cada persona.",
    email: "manuel.huapaya@caritas.org.pe",
    networks: "https://www.facebook.com/caritasdelperu/",
    keywords: "Acción humanitaria"
  },
  {
    id: 36,
    name_company: "Casa Ronald Mc Donald",
    description: "Un hogar lejos de casa para familias que llegan a Lima buscando tratamiento médico para sus hijos.",
    email: "contactenos@casaronald.org.pe",
    networks: "https://www.facebook.com/CasaRonaldPeru",
    keywords: "Salud"
  },
  {
    id: 37,
    name_company: "CEDEH (Centro de Desarrollo Humano)",
    description: "¡Derechos culturales y sociales para Puno! Impulsan el desarrollo humano a través de capacitación y defensa en comunidades vulnerables.",
    email: "cedeh@cedeh.org.pe",
    phones: ["+511208623"],
    networks: "https://www.facebook.com/www.dhperu.org",
    keywords: "Derechos humanos"
  },
  {
    id: 38,
    name_company: "CEDRO (Centro de Información y Educación para la Prevencion del Abuso de Drogas)",
    description: "Impulsan el desarrollo sostenible y la inclusión económica, promoviendo estilos de vida saludables y fortaleciendo comunidades vulnerables.",
    email: "contacto@cedro.org.pe",
    phones: ["+5114467046"],
    networks: "https://www.facebook.com/cedroperu/",
    keywords: "Salud"
  },
  {
    id: 39,
    name_company: "CESAL",
    description: "Impulsan el desarrollo económico, empleo y gobernabilidad, mientras cuidan el medio ambiente, apoyando a comunidades vulnerables y migrantes en Perú.",
    email: "peru@cesal.org",
    phones: ["+5112784300"],
    networks: "https://www.facebook.com/ONGCESAL/",
    keywords: "Acción humanitaria"
  },
  {
    id: 40,
    name_company: "CHS Alternativo",
    description: "Luchan contra la trata y explotación, protegiendo a las víctimas y promoviendo la restitución de sus derechos vulnerados.",
    email: "direccion@chsalternativo.org",
    networks: "https://www.facebook.com/chsperu",
    keywords: "Trata de personas"
  },
  {
    id: 41,
    name_company: "Comité Internacional de la Cruz Roja (CICR)",
    description: "¡Justicia y dignidad! Monitorean conflictos, apoyamos a personas detenidas y trabajamos en la búsqueda de desaparecidos.",
    phones: ["+5112419904"],
    networks: "https://www.facebook.com/ICRCespanol",
    keywords: "Derechos humanos"
  },
  {
    id: 42,
    name_company: "Sociedad Nacional de la Cruz Roja Peruana",
    description: "Asistencia y apoyo en momentos críticos. Gestionan riesgos de desastres y brindamos ayuda humanitaria a las comunidades más vulnerables.",
    email: "contacto@cruzroja.org.pe",
    networks: "https://www.facebook.com/CruzRojaPeruana",
    keywords: "Acción humanitaria"
  },
  {
    id: 43,
    name_company: "Ciudadanía sin Fronteras",
    description: "Construyen puentes de inclusión trabajando en políticas públicas para integrar a migrantes y refugiados en una sociedad más justa.",
    networks: "https://www.instagram.com/ciudadaniasinfronteras/",
    keywords: "Refugiados y migrantes"
  },
  {
    id: 44,
    name_company: "Conferencia Episcopal Peruana",
    description: "Unidos por la fe reunen a obispos para trabajar en conjunto en temas pastorales y potenciar el impacto de la Iglesia en el Perú.",
    phones: ["+5114631010"],
    networks: "https://www.facebook.com/confepiscopalperu/",
    keywords: "Religión"
  },
  {
    id: 45,
    name_company: "Consejo Interreligioso - Religiones por la Paz",
    description: "Construyen puentes interreligiosos a través del diálogo y la cooperación en favor de la justicia, la paz y la solidaridad.",
    email: "laurav1948@gmail.com",
    networks: "https://www.facebook.com/ConsejoInterreligiosoPeru/",
    keywords: "Religión"
  },
  {
    id: 46,
    name_company: "El Consejo Danés para los Refugiados (DRC)",
    description: "Apoyo integral para comenzar de nuevo. Brindan asistencia y facilitamos la integración de personas desplazadas y refugiadas en la región.",
    email: "yann.faivre@drc.ngo",
    keywords: "Refugiados y migrantes"
  },
  {
    id: 47,
    name_company: "Encuentros Servicio Jesuita a Migrantes",
    description: "Refugiados y migrantes encuentran apoyo para integrarse y defender sus derechos en Perú con su acompañamiento cercano.",
    phones: ["+59162500080"],
    networks: "https://www.facebook.com/sjmPeru",
    keywords: "Refugiados y migrantes"
  },
  {
    id: 48,
    name_company: "Equilibrium CenDE",
    description: "Piensan en grande para América Latina, investigando y debatiendo soluciones sociales y económicas que transformen la región.",
    email: "gbrauckmeyer@equilibriumbdc.com",
    networks: "https://www.facebook.com/EquilibriumCenDE?mibextid=2JQ9oc",
    keywords: "Refugiados y migrantes"
  },
  {
    id: 49,
    name_company: "Food for the Hungry - FH Perú",
    description: "Educación y alimentación que cambian vidas. Trabajan junto a comunidades vulnerables para impulsar su desarrollo.",
    email: "onorhelp@fh.org",
    networks: "https://www.facebook.com/foodforthehungry/",
    keywords: "Alimentación"
  },
  {
    id: 50,
    name_company: "HIAS",
    description: "Dignidad y nuevos comienzos. Apoyan a refugiados y solicitantes de asilo a reconstruir sus vidas alrededor del mundo.",
    email: "sandra.marcos@hias.org",
    networks: "https://www.facebook.com/HIASrefugees",
    keywords: "Refugiados y migrantes"
  },
  {
    id: 51,
    name_company: "IDEHPUCP",
    description: "Democracia y derechos en acción. Lideramos formación e investigación para políticas públicas que construyan un país más justo.",
    email: "esalmon@pucp.edu.pe",
    networks: "https://idehpucp.pucp.edu.pe/",
    keywords: "Derechos humanos"
  },
  {
    id: 52,
    name_company: "Instituto de Defensa Legal (IDL)",
    description: "Paz, derechos y democracia. Son una voz independiente que trabaja por un Perú y una región más equitativa.",
    email: "comunicacioninstitucionalidl@idl.org.pe",
    phones: ["+5116175700"],
    networks: "https://www.facebook.com/ideele/?ref=br_rs",
    keywords: "Derechos humanos"
  },
  {
    id: 53,
    name_company: "Más Igualdad",
    description: "Diversidad y derechos para todos. Luchan por la visibilidad y el reconocimiento familiar de las personas LGBTIQ+ en Perú.",
    email: "ahernandez@masigualdad.pe",
    networks: "https://www.facebook.com/masigualdadpe/",
    keywords: "LGTBIQ+"
  },
  {
    id: 54,
    name_company: "Plan International",
    description: "Infancias protegidas y con oportunidades. Transforman las vidas de niñas, niños y adolescentes a través de educación y cuidado.",
    email: "veronique.henry@plan-international.org",
    networks: "https://www.facebook.com/PlanPeru/",
    keywords: "Género"
  },
  {
    id: 55,
    name_company: "PRISMA",
    description: "Investigación y acción para un futuro mejor. Desarrollan proyectos que fortalecen capacidades y abren oportunidades para una inclusión sostenible.",
    email: "cgutierrez@prisma.org.pe",
    networks: "https://www.facebook.com/PrismaONG",
    keywords: "Desarrollo sostenible"
  },
  {
    id: 56,
    name_company: "PROSA",
    description: "Vivir con calidad y derechos. Ofrecen apoyo integral para personas con VIH/SIDA, promoviendo autoayuda y dignidad.",
    email: "juliocesar@prosa.org.pe",
    networks: "https://www.facebook.com/asociacion.prosa/",
    keywords: "Salud"
  },
  {
    id: 57,
    name_company: "Asociación Civil Quinta Ola",
    description: "Empoderamiento feminista en acción. Educan y generan cambios culturales para garantizar los derechos de niñas y mujeres.",
    email: "gianina@quintaola.org",
    networks: "https://www.facebook.com/QuintaOlaPeru/",
    keywords: "Género"
  },
  {
    id: 58,
    name_company: "RET Americas",
    description: "Transforman crisis en oportunidades sostenibles para comunidades de América Latina.",
    email: "t.rubio@RETAmericas.org",
    networks: "https://www.facebook.com/RETAmericas",
    keywords: "Refugiados y migrantes"
  },
  {
    id: 59,
    name_company: "Unión Venezolana",
    description: "Mano amiga para migrantes. Facilitan la integración de venezolanos en Perú, conectándolos con aliados estratégicos.",
    email: "oscarpt2002@gmail.com",
    networks: "https://www.facebook.com/unionveperu/",
    keywords: "Refugiados y migrantes"
  },
  {
    id: 60,
    name_company: "Oxfam",
    description: "Desigualdad no es destino. Trabajan por una democracia inclusiva que cierre brechas de pobreza y exclusión.",
    email: "alejandra.alayza@oxfam.org",
    networks: "https://www.facebook.com/oxfamenperu/",
    keywords: "Acción humanitaria"
  },
  {
    id: 61,
    name_company: "Lutheran World Relief",
    description: "Futuro resiliente desde la raíz. Impulsan medios de vida sostenibles junto a agricultores y gobiernos, fortaleciendo sectores como el cacao.",
    email: "econtreras@lwr.org",
    networks: "https://www.facebook.com/LuthWorldRelief/",
    keywords: "Desarrollo sostenible"
  },
  {
    id: 62,
    name_company: "Asociación Nacional de Centros",
    description: "Unión para el cambio. Defienden y fortalecen a las ONGD peruanas para que su impacto siga creciendo.",
    email: "pinahuaman@gmail.com",
    networks: "https://www.facebook.com/ANCPERU/?locale=es_LA",
    keywords: "Derechos Humanos"
  },
  {
    id: 63,
    name_company: "Asociación Evangélica Luterana de Ayuda para el Desarrollo Comunal (Diaconía)",
    description: "Agua, salud y oportunidades. Transforman comunidades vulnerables con programas que siembran sostenibilidad y empoderamiento.",
    email: "edelvis.rodriguez@diaconiaperu.org",
    networks: "https://www.facebook.com/DiaconiaPeru",
    keywords: "Acción humanitaria"
  },
  {
    id: 64,
    name_company: "Salvamento Auxilio y Rescate (SAR) Perú",
    description: "Juntos ante los desastres. Previenen riesgos para reducir el impacto de emergencias en el Perú.",
    email: "jperez@sarperu.org",
    networks: "https://www.facebook.com/OngSarPeru/?locale=es_ES",
    keywords: "Acción humanitaria"
  },
  {
    id: 65,
    name_company: "PROMSEX",
    description: "El derecho a decidir y vivir con justicia. Promueven la autonomía en derechos sexuales y reproductivos a través de incidencia política y alianzas estratégicas.",
    email: "elidaguerra@promdsr.org",
    keywords: "Salud sexual"
  },
  {
    id: 66,
    name_company: "JUNTOS CATOLICA ",
    description: "Estudiar no tiene que ser un camino solitario. Acompañan a estudiantes con actividades que potencian su desarrollo académico y social en la universidad.",
    email: "70358355@ucsm.edu.pe                       ",
    phones: ["985556964"],
    networks: "https://www.facebook.com/JuntosCatolica/",
    keywords: "Gremio estudiantil"
  },
  {
    id: 67,
    name_company: "Presente",
    description: "Diversidad en acción. Crean espacios colaborativos y alianzas estratégicas para avanzar los derechos de la comunidad LGBTIQ+.",
    email: "contacto@presente.pe",
    keywords: "LGBTIQ+"
  },
  {
    id: 68,
    name_company: "NUEVA FACE",
    description: "Un grupo estudiantil con grandes propósitos. La UCSM trabaja por la democracia y los derechos humanos en Arequipa.",
    email: "olga.humpire@ucsm.edu.pe",
    networks: "https://www.instagram.com/nueva_face/?hl=es",
    keywords: "Gremio estudiantil"
  },
  {
    id: 69,
    name_company: "Save the Children",
    description: "Salud, educación y protección son derechos, no privilegios. Trabajan por el bienestar de la niñez, especialmente de migrantes y refugiados.",
    email: "William.Campbell@savethechildren.org",
    networks: "https://www.facebook.com/SavetheChildrenPeru/",
    keywords: "Infancias"
  },
  {
    id: 70,
    name_company: "Terre des Hommes Suisse",
    description: "Solidaridad sin fronteras. Actúan en once países defendiendo derechos humanos y construyendo sociedades más justas.",
    email: "oscar.vasquez@tdh.ch",
    networks: "https://www.facebook.com/tdhsperu/",
    keywords: "Infancias"
  },
  {
    id: 71,
    name_company: "Socios en Salud",
    description: "Diseñan e implementan programas basados en evidencia para comunidades vulnerables, replicando modelos efectivos de justicia social.",
    email: "sesperu@pih.org",
    keywords: "Salud"
  },
  {
    id: 72,
    name_company: "Centro de la Mujer Peruana Flora Tristán",
    description: "La igualdad es un compromiso constante. Desde 1979 trabajan por los derechos de las mujeres y la igualdad de género en todas sus dimensiones.",
    email: "postmast@flora.org.pe                                     ",
    phones: ["+5114331457"],
    keywords: "Género"
  },
  {
    id: 74,
    name_company: "Voces Ciudadanas",
    description: "La democracia se fortalece con diálogo. Conectan a la sociedad y el Estado para generar propuestas que impulsen el cambio desde el análisis crítico.",
    email: "edson.aguilar@vocesciudadanas.pe",
    networks: "https://www.facebook.com/VocesCiudadanas",
    keywords: "Democracia"
  },
  {
    id: 75,
    name_company: "Acción por los Niños",
    description: "Trabajan por el desarrollo integral de niñas, niños y adolescentes, protegiéndolos y educándolos para un mejor futuro.",
    email: "lourdes.febres@accionporlosninos.org.pe",
    networks: "https://www.facebook.com/accionxlosninos",
    keywords: "Infancias"
  },
  {
    id: 76,
    name_company: "IPRODES",
    description: "Diversidad que transforma. Promueven derechos humanos, igualdad de género y gobernanza mediante proyectos interculturales.",
    email: "sgarcia@iprodes.org",
    networks: "https://www.facebook.com/Iprodes/",
    keywords: "Derechos humanos"
  },
  {
    id: 77,
    name_company: "Aldeas Infantiles SOS Perú",
    description: "Todo niño merece un hogar. Brindan entornos seguros y familiares a quienes han perdido el cuidado de su familia.",
    email: "rafael.casas@aldeasinfantiles.org.pe",
    networks: "https://www.facebook.com/AldeasInfantilesSOS.Pe",
    keywords: "Infancias"
  },
  {
    id: 78,
    name_company: "International Rescue Committee /Comité Internacional de Rescate (IRC)",
    description: "Protegen y empoderan. Diseñamos programas en salud, protección infantil y apoyo a comunidades vulnerables para crear resiliencia.",
    email: "nicole.kast@rescue.org",
    networks: "https://www.facebook.com/sharer.php?u=https%3A%2F%2Fwww.rescue.org%2Fcountry%2Fperu",
    keywords: "Refugiados y migrantes"
  },
  {
    id: 79,
    name_company: "Venezolanos Organizados (Veo Perú)",
    description: "Un nuevo comienzo. Organizan asistencia y facilitamos la integración de refugiados venezolanos con acceso a servicios esenciales.",
    email: "asocveo2023@gmail.com",
    networks: "https://www.rescue.org/somos-irc",
    keywords: "Refugiados y migrantes"
  },
  {
    id: 80,
    name_company: "VENINTEGRA",
    description: "Migrar no te debe dejar fuera. En Lima, te ayudan a acceder a salud, educación y servicios básicos si más lo necesitas",
    email: "citasenlineaveneintegra@gmail.com",
    phones: ["917622611"],
    keywords: "Refugiados y migrantes"
  },
  {
    id: 81,
    name_company: "Asociacion Qosqo Maki",
    description: "En Cusco, los niños encuentran un hogar. Más de 30 años dando educación y refugio a chicos en situación de calle",
    email: "web.qosqomaki@gmail.com",
    networks: "https://www.facebook.com/asociacionqosqomaki",
    keywords: "Infancias"
  },
  {
    id: 82,
    name_company: "World Vision",
    description: "En Lima, Áncash, La Libertad, Huancavelica, Ayacucho, Cusco, Tacna, Tumbes y Loreto, crean oportunidades para jóvenes y familias para que tengan un futuro justo",
    email: "sandra_contreras@wvi.org ",
    networks: "https://www.facebook.com/WorldVisionPeru/",
    keywords: "Infancias"
  },
  {
    id: 83,
    name_company: "Fútbol Más (El balón no tiene fronteras)",
    description: "El fútbol cambia vidas en Lima, Piura, La Libertad, Lambayeque, Callao, Arequipa, Junín, Cusco e Ica. Llevan deporte y bienestar a escuelas y barrios donde más se necesita",
    email: "ivonne.gonzalez@futbolmas.org",
    networks: "https://www.facebook.com/FutbolMasPE/",
    keywords: "Infancias"
  },
  {
    id: 84,
    name_company: "Movimiento Migrante",
    description: "En Lima Norte y Callao, unimos a migrantes y refugiados para que tengan redes de apoyo y puedan salir adelante juntos",
    email: "a.social@movimientomigrante.org",
    phones: ["925637345"],
    networks: "https://www.facebook.com/movimientomigrante/",
    keywords: "Refugiados y migrantes"
  },
  {
    id: 85,
    name_company: "Warmi Huasi ",
    description: "En Lima, impulsan el liderazgo y la participación de niños, adolescentes y familias en sus barrios",
    email: "warmihuasi@gmail.com",
    networks: "https://www.facebook.com/Warmi-Huasi-266161226767465/",
    keywords: "Infancias"
  },
  {
    id: 86,
    name_company: "Programa Conjunto de las Naciones Unidas sobre el VIH/SIDA (ONUSIDA)",
    description: "En Lima, Amazonas y otras regiones, trabajan para que todos puedan prevenir y tratar el VIH sin barreras ni prejuicios",
    email: "velasquezCl@unaids.org",
    networks: "http://www.facebook.com/UNAIDS",
    keywords: "Salud"
  },
  {
    id: 87,
    name_company: "Programa de Naciones Unidas para el Desarrollo (PNUD)",
    description: "En Arequipa, Piura, Puno, Ica, La Libertad, Lambayeque, Ancash, Cusco, Huánuco, Lima, Ucayali, Loreto, Pasco, San Martín, Madre de Dios, Tacna, Amazonas, Cajamarca, Huancavelica, Junín, Apurímac y Ayacucho, luchan contra la pobreza y apoyamos a comunidades a construir un futuro sostenible",
    email: "Bettina.woll@undp.org",
    networks: "https://www.facebook.com/PNUDPe/",
    keywords: "Desarrollo sostenible"
  },
  {
    id: 88,
    name_company: "Organización de las Naciones Unidas para el Desarrollo Industrial (ONUDI)",
    description: "En Lima, Callao, San Martín, Junín y Loreto, promovemos industrias que cuidan el ambiente y ayudan a reducir la pobreza",
    email: "C.GONZALEZ-MUELLER@unido.org",
    networks: "https://www.facebook.com/UNIDO.HQ",
    keywords: "Desarrollo sostenible"
  },
  {
    id: 89,
    name_company: "Organización Panamericana de la Salud / Organización Mundial de la Salud (OPS/OMS)",
    description: "Buscan que todos tengan acceso a salud de calidad en Amazonas, Cusco, Lima, Ucayali, Piura, Arequipa, San Martín, Ayacucho, La Libertad, Madre de Dios, Loreto y Pasco",
    email: "birminghamm@paho.org",
    networks: "https://www.facebook.com/OPSOMSPeru/",
    keywords: "Salud"
  },
  {
    id: 90,
    name_company: "Organización de Aviación Civil Internacional (OACI)",
    description: "En todo el Perú, hacen que volar sea más seguro y accesible para todos",
    email: "frabbani@icao.int",
    networks: "https://www.facebook.com/ICAOSAM/",
    keywords: "Aviación"
  },
  {
    id: 91,
    name_company: "Organización Internacional para las Migraciones (OIM)",
    description: "En Callao, Lima, Piura, Tacna, Tumbes, Puno, Amazonas, San Martín y Arequipa, apoyan a migrantes y gobiernos para que moverse sea seguro y justo para todos",
    email: "gcrocetti@iom.int",
    networks: "https://www.facebook.com/IOM",
    keywords: "Refugiados y migrantes"
  },
  {
    id: 92,
    name_company: "Organización de las Naciones Unidas para la Educación, la Ciencia y la Cultura (UNESCO)",
    description: "En Amazonas, Cusco, Junín, Ucayali, Loreto, Arequipa, La Libertad y Piura, usan la educación, la ciencia y la cultura para construir paz y combatir la pobreza",
    email: "g.alonso@unesco.org",
    networks: "https://www.facebook.com/UNESCOes/?locale=es_LA",
    keywords: "Arte y cultura"
  },
  {
    id: 93,
    name_company: "Fondo de Población de las Naciones Unidas (UNFPA)",
    description: "Defienden la salud sexual y reproductiva en Piura, Amazonas, Ayacucho, Loreto, Lambayeque y Tumbes para que cada embarazo sea deseado y cada parto seguro",
    email: "gonzalez@unfpa.org",
    networks: "https://www.facebook.com/UNFPAPeru",
    keywords: "Salud sexual"
  },
  {
    id: 94,
    name_company: "Organización Internacional del Trabajo (OIT)",
    description: "Defienden los derechos laborales y humanos en Lima, Piura, Cusco, Loreto, San Martín, Ucayali, Puno y Arequipa para que todos tengan un trabajo justo y digno",
    email: "cardona@ilo.org",
    networks: "https://www.facebook.com/OITAmericas/?brand_redir=488782827814626#",
    keywords: "Trabajo"
  },
  {
    id: 95,
    name_company: "Alto Comisionado de las Naciones Unidas para los Derechos Humanos (ACNUDH)",
    description: "En todo el Perú, apoyan a fortalecer instituciones y proteger los derechos humanos",
    email: "anttila@un.org",
    networks: "https://www.facebook.com/onudh/",
    keywords: "Derechos humanos"
  },
  {
    id: 96,
    name_company: "Fondo de las Naciones Unidas para la Infancia (UNICEF)",
    description: "Trabajan por el bienestar y los derechos de niñas, niños y adolescentes en Lima, Loreto, Ucayali, Tumbes y Huancavelica",
    email: "jalvarez@unicef.org",
    networks: "https://www.facebook.com/unicefperu",
    keywords: "Infancias"
  },
  {
    id: 97,
    name_company: "Oficina de las Naciones Unidas contra la Droga y el Delito (UNODC)",
    description: "Luchan contra el crimen y las drogas en Loreto, Madre de Dios, Ucayali, San Martín y Lima para que vivas en un país más seguro y justo",
    email: "javier.montano@un.org",
    keywords: "Seguridad"
  },
  {
    id: 98,
    name_company: "Fondo Internacional de Desarrollo Agrícola (FIDA)",
    description: "En Apurímac, Ayacucho, Cusco, Huancavelica, Junín, Amazonas, Ancash, Cajamarca, Lima y San Martín, apoyan a comunidades rurales para que salgan de la pobreza y mejoren su vida diaria",
    email: "j.ruizcumplido@ifad.org",
    networks: "https://www.facebook.com/IFAD/",
    keywords: "Desarrollo sostenible"
  },
  {
    id: 99,
    name_company: "Alto Comisionado de las Naciones Unidas para los Refugiados (ACNUR)",
    description: "Protegen a refugiados y desplazados en Tumbes, La Libertad, Lima, Arequipa, Tacna, Puno y Madre de Dios para que puedan empezar de nuevo con dignidad",
    email: "almirall@unhcr.org",
    networks: "https://www.facebook.com/ACNUR",
    keywords: "Refugiados y migrantes"
  },
  {
    id: 100,
    name_company: "Organización de las Naciones Unidas para la Alimentación y la Agricultura (FAO)",
    description: "Trabajan para que nadie pase hambre y todos tengan acceso a comida sana en Tumbes, Piura, Lambayeque, La Libertad, Ancash, Lima, Arequipa, Moquegua, Tacna, Cajamarca, Huánuco, Pasco, Junín, Huancavelica, Ayacucho, Apurímac, Cusco, Puno, Loreto, Ucayali, San Martín, Madre de Dios y Amazonas",
    email: "Mariana.EscobarArango@fao.org",
    networks: "https://www.facebook.com/ICAOSAM/",
    keywords: "Acción humanitaria"
  },
  {
    id: 101,
    name_company: "Oficina de las Naciones Unidas de Servicios para Proyectos (UNOPS)",
    description: "Gestionan proyectos que mejoran la salud, educación y el ambiente en Amazonas, Lambayeque, Puno y Lima",
    email: "monicasi@unops.org",
    networks: "https://www.facebook.com/unops.org",
    keywords: "Desarrollo sostenible"
  },
  {
    id: 102,
    name_company: "Programa de las Naciones Unidas para los Asentamientos Humanos (ONU-HABITAT)",
    description: "En Lima, promueven ciudades más sostenibles y viviendas dignas para todos",
    email: "roi.chiti@un.org",
    networks: "https://www.facebook.com/ONUHabitat.es/",
    keywords: "Vivienda"
  },
  {
    id: 103,
    name_company: "Programa Mundial de Alimentos (WFP)",
    description: "Llevan alimentos a quienes lo necesitan y ayudan a comunidades a ser más fuertes frente a emergencias en Lima, Callao, Cusco, Arequipa, Puno, Tumbes, Lambayeque, San Martín, Ayacucho, Amazonas, Ancash, Apurímac, Cajamarca, Huancavelica, Huánuco, Junín, La Libertad, Loreto, Piura y Tacna",
    email: "sarah.laughton@wfp.org",
    networks: "https://www.facebook.com/ProgramaMundialdeAlimentos/",
    keywords: "Acción humanitaria"
  },
  {
    id: 104,
    name_company: "Oficina de Coordinación de Asuntos Humanitarios (OCHA)",
    description: "Coordinan la ayuda humanitaria desde Lima para responder rápido y bien ante emergencias en Perú",
    email: "cheatham@un.org",
    networks: "https://www.facebook.com/UNOCHAAmericas/",
    keywords: "Acción humanitaria"
  },
  {
    id: 105,
    name_company: "Centro Regional de las Naciones Unidas para la Paz, el Desarme y el Desarrollo en América Latina y el Caribe (UNLIREC)",
    description: "En todo el Perú, promuevan la paz y el desarme para que vivas en una sociedad más segura",
    email: "maria.urruelaarenales@un.org",
    networks: "https://www.facebook.com/UNLIREC",
    keywords: "Paz"
  },
  {
    id: 106,
    name_company: "ONU Mujeres",
    description: "En Lima, defienden los derechos de mujeres y niñas para que tengan las mismas oportunidades que todos",
    email: "mariapia.molero@unwomen.org",
    networks: "https://www.facebook.com/unwomen",
    keywords: "Género"
  },
  {
    id: 107,
    name_company: "Peace and Hope International (Paz y Esperanza)",
    description: "En Lima, Huánuco, San Martín, Ayacucho y Apurímac, enfrentan la violencia con programas de justicia y apoyo",
    email: "jarcobocco@pazyesperanza.org ",
    networks: "https://web.facebook.com/pazyesperanzaperu/",
    keywords: "Salud sexual"
  },
  {
    id: 108,
    name_company: "Welthungerhilfe",
    description: "En todo el Perú, impulsan proyectos rurales y acceso a agua potable para que más peruanos vivan mejor",
    email: "Susanna.Daag@welthungerhilfe.de",
    networks: "https://www.facebook.com/welthungerhilfesouthamerica/",
    keywords: "Alimentación"
  },
  {
    id: 109,
    name_company: "Asociación Solidaridad Países Emergentes",
    description: "En Lima, promueven inclusión y desarrollo para quienes más lo necesitan",
    email: "mzevallos@aspem.org.pe",
    networks: "https://www.facebook.com/ASPEm.PERU/",
    keywords: "Desarrollo sostenible"
  },
  {
    id: 110,
    name_company: "Humanity & Inclusion",
    description: "Dan asistencia técnica y defendemos los derechos de migrantes y refugiados vulnerables en Perú",
    email: "m.berche@hi.org",
    networks: "https://www.facebook.com/HumanityAndInclusionLAC",
    keywords: "Refugiados y migrantes"
  },
  {
    id: 111,
    name_company: "Médicos del Mundo",
    description: "En todo el Perú, llevan salud a donde más se necesita, respondiendo a emergencias",
    email: "presidencia@mdm.org.ar",
    networks: "https://www.medicosdelmundo.org/",
    keywords: "Salud"
  },
  {
    id: 112,
    name_company: "RICH (Red Internacional de Cooperación Humanitaria)",
    description: "En La Libertad, unen ONG para apoyar a refugiados y comunidades vulnerables",
    email: "red.coop.hm@gmail.com",
    networks: "https://www.facebook.com/profile.php?id=61560186960160",
    keywords: "Refugiados y migrantes"
  },
  {
    id: 113,
    name_company: "Asociación Misioneros De San Carlos Scalabrinianos",
    description: "En Lima, Tumbes y Tacna, apoyamos a migrantes y refugiados con ayuda integral desde nuestra misión religiosa",
    email: "luiz.doarte@simn-global.or",
    networks: "https://www.facebook.com/Scalabrinianos/?locale=es_LA",
    keywords: "Refugiados y migrantes"
  },
  {
    id: 114,
    name_company: "Idea Internacional",
    description: "En todo el Perú, trabajamos por una democracia sostenible.",
    phones: ["999850097"],
    networks: "www.idea.int",
    keywords: "Democracia"
  },
  {
    id: 115,
    name_company: "Asociación Civil Transparencia",
    description: "En todo el país, impulsan la transparencia y la participación ciudadana para construir un Perú más justo.",
    phones: ["970935400"],
    networks: "https://www.facebook.com/transparenciaperu?_rdc=1&_rdr",
    keywords: "Democracia"
  },
  {
    id: 116,
    name_company: "Pro-Dialogo",
    description: "En Lima, ayudan a resolver conflictos y fortalecer la cohesión política a través del diálogo.",
    phones: ["987555695"],
    networks: "https://www.facebook.com/prodialogoperu/?locale=es_LA",
    keywords: "Democracia"
  },
  {
    id: 117,
    name_company: "Coalición Ciudadana",
    description: "En todo el Perú, defienden los derechos de la gente promoviendo la participación activa de la ciudadanía.",
    phones: ["987555695"],
    networks: "https://www.facebook.com/coalicion.pe/",
    keywords: "Democracia"
  },
  {
    id: 118,
    name_company: "Ashanti Peru",
    description: "En Lima, apoyan y empoderan a la juventud afroperuana para que defienda sus derechos y participe en la vida política.",
    email: "ashantiperu@ashantiperu.org",
    networks: "https://www.facebook.com/ashantiperu",
    keywords: "Afroperuanos"
  },
  {
    id: 119,
    name_company: "Articulación de Lesbianas Feministas de Lima",
    description: "En Lima, mujeres lesbianas luchan juntas para lograr igualdad y justicia de género.",
    email: "articulacionlesbianaslima2012@gmail.com",
    networks: "https://www.facebook.com/p/Articulaci%C3%B3n-de-Lesbianas-Feministas-de-Lima-100064601953339/",
    keywords: "LGTBIQ+"
  },
  {
    id: 120,
    name_company: "Lesbianas Independientes Feministas Socialistas",
    description: "En Lima, defienden los derechos de mujeres lesbianas desde el feminismo socialista.",
    email: "lifperu@gmail.com",
    networks: "https://www.facebook.com/lifsperu",
    keywords: "LGTBIQ+"
  },
  {
    id: 121,
    name_company: "Católicas por el Derecho a Decidir - Perú",
    description: "En Lima, trabajan por la justicia social y los derechos sexuales de las mujeres desde la fe.",
    email: "cddperu@cddperu.org",
    networks: "https://www.facebook.com/catolicasperu/?locale=es_LA",
    keywords: "Salud sexual"
  },
  {
    id: 122,
    name_company: "Movimiento Manuela Ramos",
    description: "Desde Lima, construyen igualdad y empoderamiento femenino en Perú desde 1978.",
    email: "postmast@manuela.org.pe",
    networks: "https://web.facebook.com/manuela.peru/",
    keywords: "Género"
  },
  {
    id: 123,
    name_company: "CLADEM Perú",
    description: "En Lima, unen fuerzas para proteger los derechos de las mujeres y luchar contra la violencia.",
    email: "cladem.peru@gmail.com",
    networks: "https://www.facebook.com/REDCLADEM",
    keywords: "Género"
  },
  {
    id: 124,
    name_company: "Colectivo Sonqo Warmi Cusco",
    description: "En Cusco, mujeres unidas impulsan igualdad y justicia para fortalecer sus comunidades.",
    email: "sonqowarmicusco@gmail.com",
    networks: "https://www.facebook.com/p/Colectivo-Sonqo-Warmi-Cusco-100066895913167/",
    keywords: "Género"
  },
  {
    id: 125,
    name_company: "Asociación Nacional de Centros (ANC)",
    description: "En todo el Perú, apoyan a organizaciones para que promuevan el desarrollo sostenible.",
    email: "anc@anc.org.pe",
    networks: "https://www.facebook.com/ANCPERU/?locale=es_LA",
    keywords: "Democracia"
  },
  {
    id: 126,
    name_company: "ALTERNATIVA Centro de Investigación Social y Educación Popular",
    description: "En Lima, promueven la educación y el conocimiento para transformar realidades y construir desarrollo.",
    email: "rodolfoalva@alter.org.pe",
    networks: "https://www.facebook.com/centroalternativa",
    keywords: "Desarrollo sostenible"
  },
  {
    id: 127,
    name_company: "Forum Solidaridad Perú",
    description: "Defienden los derechos de comunidades indígenas en la Amazonía peruana a través de alianzas estratégicas.",
    email: "alonsogondel@gmail.com",
    networks: "https://www.facebook.com/people/Forum-Solidaridad-Per%C3%BA/100063709982424/",
    keywords: "Pueblos indígenas"
  },
  {
    id: 128,
    name_company: "Grupo de Trabajo sobre Pueblos Indígenas de la Coordinadora Nacional de Derechos Humanos",
    description: "Apoyan a organizaciones indígenas en sus procesos sociales y técnicos para fortalecer su autonomía.",
    email: "balbuena.pj@pucp.pe",
    networks: "https://www.instagram.com/cnddhhperu/?hl=en",
    keywords: "Pueblos indígenas"
  },
  {
    id: 129,
    name_company: "Resucita Perú Ahora ",
    description: "Construyen redes de solidaridad entre la Iglesia y la sociedad civil para el bien común en Perú.",
    email: "resucitaperuahora@gmail.com",
    networks: "https://www.facebook.com/resucitaperuahora",
    keywords: "Acción humanitaria"
  },
  {
    id: 130,
    name_company: "Asociación Servicios Educativos Rurales (SER)",
    description: "En Lima, Cajamarca, Ayacucho y Puno, mejoran la calidad de vida en los Andes y la Amazonía con educación y acceso a agua potable.",
    email: "ser@ser.org.pe",
    networks: "https://www.facebook.com/1980Asociacion.SER/",
    keywords: "Desarrollo sostenible"
  },
  {
    id: 131,
    name_company: "Movimiento Ciudadano frente al Cambio Climático (MOCICC)",
    description: "Promueven una ciudadanía comprometida con la sostenibilidad ambiental en todo el Perú.",
    email: "info@mocicc.org",
    networks: "https://www.facebook.com/MOCICCPeru",
    keywords: "Medio ambiente"
  },
  {
    id: 132,
    name_company: "Centro de Estudios y Prevención de Desastres – PREDES",
    description: "En Lima, Cusco, Arequipa y Moquegua, ayudan a las comunidades a estar preparadas ante desastres.",
    email: "postmast@predes.org.pe",
    networks: "http://www.facebook.com/sharer/sharer.php?u=https://predes.org.pe/institucional/",
    keywords: "Medio ambiente"
  },
  {
    id: 133,
    name_company: "Fomento de la Vida (FOVIDA)",
    description: "En Lima, Junín y Huancavelica, trabajamos por territorios sostenibles y comunidades más fuertes.",
    email: "mcuentas@fovida.org.pe",
    networks: "https://www.facebook.com/fomentodelavida",
    keywords: "Desarrollo sostenible"
  },
  {
    id: 134,
    name_company: "Centro de Investigación, Documentación y Asesoría Poblacional (Cidap) ",
    description: "En Lima, luchan contra la pobreza urbana y facilitan el acceso igualitario a los servicios.",
    email: "consulta@cidap.org.pe",
    networks: "https://www.facebook.com/cidap/?locale=es_LA",
    keywords: "Vivienda"
  },
  {
    id: 135,
    name_company: "Centro de Estudios Sociales y Publicaciones (CESIP)",
    description: "En todo el Perú, defienden los derechos de la infancia y adolescencia desde 1976.",
    email: "postmast@cesip.org.pe",
    networks: "https://www.facebook.com/Cesip.org",
    keywords: "Infancias"
  },
  {
    id: 136,
    name_company: "El Movimiento Homosexual de Lima (MHOL)",
    description: "En Lima, Ayacucho y Lambayeque, luchan por los derechos LGTB con compromiso y valentía.",
    email: "mholperu@mhol.pe",
    networks: "https://www.facebook.com/mholperu/?locale=es_LA",
    keywords: "LGTBIQ+"
  },
  {
    id: 137,
    name_company: "Instituto Bartolomé de Las Casas",
    description: "En Lima, Ayacucho y Lambayeque, impulsan el cambio hacia la justicia social y el desarrollo sostenible desde la fe.",
    email: "comunicacion@bcasas.org.pe",
    networks: "https://www.facebook.com/Institutobartolomedelascasas/",
    keywords: "Desarrollo sostenible"
  },
  {
    id: 138,
    name_company: "Centro de Culturas Indígenas del Perú (CHIRAPAQ)",
    description: "Fortalecen la identidad indígena con proyectos educativos y culturales en todo el Perú.",
    email: "ayllu@chirapaq.org.pe",
    networks: "https://www.facebook.com/chirapaqoficial/",
    keywords: "Pueblos indígenas"
  },
  {
    id: 139,
    name_company: "IDMA",
    description: "En Lima, Huánuco y Apurímac, promueven desarrollo sostenible con inclusión social y conciencia ambiental.",
    email: "directorejecutivo@idmaperu.org",
    networks: "https://www.facebook.com/IdmaInstitutoDeDesarrolloYMedioAmbiente",
    keywords: "Desarrollo sostenible"
  },
  {
    id: 140,
    name_company: "Proetica",
    description: "En todo el Perú, combaten la corrupción con transparencia y participación ciudadana.",
    email: "csanchez@proetica.org.pe",
    networks: "https://www.facebook.com/ProeticaPeru/",
    keywords: "Democracia"
  },
  {
    id: 141,
    name_company: "Instituto Prensa y Sociedad (IPYS)",
    description: "En Lima, promueven el periodismo de investigación y el acceso libre a la información.",
    email: "contacto@ipys.org",
    networks: "https://www.facebook.com/ipys.org/",
    keywords: "Periodismo"
  },
  {
    id: 142,
    name_company: "Observatorio de los Derechos Sexuales y Reproductivos de las Personas con Discapacidad – ODISEX PERÚ",
    description: "En Lima, apoyan la inclusión de personas con discapacidad en sus derechos sexuales.",
    email: "mmogollonch@gmail.com",
    networks: "https://www.facebook.com/Odisex-Per%C3%BA-489540701477323",
    keywords: "Salud sexual"
  },
  {
    id: 143,
    name_company: "Veneactiva",
    description: "En Lima, Tumbes, Trujillo y Piura, protegen y promueven la integración de migrantes que buscan nuevas oportunidades.",
    email: "info@veneactiva.org",
    networks: "https://www.facebook.com/Veneactivaorg",
    keywords: "Refugiados y migrantes"
  },
  {
    id: 144,
    name_company: "VeneIca",
    description: "En Ica, trabajan por una migración inclusiva y alianzas que garanticen derechos para todos.",
    email: "andy@veneica.org",
    networks: "https://www.facebook.com/VeneIcaOficial/",
    keywords: "Refugiados y migrantes"
  },
  {
    id: 145,
    name_company: "WWF Perú",
    description: "En todo el país, conservan la naturaleza y luchamos contra el cambio climático para un futuro mejor.",
    email: "comunicaciones@wwfperu.org",
    networks: "https://www.facebook.com/OficialWWFPeru/",
    keywords: "Medio ambiente"
  },
  {
    id: 146,
    name_company: "AIDESEP",
    description: "En todo el Perú, apoyan a comunidades indígenas amazónicas para proteger sus derechos y territorios.",
    networks: "https://aidesep.org.pe/",
    keywords: "Pueblos Indígenas"
  },
  {
    id: 147,
    name_company: "Asociación Regional de Pueblos Indígenas de la Selva Central (ARPI SC)",
    description: "En Junín, Pasco, Huánuco y Ucayali, promueven el desarrollo sostenible y la gestión territorial en comunidades locales",
    email: "arpiselvacentral@yahoo.es",
    networks: "https://www.facebook.com/arpiselvacentral/",
    keywords: "Pueblos Indígenas"
  },
  {
    id: 148,
    name_company: "Coordinadora de Desarrollo y Defensa de los Pueblos Indígenas de la región San Martín (CODEPISAM)",
    description: "En San Martín, fortalecen la autonomía y capacidades de las comunidades amazónicas.",
    email: "codepisamcomu@gmail.com",
    networks: "https://www.facebook.com/people/Codepisam/61559059515573/?_rdr",
    keywords: "Pueblos Indígenas"
  },
  {
    id: 149,
    name_company: "Consejo Machiguenga del Río Urubamba (COMARU)",
    description: "En Cusco, defienden los derechos y territorios de las comunidades urubambinas.",
    email: "comaruc@gmail.com",
    networks: "https://www.facebook.com/people/Consejo-Machiguenga-del-Rio-Urubamba/100064403031266/?_rdr",
    keywords: "Pueblos Indígenas"
  },
  {
    id: 150,
    name_company: "Coordinadora Regional de los Pueblos Indígenas de San Lorenzo (CORPI-SL)",
    description: "En Loreto, coordinan la defensa de recursos y derechos indígenas.",
    email: "corpi.sl@gmail.com",
    networks: "https://www.facebook.com/corpisl.cosmovisionindigena.7",
    keywords: "Pueblos Indígenas"
  },
  {
    id: 151,
    name_company: "Coordinadora Regional de los Pueblos Indígenas de AIDESEP Atalaya (CORPIAA)",
    description: "En Ucayali, unen comunidades nativas para gestionar su territorio de forma sostenible.",
    email: "corpiaa2018@gmail.com",
    networks: "https://www.facebook.com/corpiaa",
    keywords: "Pueblos Indígenas"
  },
  {
    id: 152,
    name_company: "Federación Nativa del Río Madre de Dios y Afluentes (FENAMAD)",
    description: "En Madre de Dios, representan a comunidades indígenas en la defensa de su cultura y tierras.",
    email: "fenamad@fenamad.com.pe",
    networks: "https://www.facebook.com/FENAMAD",
    keywords: "Pueblos Indígenas"
  },
  {
    id: 153,
    name_company: "Organización Regional Aidesep Ucayali (ORAU)",
    description: "En Huánuco, Ucayali y Loreto, trabajan por el desarrollo integral y la identidad de los pueblos indígenas.",
    email: "orauo347@gmail.com",
    networks: "https://www.facebook.com/OrauOficial",
    keywords: "Pueblos Indígenas"
  },
  {
    id: 154,
    name_company: "Organización Regional de Pueblos Indígenas de la Amazonía Norte del Perú (ORPIAN–P)",
    description: "En Cajamarca y Amazonas, los pueblos Wampis y Awajun defienden sus territorios y derechos.",
    email: "awasa1@hotmail.com",
    networks: "https://www.facebook.com/profile.php?id=100020423652582",
    keywords: "Pueblos Indígenas"
  },
  {
    id: 155,
    name_company: "Organización Regional de Pueblos Indígenas del Oriente (ORPIO)",
    description: "En Loreto, quince cuencas indígenas se unen para proteger su herencia territorial.",
    email: "orpio-baseregional_aidesep@hotmail.com",
    networks: "https://www.facebook.com/orpioloreto",
    keywords: "Pueblos Indígenas"
  },
  {
    id: 156,
    name_company: "Red inclusiva de gestión de riesgos desastres y discapacidad de América Latina y el Caribe (RED GIRDD-LAC)",
    description: "Promueven la inclusión de personas con discapacidad en la gestión de riesgos en América Latina y el Caribe.",
    email: "orauramari@gmail.com",
    networks: "https://www.facebook.com/RedGIRDD/",
    keywords: "Inclusión y discapacidad"
  },
  {
    id: 157,
    name_company: "INPPARES",
    description: "En Lima, Arequipa, Ancash y Lambayeque, brindan servicios de salud sexual y reproductiva sin barreras.",
    email: "informes@inppares.org",
    networks: "https://www.facebook.com/INPPARES",
    keywords: "Salud sexual"
  },
  {
    id: 158,
    name_company: "Cooperazione Internazionale (COOPI)",
    description: "En Lima, Piura, Tumbes, Loreto y Ucayali, llevan agua, protección y acción comunitaria a quienes enfrentan desafíos.",
    email: "coord.peru@coopi.org",
    networks: "https://www.facebook.com/Coipe",
    keywords: "Refugiados y migrantes"
  },
  {
    id: 159,
    name_company: "Valientes en Acción",
    description: "En Lima, brindan asistencia social y cultural para el bienestar de migrantes y la cohesión comunitaria.",
    email: "ValientesEnAccionVen@gmail.com",
    phones: ["9455604881"],
    networks: "https://www.facebook.com/p/Valientes-En-Acci%C3%B3n-100076528400492/?_rdr",
    keywords: "Refugiados y migrantes"
  },
  {
    id: 160,
    name_company: "We World - GVC",
    description: "En Apurímac, Piura, Lambayeque y La Libertad, promueven agricultura sostenible y derechos humanos en los Andes.",
    email: "info@weworld.it",
    networks: "https://www.facebook.com/WeWorldGlobal",
    keywords: "Acción humanitaria"
  },
  {
    id: 161,
    name_company: "ENGADI",
    description: "En Lima, ofrecen programas contra el analfabetismo que fortalecen las habilidades y oportunidades de los niños.",
    email: "maikolchirino@gmail.com ",
    phones: ["977454743"],
    networks: "https://www.facebook.com/profile.php?id=100084384435002",
    keywords: "Refugiados y migrantes"
  },
  {
    id: 162,
    name_company: "Sembrando Esperanzas MV",
    description: "Mujeres venezolanas en [región] ofrecen apoyo emocional a quienes buscan un nuevo comienzo.",
    phones: ["918521895"],
    networks: "https://www.facebook.com/sembrandoesperanzamv/",
    keywords: "Refugiados y migrantes"
  },
  {
    id: 163,
    name_company: "Swisscontact",
    description: "En Lima, Piura, Cusco, Arequipa, Junín, La Libertad, Lambayeque e Ica, impulsan vivienda, educación y emprendimiento sostenible para transformar vidas y economías",
    email: "pe.info@swisscontact.org",
    networks: "https://www.facebook.com/swisscontactlatam/",
    keywords: "Refugiados y migrantes"
  },
  {
    id: 164,
    name_company: "OCASIVEN",
    description: "En Lima, ofrecen apoyo integral y servicios para que migrantes venezolanos tengan más oportunidades y puedan salir adelante.",
    email: "migrantesvulnerables@ocasiven.org",
    networks: "https://www.facebook.com/ocasiven?mibextid=LQQJ4d",
    keywords: "Refugiados y migrantes"
  },
  {
    id: 165,
    name_company: "OEI Perú",
    description: "Acerca la tecnología a la educación desde la infancia. Usa la innovación para abrir más oportunidades desde los primeros años",
    email: "oei.per@oei.int",
    networks: "https://www.facebook.com/OEIPERU.ORG",
    keywords: "Desarrollo sostenible"
  },
  {
    id: 166,
    name_company: "Fundación Panamericana para el Desarrollo (PADF) ",
    description: "Construye ciudades del futuro en Lima. Usa STEM, democracia y derechos humanos para integrar a migrantes y refugiados y fortalecer comunidades resilientes",
    email: "connect@padf.org",
    networks: "https://facebook.com/padf.org",
    keywords: "Desarrollo sostenible"
  },
  {
    id: 167,
    name_company: "Unión Internacional para la Conservación de la Naturaleza (UICN)",
    description: "Protege la biodiversidad en todo el país. Aplica conservación y sostenibilidad para cuidar lo que la naturaleza nos da.",
    email: "samerica@iucn.org",
    networks: "https://iucn.org/es",
    keywords: "Medio ambiente"
  },
  {
    id: 168,
    name_company: "Instituto Internacional de Derecho y Sociedad (IIDS)",
    description: "Fortalece comunidades indígenas en todo el país. Impulsa políticas inclusivas desde su identidad, autonomía y fuerza colectiva.",
    email: "iids@derechoysociedad.org",
    networks: "https://www.facebook.com/InstitutoInternacionalDeDerechoYSociedad/",
    keywords: "Pueblos indígenas"
  },
  {
    id: 169,
    name_company: "Sociedad Peruana de Derecho Ambiental ",
    description: "Mediante el derecho, resguardan la naturaleza, así como a las personas que la protegen y dependen de ella.",
    email: "icalle@spda.org.pe",
    networks: "https://www.facebook.com/spdaorg/?locale=es_LA",
    keywords: "Medio ambiente"
  },
  {
    id: 170,
    name_company: "Caminando Juntos",
    description: "Mejoran la vida de personas en vulnerabilidad entregando calzado en buen estado a niñas, niños y adolescentes del Perú.",
    phones: ["012713323"],
    networks: "https://www.facebook.com/caminandojuntos.pe",
    keywords: "Infancias"
  },
  {
    id: 171,
    name_company: "Enseña Perú",
    description: "Contribuyen a transformar la educación en Perú, formando una red de agentes de cambio que impulsen el desarrollo de cada estudiante.",
    email: "angela.bravo@ensenaperu.org",
    networks: "https://www.facebook.com/EnsenaPeru/",
    keywords: "Educación"
  },
  {
    id: 172,
    name_company: "Es hoy",
    description: "Movimiento de líderes empresariales que trabaja en los grandes desafíos del Perú. Moviliza recursos y capacidades del sector privado para impulsar iniciativas en educación, mypes, empleo, entre otros.",
    email: "vsifuentes@eshoy.pe",
    networks: "http://www.facebook.com/eshoyperu/",
    keywords: "Educación"
  },
  {
    id: 173,
    name_company: "EPA",
    description: "Trabaja para que más jóvenes y adultos terminen la educación básica, articulando con el Estado, empresas y sociedad civil para mejorar el acceso y la calidad educativa.",
    email: "programaeba@eshoy.pe",
    networks: "http://www.facebook.com/eshoyperu/",
    keywords: "Educación"
  },
  {
    id: 174,
    name_company: "DVV",
    description: "Promueve la educación de personas jóvenes y adultas",
    email: "xvelasquez@dvv-international.edu.pe",
    networks: "https://www.facebook.com/@DVV.International.pe/?locale=es_LA",
    keywords: "Educación"
  },
  {
    id: 175,
    name_company: "Dispurse ",
    description: "Impulsa la alfabetización digital y educativa de mujeres que no pudieron ir a la escuela, para su aprendizaje y empoderamiento.",
    email: "contacto@dispurse.org",
    networks: "https://www.facebook.com/Dispurse",
    keywords: "Educación"
  },
  {
    id: 176,
    name_company: "Nunca es tarde para aprender",
    description: "Servicio educativo para personas mayores de 14 años con primaria o secundaria incompleta en Cusco.",
    email: "contacto@dispurse.org",
    networks: "https://www.facebook.com/p/EBA-Nunca-es-tarde-para-aprender-100063578172013/?locale=es_LA",
    keywords: "Educación"
  },
  {
    id: 177,
    name_company: "Grandes",
    description: "Brinda la oportunidad a jóvenes y adultos de Amazonas de acceder y culminar su educación básica.",
    email: "lucyvallejosbenites@gmail.com",
    networks: "https://www.facebook.com/GrandesPeru/?locale=es_LA",
    keywords: "Educación"
  },
  {
    id: 178,
    name_company: "Derecho, Ambiente y Recursos Naturales (DAR)",
    description: "Trabaja por los derechos de los pueblos indígenas y el respeto de los derechos humanos y colectivos de los pueblos indígenas, promoviendo la equidad, la justicia y la diversidad cultural desde el Estado y las propias organizaciones indígenas.",
    email: "hchepiu@dar.org.pe",
    networks: "https://dar.org.pe/amazonia/#",
    keywords: "Refugiados y migrantes"
  },
  {
    id: 179,
    name_company: "Mongabay ",
    description: "Organización periodística que informa sobre la naturaleza y los desafíos planetarios con una red global de periodistas locales. ",
    networks: "https://www.facebook.com/mongabay",
    keywords: "Periodismo"
  },
  {
    id: 180,
    name_company: "Conservamos por Naturaleza",
    description: "Brinda apoyo a iniciativas de conservación voluntaria e involucra a más personas en acciones estratégicas para contribuir al cuidado de la naturaleza.",
    email: "conservamos@spda.org.pe",
    networks: "https://www.facebook.com/conservamospornaturaleza",
    keywords: "Medio Ambiente"
  },
  {
    id: 181,
    name_company: "Centro Amazónico de Antropología y Aplicación Práctica (CAAP)",
    description: "Promueve la equidad, la interculturalidad y la defensa de los derechos humanos y ambientales, trabajando con organizaciones indígenas y el Estado para construir una democracia intercultural y justa.",
    email: "caaaperu@caaap.org.pe",
    networks: "https://www.facebook.com/centro.amazonico/",
    keywords: "Pueblos Indígenas"
  },
  {
    id: 182,
    name_company: "OCEANA",
    description: "Oceana pretende lograr cambios políticos para aumentar la biodiversidad y la abundancia de la vida marina.",
    networks: "https://www.facebook.com/oceanaperu",
    keywords: "Medio Ambiente"
  },
  {
    id: 184,
    name_company: "Helvetas",
    description: "Implementa proyectos de desarrollo en agua, agricultura, educación, economía, medio ambiente y más, y también brinda ayuda humanitaria en situaciones de emergencia.",
    email: "Kaspar.Schmidt@helvetas.org",
    networks: "https://www.facebook.com/HelvetasPeru",
    keywords: "Acción humanitaria"
  },
  {
    id: 185,
    name_company: "Amautas Mineros",
    description: "Llevan las buenas prácticas de la minería moderna a estudiantes y comunidades. ¡Por una minería responsable y consciente!",
    email: "amautasmineros@gmail.com",
    networks: "https://www.facebook.com/AmautasMinerosPeru/?locale=es_LA",
    keywords: "Desarrollo sostenible"
  },
  {
    id: 186,
    name_company: "Patria C",
    description: "Pone en manos de los jóvenes las claves para comprender, construir y fortalecer una democracia inclusiva y participativa.",
    email: "patriacperu@gmail.com",
    networks: "https://web.facebook.com/PatriaCPeru/?_rdc=1&_rdr",
    keywords: "Democracia"
  },
  {
    id: 187,
    name_company: "Red de Integridad Cajamarca",
    description: "Vigilan la transparencia en las obras públicas de Cajamarca, promoviendo veedurías colaborativas para asegurar una gestión más justa.",
    keywords: "Gestión pública"
  },
  {
    id: 188,
    name_company: "Ruralia",
    description: "Impulsa la educación rural en Perú, acelerando intervenciones de organizaciones y reconociendo a empresas que apuestan por este reto con impacto y compromiso.",
    email: "ruralia@eshoy.pe",
    networks: "https://www.facebook.com/RuraliaPeru/",
    keywords: "Educación"
  },
  {
    id: 189,
    name_company: "GRADE",
    description: "Es un centro de investigación de temas clave como educación, desarrollo rural y medio ambiente en todo el país para aportar a políticas públicas que mejoren la vida de las personas.",
    email: "proyectos@grade.org.pe",
    networks: "https://www.facebook.com/grupodeanalisisparaeldesarrollo",
    keywords: "Investigación"
  },
  {
    id: 190,
    name_company: "Minkando ",
    description: "Comunidad de jóvenes voluntarios que lleva educación divertida a niñas y niños en Lima, Arequipa, Ayacucho e Ica.",
    networks: "https://www.facebook.com/ONG.MINKANDO/?locale=es_LA",
    keywords: "Educación"
  },
  {
    id: 191,
    name_company: "ACCIONA ORG PERU ",
    description: "Mejora el acceso al agua segura en Cajamarca, Loreto, Cusco e Ica, impulsando soluciones sostenibles en comunidades vulnerables.",
    networks: "https://www.facebook.com/Accionaorg-The-Energy-Water-Foundation-156386327712435/",
    keywords: "Agua y Saneamiento"
  },
  {
    id: 192,
    name_company: "ADDMEWORK",
    description: "Conecta a personas con discapacidad con empresas que puedan emplearlos en Lima.",
    email: "hola@addmework.com",
    networks: "https://web.facebook.com/AddmeWork/?locale=es_LA&_rdc=1&_rdr",
    keywords: "Inclusión y discapacidad"
  },
  {
    id: 193,
    name_company: "AGENTE CASH",
    description: "Ofrece servicios financieros en Cajamarca para que más personas accedan al ahorro, pagos y cobros de forma segura.",
    email: "red.comercial@agentecash.net",
    networks: "https://www.facebook.com/agentecash/",
    keywords: "Desarrollo Económico"
  },
  {
    id: 194,
    name_company: "AMA SACRED VALLEY ",
    description: "Desde el turimo en el Valle Sagrado de Cusco, impulsa iniciativas que buscan fortalecer a mujeres y actores locales, mejorando sus vidas. ",
    email: "amavallesagrado@gmail.com",
    networks: "https://www.facebook.com/AmaSacredValley",
    keywords: "Desarrollo Económico"
  },
  {
    id: 195,
    name_company: "AMAZONIA SIN FRONTERAS",
    description: "Desde Loreto, trabaja en conjunto con comunidades nativas, organizaciones sin fines de lucro, empresas, universidades, y otros actores para proteger la Amazonía, promoviendo la sostenibilidad, la educación y la protección de los derechos humanos de las comunidades en la región. ",
    email: "info@amazoniasinfronteras.org",
    networks: "https://m.facebook.com/amazoniasinfronteras",
    keywords: "Pueblos Indígenas"
  },
  {
    id: 196,
    name_company: "ALLIN KAWSAY ",
    description: "Impulsa la educación en Puno, Cusco, Iquitos, con proyectos que buscan cerrar brechas y mejorar oportunidades para jóvenes y comunidades.",
    email: "informes@allinkawsay.org.pe",
    networks: "https://www.facebook.com/a.allinkawsay/?locale=es_LA",
    keywords: "Educación"
  },
  {
    id: 197,
    name_company: "ASOCIACIÓN ARARIWA",
    description: "Trabaja en Cusco fortaleciendo capacidades, derechos e identidad cultural de las personas, impulsando la democracia, la participación ciudadana y un crecimiento económico justo para lograr una vida digna y sostenible.",
    email: "arariwa.cusco@gmail.com",
    networks: "https://www.facebook.com/Arariwa/?locale=es_LA",
    keywords: "Desarrollo sostenible"
  },
  {
    id: 198,
    name_company: "Asociación Bioselva Perú",
    description: "Produce productos de alta calidad, pensando en el medio ambiente y la sostenibilidad, involucrando a comunidades.",
    email: "ventas@bioselva.pe",
    keywords: "Salud"
  },
  {
    id: 199,
    name_company: "Asociacion Campesina Forestal",
    description: "Trabaja en Cusco, creando un bosque comunitario sostenible con 1 millón de árboles, en conjunto con la comunidad campesina de Qquencco.",
    email: "info@campesinaforestal.org",
    networks: "https://www.facebook.com/campesinaforestal/",
    keywords: "Medio Ambiente"
  },
  {
    id: 200,
    name_company: "Asociación de Emprendedores del Perú (ASEP)",
    description: "Promueve y defiende el derecho del emprendimiento en los peruanos.",
    email: "info@asep.pe",
    networks: "https://www.facebook.com/AsepPeru/",
    keywords: "Desarrollo Económico"
  },
  {
    id: 201,
    name_company: "Asociación Peruana de Seguridad, Salud Ocupacional y Medio Ambiente (APSSOMA)",
    description: "Hace que más trabajos sean seguros en todo el Perú. Enseña a prevenir riesgos y lleva 5 años formando a trabajadores y cuidando miles de espacios laborales.",
    email: "contacto@apssoma.org",
    networks: "https://www.facebook.com/apssoma",
    keywords: "Salud ocupacional"
  },
  {
    id: 202,
    name_company: "Asociación Civil Chibolito ",
    description: "Promueve el cuidado de los niños, niñas y adolescentes de Cajamarca, a través de la prevención de riesgos psicosociales",
    email: "asociacionchibolitos@yahoo.es",
    networks: "https://www.facebook.com/asociacionchibolitos?mibextid=2JQ9oc",
    keywords: "Infancias"
  },
  {
    id: 203,
    name_company: "Corazones Unidos ",
    description: "Promueve la inclusión de personas con discapacidad en Lima, creando oportunidades reales de participación.",
    email: "Administracion@corazonesunidos.org",
    networks: "https://www.facebook.com/CorazonesUnidosPeru",
    keywords: "Inclusión y discapacidad"
  },
  {
    id: 204,
    name_company: "Intirunakunaq Wasin",
    description: "Trabaja en Cusco brindando servicios educativos complementarios a la niños y adolescentes en situación de riesgo ",
    email: "info@intirunakunaqwasin.org",
    networks: "https://www.facebook.com/intirunakunaqwasin",
    keywords: "Educación"
  },
  {
    id: 205,
    name_company: "Asociación Civil ONG Camina Conmigo",
    description: "Trabaja en Cajamarca mejorando la calidad de vida de niños con habilidades diferentes que viven en comunidades de extrema pobreza",
    email: "calidosacajamarca@gmail.com",
    networks: "https://www.facebook.com/CaminaConmigoCaj/",
    keywords: "Infancias"
  },
  {
    id: 206,
    name_company: "Asociacion Civil Pachamama Raymi, Aprender de los Mejores",
    description: "Apoya a comunidades rurales de Cusco para que vivan mejor, cuidando sus recursos naturales de forma sostenible.",
    email: "hola@pachamamaraymi.org",
    networks: "https://www.facebook.com/PachamamaRaymi/",
    keywords: "Desarrollo sostenible"
  },
  {
    id: 207,
    name_company: "Asociacion Civil Selva Amazonica",
    description: "Se dedica a la investigación clínica científica de programas de prevención del ITS y VIH-SIDA en Iquitos",
    email: "contacto@acsaperu.org",
    networks: "https://www.facebook.com/selvaamazonicaperu/?locale=es_LA",
    keywords: "Salud"
  },
  {
    id: 208,
    name_company: "Asociación Abrazos",
    description: "Trabaja en Cusco orientando a las personas sobre el autismo.",
    phones: ["984132633"],
    networks: "https://www.facebook.com/p/Abrazos-Cusco-100064452292395/",
    keywords: "Inclusión y discapacidad"
  },
  {
    id: 209,
    name_company: "ONG Ñañachaykuna",
    description: "Preserva la identidad cultural de las mujeres artesanas y productoras rurales de Cusco",
    email: "nanachaykunaong@gmail.com",
    networks: "https://www.facebook.com/ongnanachaykuna",
    keywords: "Pueblos Indígenas"
  },
  {
    id: 210,
    name_company: "La Asociación Kusi Warma",
    description: "Trabaja por los derechos de niñas, niños y adolescentes en situación vulnerable, protegiendo su salud, educación y bienestar.",
    email: "kusiwarma@kusiwarma.org",
    networks: "https://web.facebook.com/asociacion.kusiwarma/?_rdc=1&_rdr#",
    keywords: "Infancias"
  },
  {
    id: 211,
    name_company: "Asociación Compromiso ",
    description: "Impulsa el empoderamiento de mujeres y jóvenes en Loreto a través de préstamos y modelos de microfinanzas",
    email: "info@compromiso.org.pe",
    networks: "https://web.facebook.com/AsociacionCompromiso?_rdc=1&_rdr",
    keywords: "Género"
  },
  {
    id: 212,
    name_company: "Asociación Cultural Angel del Folklore ",
    description: "Promueve el arte y el deporte como forma de expresar la identidad cultural del Perú, con talleres para niños, jóvenes y adultos, en Arequipa",
    email: "info@afiperuinternacional.com",
    networks: "https://web.facebook.com/AsociacionAFIPERU",
    keywords: "Pueblos Indígenas"
  },
  {
    id: 213,
    name_company: "Asociacion de Productores Agropecuarios el Gran Mirador  Coffee",
    description: "Trabaja con productores cafetaleros para mejorar su producción en San Ignacio, Cajamarca.",
    networks: "https://granmiradorcoffee.com.pe/",
    keywords: "Desarrollo Económico"
  },
  {
    id: 214,
    name_company: "La Asociación de Promoción y Bienestar Familiar – APROBIF",
    description: "Apoyan a niños y familias en situación vulnerable en Arequipa. ",
    email: "contacto@aprobif.org.pe",
    networks: "https://web.facebook.com/APROBIF/?locale=es_LA&_rdc=1&_rdr#",
    keywords: "Infancias"
  },
  {
    id: 215,
    name_company: "Asociación Dignidad Perú",
    description: "Ayuda a que las personas en situación de cárcel puedan recuperar su libertad con dignidad como ciudadanos dignos y útiles a la sociedad",
    networks: "https://web.facebook.com/dignidadhumanaysolidaridad?_rdc=1&_rdr",
    keywords: "Desarrollo económico"
  },
  {
    id: 216,
    name_company: "Escalo-Thérapie",
    description: "Psicoterapeutas en Arequipa utilizan la escalada como herramienta terapéutica para mejorar la coordinación, el tono muscular, la atención, la motricidad fina y la autoestima de personas neurodivergentes. ",
    email: "escalo.therapie@outlook.com",
    networks: "https://www.facebook.com/escaloterapia/?locale=es_LA",
    keywords: "Salud mental"
  },
  {
    id: 217,
    name_company: "Asociación Familia Sana",
    description: "Promociona los derechos y la salud integral de las mujeres más vulnerables en Cajamarca.",
    phones: ["976770044"],
    networks: "https://www.facebook.com/p/Familia-Sana-100064732296651/?locale=es_LA",
    keywords: "Género"
  },
  {
    id: 218,
    name_company: "Asociación Los Andes de Cajamarca (ALAC)",
    description: "Impulsa mejoras en la educación, fortalecimiento de capacidades productivas y empresariales , y fomenta la inversión de recursos públicos y privados en infraestructura social, especialmente en el abastecimiento de agua de calidad.",
    email: "asociacion@losandes.org.pe",
    networks: "https://www.facebook.com/AndesdeCajamarca",
    keywords: "Desarrollo sostenible"
  },
  {
    id: 219,
    name_company: "Asociación para la Ciencia e Innovación Agraria para la Red Norte - AGRORED NORTE",
    description: "Impulsa innovación y conocimiento en la agricultura del norte del Perú.",
    email: "info@agroednorte.org.pe",
    networks: "https://www.facebook.com/p/Agrored-Norte-61555651453436/",
    keywords: "Desarrollo económico"
  },
  {
    id: 220,
    name_company: "Talento sin Límites",
    description: "Fortalece educación y habilidades de niños y adolescentes en Piura.",
    networks: "https://www.facebook.com/profile.php?id=100076165123996",
    keywords: "Educación, Niñez"
  },
  {
    id: 221,
    name_company: "ASPAPPUKU ",
    description: "Agrupa pescadores artesanales de paiche en Loreto.",
    email: "aspappuku@gmail.com",
    networks: "https://www.facebook.com/profile.php?id=100088274101119",
    keywords: "Desarrollo económico"
  },
  {
    id: 222,
    name_company: "Coalición para la Economía Verde",
    description: "Promueve la economía verde para beneficiar a personas y el ambiente en Perú.",
    email: "coalicion@economiaverde.pe",
    keywords: "Medio ambiente"
  },
  {
    id: 223,
    name_company: "Ayudando Abrigando",
    description: "Ayuda a personas necesitadas en Lima y cuida el ambiente reciclando botellas plásticas.",
    email: "info@ayudandoabrigando.org",
    networks: "https://web.facebook.com/ayudandoabrigando/?_rdc=1&_rdr",
    keywords: "Medio ambiente"
  },
  {
    id: 224,
    name_company: "Bety Linares Fundacion ",
    description: "Crea programas para mejorar la vida de adultos mayores en Arequipa.",
    email: "bettylinaresfundacion@hotmail.com",
    networks: "https://web.facebook.com/bettylinaresfundacion/?locale=es_LA&_rdc=1&_rdr#",
    keywords: "Adultos Mayores"
  },
  {
    id: 225,
    name_company: "Corazon de los Apus",
    description: "Apoya a niños en extrema pobreza para mejorar su vida en Cusco.",
    email: "apussonperu@gmail.com",
    networks: "https://web.facebook.com/corazondelosapusvolunteerwork/?locale=es_LA&_rdc=1&_rdr",
    keywords: "Infancias"
  },
  {
    id: 226,
    name_company: "Centro de Rescate Amazonico (CREA)",
    description: "Protege animales silvestres víctimas del tráfico ilegal en Loreto.",
    email: "luisjavi.vv@gmail.com",
    networks: "https://web.facebook.com/CentroRescateAmazonicoCREA?_rdc=1&_rdr#",
    keywords: "Medio Ambiente"
  },
  {
    id: 227,
    name_company: "Centro Ideas ",
    description: "Promueve desarrollo humano y agricultura ecológica en Piura y Cajamarca.",
    email: "ideas_piura@ideas.org.pe",
    networks: "https://web.facebook.com/centroideas.programapiura/?_rdc=1&_rdr",
    keywords: "Desarrollo económico"
  },
  {
    id: 228,
    name_company: "Centro de Investigación y Promoción del Campesinado - Cipca",
    description: "Trabaja por el desarrollo sostenible y la igualdad en zonas rurales de Piura.",
    email: "cipca@cipca.pe",
    networks: "https://web.facebook.com/profile.php?id=100064470048692",
    keywords: "Desarrollo sostenible"
  },
  {
    id: 229,
    name_company: "Code en mi Cole",
    description: "Enseña programación a escolares en Lima.",
    email: "contacto@codenmicole.com",
    networks: "https://web.facebook.com/Code.en.mi.Cole/?locale=es_LA&_rdc=1&_rdr#",
    keywords: "Educación"
  },
  {
    id: 230,
    name_company: "Compadre",
    description: "Apoya a pequeños agricultores con pago justo y acompañamiento en Lima.",
    email: "hola@compadre.pe",
    networks: "https://web.facebook.com/cafe.compadre/",
    keywords: "Desarrollo Económico"
  },
  {
    id: 231,
    name_company: "Consejo Regional de la Juventud - COREJU Cusco",
    description: "Espacio de consulta y propuestas políticas para jóvenes en Cusco.",
    email: "corejucusco@regioncusco.gob.pe",
    networks: "https://web.facebook.com/p/Consejo-Regional-de-la-Juventud-COREJU-Cusco-100079778203403/?_rdc=1&_rdr#",
    keywords: "Democracia"
  },
  {
    id: 232,
    name_company: "Banco del Estudiante",
    description: "Fomenta educación e inclusión financiera en jóvenes usando reciclaje en Arequipa y Lima.",
    email: "informes@bancodelestudiante.org",
    networks: "https://web.facebook.com/bancodel.estudiante/?locale=es_LA&_rdc=1&_rdr#",
    keywords: "Educación"
  },
  {
    id: 233,
    name_company: "Fundación Crees por Manu",
    description: "Promueve conciencia ambiental con base científica en Madre de Dios y Cusco.",
    email: "network@crees-manu.org",
    networks: "https://www.facebook.com/creesfoundation",
    keywords: "Medio ambiente"
  },
  {
    id: 234,
    name_company: "Descubriendo Juntxs",
    description: "Fortalece habilidades blandas y liderazgo de jóvenes en Perú.",
    email: "saddit.siuce@gmail.com",
    networks: "https://www.facebook.com/p/Descubriendo-Juntxs-100083237715538/",
    keywords: "Educación"
  },
  {
    id: 235,
    name_company: "Eagle Condor Humanitarian",
    description: "Amplía oportunidades para personas en pobreza en Perú.",
    email: "info@eagle-condor.org",
    networks: "https://www.facebook.com/EagleCondor/",
    keywords: "Desarrollo Rural"
  },
  {
    id: 236,
    name_company: "EcoSwell",
    description: "Implementa proyectos sostenibles junto a comunidades en Piura.",
    email: "info@ecoswell.org",
    networks: "https://www.facebook.com/EcoSwell",
    keywords: "Desarollo sostenible"
  },
  {
    id: 237,
    name_company: "Fundación Ayuda en Acción",
    description: "Apoya a comunidades vulnerables para que niños y jóvenes accedan a educación y empleo digno.",
    phones: ["950426002"],
    networks: "https://www.facebook.com/ayudaenaccion.peru/?_gl=1*hvhfld*_gcl_au*NjExNjE2MjIwLjE3MzcwNDc5NDQ.",
    keywords: "Infancias"
  },
  {
    id: 238,
    name_company: "Future of Fish",
    description: "Empodera comunidades pesqueras artesanales para que sean competitivas y sostenibles en Piura.",
    email: "communications@futureoffish.org",
    networks: "https://www.facebook.com/FutureofFishLATAM",
    keywords: "Desarrollo Económico"
  },
  {
    id: 239,
    name_company: "Global Shapers",
    description: "Jóvenes que forman parte de una red global para liderar cambios en sus comunidades.",
    email: "limashapers@gmail.com",
    networks: "https://www.facebook.com/limahub/",
    keywords: "Liderazgo"
  },
  {
    id: 240,
    name_company: "Sin Tabues",
    description: "Promueve educación sexual integral en colegios de Lima.",
    email: "sintabues.org@gmail.com",
    networks: "https://www.facebook.com/sintabuesrs",
    keywords: "Salud sexual"
  },
  {
    id: 241,
    name_company: "Hacedoras",
    description: "Impulsa que más mujeres participen en decisiones públicas en Latinoamérica.",
    networks: "https://www.hacedoras.org/",
    keywords: "Gestión pública"
  },
  {
    id: 242,
    name_company: "Heroínas Peruanas",
    description: "Promueve educación e igualdad mostrando ejemplos de mujeres peruanas emblemáticas.",
    email: "heroinasperuanas@gmail.com",
    networks: "https://www.facebook.com/HeroinasPeruanas/",
    keywords: "Género"
  },
  {
    id: 243,
    name_company: "Juventud Laica",
    description: "Defiende derechos humanos y sociales de jóvenes en Cajamarca.",
    email: "juventudlaicacaj@gmail.com",
    networks: "https://www.facebook.com/profile.php?id=100066302572825",
    keywords: "Derechos Humanos"
  },
  {
    id: 244,
    name_company: "Kaysay Centro de Formación Ambiental",
    description: "Enseña a cuidar la naturaleza usando saberes ancestrales y modernos en Cusco.",
    email: "info@pukllasunchis.org",
    networks: "https://www.facebook.com/profile.php?id=100083370180873",
    keywords: "Medio ambiente"
  },
  {
    id: 245,
    name_company: "Ludoteca Gotitas de Amor",
    description: "Enseña valores a niños a través de juegos en Piura.",
    email: "ludotecagotitasdeamor@gmail.com",
    networks: "https://www.facebook.com/GotitasdeAmor.Ludoteca/?locale=es_LA",
    keywords: "Infancias"
  },
  {
    id: 246,
    name_company: "Mujeres en STEAM",
    description: "Impulsa que más mujeres y niñas participen en ciencia, tecnología, arte y matemáticas en Perú.",
    email: "mujeresensteam@gmail.com",
    networks: "https://www.facebook.com/MujeresEnSTEAM/",
    keywords: "Género"
  },
  {
    id: 247,
    name_company: "ÑAÑAYKUNA",
    description: "Promueve igualdad de género e identidad cultural en Cusco.",
    email: "nanaykunacusco@gmail.com",
    networks: "https://www.facebook.com/Nanaykuna/",
    keywords: "Género"
  },
  {
    id: 248,
    name_company: "ONG PACHAMAMA YAKU",
    description: "Trabaja en proyectos de reforestación y producción agrícola que buscan generar impacto real en comunidades rurales de Piura.",
    email: "pachamamayaku.ong@gmail.com",
    networks: "https://www.facebook.com/PachamamaYaku.18",
    keywords: "Medio ambiente"
  },
  {
    id: 249,
    name_company: "Plastic Corporation",
    description: "Convierte residuos plásticos en muebles y estructuras en Sullana.",
    email: "plasticcorporationsac@gmail.com",
    networks: "https://www.facebook.com/p/Plastic-Corporation-100089185130766/",
    keywords: "Medio ambiente"
  },
  {
    id: 250,
    name_company: "PROA",
    description: "Conecta voluntarios y donantes con organizaciones que necesitan ayuda en Lima.",
    email: "info@proa.pe",
    networks: "https://www.facebook.com/proa.pe",
    keywords: "Desarrollo sostenible"
  },
  {
    id: 251,
    name_company: "Canchiqmy Kany",
    description: "Promueve educación inclusiva y mejor aprendizaje en Cañete.",
    phones: ["964600368"],
    networks: "https://www.facebook.com/Canchiqmy/?profile_tab_item_selected=mentions&_rdr",
    keywords: "Educación"
  },
  {
    id: 252,
    name_company: "Sonrisas Solidarias",
    description: "Busca mejorar la salud bucal en zonas rurales de Cusco.",
    email: "sonrisassolidariascusco@gmail.com",
    networks: "https://www.facebook.com/sonrisassolidariascusco/?locale=es_LA",
    keywords: "Salud"
  },
  {
    id: 253,
    name_company: "Suyay ONG",
    description: "Trabaja por una Amazonía más justa. Lleva educación y salud a niños y adultos en Loreto, promoviendo igualdad, desarrollo personal y compromiso ciudadano.",
    email: "info@suyay.es",
    networks: "https://www.facebook.com/suyay.ongd/?locale=es_LA",
    keywords: "Educación"
  },
  {
    id: 254,
    name_company: "Triangulo Naranja",
    description: "Une familias y profesionales para mejorar la vida de personas con TDAH en Perú.",
    email: "hola@triangulonaranja.org",
    networks: "https://www.facebook.com/unidosporeltdah/?locale=es_LA",
    keywords: "Salud mental"
  },
  {
    id: 255,
    name_company: "Un Millón de Niños Lectores",
    description: "Promueve la lectura en niños y niñas construyendo bibliotecas en Perú.",
    email: "bibliotecas@millondeninoslectores.org.",
    networks: "https://web.facebook.com/UNMILLONDENINOSLECTORES/#",
    keywords: "Infancias"
  },
  {
    id: 256,
    name_company: "Lima como vamos",
    description: "Fomenta ciudadanía activa y uso de datos para mejorar la vida urbana en Lima.",
    email: "observatorio@limacomovamos.org",
    networks: "https://web.facebook.com/limacomovamos?_rdc=1&_rdr#",
    keywords: "Urbanismo"
  },
  {
    id: 257,
    name_company: "Fundación Peruana de Cancer",
    description: "Apoya a pacientes con cáncer que más lo necesitan en Perú.",
    email: "fundacion@fpc.pe",
    networks: "https://web.facebook.com/FundacionPeruanaDeCancer/?_rdc=1&_rdr#",
    keywords: "Salud"
  },
  {
    id: 258,
    name_company: "Juguete Pendiente",
    description: "Lleva soluciones sostenibles a comunidades vulnerables en Perú, a través de ayuda humanitaria, rehabilitación de espacios y desarrollo de capacidades.",
    email: "contacto@juguetependiente.org",
    networks: "https://web.facebook.com/JuguetePendiente/",
    keywords: "Acción humanitaria"
  },
  {
    id: 259,
    name_company: "Kantaya",
    description: "Mejora la vida de niños vulnerables con programas educativos en Lima.",
    email: "donacion@kantayaperu.com",
    networks: "https://web.facebook.com/kantayaperu?_rdc=1&_rdr#",
    keywords: "Infancias"
  },
  {
    id: 260,
    name_company: "Caifai Amazonas",
    description: "Promueve igualdad y bienestar de la comunidad LGTB+ en Chachapoyas.",
    email: "organizacionlgbtcaifai@gmail.com",
    networks: "https://web.facebook.com/caifaiamazonas/?locale=es_ES&_rdc=1&_rdr#",
    keywords: "LGBTIQ+"
  },
  {
    id: 261,
    name_company: "Maricas Perú",
    description: "Visibiliza y apoya a hombres gays y bisexuales en Lima.",
    email: "maricasperu@gmail.com",
    networks: "https://web.facebook.com/maricasperu/?_rdc=1&_rdr#",
    keywords: "LGBTIQ+"
  },
  {
    id: 262,
    name_company: "Amantani",
    description: "Promueve inclusión y oportunidades para jóvenes rurales en Cusco y Loreto, a través de oportunidades en educación, empleo y comercio justo.",
    email: "info@amantani.org.pe",
    networks: "https://web.facebook.com/amantaniuk/?_rdc=1&_rdr#",
    keywords: "Desarrollo sostenible"
  },
  {
    id: 263,
    name_company: "Misión Huascarán",
    description: "Crea oportunidades educativas y económicas respetando la cultura en Ancash.",
    email: "comunicaciones@misionesrurales.org.pe",
    networks: "https://web.facebook.com/misionhuascaran/?_rdc=1&_rdr#",
    keywords: "Desarrollo sostenible"
  },
  {
    id: 264,
    name_company: "Viernes por el Futuro Perú",
    description: "Moviliza jóvenes contra la crisis climática en Perú.",
    email: "fridaysforfutureperu@gmail.com",
    networks: "https://web.facebook.com/fridaysforfutureperu/?locale=es_LA&_rdc=1&_rdr#",
    keywords: "Medio Ambiente"
  },
  {
    id: 265,
    name_company: "Colectivo PAS",
    description: "Difunde información sobre minería ilegal y delitos asociados en Perú.",
    networks: "https://web.facebook.com/queremospas.pe/?_rdc=1&_rdr#",
    keywords: "Medio Ambiente"
  },
  {
    id: 266,
    name_company: "It Gets Better Perú",
    description: "Apoya a jóvenes LGBTQ+ con recursos educativos y apoyo psicológico en Lima.",
    email: "contacto@itgetsbetterperu.org",
    networks: "https://web.facebook.com/itgetsbetterperu/?_rdc=1&_rdr#",
    keywords: "LGTBIQ+"
  },
  {
    id: 267,
    name_company: "Atmosphera Project",
    description: "Impulsa proyectos sostenibles para el desarrollo en Arequipa.",
    keywords: "Medio ambiente"
  },
  {
    id: 268,
    name_company: "Creas Más",
    description: "Apoya a personas vulnerables con oportunidades y productos esenciales en Perú.",
    networks: "https://www.facebook.com/Creamasperu/?locale=es_LA",
    keywords: "Educación"
  },
  {
    id: 269,
    name_company: "Red de Estudios para el Desarrollo",
    description: "Conecta Estado, academia y ciudadanía para impulsar el desarrollo en Perú.",
    email: "contacto@redesarrollo.pe",
    networks: "https://www.facebook.com/redesarrollope/",
    keywords: "Gestión pública"
  },
  {
    id: 270,
    name_company: "Poiesis",
    description: "Fomenta la creatividad en todas sus formas en Lima.",
    keywords: "Arte y cultura"
  },
  {
    id: 271,
    name_company: "Actúa.pe",
    description: "Plataforma que conecta y apoya acciones ciudadanas contra la desigualdad en Perú.",
    email: "actua.pe@gmail.com",
    networks: "https://www.facebook.com/ActuaPe1",
    keywords: "Desarrollo sostenible"
  },
  {
    id: 272,
    name_company: "PeruTeQuiero",
    description: "Fortalece la sociedad civil para un Perú más solidario e inclusivo.",
    email: "secretariaejecutivaptq@mosaicolab.org",
    networks: "https://www.facebook.com/Perutequiero.pe",
    keywords: "Democracia"
  },
  {
    id: 273,
    name_company: "Recambio",
    description: "Busca renovar la política y fortalecer la democracia en Perú.",
    email: "recambioproyecto@gmail.com",
    networks: "https://www.facebook.com/RecambioPe/",
    keywords: "Democracia"
  },
  {
    id: 274,
    name_company: "Konrad-Adenauer-Stiftung",
    description: "Fortalece la democracia y las instituciones en Lima.",
    email: "kasperu@kas.de",
    networks: "https://www.facebook.com/kasenperu",
    keywords: "Democracia"
  },
  {
    id: 275,
    name_company: "Niños del Arco Iris",
    description: "Da educación, nutrición y salud a niños vulnerables en Cusco.",
    email: "info@ninosdelarcoiris.edu.pe",
    networks: "https://www.facebook.com/fundacionninosdelarcoiriscusco/",
    keywords: "Educación"
  },
  {
    id: 276,
    name_company: "Diálogo Político",
    description: "Espacio para el diálogo democrático entre líderes políticos en Latinoamérica.",
    email: "info@dialogopolitico.org",
    networks: "https://www.facebook.com/dialogopoliticolatinoamerica",
    keywords: "Democracia"
  },
  {
    id: 277,
    name_company: "Jovenes Peruanos Frente al Cambio Climático",
    description: "Une a jóvenes para buscar soluciones frente al cambio climático en Perú.",
    email: "jpcc2021@gmail.com",
    networks: "https://www.facebook.com/jpccperu",
    keywords: "Medio ambiente"
  },
  {
    id: 278,
    name_company: "Global Changemakers",
    description: "Impulsa a jóvenes a crear soluciones a los grandes retos del país.",
    email: "info@global-changemakers.net",
    networks: "https://www.facebook.com/WeAreGCM/?_rdc=1&_rdr#",
    keywords: "Liderazgo"
  },
  {
    id: 279,
    name_company: "Conservación Internacional (CI)",
    description: "Protege los ecosistemas esenciales en la Amazonía.",
    email: "contactoPE@conservation.org",
    networks: "https://www.facebook.com/ciperu",
    keywords: "Medio Ambiente"
  },
  {
    id: 280,
    name_company: "Xapiri Ground",
    description: "Difunde el arte y cultura viva de la Amazonía en Cusco.",
    email: "info@xapiriground.org",
    networks: "https://www.facebook.com/xapiriground?_rdc=1&_rdr#",
    keywords: "Arte y cultura"
  },
  {
    id: 281,
    name_company: "Convoca",
    description: "Hace periodismo de investigación e innovación para generar cambios en Lima.",
    email: "convocaredes@gmail.com",
    networks: "https://www.facebook.com/Convoca/",
    keywords: "Periodismo"
  },
  {
    id: 282,
    name_company: "La Buena Pesca",
    description: "Promueve pesca y consumo responsable en Lima.",
    email: "labuenapesca@futureoffish.org",
    networks: "https://www.facebook.com/labuenapescaperu/",
    keywords: "Desarrollo económico"
  },
  {
    id: 283,
    name_company: "Hazla por tu Ola",
    description: "Busca proteger las olas y espacios marinos para el deporte en Perú.",
    email: "conservamos@spda.org.pe",
    networks: "https://www.facebook.com/conservamospornaturaleza",
    keywords: "Medio ambiente"
  },
  {
    id: 284,
    name_company: "Ania ORG",
    description: "Ayuda a jóvenes a conectar con la naturaleza y ser agentes de cambio en Perú.",
    email: "info@aniaorg.pe",
    networks: "https://www.facebook.com/Aniaorg/",
    keywords: "Medio ambiente"
  },
  {
    id: 285,
    name_company: "On Think Tanks",
    description: "Plataforma global que impulsa el cambio social basado en evidencia",
    email: "info@onthinktanks.org",
    networks: "https://www.facebook.com/onthinktanks",
    keywords: "Investigación"
  },
  {
    id: 286,
    name_company: "AGUAPAN, Guardianes de la Papa",
    description: "Protege y promueve la papa nativa del Perú en Lima y Trujillo.",
    email: "guardianesdelapapa@gmail.com",
    networks: "https://www.facebook.com/miski.papa",
    keywords: "Desarrollo económico"
  },
  {
    id: 287,
    name_company: "Amazónicos por la Amazonía (AMPA)",
    description: "Conserva el patrimonio natural y cultural y mejora la vida en comunidades de la Amazonía andina.",
    email: "ampa@ampaperu.info",
    networks: "https://www.facebook.com/AMPAPERU/?locale=es_LA",
    keywords: "Medio ambiente"
  },
  {
    id: 288,
    name_company: "Ciudad Saludable",
    description: "Mejora la calidad de vida con sistemas innovadores de gestión ambiental en San Martín y Lima.",
    phones: ["5114466323"],
    networks: "https://www.facebook.com/ciudadsaludable.org/about_details?locale=es_LA",
    keywords: "Urbanismo"
  },
  {
    id: 289,
    name_company: "Los Tambopatas",
    description: "Vigilan y protegen la Reserva Nacional de Tambopata contra la minería ilegal.",
    email: "patronato.tambopata@gmail.com",
    networks: "https://www.facebook.com/SomosTambopata/",
    keywords: "Medio Ambiente"
  },
  {
    id: 290,
    name_company: "AIDER Perú",
    description: "Impulsa conservación ambiental y desarrollo sostenible en comunidades nativas de Perú.",
    email: "comunicaciones@aider.com.pe",
    networks: "https://www.facebook.com/aiderperu",
    keywords: "Medio Ambiente"
  },
  {
    id: 291,
    name_company: "Faiths for Forests",
    description: "Une religiones para proteger los bosques tropicales en la Amazonía.",
    email: "peru@interfaithrainforest.org",
    networks: "https://www.facebook.com/faiths4forests",
    keywords: "Medio Ambiente"
  },
  {
    id: 292,
    name_company: "Celebración de las Áreas Protegidas y Conservadas LAC",
    description: "Fomenta la conservación de áreas protegidas en Latinoamérica.",
    email: "info@celebracionareasprotegidas.org",
    networks: "https://www.facebook.com/celebracionapclac/",
    keywords: "Medio Ambiente"
  },
  {
    id: 293,
    name_company: "Red de Conservación Voluntaria de Amazonas",
    description: "Reúne iniciativas para conservar el ambiente en Amazonas.",
    email: "info@www.redama.org",
    networks: "https://www.facebook.com/red.ama.amazonas",
    keywords: "Medio Ambiente"
  },
  {
    id: 294,
    name_company: "Recicla Latam Perú",
    description: "Promueve reciclaje formal y economía circular en Perú, Colombia y Ecuador.",
    networks: "https://www.facebook.com/reciclalatamperu",
    keywords: "Medio Ambiente"
  },
  {
    id: 295,
    name_company: "Earth Rights Intl",
    description: "Apoya a comunidades que defienden el ambiente y derechos humanos en Latinoamérica.",
    email: "infoperu@earthrights.org",
    networks: "https://www.facebook.com/EarthRightsIntl",
    keywords: "Medio Ambiente"
  },
  {
    id: 296,
    name_company: "Pro Delphinus Perú",
    description: "Investiga y protege especies marinas en peligro en la costa peruana y Ucayali.",
    email: "prodelphinus@gmail.com",
    networks: "https://www.facebook.com/ProDelphinus",
    keywords: "Medio Ambiente"
  },
  {
    id: 297,
    name_company: "Saving The Amazon",
    description: "Planta árboles con comunidades indígenas para combatir la crisis climática en la Amazonía.",
    email: "wvalentina@savingtheamazon.org",
    networks: "https://www.facebook.com/fundacionsavingtheamazon/",
    keywords: "Medio Ambiente"
  },
  {
    id: 298,
    name_company: "Hazla por tu Playa",
    description: "Limpia playas y ecosistemas acuáticos en todo el Perú.",
    email: "hazlaportuplaya@gmail.com",
    networks: "https://www.facebook.com/HAZlaPlaya/?locale=es_LA",
    keywords: "Medio Ambiente"
  },
  {
    id: 299,
    name_company: "Ecoladrillos Perú",
    description: "Enseña a aprovechar residuos y crear ecoladrillos en Lima.",
    email: "ecoladrillos.peru@gmail.com",
    networks: "https://www.facebook.com/ecoladrillerosperu",
    keywords: "Medio Ambiente"
  },
  {
    id: 300,
    name_company: "Cool Earth",
    description: "Apoya a comunidades indígenas para proteger bosques tropicales.",
    email: "info@coolearth.org",
    networks: "https://www.facebook.com/coolearth",
    keywords: "Pueblos Indígenas"
  },
  {
    id: 301,
    name_company: "Comunidad en Marcha",
    description: "Promueve el desarrollo integral y solidario en Arequipa.",
    email: "info@comunidadenmarcha.org",
    networks: "https://www.facebook.com/ComunidadMarcha",
    keywords: "Desarrollo Económico"
  },
  {
    id: 302,
    name_company: "Asociación Civil Japiqay, Memoria y Ciudadanía",
    description: "Promueve memoria y verdad para luchar contra la corrupción en Perú.",
    email: "contacto@japiqay.org",
    networks: "https://www.facebook.com/JapiqayPe/",
    keywords: "Derechos Humanos"
  },
  {
    id: 303,
    name_company: "Asociación de Familias por la Diversidad Sexual Perú",
    description: "Apoya a familias con miembros LGBTIQ+ en Perú.",
    email: "asociacionfdsperu@gmail.com",
    networks: "https://www.facebook.com/afdsperu/",
    keywords: "LGBTIQ+"
  },
  {
    id: 304,
    name_company: "Asociacion Amar C",
    description: "Empodera a mujeres y brinda información sobre salud sexual en Amazonas.",
    email: "asociacionamarc@gmail.com",
    networks: "http://web.facebook.com/ASOCIACIONAMARC/?_rdc=1&_rdr#",
    keywords: "Salud sexual"
  },
  {
    id: 305,
    name_company: "Asociacion Humanidad Libre",
    description: "Trabaja por el empoderamiento de mujeres y la igualdad en Arequipa.",
    email: "ashumanidadlibre@yahoo.es",
    networks: "https://web.facebook.com/AsociacionHumanidadLibre/about_contact_and_basic_info?locale=es_LA",
    keywords: "Género"
  },
  {
    id: 306,
    name_company: "Capitalismo Consciente Perú",
    description: "Impulsa empresas conscientes para mejorar la sociedad en Perú.",
    email: "movimiento@capitalismoconsciente.pe",
    networks: "https://web.facebook.com/CapitalismoConscientePeru",
    keywords: "Desarrollo Económico"
  },
  {
    id: 307,
    name_company: "Centro de Desarrollo de la Mujer Negra Peruana CEDEMUNEP",
    description: "Defiende derechos y mejora la vida de mujeres afroperuanas en Lima.",
    email: "cedemunep@hotmail.com",
    networks: "https://www.facebook.com/centro.cedemunep/?locale=es_LA&_rdc=2&_rdr#",
    keywords: "Afroperuanos"
  },
  {
    id: 308,
    name_company: "CiudadanosTodos",
    description: "Forma ciudadanos responsables y conscientes de sus derechos en Lima.",
    email: "ciudadtodos.boletin@gmail.com",
    networks: "https://www.facebook.com/profile.php?%20id=61561812667195&mibextid=LQQJ4d&rdid=p1aepuqK7yr2Rvr8&share_url=https%20%3A%2F%2Fwww.facebook.com%2Fshare%2FQnYASe9Msb1qHgb3%2F%3Fmibextid%20%3DLQQJ4d",
    keywords: "Democracia"
  },
  {
    id: 309,
    name_company: "Foro Regional por los Derechos Sexuales y Reproductivos FORDES Arequipa",
    description: "Promueve la salud mental y combate el estigma en todo el país.",
    email: "fordesarequipa@gmail.com",
    networks: "https://www.facebook.com/FORDES.AREQUIPA",
    keywords: "Salud mental"
  },
  {
    id: 310,
    name_company: "Fundación Peruanos Power",
    description: "Defiende derechos sexuales y reproductivos en Arequipa.",
    email: "informes@peruanospower.org",
    networks: "https://www.facebook.com/share/15YUifbB8R/?mibextid=wwXIfr",
    keywords: "Salud sexual"
  },
  {
    id: 311,
    name_company: "DEMUS - Estudio para la defensa de los derechos de la mujer",
    description: "Da oportunidades y recursos para que niños y jóvenes desarrollen su potencial en Lima y Junín.",
    phones: ["+5114638515"],
    networks: "https://www.facebook.com/DemusPeru",
    keywords: "Infancias"
  },
  {
    id: 312,
    name_company: "Mujeres Solidarias de la Región Lambayeque",
    description: "Defiende derechos sexuales y reproductivos de mujeres en Lima.",
    networks: "https://web.facebook.com/profile.php?id=100006692740086&locale=es_LA",
    keywords: "Salud sexual"
  },
  {
    id: 313,
    name_company: "Plataforma ciudadana para la formulación de políticas públicas en Salud y derechos Humanos",
    description: "Promueve la prevención del cáncer en Lambayeque.",
    email: "info@saludyderechos.org",
    phones: ["977155642"],
    networks: "https://www.facebook.com/Plataforma-Salud-y-Derechos-104383344644388/",
    keywords: "Salud"
  },
  {
    id: 314,
    name_company: "Social Good Peru",
    description: "Busca mejorar los servicios de salud y superar la crisis sanitaria en Perú.",
    email: "socialgoodperu@gmail.com",
    networks: "https://web.facebook.com/SocialGoodPeru/?_rdc=1&_rdr#",
    keywords: "Salud"
  },
  {
    id: 315,
    name_company: "Sense Internacional Peru",
    description: "Jóvenes que promueven el desarrollo sostenible y el cuidado del ambiente en Lima.",
    email: "sense@senseintperu.org",
    networks: "https://www.senseintperu.org/contactanos/#",
    keywords: "Medio Ambiente"
  },
  {
    id: 316,
    name_company: "ONGD asociación equilibrio",
    description: "Apoya a personas con sordoceguera y discapacidad múltiple en todo el país.",
    email: "contacto@equilibrio.org.pe",
    networks: "https://www.facebook.com/113727953664448?referrer=whatsapp",
    keywords: "Inclusión y discapacidad"
  },
  {
    id: 317,
    name_company: "Women CEO Peru",
    description: "Promueve el liderazgo de mujeres en espacios de decisión en Perú.",
    email: "informes@womenceoperu.org",
    networks: "https://www.facebook.com/womenceoperu",
    keywords: "Género"
  },
  {
    id: 318,
    name_company: "ILAD Media",
    description: "Defiende la democracia y la libertad a través de su canal en Perú.",
    email: "ilad.redes@gmail.com",
    networks: "https://www.facebook.com/ilad.media/?locale=es_LA",
    keywords: "Periodismo"
  },
  {
    id: 319,
    name_company: "Padres Peruanos",
    description: "Defiende el derecho de los padres a educar a sus hijos en Lima.",
    phones: ["960749076"],
    networks: "https://www.facebook.com/padres.peruanos",
    keywords: "Familia"
  },
  {
    id: 321,
    name_company: "Con mis hijos no te metas",
    description: "Busca el desarrollo y crecimiento sano de los hijos en Perú.",
    email: "informes@conmishijosnotemetas.pe",
    networks: "https://www.facebook.com/ConMisHijosNoTeMetasOficial/?locale=es_LA",
    keywords: "Familia"
  },
  {
    id: 322,
    name_company: "Una voz diferente",
    description: "Participa en la batalla cultural y política en Lima.",
    email: "unavozdiferente.peru@gmail.com",
    networks: "https://www.facebook.com/people/Una-Voz-Diferente/100084334942485/",
    keywords: "Democracia"
  },
  {
    id: 323,
    name_company: "Caene",
    description: "Ofrece consultorías y formación en economía y empresas en Lima.",
    email: "informes@caene.org.pe",
    networks: "https://www.facebook.com/caene.educacion",
    keywords: "Desarrollo Económico"
  },
  {
    id: 324,
    name_company: "Piensa.pe",
    description: "Difunde información clara y basada en evidencia sobre temas importantes en Perú.",
    email: "cm@piensa.pe",
    networks: "https://www.facebook.com/profile.php?id=100064544362300",
    keywords: "Democracia"
  },
  {
    id: 325,
    name_company: "Asociación de contribuyentes Perú",
    description: "Defiende el derecho a servicios estatales de calidad para los contribuyentes en Perú.",
    email: "info@tucontribuyes.org",
    networks: "https://www.facebook.com/contribuyentesperuanos/?locale=es_LA",
    keywords: "Desarrollo económico"
  },
  {
    id: 326,
    name_company: "EsLibertad",
    description: "Apoya a estudiantes que promueven la libertad en Perú.",
    email: "azanabria@eslibertad.org",
    networks: "https://www.facebook.com/EsLibertadPeru/",
    keywords: "Democracia"
  },
  {
    id: 327,
    name_company: "IPL Libertad",
    description: "Propone ideas para el desarrollo del país basadas en la libertad y la democracia en Lima.",
    email: "ipl@iplperu.org",
    networks: "https://www.facebook.com/ipllibertad/",
    keywords: "Democracia"
  },
  {
    id: 328,
    name_company: "Bethel Radio",
    description: "Emisora cristiana que difunde la palabra de Dios en Perú.",
    email: "Webmaster@bethel.fm",
    networks: "https://www.facebook.com/bethelradio",
    keywords: "Periodismo"
  },
  {
    id: 329,
    name_company: "Centro para el desarrollo de la familia",
    description: "Fortalece e integra familias con programas y capacitaciones en Lima.",
    email: "informes@centrofamilia.org",
    networks: "https://www.facebook.com/centrofamiliaperu",
    keywords: "Familia"
  },
  {
    id: 330,
    name_company: "Voluntarios.pe",
    description: "Articula esfuerzos de la sociedad civil, sector privado, academia y Estado, diseñando soluciones sostenibles junto a las comunidades.",
    networks: "https://www.voluntarios.pe/",
    keywords: "Desarrollo sostenible"
  },
  {
    id: 331,
    name_company: "Urban Action Foundation e.V.",
    description: "Impulsa el desarrollo integral y participativo de ciudades informales en América Latina para mejorar la calidad de vida urbana.",
    networks: "https://urbanactionfoundation.com/",
    keywords: "Urbanismo"
  }
]
export const photos = [
  { id: 1, url: 'https://alfi-others.s3.us-east-2.amazonaws.com/gallery_1.jpg' },
  { id: 2, url: 'https://alfi-others.s3.us-east-2.amazonaws.com/gallery_2.jpg' },
  { id: 3, url: 'https://alfi-others.s3.us-east-2.amazonaws.com/gallery_3.jpg' },
  { id: 4, url: 'https://alfi-others.s3.us-east-2.amazonaws.com/gallery_4.jpg' },
  { id: 5, url: 'https://alfi-others.s3.us-east-2.amazonaws.com/gallery_5.jpg' },
  { id: 6, url: 'https://alfi-others.s3.us-east-2.amazonaws.com/gallery_6.jpg' },
  { id: 7, url: 'https://alfi-others.s3.us-east-2.amazonaws.com/gallery_7.jpg' },
  { id: 8, url: 'https://alfi-others.s3.us-east-2.amazonaws.com/gallery_8.jpg' },
  { id: 9, url: 'https://alfi-others.s3.us-east-2.amazonaws.com/gallery_9.jpg' },
  { id: 10, url: 'https://alfi-others.s3.us-east-2.amazonaws.com/gallery_10.jpg' },
  { id: 11, url: 'https://alfi-others.s3.us-east-2.amazonaws.com/gallery_11.jpg' },
  { id: 12, url: 'https://alfi-others.s3.us-east-2.amazonaws.com/gallery_12.jpg' },
  { id: 13, url: 'https://alfi-others.s3.us-east-2.amazonaws.com/gallery_13.jpg' },
  { id: 14, url: 'https://alfi-others.s3.us-east-2.amazonaws.com/gallery_14.jpg' },
  { id: 15, url: 'https://alfi-others.s3.us-east-2.amazonaws.com/gallery_15.jpg' },
  { id: 16, url: 'https://alfi-others.s3.us-east-2.amazonaws.com/gallery_16.jpg' },
  { id: 17, url: 'https://alfi-others.s3.us-east-2.amazonaws.com/gallery_17.jpg' },
  { id: 18, url: 'https://alfi-others.s3.us-east-2.amazonaws.com/gallery_18.jpg' },
  { id: 19, url: 'https://alfi-others.s3.us-east-2.amazonaws.com/gallery_19.jpg' },
  { id: 20, url: 'https://alfi-others.s3.us-east-2.amazonaws.com/gallery_20.jpg' },
  { id: 21, url: 'https://alfi-others.s3.us-east-2.amazonaws.com/gallery_21.jpg' },
  { id: 22, url: 'https://alfi-others.s3.us-east-2.amazonaws.com/gallery_22.jpg' },
  { id: 23, url: 'https://alfi-others.s3.us-east-2.amazonaws.com/gallery_23.jpg' },
  { id: 24, url: 'https://alfi-others.s3.us-east-2.amazonaws.com/gallery_24.jpg' },
  { id: 25, url: 'https://alfi-others.s3.us-east-2.amazonaws.com/gallery_25.jpg' },
  { id: 26, url: 'https://alfi-others.s3.us-east-2.amazonaws.com/gallery_26.jpg' },
  { id: 27, url: 'https://alfi-others.s3.us-east-2.amazonaws.com/gallery_27.jpg' }
]
export const logos_black = [
  'https://alfi-others.s3.us-east-2.amazonaws.com/footer_black/Studio92.png',
  'https://alfi-others.s3.us-east-2.amazonaws.com/footer_black/Corazo%CC%81n.png',
  'https://alfi-others.s3.us-east-2.amazonaws.com/footer_black/La+Zona.png',
  'https://alfi-others.s3.us-east-2.amazonaws.com/footer_black/Cara.png',
  'https://alfi-others.s3.us-east-2.amazonaws.com/footer_black/Patria+C.png',
  'https://alfi-others.s3.us-east-2.amazonaws.com/footer_black/Recambio.png',
  'https://alfi-others.s3.us-east-2.amazonaws.com/footer_black/Oranch.png',
  'https://alfi-others.s3.us-east-2.amazonaws.com/footer_black/Invisible.png',
  'https://alfi-others.s3.us-east-2.amazonaws.com/footer_black/Datum.png',
  'https://alfi-others.s3.us-east-2.amazonaws.com/footer_black/Resurgir.png',
  'https://alfi-others.s3.us-east-2.amazonaws.com/footer_black/Amautas.png',
  'https://alfi-others.s3.us-east-2.amazonaws.com/footer_black/Openmind.png',
  'https://alfi-others.s3.us-east-2.amazonaws.com/footer_black/Arequipa+(1).png',
  'https://alfi-others.s3.us-east-2.amazonaws.com/footer_black/Casona.png',
  'https://alfi-others.s3.us-east-2.amazonaws.com/footer_black/USMP.png',
  'https://alfi-others.s3.us-east-2.amazonaws.com/footer_black/UAF.png',
]
export const logos_white = [
  'https://alfi-others.s3.us-east-2.amazonaws.com/footer_white/Studio92.png',
  'https://alfi-others.s3.us-east-2.amazonaws.com/footer_white/Corazo%CC%81n.png',
  'https://alfi-others.s3.us-east-2.amazonaws.com/footer_white/La+Zona.png',
  'https://alfi-others.s3.us-east-2.amazonaws.com/footer_white/Cara.png',
  'https://alfi-others.s3.us-east-2.amazonaws.com/footer_white/Patria+C.png',
  'https://alfi-others.s3.us-east-2.amazonaws.com/footer_white/Recambio.png',
  'https://alfi-others.s3.us-east-2.amazonaws.com/footer_white/Oranch.png',
  'https://alfi-others.s3.us-east-2.amazonaws.com/footer_white/Invisible.png',
  'https://alfi-others.s3.us-east-2.amazonaws.com/footer_white/Datum.png',
  'https://alfi-others.s3.us-east-2.amazonaws.com/footer_white/Resurgir.png',
  'https://alfi-others.s3.us-east-2.amazonaws.com/footer_white/Amautas.png',
  'https://alfi-others.s3.us-east-2.amazonaws.com/footer_white/Openmind.png',
  'https://alfi-others.s3.us-east-2.amazonaws.com/footer_white/Arequipa+(1).png',
  'https://alfi-others.s3.us-east-2.amazonaws.com/footer_white/Casona.png',
  'https://alfi-others.s3.us-east-2.amazonaws.com/footer_white/USMP.png',
  'https://alfi-others.s3.us-east-2.amazonaws.com/footer_white/UAF.png',
]