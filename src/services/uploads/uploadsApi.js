import { uploadFile } from "./uploadClient";

export const uploadsApi = {
  async uploadImage(file, { useMock = true } = {}) {
    const data = await uploadFile(file, { useMock });

    // project shape: { fileId, url }
    // When mocking, we only have a local preview URL.
    return { fileId: null, url: data?.url || "" };
  },
};
