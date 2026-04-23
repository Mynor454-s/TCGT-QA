/**
 * Tipos compartidos para datos de prueba de clientes.
 * Refleja la estructura de data/data_new_client.json y data/data_new_client_TCJ.json.
 */

export interface ClienteAssets {
  templateRaw: string;
  bestImageTokenized: string;
  bestImage: string;
  videoS3?: {
    bucket: string;
    key: string;
  };
  urlVideo?: string;
}

export interface ClienteEmpresa {
  nombre: string;
  numero: string;
  puesto: string;
  tipoEmpresa: string;
  actividad: string;
  departamento?: string;
  municipio?: string;
  zona?: string;
  direccion?: string;
}

export interface ClienteNegocioPropio {
  nombreComercial: string;
  fechaInscripcion: string;  // DD/MM/YYYY
  giroNegocio: string;
  actividad: string;
  departamento?: string;
  municipio?: string;
  zona?: string;
  direccion?: string;
}

export interface ClienteTestData {
  // B2C credentials
  UsuarioB2C?: string;
  PasswordB2C?: string;

  // Identity
  dpi: string;
  tipoTarjeta?: 'MC' | 'VISA' | 'TCJ';

  // General data
  email: string;
  numeroCelular: string;
  nit: string;
  fechaInicioTrabajo: string;

  // Personalization
  Alias: string;
  cardColor?: string;
  opcionLealtad?: string;
  categorias?: string[];

  // Economic data
  IngresoMensual: string;
  GastoMensual: string;
  economicCheckboxes?: string[];

  // Conditional sections (pueden combinarse — según economicCheckboxes seleccionados)
  empresa?: ClienteEmpresa;              // "Trabajo en una empresa"
  negocioPropio?: ClienteNegocioPropio;  // "Tengo negocio propio"
  otrosIngresos?: { fuente?: string };   // "Percibo otros ingresos"

  // BEL
  bel?: {
    username?: string;
    compania?: 'Tigo' | 'Claro';
  };

  // Biometric assets
  assets: ClienteAssets;
}

/**
 * Constantes compartidas de configuración de tests.
 */
export const OFERTA_URL =
  process.env.OFFER_FORM_URL || 'https://qa-tarjetadigital.incubadorabi.com/cliente-digital/oferta';
