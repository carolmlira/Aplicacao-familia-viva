/**
 * Import function triggers from their respective submodules:
 *
 * import {onCall} from "firebase-functions/v2/https";
 * import {onDocumentWritten} from "firebase-functions/v2/firestore";
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

import * as functions from "firebase-functions";
import next from "next";

const app = next({ dev: false });
const handle = app.getRequestHandler();

const preparePromise = app.prepare();

export const nextSSR = functions.https.onRequest(async (req, res) => {
  await preparePromise; // aguarda a preparação uma vez
  await handle(req, res);
});
