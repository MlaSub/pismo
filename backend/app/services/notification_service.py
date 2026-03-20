import json
import logging
import urllib.parse
import urllib.request

EXPO_PUSH_URL = "https://exp.host/--/api/v2/push/send"


def send_push_notification(push_token: str, title: str, body: str, data: dict) -> None:
    payload = json.dumps(
        {
            "to": push_token,
            "title": title,
            "body": body,
            "data": data,
            "sound": "default",
        }
    ).encode("utf-8")

    if urllib.parse.urlparse(EXPO_PUSH_URL).scheme != "https":
        logging.error("Expo push URL must use HTTPS")
        return

    request = urllib.request.Request(  # noqa: S310
        EXPO_PUSH_URL,
        data=payload,
        headers={"Content-Type": "application/json", "Accept": "application/json"},
        method="POST",
    )

    try:
        with urllib.request.urlopen(request, timeout=10) as response:  # noqa: S310
            result = response.read().decode("utf-8")
            logging.info(f"Expo push response: {result}")
    except Exception as e:
        logging.error(f"Failed to send push notification: {e}")
