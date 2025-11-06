<?php
class Room {
    private $conn;
    private $table_name = "rooms";

    public $id;
    public $name;
    public $description;
    public $price;
    public $type;
    public $capacity;
    public $image;
    public $status;

    public function __construct($db) {
        $this->conn = $db;
    }

    public function read() {
        $query = "SELECT * FROM " . $this->table_name;
        $stmt = $this->conn->prepare($query);
        $stmt->execute();
        return $stmt;
    }

    public function readOne() {
        $query = "SELECT * FROM " . $this->table_name . " WHERE id = ?";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(1, $this->id);
        $stmt->execute();
        $row = $stmt->fetch(PDO::FETCH_ASSOC);

        if($row) {
            $this->name = $row['name'];
            $this->description = $row['description'];
            $this->price = $row['price'];
            $this->type = $row['type'];
            $this->capacity = $row['capacity'];
            $this->image = $row['image'];
            $this->status = $row['status'];
            return true;
        }
        return false;
    }

    public function create() {
        $query = "INSERT INTO " . $this->table_name . "
                SET
                    name = :name,
                    description = :description,
                    price = :price,
                    type = :type,
                    capacity = :capacity,
                    image = :image,
                    status = :status";

        $stmt = $this->conn->prepare($query);

        // Sanitize input
        $this->name = htmlspecialchars(strip_tags($this->name));
        $this->description = htmlspecialchars(strip_tags($this->description));
        $this->price = htmlspecialchars(strip_tags($this->price));
        $this->type = htmlspecialchars(strip_tags($this->type));
        $this->capacity = htmlspecialchars(strip_tags($this->capacity));
        $this->image = htmlspecialchars(strip_tags($this->image));
        $this->status = htmlspecialchars(strip_tags($this->status));

        // Bind values
        $stmt->bindParam(":name", $this->name);
        $stmt->bindParam(":description", $this->description);
        $stmt->bindParam(":price", $this->price);
        $stmt->bindParam(":type", $this->type);
        $stmt->bindParam(":capacity", $this->capacity);
        $stmt->bindParam(":image", $this->image);
        $stmt->bindParam(":status", $this->status);

        if($stmt->execute()) {
            return true;
        }
        return false;
    }

    public function update() {
        $query = "UPDATE " . $this->table_name . "
                SET
                    name = :name,
                    description = :description,
                    price = :price,
                    type = :type,
                    capacity = :capacity,
                    image = :image,
                    status = :status
                WHERE
                    id = :id";

        $stmt = $this->conn->prepare($query);

        // Sanitize and bind values
        $this->name = htmlspecialchars(strip_tags($this->name));
        $this->description = htmlspecialchars(strip_tags($this->description));
        $this->price = htmlspecialchars(strip_tags($this->price));
        $this->type = htmlspecialchars(strip_tags($this->type));
        $this->capacity = htmlspecialchars(strip_tags($this->capacity));
        $this->image = htmlspecialchars(strip_tags($this->image));
        $this->status = htmlspecialchars(strip_tags($this->status));
        $this->id = htmlspecialchars(strip_tags($this->id));

        $stmt->bindParam(":name", $this->name);
        $stmt->bindParam(":description", $this->description);
        $stmt->bindParam(":price", $this->price);
        $stmt->bindParam(":type", $this->type);
        $stmt->bindParam(":capacity", $this->capacity);
        $stmt->bindParam(":image", $this->image);
        $stmt->bindParam(":status", $this->status);
        $stmt->bindParam(":id", $this->id);

        if($stmt->execute()) {
            return true;
        }
        return false;
    }

    public function delete() {
        $query = "DELETE FROM " . $this->table_name . " WHERE id = ?";
        $stmt = $this->conn->prepare($query);
        $this->id = htmlspecialchars(strip_tags($this->id));
        $stmt->bindParam(1, $this->id);

        if($stmt->execute()) {
            return true;
        }
        return false;
    }
}
?>