import { httpRequest } from "./http";
import { StatusCodes } from "http-status-codes";

export interface CreateArticleRequest {
  article: {
    title: string;
    description: string;
    body: string;
    tagList: string[];
  };
}

export interface CreateArticleResponse {
  slug: string;
  title: string;
  description: string;
  body: string;
  tagList: string[];
  [key: string]: any;
}

export async function createArticle(
  title: string,
  description: string,
  body: string,
  tagList: string[],
  token: string,
): Promise<string> {
  const payload: CreateArticleRequest = {
    article: {
      title,
      description,
      body,
      tagList,
    },
  };

  const { data, status } = await httpRequest<CreateArticleResponse>({
    method: "POST",
    resource: "/articles/",
    data: payload,
    token: token,
  });

  if (status !== StatusCodes.OK && status !== StatusCodes.CREATED) {
    throw new Error(`Failed to create article. Status code: ${status}`);
  }

  const slug = data.slug || data.article?.slug;

  if (!slug) {
    console.error("❌ No slug found in response:", data);
    throw new Error("Article created but no slug returned in response");
  }

  return slug;
}

export async function deleteArticle(
  slug: string,
  token: string,
): Promise<void> {
  const { status } = await httpRequest({
    method: "DELETE",
    resource: `/articles/${slug}`,
    token: token,
  });

  if (status !== StatusCodes.NO_CONTENT) {
    throw new Error(`Failed to delete article. Status code: ${status}`);
  }
}
