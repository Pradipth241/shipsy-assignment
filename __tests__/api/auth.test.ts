// __tests__/api/auth.test.ts
import { createMocks } from 'node-mocks-http';
import loginHandler from '@/pages/api/auth/login';
import prisma from '@/lib/prisma';
import bcrypt from 'bcryptjs';

// --- THE FIX IS HERE ---
// We provide a factory function to jest.mock to create a custom mock structure.
jest.mock('@/lib/prisma', () => ({
  __esModule: true, // This is important for modules with default exports
  default: {
    user: {
      findUnique: jest.fn(),
      create: jest.fn(),
      // Add other methods you might need to mock here
    },
  },
}));

// We also mock the bcryptjs module
jest.mock('bcryptjs');

describe('/api/auth/login', () => {
  // Before each test, reset the mocks to ensure tests are isolated
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should return 401 if password is incorrect', async () => {
    // 1. Setup the mocks
    // Now we cast the imported prisma module's methods to jest.Mock
    const mockedPrismaUserFindUnique = prisma.user.findUnique as jest.Mock;
    const mockedBcryptCompare = bcrypt.compare as jest.Mock;
    
    // Mock Prisma to "find" a user
    mockedPrismaUserFindUnique.mockResolvedValue({
      id: 'user-1',
      username: 'testuser',
      password: 'hashedpassword',
    });

    // Mock bcrypt to return `false` (passwords do not match)
    mockedBcryptCompare.mockResolvedValue(false);

    // 2. Create mock request and response
    const { req, res } = createMocks({
      method: 'POST',
      body: {
        username: 'testuser',
        password: 'wrongpassword',
      },
    });

    // 3. Call the handler
    await loginHandler(req, res);

    // 4. Assert the results
    expect(res._getStatusCode()).toBe(401);
    expect(JSON.parse(res._getData())).toEqual(
      expect.objectContaining({ message: 'Invalid credentials' })
    );
  });

  // Example of another test
  it('should return 401 if user is not found', async () => {
    const mockedPrismaUserFindUnique = prisma.user.findUnique as jest.Mock;
    
    // Mock Prisma to return null (user not found)
    mockedPrismaUserFindUnique.mockResolvedValue(null);

    const { req, res } = createMocks({
      method: 'POST',
      body: { username: 'nonexistentuser', password: 'password' },
    });

    await loginHandler(req, res);

    expect(res._getStatusCode()).toBe(401);
  });
});