import { initializeApp, getApps, applicationDefault, getApp } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import { getAuth } from 'firebase-admin/auth';
import firebaseConfig from '../firebase-applet-config.json';

if (!getApps().length) {
  initializeApp({
    credential: applicationDefault(),
    projectId: firebaseConfig.projectId,
  });
}

export const adminDb = getFirestore(getApp(), firebaseConfig.firestoreDatabaseId);
export const adminAuth = getAuth(getApp());

