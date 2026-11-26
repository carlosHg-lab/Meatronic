import type { PdfDocument } from '../services/pdfLibrary';

/**
 * Catálogo de PDFs empaquetados dentro de la app.
 *
 * Para agregar un nuevo documento:
 *   1. Copia el archivo `.pdf` dentro de `src/assets/manuales/` o
 *      `src/assets/diagramas/` según corresponda.
 *   2. Agrega una entrada en el arreglo de la categoría correspondiente.
 *   3. Usa un `id` único, un `title` legible y `size: 0` (los PDFs incluidos
 *      no reportan un tamaño en disco).
 *
 * El `uri` debe ser la referencia estática devuelta por `require(...)`.
 */
export const BUNDLED_PDFS: Record<'manuales' | 'diagramas', PdfDocument[]> = {
  manuales: [
    {
      id: 'bundled-manuales-manual-4y',
      name: 'manual_4Y.pdf',
      title: 'Manual 4Y',
      uri: require('../assets/manuales/manual_4Y.pdf'),
      size: 0,
      category: 'manuales',
    },
    // Agrega aquí los nuevos manuales empaquetados, por ejemplo:
    // {
    //   id: 'bundled-manuales-otro-manual',
    //   name: 'otro_manual.pdf',
    //   title: 'Otro manual',
    //   uri: require('../assets/manuales/otro_manual.pdf'),
    //   size: 0,
    //   category: 'manuales',
    // },
  ],
  diagramas: [
    {
    id: 'bundled-diagramas-esquema-mazda6i',
       name: '2003 MAZDA 6 i SYSTEM WIRING DIAGRAMS.pdf',
       title: 'Esquema eléctrico Mazda 6 i',
       uri: require('../assets/diagramas/2003 MAZDA 6 i SYSTEM WIRING DIAGRAMS.pdf'),
       size: 0,
       category: 'diagramas',
     },
     {
    id: 'bundled-diagramas-esquema-mazda6i',
       name: '2003 MAZDA 6 i SYSTEM WIRING DIAGRAMS.pdf',
       title: 'Esquema eléctrico Mazda 6 i',
       uri: require('../assets/diagramas/2003 MAZDA 6 i SYSTEM WIRING DIAGRAMS.pdf'),
       size: 0,
       category: 'diagramas',
     },
     {
    id: 'bundled-diagramas-esquema-mazda6i',
       name: '2003 MAZDA 6 i SYSTEM WIRING DIAGRAMS.pdf',
       title: 'Esquema eléctrico Mazda 6 i',
       uri: require('../assets/diagramas/2003 MAZDA 6 i SYSTEM WIRING DIAGRAMS.pdf'),
       size: 0,
       category: 'diagramas',
     },
     {
    id: 'bundled-diagramas-esquema-mazda6i',
       name: '2003 MAZDA 6 i SYSTEM WIRING DIAGRAMS.pdf',
       title: 'Esquema eléctrico Mazda 6 i',
       uri: require('../assets/diagramas/2003 MAZDA 6 i SYSTEM WIRING DIAGRAMS.pdf'),
       size: 0,
       category: 'diagramas',
     },
    // Agrega aquí los nuevos diagramas empaquetados, por ejemplo:
    // {
    //   id: 'bundled-diagramas-esquema-electrico',
    //   name: 'esquema_electrico.pdf',
    //   title: 'Esquema eléctrico',
    //   uri: require('../assets/diagramas/esquema_electrico.pdf'),
    //   size: 0,
    //   category: 'diagramas',
    // },
  ],
};
