import * as admin from 'firebase-admin';

const serviceAccount = {
  type: 'service_account',
  project_id: 'familia-viva-recife',
  private_key_id: 'd7800a47bdc0c850baa8be0541c3d592f719c0c4',
  private_key:
    '-----BEGIN PRIVATE KEY-----\nMIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQDZNNefVsHKiLLe\nDMBbqNsVgU8K+QBhF/+P8Dpcl7/tn1aB1Y/Ds3xE4oo8edoCQJKQQLdafEvSSei3\nX5/IM2R0/EfCNef3aGce0/QSDSWHA4dAJ6fUq8A8w6EycLvjzYWlKrx/WWIaf2Tr\ntamCom55BEWaxldLN0cz6amF1yCwh/eEIoPhyU4OC4kwFiq6i7SfTaMArgnGJxZL\ndOjaLylfYGQP2Il4mEkxieGnGUNvkA5yjBY/Do9KmU/6h5V6+W2DmRDponWVOoSW\noN13P8FfrgArnnKXEggJ55SktT8CMYN8KWqBkcDzrB+TS4BCI93bMOgtFOv9V7Qj\nC2nUpGZHAgMBAAECggEAHfLfnt8V02OWfhrLVG1rioM3hITMHOxz1sNB2M3XrzT0\nIZdyaNfQ/6fYyvk7f79Vi2xQ8Q9ds6jF3LA5AMq37uVwzizOnNoZYIfLCcjO7tck\nCUrZJPAVjotO06dK+4sKrWO/dTO8MiPJ+jIkeu2t8SO5+9rzOFzD2uWR8/FeAYOi\nKTdQROOCfKZvvpI/l0bn9Ko/0lewH7wEWURDA4DU15El6Zm/tLq6gyHSla6MmQb9\nRleap7KLLdU/3J/Dwx4PvehOnuleDwrchHqT3rbywELhfeVnnCONCNDebCQj+LHY\nlLCh1QVDgYDIS5GyGM5n+qdG1IvTfWJvrIeWOd7n2QKBgQDwg86DiW5+vDtK1Ec6\nVLvx5D01uIogMHRBdNwx5MDp+TupqQPQhwQ7xw0INbYTDn1Vq6Ig2TLkNu1peJoA\novh1+cA/n7MKErIe5DDgREHBbooywB1fL+JpES5m8kfA3IXT9mjHD0HAmzuzrh6i\nChMAaFM0iTkR7TtGD1HCf7uZRQKBgQDnMNzs/W5PJlkMO6nScobyHsVRy1df/hTZ\n4ebekiDxqNBY+08b7y1GA5LtMY5WUz2pX/wXBGM2WKSg1B1fbRAPuUn7MTZ90+1o\nDFhQakwyTCV/8YlmYqYN/wZaMZ0hnckwNfgOYi43jGqqrv+8/hQvjC0pz1FCk3hj\nQ++EGrwMGwKBgQDrhwfLA+Byt34Qz0RZOPU78diHLQoGb6zJFNk0+uB3v5vPjzWv\nFSjuKQT4DzEYBE50gLkqFciid6+SY4ncKbvKPCMpqwg3Swum+KtsUytZcxhejoe0\n2T2Mykh4g7YEhW+AnIMKvEQVi26xjEdvQxJMid1BS0fZ6EjtWL8mCtP5SQKBgQDJ\nKPsSOnGA7R0OR9u8AWrpwVxvjz63h50c+DKp9vwzSW///KsY40PBZ9qwCC6Rblx4\nw8vVOzwYTYjxZ58nKP6Qr+hvaKLBWWV440T0s4kZOqhmawPi0nMqOnyMfh764Q/t\nowfze/o62zL00NA04d8ugAnMF1fdVfOqa7I8gAafgQKBgBsRvUpSVvUojxzKTJxN\nZ7r7xS9E1WkjaN4dxoop3nIHl8x1MG55JnZesPUAkVhVRgYj5Ko9Z4EGKj4S0l1T\n5OTfrvNw9zVX+7akFxogvCmGR6JbQ7lbut/Hkxix4K7wIkSYgmJtXKK20ha65i2V\neRiPclxVM06UXwIYX5zycSaG\n-----END PRIVATE KEY-----\n',
  client_email:
    'firebase-adminsdk-fbsvc@familia-viva-recife.iam.gserviceaccount.com',
  client_id: '115462661536327032104',
  auth_uri: 'https://accounts.google.com/o/oauth2/auth',
  token_uri: 'https://oauth2.googleapis.com/token',
  uth_provider_x509_cert_url: 'https://www.googleapis.com/oauth2/v1/certs',
  client_x509_cert_url:
    'https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-fbsvc%40familia-viva-recife.iam.gserviceaccount.com',
  universe_domain: 'googleapis.com',
};

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount as admin.ServiceAccount),
    databaseURL: 'https://familia-viva-recife-default-rtdb.firebaseio.com',
    storageBucket: 'familia-viva-recife.firebasestorage.app',
  });
}

const firestore = admin.firestore();
const realtimeDB = admin.database();
const storage = admin.storage();

export { admin, firestore, realtimeDB, storage };
