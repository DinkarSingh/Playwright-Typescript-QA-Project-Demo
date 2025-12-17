import { test as base, request } from '@playwright/test';
import { defaultData } from '../data/default';
import fs from 'fs';

export const test = base.extend<{ user: { login: () => Promise<void> } }>({
  user: async ({}, use) => {
    const login = async () => {
      const apiRequest = await request.newContext();
      const baseURL = defaultData.uibaseURL[0].baseURL;
      const loginPageUrl = `${baseURL}/login`;

      try {
        // Step 1: Get CSRF token from login page
        const getResponse = await apiRequest.get(loginPageUrl);
        if (!getResponse.ok()) {
          throw new Error(`Failed to load login page: ${getResponse.status()}`);
        }
        
        const html = await getResponse.text();
        const csrfMatch = html.match(/name=['"]csrfmiddlewaretoken['"] value=['"]([^'"]+)['"]/);
        if (!csrfMatch) {
          throw new Error("CSRF token not found in login page");
        }
        const csrfToken = csrfMatch[1];

        // Step 2: Login with proper headers and CSRF token
        const response = await apiRequest.post(loginPageUrl, {
          form: {
            csrfmiddlewaretoken: csrfToken,
            email: defaultData.userCredentials[0].email,
            password: defaultData.userCredentials[0].password,
          },
          headers: {
            'Referer': loginPageUrl,
            'Origin': baseURL,
          }
        });

        if (!response.ok()) {
          const errorText = await response.text();
          throw new Error(`Login request failed: ${response.status()} ${errorText}`);
        }

        // Step 3: Save session state
        await apiRequest.storageState({ path: "auth/storageState.json" });
        console.log("Login successful, storage state saved");
        
      } catch (error) {
        console.error("Login failed:", error);
        throw error;
      } finally {
        await apiRequest.dispose();
      }
    };

    await use({ login });
  },
});

export { expect } from '@playwright/test';