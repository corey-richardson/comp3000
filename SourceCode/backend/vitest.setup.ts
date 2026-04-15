import { vi, beforeEach } from "vitest";

const mockPrisma = {
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
    $transaction: vi.fn((callback) => callback(mockPrisma)),
};
vi.mock("./lib/prisma", () => ({
    default: mockPrisma,
    prisma: mockPrisma,
}));

beforeEach(() => {
    vi.clearAllMocks();
});
