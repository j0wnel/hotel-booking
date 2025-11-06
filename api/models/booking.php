<?php
class Booking {
    private $conn;
    private $table_name = "bookings";

    public $id;
    public $user_id;
    public $room_id;
    public $check_in;
    public $check_out;
    public $total_price;
    public $status;
    public $created_at;

    public function __construct($db) {
        $this->conn = $db;
    }

    public function create() {
        $query = "INSERT INTO " . $this->table_name . "
                SET
                    user_id = :user_id,
                    room_id = :room_id,
                    check_in = :check_in,
                    check_out = :check_out,
                    total_price = :total_price,
                    status = :status";

        $stmt = $this->conn->prepare($query);

        // Sanitize input
        $this->user_id = htmlspecialchars(strip_tags($this->user_id));
        $this->room_id = htmlspecialchars(strip_tags($this->room_id));
        $this->check_in = htmlspecialchars(strip_tags($this->check_in));
        $this->check_out = htmlspecialchars(strip_tags($this->check_out));
        $this->total_price = htmlspecialchars(strip_tags($this->total_price));
        $this->status = htmlspecialchars(strip_tags($this->status));

        // Bind values
        $stmt->bindParam(":user_id", $this->user_id);
        $stmt->bindParam(":room_id", $this->room_id);
        $stmt->bindParam(":check_in", $this->check_in);
        $stmt->bindParam(":check_out", $this->check_out);
        $stmt->bindParam(":total_price", $this->total_price);
        $stmt->bindParam(":status", $this->status);

        if($stmt->execute()) {
            return true;
        }
        return false;
    }

    public function readAll() {
        $query = "SELECT 
                    b.*, 
                    u.name as user_name,
                    r.name as room_name
                FROM 
                    " . $this->table_name . " b
                    LEFT JOIN users u ON b.user_id = u.id
                    LEFT JOIN rooms r ON b.room_id = r.id
                ORDER BY
                    b.created_at DESC";

        $stmt = $this->conn->prepare($query);
        $stmt->execute();
        return $stmt;
    }

    public function readOne() {
        $query = "SELECT 
                    b.*, 
                    u.name as user_name,
                    r.name as room_name
                FROM 
                    " . $this->table_name . " b
                    LEFT JOIN users u ON b.user_id = u.id
                    LEFT JOIN rooms r ON b.room_id = r.id
                WHERE 
                    b.id = ?
                LIMIT 0,1";

        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(1, $this->id);
        $stmt->execute();
        return $stmt;
    }

    public function update() {
        $query = "UPDATE " . $this->table_name . "
                SET
                    status = :status
                WHERE
                    id = :id";

        $stmt = $this->conn->prepare($query);

        // Sanitize and bind
        $this->status = htmlspecialchars(strip_tags($this->status));
        $this->id = htmlspecialchars(strip_tags($this->id));

        $stmt->bindParam(':status', $this->status);
        $stmt->bindParam(':id', $this->id);

        if($stmt->execute()) {
            return true;
        }
        return false;
    }

    public function checkAvailability() {
        $query = "SELECT COUNT(*) as count
                FROM " . $this->table_name . "
                WHERE room_id = :room_id
                AND (
                    (check_in <= :check_in AND check_out >= :check_in)
                    OR
                    (check_in <= :check_out AND check_out >= :check_out)
                    OR
                    (check_in >= :check_in AND check_out <= :check_out)
                )
                AND status != 'cancelled'";

        $stmt = $this->conn->prepare($query);

        $stmt->bindParam(":room_id", $this->room_id);
        $stmt->bindParam(":check_in", $this->check_in);
        $stmt->bindParam(":check_out", $this->check_out);

        $stmt->execute();
        $row = $stmt->fetch(PDO::FETCH_ASSOC);

        return $row['count'] == 0;
    }
}
?>