import admin from 'firebase-admin';

const { FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL, FIREBASE_PRIVATE_KEY, FIREBASE_STORAGE_BUCKET } = process.env;

if (!FIREBASE_PROJECT_ID || !FIREBASE_CLIENT_EMAIL || !FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n') || !FIREBASE_STORAGE_BUCKET) {
  throw new Error('Firebase env variables are missing!');
}

// Инициализируем Firebase Admin SDK
admin.initializeApp({
  credential: admin.credential.cert({
    projectId: FIREBASE_PROJECT_ID,
    clientEmail: FIREBASE_CLIENT_EMAIL,
    privateKey: FIREBASE_PRIVATE_KEY,
  }),
  storageBucket: FIREBASE_STORAGE_BUCKET,
});

const bucket = admin.storage().bucket();

const uploadToFirebase = async (filePath: string, destination: string): Promise<string> => {
  await bucket.upload(filePath, {
    destination,
    metadata: {
      cacheControl: 'public, max-age=31536000',
    },
  });

  await bucket.file(destination).makePublic();

  return `https://storage.googleapis.com/${bucket.name}/${destination}`;
};

export default uploadToFirebase;
