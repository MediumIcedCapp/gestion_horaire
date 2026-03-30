import request from "supertest";
import { beforeEach, describe, expect, it, vi } from "vitest";

globalThis.process.env.NODE_ENV = "test";

const { mockQuery } = vi.hoisted(() => ({
  mockQuery: vi.fn()
}));

vi.mock("../connectionBaseDeDonnee/baseDeDonnees.js", () => ({
  default: {
    query: mockQuery
  }
}));

const { default: app } = await import("../connectionBaseDeDonnee/server.js");

const readQueryCall = (sql, params, callback) => {
  const actualParams = typeof params === "function" ? [] : params;
  const actualCallback = typeof params === "function" ? params : callback;
  return { sql, params: actualParams, callback: actualCallback };
};

describe("API professeurs", () => {
  beforeEach(() => {
    mockQuery.mockReset();
  });

  it("retourne la liste des professeurs sans filtre", async () => {
    mockQuery.mockImplementation((sql, params, callback) => {
      const queryCall = readQueryCall(sql, params, callback);
      expect(queryCall.sql).toContain("FROM module_gestion_professeur");
      expect(queryCall.params).toEqual([]);
      queryCall.callback(null, [
        {
          idProfesseur: 1,
          matricule: "1234567",
          nom: "Dupont",
          prenom: "Jean",
          specialite: "Math",
          disponibilite: "Disponible"
        }
      ]);
    });

    const response = await request(app).get("/api/professeurs");

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.count).toBe(1);
    expect(response.body.filters).toEqual({
      specialite: null,
      disponibilite: null
    });
  });

  it("applique les filtres de specialite et disponibilite", async () => {
    mockQuery.mockImplementation((sql, params, callback) => {
      const queryCall = readQueryCall(sql, params, callback);
      expect(queryCall.sql).toContain("specialite LIKE ?");
      expect(queryCall.sql).toContain("disponibilite = ?");
      expect(queryCall.params).toEqual(["%Math%", "Disponible"]);
      queryCall.callback(null, []);
    });

    const response = await request(app).get("/api/professeurs?specialite=Math&disponibilite=Disponible");

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.filters).toEqual({
      specialite: "Math",
      disponibilite: "Disponible"
    });
  });

  it("retourne 404 pour un professeur inexistant", async () => {
    mockQuery.mockImplementation((sql, params, callback) => {
      const queryCall = readQueryCall(sql, params, callback);
      expect(queryCall.params).toEqual(["999"]);
      queryCall.callback(null, []);
    });

    const response = await request(app).get("/api/professeurs/999");

    expect(response.status).toBe(404);
    expect(response.body.success).toBe(false);
  });

  it("retourne 400 si aucune donnee modifiable n est envoyee", async () => {
    const response = await request(app).put("/api/professeurs/1").send({});

    expect(response.status).toBe(400);
    expect(response.body.message).toContain("Aucune");
    expect(mockQuery).not.toHaveBeenCalled();
  });

  it("modifie un professeur existant", async () => {
    mockQuery
      .mockImplementationOnce((sql, params, callback) => {
        const queryCall = readQueryCall(sql, params, callback);
        expect(queryCall.sql).toContain("UPDATE module_gestion_professeur SET");
        expect(queryCall.params).toEqual(["7654321", "Martin", "Claire", "Physique", "Occupe", "4"]);
        queryCall.callback(null, { affectedRows: 1 });
      })
      .mockImplementationOnce((sql, params, callback) => {
        const queryCall = readQueryCall(sql, params, callback);
        expect(queryCall.sql).toContain("FROM module_gestion_professeur WHERE idProfesseur = ?");
        expect(queryCall.params).toEqual(["4"]);
        queryCall.callback(null, [
          {
            idProfesseur: 4,
            matricule: "7654321",
            nom: "Martin",
            prenom: "Claire",
            specialite: "Physique",
            disponibilite: "Occupe"
          }
        ]);
      });

    const response = await request(app).put("/api/professeurs/4").send({
      matricule: "7654321",
      nom: "Martin",
      prenom: "Claire",
      specialite: "Physique",
      disponibilite: "Occupe"
    });

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.data.specialite).toBe("Physique");
  });

  it("garde les filtres parametres pour une recherche malveillante", async () => {
    mockQuery.mockImplementation((sql, params, callback) => {
      const queryCall = readQueryCall(sql, params, callback);
      expect(queryCall.sql).toContain("specialite LIKE ?");
      expect(queryCall.params).toEqual(["%' OR 1=1 --%"]);
      queryCall.callback(null, []);
    });

    const response = await request(app).get("/api/professeurs?specialite=' OR 1=1 --");

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
  });
});
