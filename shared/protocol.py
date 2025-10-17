"""
protocol.py
Định nghĩa cấu trúc dữ liệu và các loại tin nhắn
được sử dụng để giao tiếp giữa Client và Server
trong mini game Kéo – Búa – Bao.
"""

# ======================================
# 🎮 Các lựa chọn trong game
# ======================================
ROCK = "rock"
PAPER = "paper"
SCISSORS = "scissors"
CHOICES = [ROCK, PAPER, SCISSORS]

# ======================================
# 📨 Các loại tin nhắn (Message Types)
# ======================================
# --- Client → Server ---
MSG_CREATE_ROOM = "create_room"         # Tạo phòng mới
MSG_JOIN_ROOM = "join_room"             # Tham gia phòng
MSG_LEAVE_ROOM = "leave_room"           # Rời phòng
MSG_PLAYER_CHOICE = "player_choice"     # Gửi lựa chọn (kéo/búa/bao)
MSG_CHAT = "chat_message"               # Gửi tin nhắn chat
MSG_SET_AVATAR = "set_avatar"           # Chọn avatar
MSG_SEND_STICKER = "send_sticker"       # Gửi sticker

# --- Server → Client ---
MSG_ROOM_CREATED = "room_created"       # Phòng được tạo thành công
MSG_JOIN_SUCCESS = "join_success"       # Vào phòng thành công
MSG_PLAYER_JOINED = "player_joined"     # Có người mới vào phòng
MSG_PLAYER_LEFT = "player_left"         # Có người rời phòng
MSG_GAME_START = "game_start"           # Bắt đầu ván đấu
MSG_GAME_UPDATE = "game_update"         # Cập nhật trạng thái game
MSG_ROUND_RESULT = "round_result"       # Kết quả một vòng đấu
MSG_CHAT_BROADCAST = "chat_broadcast"   # Phát tin nhắn chat tới tất cả
MSG_AVATAR_UPDATE = "avatar_update"     # Cập nhật avatar người chơi
MSG_STICKER_BROADCAST = "sticker_broadcast"  # Phát sticker
MSG_ERROR = "error"                     # Thông báo lỗi

# ======================================
# 🧩 Các hàm tiện ích
# ======================================
def create_message(msg_type, payload=None):
    """
    Tạo một tin nhắn chuẩn dưới dạng dictionary.
    Dùng để gửi giữa client ↔ server.
    """
    message = {"type": msg_type}
    if payload is not None:
        message["payload"] = payload
    return message


def parse_message(raw_data):
    """
    Chuyển chuỗi JSON thành message Python.
    Trả về None nếu dữ liệu lỗi.
    """
    import json
    try:
        return json.loads(raw_data)
    except json.JSONDecodeError:
        return None


def message_to_json(msg):
    """
    Chuyển message dictionary sang JSON string
    trước khi gửi qua socket.
    """
    import json
    return json.dumps(msg)


# ======================================
# ⚙️ Ví dụ sử dụng
# ======================================
if __name__ == "__main__":
    # Tạo tin nhắn: người chơi chọn "kéo"
    msg = create_message(MSG_PLAYER_CHOICE, {"choice": ROCK})
    print("Message Dict:", msg)
    print("Message JSON:", message_to_json(msg))
