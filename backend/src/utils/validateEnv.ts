import { z } from 'zod';

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  PORT: z.string().default('5000'),
  DATABASE_URL: z.string().url(),
  JWT_SECRET: z.string().min(32),
  CLOUDFLARE_R2_BUCKET: z.string(),
  CORS_ORIGIN: z.string().default('http://localhost:3000'),
});

export const validateEnv = () => {
  try {
    envSchema.parse(process.env);
    console.log('✅ Environment variables validated');
  } catch (error) {
    if (error instanceof z.ZodError) {
      const missingVars = error.errors.map((e) => e.path.join('.'));
      console.error('❌ Missing or invalid environment variables:', missingVars);
      throw new Error(`Invalid environment configuration: ${missingVars.join(', ')}`);
    }
    throw error;
  }
};
