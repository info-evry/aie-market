import { faker } from "@faker-js/faker";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function createFakeUser() {
    return await prisma.user.create({
        data: {
            email: faker.internet.email(),
            name: faker.person.fullName(),
            emailVerifiedAt: new Date(),
            studentId: faker.number.int({ min: 0, max: 9999999 }).toString(),
            role: faker.helpers.arrayElement(["STUDENT", "EXTERNAL", "MEMBER", "ADMIN", "BOARD"]),
            azureAdId: null,
            githubId: null,
            googleId: null,
            stripeCustomerId: null,
        },
    });
}

async function createFakeProduct() {
    return await prisma.product.create({
        data: {
            title: faker.commerce.productName(),
            description: faker.commerce.productDescription(),
            priceExternal: faker.number.int({ min: 0, max: 9999 }),
            priceMember: faker.number.int({ min: 0, max: 9999 }),
            quantity: faker.number.int({ min: 0, max: 500 }),
            category: faker.helpers.arrayElement(["Cafe", "Chocolat"]),
            createdAt: new Date(),
            customFields: {},
            deletedAt: null,
            image: Buffer.from(
                faker.image.dataUri({ width: 200, height: 200, type: "svg-base64" }),
            ),
            isActive: faker.datatype.boolean(),
            isExclusiveToStudents: faker.datatype.boolean(),
            isExternal: faker.datatype.boolean(),
            packageId: null,
        },
    });
}

async function createFakeOrder(userId: string, productIds: string[]) {
    return await prisma.order.create({
        data: {
            userId,
            createdAt: new Date(),
            updatedAt: new Date(),
            Transaction: {
                create: {
                    amount: faker.number.int({ min: 0, max: 9999 }),
                    checkoutSessionId: faker.string.uuid(),
                    status: faker.helpers.arrayElement(["EXPIRED", "SUCCEEDED", "PENDING"]),
                },
            },
            products: {
                createMany: {
                    data: productIds.map((id) => ({ productId: id, quantity: 1 })),
                },
            },
        },
    });
}

async function main() {
    const users = await Promise.all(Array.from({ length: 10 }).map(() => createFakeUser()));
    const products = await Promise.all(Array.from({ length: 10 }).map(() => createFakeProduct()));
    const productIds = products.map((product) => product.id);
    const orders = await Promise.all(
        Array.from({ length: 10 }).map(() =>
            createFakeOrder(faker.helpers.arrayElement(users).id, productIds),
        ),
    );
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
