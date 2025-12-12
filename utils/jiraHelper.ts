import { request } from '@playwright/test';

/**
 * Actualiza el estado de un test run en Jira mediante GraphQL
 * @param testRunId ID del test run en Jira
 * @param status Estado del test: "TODO" | "EXECUTING" | "PASSED" | "FAILED" | "ABORTED"
 * @param jiraUrl URL base de tu instancia de Jira
 * @param authToken Token de autenticación para Jira
 */
export async function updateJiraTestStatus(
  testRunId: string,
  status: 'TODO' | 'EXECUTING' | 'PASSED' | 'FAILED' | 'ABORTED',
  jiraUrl: string,
  authToken: string
) {
  const apiContext = await request.newContext();
  
  const query = `
    mutation {
      updateTestRunStatus(
        id: "${testRunId}",
        status: "${status}"
      )
    }
  `;

  try {
    const response = await apiContext.post(`${jiraUrl}/graphql`, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authToken}`
      },
      data: {
        query
      }
    });

    if (!response.ok()) {
      console.error(`Error actualizando Jira: ${response.status()} ${response.statusText()}`);
      const errorBody = await response.text();
      console.error(`Response body: ${errorBody}`);
    } else {
      console.log(`✅ Estado de test actualizado en Jira: ${status}`);
    }
  } catch (error) {
    console.error(`Error al actualizar estado en Jira:`, error);
  } finally {
    await apiContext.dispose();
  }
}
