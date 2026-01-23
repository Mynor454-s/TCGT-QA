import * as fs from 'fs';
import * as path from 'path';

/**
 * Utilidad para ejecutar tests basados en la test-matrix.json
 * Permite data-driven testing sin hardcodear datos en los tests
 */

interface TestScenario {
  id: string;
  name: string;
  priority: string;
  file: string;
  dataProvider?: string;
  tags?: string[];
  estimatedTime?: string;
  browsers?: string[];
  status: string;
  notes?: string;
}

interface TestDataConfig {
  filePath: string;
  key: string;
}

/**
 * Lee la test-matrix.json
 */
export function getTestMatrix() {
  const matrixPath = path.join(process.cwd(), 'data', 'test-matrix.json');
  const matrixContent = fs.readFileSync(matrixPath, 'utf-8');
  return JSON.parse(matrixContent);
}

/**
 * Obtiene todos los escenarios de una categoría específica
 * @param category - e2e-flows, validations, economic-combinations, etc.
 */
export function getScenariosByCategory(category: string): TestScenario[] {
  const matrix = getTestMatrix();
  return matrix.scenarios[category]?.scenarios || [];
}

/**
 * Obtiene un escenario específico por su ID
 * @param scenarioId - E2E-001, VAL-001, etc.
 */
export function getScenarioById(scenarioId: string): TestScenario | null {
  const matrix = getTestMatrix();
  
  for (const category of Object.values(matrix.scenarios)) {
    const scenario = (category as any).scenarios?.find((s: TestScenario) => s.id === scenarioId);
    if (scenario) return scenario;
  }
  
  return null;
}

/**
 * Parsea el dataProvider string y obtiene los datos
 * @param dataProvider - Formato: "data/data_new_client.json:cliente1"
 */
function parseDataProvider(dataProvider: string): TestDataConfig {
  const [filePath, key] = dataProvider.split(':');
  return { filePath, key };
}

/**
 * Carga los datos de un dataProvider
 * @param dataProvider - String en formato "path/to/file.json:key"
 * @returns Los datos específicos del key
 */
export function loadTestData(dataProvider: string): any {
  const { filePath, key } = parseDataProvider(dataProvider);
  const fullPath = path.join(process.cwd(), filePath);
  
  if (!fs.existsSync(fullPath)) {
    throw new Error(`Data file not found: ${fullPath}`);
  }
  
  const fileContent = fs.readFileSync(fullPath, 'utf-8');
  const data = JSON.parse(fileContent);
  
  if (key) {
    if (!(key in data)) {
      throw new Error(`Key "${key}" not found in ${filePath}`);
    }
    return data[key];
  }
  
  return data;
}

/**
 * Obtiene todos los datasets configurados para un escenario
 * Permite ejecutar el mismo test con múltiples conjuntos de datos
 * @param scenarioId - ID del escenario (E2E-001, VAL-001, etc.)
 * @returns Array de objetos con nombre y datos
 */
export function getTestDatasets(scenarioId: string): Array<{ name: string, data: any }> {
  const scenario = getScenarioById(scenarioId);
  
  if (!scenario) {
    throw new Error(`Scenario not found: ${scenarioId}`);
  }
  
  if (!scenario.dataProvider) {
    return [{ name: 'default', data: {} }];
  }
  
  // Si el dataProvider usa *, cargar todos los datasets del archivo
  if (scenario.dataProvider.includes('*')) {
    const { filePath } = parseDataProvider(scenario.dataProvider.replace('*', ''));
    const fullPath = path.join(process.cwd(), filePath);
    const fileContent = fs.readFileSync(fullPath, 'utf-8');
    const allData = JSON.parse(fileContent);
    
    // Convertir el objeto en array de datasets
    return Object.keys(allData).map(key => ({
      name: key,
      data: allData[key]
    }));
  }
  
  // dataProvider específico
  const data = loadTestData(scenario.dataProvider);
  const dataKey = scenario.dataProvider.split(':')[1] || 'default';
  
  return [{ name: dataKey, data }];
}

/**
 * Filtra escenarios por tags
 * @param tags - Array de tags a filtrar (e.g., ['@smoke', '@P0'])
 */
export function getScenariosByTags(tags: string[]): TestScenario[] {
  const matrix = getTestMatrix();
  const allScenarios: TestScenario[] = [];
  
  for (const category of Object.values(matrix.scenarios)) {
    const scenarios = (category as any).scenarios || [];
    allScenarios.push(...scenarios);
  }
  
  return allScenarios.filter(scenario => 
    scenario.tags?.some(tag => tags.includes(tag))
  );
}

/**
 * Obtiene escenarios por prioridad
 * @param priorities - Array de prioridades (e.g., ['P0', 'P1'])
 */
export function getScenariosByPriority(priorities: string[]): TestScenario[] {
  const matrix = getTestMatrix();
  const allScenarios: TestScenario[] = [];
  
  for (const category of Object.values(matrix.scenarios)) {
    const scenarios = (category as any).scenarios || [];
    allScenarios.push(...scenarios);
  }
  
  return allScenarios.filter(scenario => 
    priorities.includes(scenario.priority)
  );
}
