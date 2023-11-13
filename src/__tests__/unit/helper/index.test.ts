import { test, expect, describe, vi, afterEach } from "vitest";
import {
  authenticateAndGetCompany,
  getCreateDocumentDefaultData,
  getUpdateDocumentDefaultData,
} from "../../../helper.mjs";
import { findOne } from "../../../mongoClient.mjs";
import { COLLECTIONS } from "../../../consts.mjs";

vi.mock("../../../mongoClient.mjs", () => ({
  findOne: vi.fn()
}));

describe("Helper", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  test("getCreateDocumentDefaultData", async () => {
    const result = getCreateDocumentDefaultData();
    expect(result.createdAt.$date).toBeInstanceOf(Date);
    expect(result.createdAt.$date.toISOString() <= (new Date()).toISOString()).toBe(true);
    expect(result.updatedAt.$date).toBeInstanceOf(Date);
    expect(result.updatedAt.$date.toISOString() <= (new Date()).toISOString()).toBe(true);
    expect(result.deleted).toBe(false);
  });

  test("getUpdateDocumentDefaultData", async () => {
    const result = getUpdateDocumentDefaultData();
    expect(result.updatedAt.$date).toBeInstanceOf(Date);
    expect(result.updatedAt.$date.toISOString() <= (new Date()).toISOString()).toBe(true);
  });

  test("authenticateAndGetCompany", async () => {
    const apiToken = "a6bb0d37-0fab-424e-9300-cf0bd3d6d685";
    const companyId = "654889031d503a0da8fc26dc"
    // @ts-ignore
    findOne.mockImplementation(() => ({
      _id: companyId
    }));

    const authenticatedCompany = await authenticateAndGetCompany(apiToken);
    expect(findOne).toHaveBeenCalledWith(
      {
        collection: COLLECTIONS.companies, filter: { apiToken },
        projection: { _id: 1, name: 1 }
      }
    );
    expect(authenticatedCompany).toStrictEqual({ _id: companyId });
  });
});