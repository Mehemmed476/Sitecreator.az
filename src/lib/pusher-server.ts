import Pusher from "pusher";

let pusherServer: Pusher | null | undefined;

export function isPusherConfigured() {
  return Boolean(
    process.env.PUSHER_APP_ID &&
      process.env.PUSHER_KEY &&
      process.env.PUSHER_SECRET &&
      process.env.PUSHER_CLUSTER
  );
}

export function getPusherServer() {
  if (!isPusherConfigured()) {
    return null;
  }

  if (pusherServer !== undefined) {
    return pusherServer;
  }

  pusherServer = new Pusher({
    appId: process.env.PUSHER_APP_ID!,
    key: process.env.PUSHER_KEY!,
    secret: process.env.PUSHER_SECRET!,
    cluster: process.env.PUSHER_CLUSTER!,
    useTLS: true,
  });

  return pusherServer;
}
