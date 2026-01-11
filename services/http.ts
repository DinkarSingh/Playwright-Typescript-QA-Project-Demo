import axios, { AxiosInstance, AxiosResponse } from "axios";
import { StatusCodes } from "http-status-codes";
import { defaultData } from "../data/default";

function getHttpInstance(): AxiosInstance {
  const instance = axios.create({
    baseURL: defaultData.publicAPIbaseURL[0].baseURL,
    headers: {
      "Content-Type": "application/json",
    },
  });
  return instance;
}

export async function httpRequest<T>({
  method,
  resource,
  data,
  auth,
  validateStatus = (status) =>
    status >= StatusCodes.OK && status < StatusCodes.MULTIPLE_CHOICES,
}: {
  method: "GET" | "POST" | "PUT" | "DELETE" | "PATCH";
  resource: string;
  data?: any;
  auth?: { email: string; password: string };
  validateStatus?: (status: number) => boolean;
}): Promise<AxiosResponse<T, unknown>> {
  const response = await getHttpInstance().request<T>({
    method,
    url: resource,
    data,
    auth: auth
      ? {
          username: auth.email,
          password: auth.password,
        }
      : undefined,
    validateStatus,
  });
  return response;
}
