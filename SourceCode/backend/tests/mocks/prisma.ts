import { vi } from "vitest";

const mockPrisma: any = {
    club: {
        create: vi.fn(),
        delete: vi.fn(),
        findMany: vi.fn(),
        findUnique: vi.fn(),
    },
    contact: {

    },
    invite: {
        updateMany: vi.fn(),
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
        findFirst: vi.fn(),
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
