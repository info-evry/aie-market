import { PUT } from "../../../../api/product/[id]/route";
import { DELETE } from "../../../../api/product/[id]/route";

const VALID_ID = "cm58qpv3g000eu6xdj7o2n7d0"; //PLS BEFORE RUNNING THE TEST, CHECK IF THIS ID IS VALID
const VALID_ID_TO_DELETE = "cm58qpv3g000fu6xdapzmsa0r"; //PLS BEFORE RUNNING THE TEST, CHECK IF THIS ID IS VALID
const UNDEFINED_ID = "";

// Test case: Successfully restock a product (valid restock data)
it("should restock a product successfully with status 200", async () => {
    const requestObj = {
        json: async () => ({
            quantity: "150",
        }),
        url: "/product/" + VALID_ID,
    } as any;

    const response: any = await PUT(requestObj);
    const body = await response?.json();

    expect(response?.status).toBe(200);
    expect(body.message).toEqual("Le produit été modifié avec succès.");
});

// Test case: Invalid data (e.g., invalid quantity or other restock data)
it("should return Zod Error when input is not valid according to restockSchema with status 400", async () => {
    const requestObj = {
        json: async () => ({
            quantity: -10, // Invalid quantity
        }),
        url: "/product/" + VALID_ID, // Use a valid product ID for testing
    } as any;

    const response = await PUT(requestObj);
    const body = await response?.json();

    expect(response?.status).toBe(400);
    expect(body.message).toEqual("Zod Error");
    expect(body.more).toContain("quantity");
});

// Test case: Missing or invalid restock data (empty body)
it("should return Zod Error when body is missing or empty with status 418", async () => {
    const requestObj = {
        url: "/product/" + VALID_ID, // Use a valid product ID for testing
    } as any;

    const response = await PUT(requestObj);
    const body = await response?.json();

    expect(response?.status).toBe(418);
    expect(body.message).toContain("Aucune donnée envoyé à mettre à jour.");
});

//DELETE
// Test case: Successfully delete a product
it("should delete a product successfully with status 200", async () => {
    const requestObj = {
        url: "/product/" + VALID_ID_TO_DELETE, // Use a valid product ID for testing
    } as any;

    const response = await DELETE(requestObj);
    const body = await response?.json();

    expect(response?.status).toBe(200);
    expect(body.message).toEqual("Le produit a été supprimé avec succès.");
});

// Test case: Invalid product ID (non-existent or invalid)
it("should return Zod Error when the input product ID is invalid with status 400", async () => {
    const requestObj = {
        url: "/product/" + "invalid_id_test", // Invalid product ID
    } as any;

    const response = await DELETE(requestObj);
    const body = await response?.json();

    expect(response?.status).toBe(400);
    expect(body.message).toEqual("ID invalide");
});

// Test case: Missing product ID (empty URL or missing ID)
it("should return error when the product ID is missing with status 400", async () => {
    const requestObj = {
        url: "/product/" + UNDEFINED_ID, // Missing product ID
    } as any;

    const response = await DELETE(requestObj);
    const body = await response?.json();

    expect(response?.status).toBe(405);
    expect(body.message).toContain("Method Not Allowed");
});
