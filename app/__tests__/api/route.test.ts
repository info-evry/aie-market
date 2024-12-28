import { GET, POST } from "../../api/product/route";
//GET
it("should return data between 1 & 3 with status 200", async () => {
    const requestObj = {
        nextUrl: {
            searchParams: new URLSearchParams({ page: "1", limit: "3" }),
        },
    } as any;

    const response = await GET(requestObj);
    const body = await response?.json();

    expect(response?.status).toBe(200);
    expect(body.message).toEqual(
        "Les produits entre la page 1 et 3 ont été récupérés avec succès.",
    );
});

it("should return all data when parameter are invalid with status 200", async () => {
    const requestObj = {
        nextUrl: {
            searchParams: new URLSearchParams({ page: "-1", limit: "0" }),
        },
    } as any;

    const response = await GET(requestObj);
    const body = await response?.json();

    expect(response?.status).toBe(200);
    expect(body.message).toEqual("Tout les produits ont été récupérés avec succès.");
});
//POST
it("should return added data with status 201", async () => {
    const requestObj = {
        json: async () => ({
            title: "Awesome Product",
            description: "This is a detailed description of the Awesome Product.",
            priceMember: 99,
            priceExternal: 119,
            customFields: {
                color: "red",
                size: "L",
            },
            quantity: "100",
            category: "Electronics",
            isExclusiveToStudents: true,
            isExternal: false,
            isActive: true,
            image: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAoAAAAHgCAQAAABtT4D4AAEAAElEQVR4nOzdd2gU1b7H8X/yXbs7bQZtbeRS1JlVS9QJuxIjQwsYsfo8sUlIqbpzMSPfbMbOChP4z0NhpyeQmxkExVGw9Ep05Yw92LC4OqHlbjqlKxOzhQ6jVQZs35sBxN1q6V0OuvS+dTVuk3aPe93z/ePt5PskzwyznBdMhLOnvH8Lz9EC6jRHUEpzN2IAyZjhe1X9pMAw28+nwaY9E04c3buPszwWbSO9P2dVwiCg5jdpglmfIu1im2rLo7boYBoRhI+M4xblsdFxleQUwdgGi9PtmzgdntWYNq6gZGg5G0m9on6kpGpHnG4kBy4Prb1sMtLh2zHVKrzQ9Goea+Xb5TpMDtmhJYc87XeU9rdsQgJpZDLx9Wp49mHEmzEuN7Diq0XY9cNoioNO3NfZQXrUoMe/vw+Gs1aEz9tK0JvH5xlq+oyqjJ7By7X9/t9XYzIZctq9JYZhPb88WZXK9Qnk9OeF62wFls3OS0MtMRk5qctmC+EzJYY8CwXY9Mc7K8iZV2m1IX2fI0Qh+1usf2vDZgW6aUJjBwsjbWVhLByrB5wXgnPE3gtqqYm1ZhDE2drqvXOfj5CINkTTdVVXxUcwzm72Yhd8rR2nsxNiL5esfgGoNc7bT1ZXz5wKLuwm3rf+1ybg4vmgrctIhwnIwi7TY5FXv5YkAOr11z0wOEKdtq5dA5RGXKqFiG8m9UOq91K5woxfg6FT8f9m06AX2pmN+IHiRIrVZoWgLgS3oAE6wAh9gj1YPzRHz7x5oOHBqFjj5zB6n2gS6X6bKN4TohJb1F3lYwGs1fm5bfak/WpxHhnoHK2z6u2Iqa6pNjqx+Eq+nwl0hJAw4TbTP8ytKjWWq+lekgGF+wr0EBYfF5slU+MGsKl2tV9w6PY0q2GoYdzCJEXGJS3npgJlpn2Dh2+aF76FwMLPdxkw9eAYWoOcbjMB0cbIMj8KUnmNEtvMLd5uJSruNm7U5z2uLRdPphHkWxzvqf6t/oGbDjpAbSx5Zx2KHNddLssErZyfs04EuB5wbNeZq1MbcIapPZzxqgM0QyK/JdxCw5tbN9n0HhqxIdRzdf7V5xtu3k7IwrwzCvYyKHkaM1dzUg6zOOpkLdr9GNOio/qNlAqkjT0lEXNll6JmFc66Jkxa/g7klF93xJbe4TYozTaW12ZWtKL1wH5D1Qsw8v0M2jdxOHpoXjtKYym+PhVmJdw+hA2tHZyIdkp+LnTYX31A2GpHhETB8d0ubVyytsSOVfFq5uTWUgEjHp80Tn9yMLvjAFmS6knivfWQeHZJgR9whQdTgK2t8qq2hd47cmwVZcFGFkUvvGkgAAw7LMWBszZC5F1ST9tKvFwkh5CBX2cWVzvauzRl78XfuP74PvhpZTbW1r2Ex6S7sF4sfnTByZLhWMRdTw9OXUBjlCmczPRre2+Owl9z9huxpycfOsXwR3LnHvxtWGfKlNbt5CIM3wDPn4cTB+Z4gPCpjAcz7Ds6gVtiHnX9/mYKnNgsdRZLwwde7s71YgbP2ksYvg82Flxg5wNmnrlAFVnH+xrK61QwDdoVfjwA99lE9t7Ak5XTg2z2XfPofB6h9ubhkeAoe/fh1BYk7C8xlnc7N6OwBwAAAA==",
            deletedAt: null,
        }),
    } as any;

    const response = await POST(requestObj);
    const body = await response?.json();
    expect(response?.status).toBe(201);
    expect(body.message).toEqual("Le produit a été créé avec succès.");
});
it("should return Zod Error when input is not validate by zod schema with status 400", async () => {
    const requestObj = {
        json: async () => ({
            title: "",
            description: "This is a detailed description of the Awesome Product.",
            priceMember: 99,
            priceExternal: 119,
            customFields: {
                color: "red",
                size: "L",
            },
            quantity: "100",
            category: "Electronics",
            isExclusiveToStudents: true,
            isExternal: false,
            isActive: true,
            image: "data:image/png;base64,invalid",
            deletedAt: null,
        }),
    } as any;

    const response = await POST(requestObj);
    const body = await response?.json();
    expect(body.message).toEqual("Zod Error");
    expect(response?.status).toBe(400);
});
