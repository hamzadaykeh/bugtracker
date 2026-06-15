<?php
require_once 'config.php';

class UserController {
    private $connection;

    public function __construct($db) { 
        $this->connection = $db; 
    }

    public function getAllStaff() {
        $stmt = $this->connection->prepare("SELECT id, username, email, category FROM users WHERE role='staff'");
        $stmt->execute();
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    public function getAllCustomers() {
        $stmt = $this->connection->prepare("SELECT id, username, email FROM users WHERE role='customer'");
        $stmt->execute();
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    public function createStaff($data) {
        $hashed = password_hash($data['password'], PASSWORD_BCRYPT);
        $stmt = $this->connection->prepare(
            "INSERT INTO users (username, password, email, role, category) VALUES (:u,:p,:e,'staff',:c)"
        );
        $stmt->bindParam(':u', $data['username']);
        $stmt->bindParam(':p', $hashed);
        $stmt->bindParam(':e', $data['email']);
        $stmt->bindParam(':c', $data['category']);
        return $stmt->execute()
            ? ["success" => true, "message" => "Staff created"]
            : ["success" => false, "message" => "Failed to create staff"];
    }

    public function deleteUser($id) {
        $stmt = $this->connection->prepare("DELETE FROM users WHERE id = :id");
        $stmt->bindParam(':id', $id);
        return $stmt->execute()
            ? ["success" => true]
            : ["success" => false];
    }
}

$db = (new Database())->getConnection();
$ctrl = new UserController($db);
$method = $_SERVER['REQUEST_METHOD'];
$input = json_decode(file_get_contents("php://input"), true);
$action = $_GET['action'] ?? $input['action'] ?? '';

if ($method === 'GET') {
    if ($action === 'staff') echo json_encode($ctrl->getAllStaff());
    elseif ($action === 'customers') echo json_encode($ctrl->getAllCustomers());
} elseif ($method === 'POST') {
    if ($action === 'create_staff') echo json_encode($ctrl->createStaff($input));
    elseif ($action === 'delete') echo json_encode($ctrl->deleteUser($input['id']));
}
?>