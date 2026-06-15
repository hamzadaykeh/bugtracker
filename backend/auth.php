<?php
require_once 'config.php';

class Auth {
    private $connection;
    private $table = 'users';

    public function __construct($db) {
        $this->connection = $db;
    }

    public function login($username, $password) {
        $query = "SELECT * FROM " . $this->table . " WHERE username = :username LIMIT 1";
        $stmt = $this->connection->prepare($query);
        $stmt->bindParam(':username', $username);
        $stmt->execute();
        $user = $stmt->fetch(PDO::FETCH_ASSOC);

        if ($user && password_verify($password, $user['password'])) {
            unset($user['password']);
            return ["success" => true, "user" => $user];
        }
        return ["success" => false, "message" => "Invalid Credentials"];
    }

    public function register($data) {//here we are going to know if any username exist in our database tables!
        $check = "SELECT id FROM " . $this->table . " WHERE username = :username";
        $stmt = $this->connection->prepare($check);
        $stmt->bindParam(':username', $data['username']);
        $stmt->execute();
        if ($stmt->rowCount() > 0) {
            return ["success" => false, "message" => "Username already exists"];
        }

        $hashed = password_hash($data['password'], PASSWORD_BCRYPT);
        $query = "INSERT INTO " . $this->table . " (username, password, email, role, category) 
                  VALUES (:username, :password, :email, :role, :category)";
        $stmt = $this->connection->prepare($query);
        $stmt->bindParam(':username', $data['username']);
        $stmt->bindParam(':password', $hashed);
        $stmt->bindParam(':email', $data['email']);
        $stmt->bindParam(':role', $data['role']);
        $stmt->bindParam(':category', $data['category']);
        
        if ($stmt->execute()) {
            return ["success" => true, "message" => "Registered successfully"];
        }
        return ["success" => false, "message" => "Registration failed"];
    }
}

$db = (new Database())->getConnection();
$auth = new Auth($db);
$method = $_SERVER['REQUEST_METHOD'];
$input = json_decode(file_get_contents("php://input"), true);

if ($method === 'POST') {
    $action = $input['action'] ?? '';
    if ($action === 'login') {
        echo json_encode($auth->login($input['username'], $input['password']));
    } elseif ($action === 'register') {
        echo json_encode($auth->register($input));
    } else {
        echo json_encode(["error" => "Unknown action"]);
    }
}
?>