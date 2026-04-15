import { vi } from "vitest";

const mockPrisma: any = {
    club: {
        create: vi.fn(),
        findMany: vi.fn(),
        findUnique: vi.fn(),
    },
    contact: {

    },
    invite: {

    },
    membership: {
        findUnique: vi.fn(),
        findFirst: vi.fn(),
        findMany: vi.fn(),
        create: vi.fn(),
        update: vi.fn(),
        delete: vi.fn(),
        count: vi.fn(),
    },
    profile: {
        create: vi.fn(),
        delete: vi.fn(),
        findMany: vi.fn(),
        findUnique: vi.fn(),
        update: vi.fn()
    },
    score: {

    },
    $transaction: vi.fn(async (callback) => callback(mockPrisma)),
};

vi.mock("../../lib/prisma", () => ({
    default: mockPrisma
}));
