import dotenv from 'dotenv';
dotenv.config();

/**
 * Validates required and optional environment variables.
 * If any critical required variables are missing, prints a detailed error and exits the process.
 */
export function validateEnv() {
  const required = [
    { key: 'MONGODB_URI', description: 'The connection string for the MongoDB database.' },
    { key: 'JWT_SECRET', description: 'The secret key used to sign and verify JSON Web Tokens.' }
  ];

  const missingRequired = [];
  for (const env of required) {
    if (!process.env[env.key]) {
      missingRequired.push(env);
    }
  }

  if (missingRequired.length > 0) {
    console.error('\n❌ CRITICAL ERROR: Missing required environment variables on startup!\n');
    missingRequired.forEach((env) => {
      console.error(`   - ${env.key}: ${env.description}`);
    });
    console.error('\nPlease check your .env file or host configuration, set these variables, and restart the server.\n');
    process.exit(1);
  }

  // Check optional Cloudinary variables
  const cloudinaryKeys = ['CLOUDINARY_CLOUD_NAME', 'CLOUDINARY_API_KEY', 'CLOUDINARY_API_SECRET'];
  const missingCloudinary = cloudinaryKeys.filter(key => !process.env[key]);

  if (missingCloudinary.length > 0) {
    console.warn('\n⚠️ WARNING: Cloudinary credentials are not fully configured.');
    console.warn(`   Missing: ${missingCloudinary.join(', ')}`);
    console.warn('   File uploads will default to local ephemeral storage. NOTE: Uploaded files will be lost on container restart.\n');
  } else {
    console.log('✓ Cloudinary configurations validated. Remote file storage is enabled.');
  }

  console.log('✓ Required environment variables validated.');
}
